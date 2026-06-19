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

export const CLIENTS: Client[] = [
  { id: "c1", name: "Mark Santos", phone: "0917 123 4567", lastVisitDate: "2026-05-29", createdAt: "2026-02-10" },
  { id: "c2", name: "Paolo Reyes", phone: "0928 555 1212", lastVisitDate: "2026-06-05", createdAt: "2026-03-01" },
  { id: "c3", name: "Carlo Tan", phone: "0939 222 8888", lastVisitDate: "2026-06-12", createdAt: "2026-01-22" },
  { id: "c4", name: "Andrei Cruz", phone: "0915 777 3344", lastVisitDate: null, createdAt: "2026-06-18" },
];

export const BOOKINGS: Booking[] = [
  {
    id: "b1",
    clientId: "c1",
    service: { name: "Haircut", price: 150, durationMinutes: 30 },
    date: "2026-06-19",
    time: "10:00 AM",
    status: "confirmed",
    source: "online",
    proofImageUrl: "proof-b1.jpg",
    paymentMethod: "gcash",
    reference: "BNT-100001",
    createdAt: "2026-06-17",
  },
  {
    id: "b2",
    clientId: "c2",
    service: { name: "Haircut + Shave", price: 230, durationMinutes: 45 },
    date: "2026-06-19",
    time: "11:00 AM",
    status: "confirmed",
    source: "walk_in",
    proofImageUrl: null,
    paymentMethod: null,
    reference: null,
    createdAt: "2026-06-19",
  },
  {
    id: "b3",
    clientId: "c3",
    service: { name: "Shave", price: 100, durationMinutes: 20 },
    date: "2026-06-19",
    time: "2:30 PM",
    status: "pending_verification",
    source: "online",
    proofImageUrl: "proof-b3.jpg",
    paymentMethod: "maya",
    reference: "BNT-100003",
    createdAt: "2026-06-19",
  },
  {
    id: "b4",
    clientId: "c4",
    service: { name: "Hot Towel Shave", price: 150, durationMinutes: 30 },
    date: "2026-06-19",
    time: "4:00 PM",
    status: "pending_verification",
    source: "online",
    proofImageUrl: "proof-b4.jpg",
    paymentMethod: "bdo",
    reference: "BNT-100004",
    createdAt: "2026-06-19",
  },
];

export function getClientById(id: string) {
  return CLIENTS.find((c) => c.id === id) ?? null;
}

export function getBookingsByStatus(status: BookingStatus) {
  return BOOKINGS.filter((b) => b.status === status);
}

export function getBookingById(id: string) {
  return BOOKINGS.find((b) => b.id === id) ?? null;
}

export function updateBookingStatus(id: string, status: BookingStatus) {
  const booking = getBookingById(id);
  if (booking) booking.status = status;
  return booking;
}

export function addWalkInBooking(input: {
  clientId: string;
  service: BookingServiceSnapshot;
  date: string;
  time: string;
}) {
  const booking: Booking = {
    id: `b${BOOKINGS.length + 1}`,
    clientId: input.clientId,
    service: input.service,
    date: input.date,
    time: input.time,
    status: "confirmed",
    source: "walk_in",
    proofImageUrl: null,
    paymentMethod: null,
    reference: null,
    createdAt: new Date().toISOString().slice(0, 10),
  };
  BOOKINGS.push(booking);
  return booking;
}

export function addClient(input: { name: string; phone: string }) {
  const client: Client = {
    id: `c${CLIENTS.length + 1}`,
    name: input.name,
    phone: input.phone,
    lastVisitDate: null,
    createdAt: new Date().toISOString().slice(0, 10),
  };
  CLIENTS.push(client);
  return client;
}

export function findOrCreateClient(input: { name: string; phone: string }) {
  const existing = CLIENTS.find((c) => c.phone.trim() === input.phone.trim());
  if (existing) return existing;
  return addClient(input);
}

const ACTIVE_STATUSES: BookingStatus[] = ["pending_verification", "confirmed", "completed"];

export function isSlotTaken(date: string, time: string) {
  return BOOKINGS.some(
    (b) => b.date === date && b.time === time && ACTIVE_STATUSES.includes(b.status)
  );
}

export function addOnlineBooking(input: {
  clientId: string;
  service: BookingServiceSnapshot;
  date: string;
  time: string;
  proofImageUrl: string;
  paymentMethod: string;
  reference: string;
}) {
  const booking: Booking = {
    id: `b${BOOKINGS.length + 1}`,
    clientId: input.clientId,
    service: input.service,
    date: input.date,
    time: input.time,
    status: "pending_verification",
    source: "online",
    proofImageUrl: input.proofImageUrl,
    paymentMethod: input.paymentMethod,
    reference: input.reference,
    createdAt: new Date().toISOString().slice(0, 10),
  };
  BOOKINGS.push(booking);
  return booking;
}

export function getBookingsByDate(date: string) {
  return BOOKINGS.filter((b) => b.date === date && b.status === "confirmed");
}

export function getBookingsByClient(clientId: string) {
  return BOOKINGS.filter((b) => b.clientId === clientId);
}

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
