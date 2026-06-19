import Link from "next/link";
import { getBookingsByDate, SHOP_SETTINGS } from "@/lib/dashboard-data";
import { BookingCard } from "@/components/dashboard/BookingCard";

function todayIso() {
  return new Date().toISOString().slice(0, 10);
}

export default function DashboardTodayPage() {
  const today = todayIso();
  const bookings = getBookingsByDate(today);

  return (
    <div className="flex flex-1 flex-col px-6 py-6">
      <h1 className="text-xl font-bold text-foreground">{SHOP_SETTINGS.shopName}</h1>
      <p className="text-sm text-zinc-500">
        Today &middot;{" "}
        {new Date().toLocaleDateString("en-US", { weekday: "long", month: "short", day: "numeric" })}
      </p>

      <div className="mt-5 flex flex-1 flex-col gap-3">
        {bookings.length === 0 ? (
          <p className="mt-8 text-center text-sm text-zinc-400">No confirmed bookings today.</p>
        ) : (
          bookings.map((booking) => <BookingCard key={booking.id} booking={booking} />)
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
