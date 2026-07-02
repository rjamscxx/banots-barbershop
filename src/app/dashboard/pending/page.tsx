import { getBookingsByStatus } from "@/lib/dashboard-data";
import { BookingCard } from "@/components/dashboard/BookingCard";

export default async function PendingRequestsPage() {
  const bookings = await getBookingsByStatus("pending_verification");

  return (
    <div className="flex flex-1 flex-col">
      <div className="bg-brand-black px-6 pb-5 pt-6">
        <h1 className="font-[family-name:var(--font-bebas)] text-5xl text-white leading-none">Pending</h1>
        <p className="mt-1 text-xs text-zinc-500">Verify payment proof before confirming.</p>
      </div>

      <div className="flex flex-1 flex-col gap-3 px-6 py-5">
        {bookings.length === 0 ? (
          <p className="mt-8 text-center text-sm text-zinc-400">No pending requests.</p>
        ) : (
          bookings.map((booking) => (
            <BookingCard
              key={booking.id}
              booking={booking}
              href={`/dashboard/bookings/${booking.id}`}
              showDate
            />
          ))
        )}
      </div>
    </div>
  );
}
