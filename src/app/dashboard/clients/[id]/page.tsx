import { notFound } from "next/navigation";
import { formatPeso, getBookingsByClient, getClientById } from "@/lib/dashboard-data";

export default async function ClientDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const client = await getClientById(id);
  if (!client) notFound();

  const bookings = (await getBookingsByClient(id)).sort((a, b) => b.date.localeCompare(a.date));

  return (
    <div className="flex flex-1 flex-col px-6 py-6">
      <h1 className="text-xl font-bold text-foreground">{client.name}</h1>
      <p className="text-sm text-zinc-500">{client.phone}</p>

      <p className="mt-6 text-sm font-semibold text-zinc-500">Visit history</p>
      <div className="mt-2 flex flex-col gap-3">
        {bookings.length === 0 ? (
          <p className="mt-4 text-center text-sm text-zinc-400">No visits yet.</p>
        ) : (
          bookings.map((booking) => (
            <div key={booking.id} className="rounded-xl border border-divider px-4 py-3">
              <div className="flex items-center justify-between">
                <p className="font-semibold text-foreground">{booking.service.name}</p>
                <p className="font-bold text-foreground">{formatPeso(booking.service.price)}</p>
              </div>
              <div className="mt-1 flex items-center justify-between text-sm text-zinc-500">
                <span>
                  {booking.date} &middot; {booking.time}
                </span>
                <span className="capitalize">{booking.status.replace("_", " ")}</span>
              </div>
              {booking.source === "walk_in" ? (
                <span className="mt-2 inline-block rounded-full bg-surface-gray px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-zinc-500">
                  Walk-in
                </span>
              ) : null}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
