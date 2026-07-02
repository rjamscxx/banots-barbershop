"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireSession } from "@/lib/session-server";
import type { DayHours } from "@/lib/slots";

function revalidateAll() {
  revalidatePath("/");
  revalidatePath("/book");
  revalidatePath("/dashboard/settings");
  revalidatePath("/dashboard/walk-in");
}

export async function updateShopProfile(input: { shopName: string; address: string; phone: string }) {
  await requireSession();
  const shopName = input.shopName.trim();
  const address = input.address.trim();
  if (!shopName) return { ok: false as const, error: "Shop name is required" };
  await prisma.shopSettings.update({
    where: { id: 1 },
    data: { shopName, address, phone: input.phone.trim() },
  });
  revalidateAll();
  return { ok: true as const };
}

export async function updateHours(hours: DayHours[]) {
  await requireSession();
  if (hours.length !== 7) return { ok: false as const, error: "Expected 7 day entries" };
  for (const h of hours) {
    if (!h.closed && !/^\d{1,2}:\d{2}\s(AM|PM)$/.test(h.open)) {
      return { ok: false as const, error: `Invalid open time for ${h.day}` };
    }
    if (!h.closed && !/^\d{1,2}:\d{2}\s(AM|PM)$/.test(h.close)) {
      return { ok: false as const, error: `Invalid close time for ${h.day}` };
    }
  }
  await prisma.shopSettings.update({ where: { id: 1 }, data: { hours } });
  revalidateAll();
  return { ok: true as const };
}

export async function saveService(input: {
  id?: string;
  name: string;
  price: number;
  durationMinutes: number;
}) {
  await requireSession();
  const name = input.name.trim();
  if (!name) return { ok: false as const, error: "Name is required" };
  if (!Number.isInteger(input.price) || input.price <= 0) {
    return { ok: false as const, error: "Price must be a positive whole number" };
  }
  if (!Number.isInteger(input.durationMinutes) || input.durationMinutes <= 0) {
    return { ok: false as const, error: "Duration must be a positive number of minutes" };
  }
  if (input.id) {
    await prisma.service.update({
      where: { id: input.id },
      data: { name, price: input.price, durationMinutes: input.durationMinutes },
    });
  } else {
    const max = await prisma.service.aggregate({ _max: { sortOrder: true } });
    await prisma.service.create({
      data: {
        name,
        price: input.price,
        durationMinutes: input.durationMinutes,
        sortOrder: (max._max.sortOrder ?? 0) + 1,
      },
    });
  }
  revalidateAll();
  return { ok: true as const };
}

export async function setServiceActive(id: string, active: boolean) {
  await requireSession();
  await prisma.service.update({ where: { id }, data: { active } });
  revalidateAll();
  return { ok: true as const };
}

export async function updatePaymentMethod(input: {
  id: string;
  accountName: string;
  accountNumber: string;
}) {
  await requireSession();
  await prisma.paymentMethod.update({
    where: { id: input.id },
    data: { accountName: input.accountName.trim(), accountNumber: input.accountNumber.trim() },
  });
  revalidateAll();
  return { ok: true as const };
}

export async function setPaymentMethodQr(id: string, qrImageUrl: string) {
  await requireSession();
  if (!qrImageUrl.startsWith("https://")) return { ok: false as const, error: "Invalid URL" };
  await prisma.paymentMethod.update({ where: { id }, data: { qrImageUrl } });
  revalidateAll();
  return { ok: true as const };
}

export async function setPaymentMethodActive(id: string, active: boolean) {
  await requireSession();
  await prisma.paymentMethod.update({ where: { id }, data: { active } });
  revalidateAll();
  return { ok: true as const };
}
