import { getBookingsByStatus } from "@/lib/dashboard-data";
import { BookingCard } from "@/components/dashboard/BookingCard";

export default async function PendingRequestsPage() {
  const bookings = await getBookingsByStatus("pending_verification");

  return (
    <div className="flex flex-1 flex-col px-6 py-6">
      <h1 className="text-xl font-bold text-foreground">Pending requests</h1>
      <p className="text-sm text-zinc-500">Verify payment proof before confirming.</p>

      <div className="mt-5 flex flex-1 flex-col gap-3">
        {bookings.length === 0 ? (
          <p className="mt-8 text-center text-sm text-zinc-400">No pending requests.</p>
        ) : (
          bookings.map((booking) => (
            <BookingCard key={booking.id} booking={booking} href={`/dashboard/pending/${booking.id}`} />
          ))
        )}
      </div>
    </div>
  );
}
