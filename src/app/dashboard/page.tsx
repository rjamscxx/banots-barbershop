import Link from "next/link";
import { getBookingsByDate, getTodayStats, SHOP_SETTINGS, formatPeso } from "@/lib/dashboard-data";
import { BookingCard } from "@/components/dashboard/BookingCard";
import { formatDate } from "@/lib/format";

function todayIso() {
  return new Date().toISOString().slice(0, 10);
}

export default async function DashboardTodayPage() {
  const today = todayIso();
  const [bookings, stats] = await Promise.all([
    getBookingsByDate(today),
    getTodayStats(today),
  ]);

  const todayLabel = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "short",
    day: "numeric",
  });

  return (
    <div className="flex flex-1 flex-col">

      {/* Header */}
      <div className="border-b border-divider px-6 pb-5 pt-6">
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-zinc-400">
          {SHOP_SETTINGS.shopName}
        </p>
        <h1 className="mt-1 text-2xl font-bold text-foreground">Today</h1>
        <p className="text-sm text-zinc-400">{todayLabel}</p>
      </div>

      <div className="flex flex-1 flex-col px-6 py-5 gap-5">

        {/* Stats */}
        <div className="grid grid-cols-2 gap-3">
          <div className="flex flex-col rounded-2xl border border-divider bg-surface-gray px-5 py-4">
            <p className="text-3xl font-bold text-foreground">{stats.count}</p>
            <p className="mt-1 text-xs text-zinc-500">Confirmed today</p>
          </div>
          <div className="flex flex-col rounded-2xl border border-divider bg-surface-gray px-5 py-4">
            <p className="text-3xl font-bold text-foreground">{formatPeso(stats.revenue)}</p>
            <p className="mt-1 text-xs text-zinc-500">Revenue today</p>
          </div>
        </div>

        {/* Schedule */}
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-zinc-400">
            Schedule
          </p>

          <div className="mt-3 flex flex-col gap-2">
            {bookings.length === 0 ? (
              <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-zinc-200 py-12 text-center">
                <div className="text-2xl">✂️</div>
                <p className="mt-3 text-sm font-semibold text-zinc-400">No bookings today</p>
                <p className="mt-1 text-xs text-zinc-300">Walk-ins can still be added below</p>
              </div>
            ) : (
              bookings.map((booking) => (
                <BookingCard
                  key={booking.id}
                  booking={booking}
                  href={`/dashboard/bookings/${booking.id}`}
                />
              ))
            )}
          </div>
        </div>

        <div className="flex-1" />

        {/* Walk-in CTA */}
        <Link
          href="/dashboard/walk-in"
          className="flex h-12 w-full items-center justify-center gap-2 rounded-full bg-brand-black px-5 text-sm font-bold text-white transition-opacity hover:opacity-90"
        >
          <span>+</span> Add walk-in
        </Link>

      </div>
    </div>
  );
}
