import { DashboardNav } from "@/components/dashboard/DashboardNav";
import { getBookingsByStatus } from "@/lib/dashboard-data";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pendingCount = (await getBookingsByStatus("pending_verification")).length;

  return (
    <main className="flex flex-1 flex-col items-center bg-white">
      <section className="flex w-full max-w-md flex-1 flex-col">
        <div className="flex flex-1 flex-col overflow-y-auto">{children}</div>
        <DashboardNav pendingCount={pendingCount} />
      </section>
    </main>
  );
}
