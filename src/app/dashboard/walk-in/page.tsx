import { CLIENTS } from "@/lib/dashboard-data";
import { WalkInForm } from "@/components/dashboard/WalkInForm";

export default function WalkInPage() {
  return <WalkInForm clients={CLIENTS} />;
}
