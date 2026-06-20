import { getClients } from "@/lib/dashboard-data";
import { WalkInForm } from "@/components/dashboard/WalkInForm";

export default async function WalkInPage() {
  const clients = await getClients();
  return <WalkInForm clients={clients} />;
}
