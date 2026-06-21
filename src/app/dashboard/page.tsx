import Link from "next/link";
import { getBookingsByDate, getTodayStats, SHOP_SETTINGS, formatPeso } from "@/lib/dashboard-data";
import { BookingCard } from "@/components/dashboard/BookingCard";

function todayIso() {
  return new Date().toISOString().slice(0, 10);
}

export default async function DashboardTodayPage() {
  const today = todayIso();
  const [bookings, stats] = await Promise.all([
    getBookingsByDate(today),
    getTodayStats(today),
  ]);

  return (
    <div className="flex flex-1 flex-col px-6 py-6">
      <h1 className="text-xl font-bold text-foreground">{SHOP_SETTINGS.shopName}</h1>
      <p className="text-sm text-zinc-500">
        Today &middot;{" "}
        {new Date().toLocaleDateString("en-US", { weekday: "long", month: "short", day: "numeric" })}
      </p>

      {/* Stats row */}
      <div className="mt-4 grid grid-cols-2 gap-3">
        <div className="rounded-xl border border-divider bg-surface-gray px-4 py-3">
          <p className="text-2xl font-bold text-foreground">{stats.count}</p>
          <p className="mt-0.5 text-xs text-zinc-500">Confirmed today</p>
        </div>
        <div className="rounded-xl border border-divider bg-surface-gray px-4 py-3">
          <p className="text-2xl font-bold text-foreground">{formatPeso(stats.revenue)}</p>
          <p className="mt-0.5 text-xs text-zinc-500">Revenue today</p>
        </div>
      </div>

      <p className="mt-6 text-sm font-semibold text-zinc-500">Schedule</p>
      <div className="mt-2 flex flex-1 flex-col gap-3">
        {bookings.length === 0 ? (
          <p className="mt-4 text-center text-sm text-zinc-400">No confirmed bookings today.</p>
        ) : (
          bookings.map((booking) => (
            <BookingCard key={booking.id} booking={booking} href={`/dashboard/bookings/${booking.id}`} />
          ))
        )}
      </div>

      <Link
        href="/dashboard/walk-in"
        className="mt-6 flex h-13 w-full items-center justify-center rounded-full bg-brand-black px-5 text-base font-bold text-white"
      >
        + Add walk-in
      </Link>
    </div>
  );
}
