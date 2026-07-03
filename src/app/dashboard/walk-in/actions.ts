"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { addClient, addWalkInBooking } from "@/lib/dashboard-data";
import { getActiveServices } from "@/lib/settings-data";
import { requireSession } from "@/lib/session-server";

export async function createWalkIn(formData: FormData) {
  await requireSession();
  const clientChoice = String(formData.get("clientChoice") ?? "");
  const serviceName = String(formData.get("service") ?? "");
  const date = String(formData.get("date") ?? "");
  const time = String(formData.get("time") ?? "");

  const allServices = await getActiveServices();
  const service = allServices.find((s) => s.name === serviceName);
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
