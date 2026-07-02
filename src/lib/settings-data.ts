import { prisma } from "./prisma";
import { generateSlots, DAY_NAMES, type DayHours } from "./slots";

export type ShopProfile = {
  shopName: string;
  address: string;
  phone: string;
  hours: DayHours[];
};

export type ServiceRecord = {
  id: string;
  name: string;
  price: number;
  durationMinutes: number;
  sortOrder: number;
  active: boolean;
};

export type PaymentMethodRecord = {
  id: string;
  label: string;
  accountName: string;
  accountNumber: string;
  qrImageUrl: string;
  sortOrder: number;
  active: boolean;
};

export async function getShopSettings(): Promise<ShopProfile> {
  const row = await prisma.shopSettings.findUnique({ where: { id: 1 } });
  if (!row) throw new Error("ShopSettings not seeded — run `npx prisma db seed`");
  return {
    shopName: row.shopName,
    address: row.address,
    phone: row.phone,
    hours: row.hours as DayHours[],
  };
}

export async function getActiveServices(): Promise<ServiceRecord[]> {
  return prisma.service.findMany({ where: { active: true }, orderBy: { sortOrder: "asc" } });
}

export async function getAllServices(): Promise<ServiceRecord[]> {
  return prisma.service.findMany({ orderBy: { sortOrder: "asc" } });
}

export async function getActivePaymentMethods(): Promise<PaymentMethodRecord[]> {
  return prisma.paymentMethod.findMany({ where: { active: true }, orderBy: { sortOrder: "asc" } });
}

export async function getAllPaymentMethods(): Promise<PaymentMethodRecord[]> {
  return prisma.paymentMethod.findMany({ orderBy: { sortOrder: "asc" } });
}

/** Slot grid for a YYYY-MM-DD date, from the stored working hours. */
export async function getSlotsForDateFromSettings(date: string): Promise<string[]> {
  const { hours } = await getShopSettings();
  const weekday = DAY_NAMES[new Date(`${date}T00:00:00`).getDay()];
  return generateSlots(hours, weekday);
}
