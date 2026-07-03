"use server";

import { revalidatePath } from "next/cache";
import {
  addOnlineBooking,
  findOrCreateClient,
  isSlotTaken,
  getActiveBookingsByDate,
  type BookingServiceSnapshot,
} from "@/lib/dashboard-data";
import { getSlotsForDateFromSettings } from "@/lib/settings-data";
import { generateBookingReference } from "@/lib/booking-data";

export type SlotInfo = { time: string; taken: boolean };

export async function getSlotsForDate(date: string): Promise<SlotInfo[]> {
  const [slots, bookings] = await Promise.all([
    getSlotsForDateFromSettings(date),
    getActiveBookingsByDate(date),
  ]);
  const taken = new Set(bookings.map((b) => b.time));
  return slots.map((time) => ({ time, taken: taken.has(time) }));
}

type SubmitBookingInput = {
  service: BookingServiceSnapshot;
  date: string;
  time: string;
  clientName: string;
  clientPhone: string;
  paymentMethod: string;
  proofImageUrl: string;
};

export async function submitBooking(input: SubmitBookingInput) {
  if (await isSlotTaken(input.date, input.time)) {
    return { ok: false as const, error: "That time slot was just taken. Please pick another." };
  }

  const client = await findOrCreateClient({ name: input.clientName, phone: input.clientPhone });
  const reference = generateBookingReference();

  const booking = await addOnlineBooking({
    clientId: client.id,
    service: input.service,
    date: input.date,
    time: input.time,
    proofImageUrl: input.proofImageUrl,
    paymentMethod: input.paymentMethod,
    reference,
  });

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/pending");
  revalidatePath("/dashboard/clients");

  return { ok: true as const, reference: booking.reference as string };
}
