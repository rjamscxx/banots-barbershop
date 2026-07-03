import { getActiveServices, getActivePaymentMethods } from "@/lib/settings-data";
import { BookingWizard } from "@/components/booking/BookingWizard";

export const dynamic = "force-dynamic";

export default async function BookPage() {
  const [services, paymentMethods] = await Promise.all([
    getActiveServices(),
    getActivePaymentMethods(),
  ]);
  return <BookingWizard services={services} paymentMethods={paymentMethods} />;
}
