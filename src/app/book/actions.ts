"use server";

import { revalidatePath } from "next/cache";
import {
  addOnlineBooking,
  findOrCreateClient,
  isSlotTaken,
  type BookingServiceSnapshot,
} from "@/lib/dashboard-data";
import { generateBookingReference } from "@/lib/booking-data";

type SubmitBookingInput = {
  service: BookingServiceSnapshot;
  date: string;
  time: string;
  clientName: string;
  clientPhone: string;
  paymentMethod: string;
  proofFileName: string;
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
    proofImageUrl: input.proofFileName,
    paymentMethod: input.paymentMethod,
    reference,
  });

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/pending");
  revalidatePath("/dashboard/clients");

  return { ok: true as const, reference: booking.reference as string };
}
