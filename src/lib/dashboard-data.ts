import { prisma } from "./prisma";
import type { Booking as BookingRow, Client as ClientRow } from "@/generated/prisma/client";
import type { BookingStatus, BookingSource, BookingServiceSnapshot, Booking, Client } from "./dashboard-shared";
import { TIME_SLOTS, UNAVAILABLE_SLOTS } from "./booking-data";

export type { BookingStatus, BookingSource, BookingServiceSnapshot, Booking, Client };
export { SHOP_SETTINGS, formatPeso } from "./dashboard-shared";

function mapBooking(row: BookingRow): Booking {
  return {
    id: row.id,
    clientId: row.clientId,
    service: {
      name: row.serviceName,
      price: row.servicePrice,
      durationMinutes: row.serviceMinutes,
    },
    date: row.date,
    time: row.time,
    status: row.status as BookingStatus,
    source: row.source as BookingSource,
    proofImageUrl: row.proofImageUrl,
    paymentMethod: row.paymentMethod,
    reference: row.reference,
    createdAt: row.createdAt.toISOString().slice(0, 10),
  };
}

function mapClient(row: ClientRow): Client {
  return {
    id: row.id,
    name: row.name,
    phone: row.phone,
    lastVisitDate: row.lastVisitDate,
    createdAt: row.createdAt.toISOString().slice(0, 10),
  };
}

export async function getClients() {
  const rows = await prisma.client.findMany();
  return rows.map(mapClient);
}

export async function getClientById(id: string) {
  const row = await prisma.client.findUnique({ where: { id } });
  return row ? mapClient(row) : null;
}

export async function getBookingsByStatus(status: BookingStatus) {
  const rows = await prisma.booking.findMany({ where: { status } });
  return rows.map(mapBooking);
}

export async function getBookingById(id: string) {
  const row = await prisma.booking.findUnique({ where: { id } });
  return row ? mapBooking(row) : null;
}

export async function updateBookingStatus(id: string, status: BookingStatus) {
  const row = await prisma.booking.update({ where: { id }, data: { status } });
  return mapBooking(row);
}

export async function addWalkInBooking(input: {
  clientId: string;
  service: BookingServiceSnapshot;
  date: string;
  time: string;
}) {
  const row = await prisma.booking.create({
    data: {
      clientId: input.clientId,
      serviceName: input.service.name,
      servicePrice: input.service.price,
      serviceMinutes: input.service.durationMinutes,
      date: input.date,
      time: input.time,
      status: "confirmed",
      source: "walk_in",
    },
  });
  return mapBooking(row);
}

export async function addClient(input: { name: string; phone: string }) {
  const row = await prisma.client.create({
    data: { name: input.name.trim(), phone: input.phone.trim() },
  });
  return mapClient(row);
}

export async function findOrCreateClient(input: { name: string; phone: string }) {
  const existing = await prisma.client.findUnique({ where: { phone: input.phone.trim() } });
  if (existing) return mapClient(existing);
  return addClient(input);
}

const ACTIVE_STATUSES: BookingStatus[] = ["pending_verification", "confirmed", "completed"];

export async function isSlotTaken(date: string, time: string) {
  const count = await prisma.booking.count({
    where: { date, time, status: { in: ACTIVE_STATUSES } },
  });
  return count > 0;
}

export async function addOnlineBooking(input: {
  clientId: string;
  service: BookingServiceSnapshot;
  date: string;
  time: string;
  proofImageUrl: string;
  paymentMethod: string;
  reference: string;
}) {
  const row = await prisma.booking.create({
    data: {
      clientId: input.clientId,
      serviceName: input.service.name,
      servicePrice: input.service.price,
      serviceMinutes: input.service.durationMinutes,
      date: input.date,
      time: input.time,
      status: "pending_verification",
      source: "online",
      proofImageUrl: input.proofImageUrl,
      paymentMethod: input.paymentMethod,
      reference: input.reference,
    },
  });
  return mapBooking(row);
}

export async function getBookingsByDate(date: string) {
  const rows = await prisma.booking.findMany({ where: { date, status: "confirmed" } });
  return rows.map(mapBooking);
}

export async function getBookingsByClient(clientId: string) {
  const rows = await prisma.booking.findMany({ where: { clientId } });
  return rows.map(mapBooking);
}

function parseSlotToMinutes(slot: string) {
  const match = slot.match(/^(\d+):(\d+)\s*(AM|PM)$/i);
  if (!match) return null;
  let hour = Number(match[1]) % 12;
  if (match[3].toUpperCase() === "PM") hour += 12;
  return hour * 60 + Number(match[2]);
}

export async function getNextOpenSlotToday() {
  const now = new Date();
  const today = now.toISOString().slice(0, 10);
  const nowMinutes = now.getHours() * 60 + now.getMinutes();

  for (const slot of TIME_SLOTS) {
    if (UNAVAILABLE_SLOTS.has(slot)) continue;
    const slotMinutes = parseSlotToMinutes(slot);
    if (slotMinutes === null || slotMinutes < nowMinutes) continue;
    if (!(await isSlotTaken(today, slot))) return slot;
  }
  return null;
}

export async function getTodayStats(date: string) {
  const rows = await prisma.booking.findMany({
    where: { date, status: { in: ["confirmed", "completed"] } },
  });
  const revenue = rows.reduce((sum, r) => sum + r.servicePrice, 0);
  return { count: rows.length, revenue };
}

export async function getWeeklyBookingCount() {
  const now = new Date();
  const startOfWeek = new Date(now);
  startOfWeek.setDate(now.getDate() - now.getDay()); // back to Sunday
  const start = startOfWeek.toISOString().slice(0, 10);
  const end = now.toISOString().slice(0, 10);
  return prisma.booking.count({
    where: { date: { gte: start, lte: end }, status: { in: ["confirmed", "completed"] } },
  });
}

export async function markBookingCompleted(id: string) {
  const [booking] = await prisma.$transaction(async (tx) => {
    const updated = await tx.booking.update({ where: { id }, data: { status: "completed" } });
    const client = await tx.client.findUnique({ where: { id: updated.clientId } });
    if (!client || !client.lastVisitDate || client.lastVisitDate < updated.date) {
      await tx.client.update({
        where: { id: updated.clientId },
        data: { lastVisitDate: updated.date },
      });
    }
    return [updated];
  });
  return mapBooking(booking);
}
