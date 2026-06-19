import { DashboardNav } from "@/components/dashboard/DashboardNav";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="flex flex-1 flex-col items-center bg-white">
      <section className="flex w-full max-w-md flex-1 flex-col">
        <div className="flex flex-1 flex-col overflow-y-auto">{children}</div>
        <DashboardNav />
      </section>
    </main>
  );
}
