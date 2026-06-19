export type Service = {
  id: string;
  name: string;
  durationMinutes: number;
  price: number;
};

export const SERVICES: Service[] = [
  { id: "haircut", name: "Haircut", durationMinutes: 30, price: 150 },
  { id: "shave", name: "Shave", durationMinutes: 20, price: 100 },
  { id: "haircut-shave", name: "Haircut + Shave", durationMinutes: 45, price: 230 },
  { id: "hot-towel-shave", name: "Hot Towel Shave", durationMinutes: 30, price: 150 },
];

export const TIME_SLOTS = [
  "9:00 AM",
  "9:30 AM",
  "10:00 AM",
  "10:30 AM",
  "11:00 AM",
  "11:30 AM",
  "1:00 PM",
  "1:30 PM",
  "2:00 PM",
  "2:30 PM",
  "3:00 PM",
  "4:00 PM",
  "4:30 PM",
  "5:00 PM",
  "6:00 PM",
];

export const UNAVAILABLE_SLOTS = new Set(["10:30 AM", "2:00 PM", "5:00 PM"]);

export type PaymentMethod = {
  id: string;
  label: string;
};

export const PAYMENT_METHODS: PaymentMethod[] = [
  { id: "gcash", label: "GCash" },
  { id: "gotyme", label: "GoTyme" },
  { id: "maya", label: "Maya" },
  { id: "bdo", label: "BDO Online Banking" },
  { id: "bpi", label: "BPI" },
];

export function formatPeso(amount: number) {
  return `₱${amount.toLocaleString("en-PH")}`;
}

export function generateBookingReference() {
  const random = Math.floor(Math.random() * 900000) + 100000;
  return `BNT-${random}`;
}
