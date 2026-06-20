"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { addClient, addWalkInBooking, SHOP_SETTINGS } from "@/lib/dashboard-data";

export async function createWalkIn(formData: FormData) {
  const clientChoice = String(formData.get("clientChoice") ?? "");
  const serviceName = String(formData.get("service") ?? "");
  const date = String(formData.get("date") ?? "");
  const time = String(formData.get("time") ?? "");

  const service = SHOP_SETTINGS.services.find((s) => s.name === serviceName);
  if (!service || !date || !time) return;

  let clientId = clientChoice;
  if (clientChoice === "new") {
    const name = String(formData.get("name") ?? "").trim();
    const phone = String(formData.get("phone") ?? "").trim();
    if (!name || !phone) return;
    const client = await addClient({ name, phone });
    clientId = client.id;
  }

  await addWalkInBooking({ clientId, service, date, time });

  revalidatePath("/dashboard");
  redirect("/dashboard");
}
