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

export const SHOP_SETTINGS = {
  shopName: "Banot's Barbershop",
  address: "Unit 4, Banot's Building, Quezon City",
  services: [
    { name: "Haircut", price: 150, durationMinutes: 30 },
    { name: "Shave", price: 100, durationMinutes: 20 },
    { name: "Haircut + Shave", price: 230, durationMinutes: 45 },
    { name: "Hot Towel Shave", price: 150, durationMinutes: 30 },
  ],
  workingHours: [
    { day: "Mon-Sat", openTime: "9:00 AM", closeTime: "7:00 PM" },
    { day: "Sun", openTime: "Closed", closeTime: "Closed" },
  ],
  paymentMethods: ["gcash", "gotyme", "maya", "bdo", "bpi"],
};

export function formatPeso(amount: number) {
  return `₱${amount.toLocaleString("en-PH")}`;
}
