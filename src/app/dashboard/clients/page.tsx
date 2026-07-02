import Link from "next/link";
import { getClients } from "@/lib/dashboard-data";
import { isDueForRebooking, type Client } from "@/lib/dashboard-shared";

function sortByDueDate(a: Client, b: Client) {
  const aDue = isDueForRebooking(a.lastVisitDate);
  const bDue = isDueForRebooking(b.lastVisitDate);
  if (aDue !== bDue) return aDue ? -1 : 1;
  if (!a.lastVisitDate && !b.lastVisitDate) return 0;
  if (!a.lastVisitDate) return 1;
  if (!b.lastVisitDate) return -1;
  return a.lastVisitDate.localeCompare(b.lastVisitDate);
}

export default async function ClientsPage() {
  const clients = (await getClients()).sort(sortByDueDate);

  return (
    <div className="flex flex-1 flex-col">

      <div className="bg-brand-black px-6 pb-5 pt-6">
        <h1 className="font-[family-name:var(--font-bebas)] text-5xl text-white leading-none">Clients</h1>
        <p className="mt-1 text-xs text-zinc-500">Sorted by who&apos;s due for a rebooking.</p>
      </div>

      <div className="flex flex-col gap-2 px-6 py-5">
        {clients.length === 0 ? (
          <p className="mt-8 text-center text-sm text-zinc-400">No clients yet.</p>
        ) : (
          clients.map((client) => {
            const due = isDueForRebooking(client.lastVisitDate);
            return (
              <Link
                key={client.id}
                href={`/dashboard/clients/${client.id}`}
                className="flex items-center justify-between rounded-xl border border-divider px-4 py-3 transition-colors hover:border-zinc-300"
              >
                <div>
                  <p className="font-bold text-foreground">{client.name}</p>
                  <p className="text-sm text-zinc-500">{client.phone}</p>
                </div>
                {due ? (
                  <span className="rounded-full bg-brand-gold px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-brand-black">
                    Due
                  </span>
                ) : (
                  <p className="text-xs text-zinc-400">
                    {client.lastVisitDate ? `Last: ${client.lastVisitDate}` : "New"}
                  </p>
                )}
              </Link>
            );
          })
        )}
      </div>
    </div>
  );
}
