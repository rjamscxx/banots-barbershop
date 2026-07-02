import Link from "next/link";
import { formatPeso, getClientById, type Booking } from "@/lib/dashboard-data";
import { formatDate } from "@/lib/format";

export async function BookingCard({ booking, href, showDate = false }: { booking: Booking; href?: string; showDate?: boolean }) {
  const client = await getClientById(booking.clientId);
  const content = (
    <div className="flex items-center justify-between rounded-xl border border-divider bg-white pl-0 pr-4 py-3 overflow-hidden group transition-colors hover:border-zinc-300">
      {/* Gold left accent bar */}
      <div className={`w-1 self-stretch shrink-0 rounded-l-xl mr-4 ${
        booking.source === "walk_in" ? "bg-zinc-300" : "bg-brand-gold"
      }`} />
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <p className="font-bold text-foreground truncate">{client?.name ?? "Unknown client"}</p>
          {booking.source === "walk_in" ? (
            <span className="shrink-0 rounded-full bg-zinc-100 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-zinc-500">
              Walk-in
            </span>
          ) : null}
        </div>
        <p className="mt-0.5 text-xs text-zinc-500">
          {booking.service.name}
          {showDate ? ` · ${formatDate(booking.date)}` : ""}
        </p>
      </div>
      <div className="shrink-0 text-right">
        <p className="font-[family-name:var(--font-bebas)] text-xl text-foreground tabular">
          {formatPeso(booking.service.price)}
        </p>
        <p className="text-xs font-semibold text-zinc-400">{booking.time}</p>
      </div>
    </div>
  );

  if (href) {
    return <Link href={href}>{content}</Link>;
  }
  return content;
}
