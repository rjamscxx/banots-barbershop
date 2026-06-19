"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { updateBookingStatus } from "@/lib/dashboard-data";

export async function approveBooking(id: string) {
  updateBookingStatus(id, "confirmed");
  revalidatePath("/dashboard");
  revalidatePath("/dashboard/pending");
  redirect("/dashboard/pending");
}

export async function rejectBooking(id: string) {
  updateBookingStatus(id, "rejected");
  revalidatePath("/dashboard/pending");
  redirect("/dashboard/pending");
}
