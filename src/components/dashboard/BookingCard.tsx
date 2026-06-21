import Link from "next/link";
import { formatPeso, getClientById, type Booking } from "@/lib/dashboard-data";
import { formatDate } from "@/lib/format";

export async function BookingCard({ booking, href, showDate = false }: { booking: Booking; href?: string; showDate?: boolean }) {
  const client = await getClientById(booking.clientId);
  const content = (
    <div className="flex items-center justify-between rounded-xl border border-divider px-4 py-3">
      <div>
        <div className="flex items-center gap-2">
          <p className="font-semibold text-foreground">{client?.name ?? "Unknown client"}</p>
          {booking.source === "walk_in" ? (
            <span className="rounded-full bg-surface-gray px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-zinc-500">
              Walk-in
            </span>
          ) : null}
        </div>
        <p className="text-sm text-zinc-500">
          {booking.service.name} &middot;{" "}
          {showDate ? `${formatDate(booking.date)} · ` : ""}
          {booking.time}
        </p>
      </div>
      <p className="font-bold text-foreground">{formatPeso(booking.service.price)}</p>
    </div>
  );

  if (href) {
    return <Link href={href}>{content}</Link>;
  }
  return content;
}
