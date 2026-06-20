"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { updateBookingStatus, markBookingCompleted } from "@/lib/dashboard-data";

function revalidateAll() {
  revalidatePath("/dashboard");
  revalidatePath("/dashboard/pending");
  revalidatePath("/dashboard/clients");
}

export async function approveBooking(id: string) {
  await updateBookingStatus(id, "confirmed");
  revalidateAll();
  redirect("/dashboard/pending");
}

export async function rejectBooking(id: string) {
  await updateBookingStatus(id, "rejected");
  revalidateAll();
  redirect("/dashboard/pending");
}

export async function completeBooking(id: string) {
  await markBookingCompleted(id);
  revalidateAll();
  redirect("/dashboard");
}

export async function markNoShow(id: string) {
  await updateBookingStatus(id, "no_show");
  revalidateAll();
  redirect("/dashboard");
}

export async function cancelBooking(id: string) {
  await updateBookingStatus(id, "cancelled");
  revalidateAll();
  redirect("/dashboard");
}
