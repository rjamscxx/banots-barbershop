import Link from "next/link";
import { getClients } from "@/lib/dashboard-data";

function sortByDueDate(a: { lastVisitDate: string | null }, b: { lastVisitDate: string | null }) {
  if (!a.lastVisitDate && !b.lastVisitDate) return 0;
  if (!a.lastVisitDate) return -1;
  if (!b.lastVisitDate) return 1;
  return a.lastVisitDate.localeCompare(b.lastVisitDate);
}

export default async function ClientsPage() {
  const clients = (await getClients()).sort(sortByDueDate);

  return (
    <div className="flex flex-1 flex-col px-6 py-6">
      <h1 className="text-xl font-bold text-foreground">Clients</h1>
      <p className="text-sm text-zinc-500">Sorted by who&apos;s due for a rebooking reminder.</p>

      <div className="mt-5 flex flex-col gap-3">
        {clients.map((client) => (
          <Link
            key={client.id}
            href={`/dashboard/clients/${client.id}`}
            className="flex items-center justify-between rounded-xl border border-divider px-4 py-3"
          >
            <div>
              <p className="font-semibold text-foreground">{client.name}</p>
              <p className="text-sm text-zinc-500">{client.phone}</p>
            </div>
            <p className="text-xs text-zinc-400">
              {client.lastVisitDate ? `Last visit ${client.lastVisitDate}` : "New client"}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
