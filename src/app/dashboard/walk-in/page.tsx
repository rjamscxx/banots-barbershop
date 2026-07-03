import { getClients } from "@/lib/dashboard-data";
import { getActiveServices } from "@/lib/settings-data";
import { WalkInForm } from "@/components/dashboard/WalkInForm";

export default async function WalkInPage() {
  const [clients, services] = await Promise.all([getClients(), getActiveServices()]);
  return <WalkInForm clients={clients} services={services} />;
}
