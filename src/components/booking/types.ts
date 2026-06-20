import type { Service } from "@/lib/booking-data";

export type BookingStep = "services" | "datetime" | "details" | "payment" | "confirmation";

export type BookingState = {
  service: Service | null;
  date: string | null;
  time: string | null;
  clientName: string;
  clientPhone: string;
  paymentMethod: string | null;
  proofImageUrl: string | null;
  reference: string | null;
};

export const INITIAL_BOOKING_STATE: BookingState = {
  service: null,
  date: null,
  time: null,
  clientName: "",
  clientPhone: "",
  paymentMethod: null,
  proofImageUrl: null,
  reference: null,
};
