// Client-safe types and constants — no Prisma/DB import here, since
// this gets bundled into client components too (e.g. WalkInForm).

export type BookingStatus =
  | "pending_verification"
  | "confirmed"
  | "rejected"
  | "completed"
  | "no_show"
  | "cancelled";

export type BookingSource = "online" | "walk_in";

export type BookingServiceSnapshot = {
  name: string;
  price: number;
  durationMinutes: number;
};

export type Booking = {
  id: string;
  clientId: string;
  service: BookingServiceSnapshot;
  date: string;
  time: string;
  status: BookingStatus;
  source: BookingSource;
  proofImageUrl: string | null;
  paymentMethod: string | null;
  reference: string | null;
  createdAt: string;
};

export type Client = {
  id: string;
  name: string;
  phone: string;
  lastVisitDate: string | null;
  createdAt: string;
};

export function formatPeso(amount: number) {
  return `₱${amount.toLocaleString("en-PH")}`;
}

export const REBOOKING_REMINDER_DAYS = 21;

export function daysSince(dateIso: string, today: Date = new Date()) {
  const then = new Date(`${dateIso}T00:00:00`);
  const diffMs = today.getTime() - then.getTime();
  return Math.floor(diffMs / (1000 * 60 * 60 * 24));
}

export function isDueForRebooking(lastVisitDate: string | null, today: Date = new Date()) {
  if (!lastVisitDate) return false;
  return daysSince(lastVisitDate, today) >= REBOOKING_REMINDER_DAYS;
}
