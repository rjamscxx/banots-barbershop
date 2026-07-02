import Link from "next/link";
import { notFound } from "next/navigation";
import { formatPeso, getBookingsByClient, getClientById } from "@/lib/dashboard-data";
import { formatDate } from "@/lib/format";

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
    <div className="flex flex-1 flex-col">

      <div className="bg-brand-black px-6 pb-5 pt-6">
        <Link href="/dashboard/clients" className="flex items-center gap-1.5 text-xs font-semibold text-zinc-600 transition-colors hover:text-zinc-300">
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path d="M7.5 2L3.5 6L7.5 10" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Clients
        </Link>
        <h1 className="mt-3 font-[family-name:var(--font-bebas)] text-4xl text-white leading-none">{client.name}</h1>
        <p className="mt-1 text-sm text-zinc-500">{client.phone}</p>
      </div>

      <div className="flex flex-col gap-2 px-6 py-5">
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-zinc-400">Visit history</p>
        <div className="mt-2 flex flex-col gap-2">
          {bookings.length === 0 ? (
            <p className="mt-4 text-center text-sm text-zinc-400">No visits yet.</p>
          ) : (
            bookings.map((booking) => (
              <div key={booking.id} className="rounded-xl border border-divider px-4 py-3">
                <div className="flex items-center justify-between">
                  <p className="font-semibold text-foreground">{booking.service.name}</p>
                  <p className="font-[family-name:var(--font-bebas)] text-xl text-foreground tabular">
                    {formatPeso(booking.service.price)}
                  </p>
                </div>
                <div className="mt-1 flex items-center justify-between text-xs text-zinc-500">
                  <span>{formatDate(booking.date)} &middot; {booking.time}</span>
                  <span className="font-semibold capitalize">{booking.status.replace(/_/g, " ")}</span>
                </div>
                {booking.source === "walk_in" ? (
                  <span className="mt-2 inline-block rounded-full bg-surface-gray px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-zinc-500">
                    Walk-in
                  </span>
                ) : null}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
