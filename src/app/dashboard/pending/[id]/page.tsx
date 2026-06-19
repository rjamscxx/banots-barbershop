import { notFound } from "next/navigation";
import { formatPeso, getBookingById, getClientById } from "@/lib/dashboard-data";
import { approveBooking, rejectBooking } from "./actions";

export default async function BookingDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const booking = getBookingById(id);
  if (!booking) notFound();

  const client = getClientById(booking.clientId);

  return (
    <div className="flex flex-1 flex-col px-6 py-6">
      <h1 className="text-xl font-bold text-foreground">Booking request</h1>

      <div className="mt-4 rounded-xl border border-divider bg-surface-gray px-4 py-4">
        <div className="flex justify-between text-sm">
          <span className="text-zinc-500">Client</span>
          <span className="font-semibold text-foreground">{client?.name}</span>
        </div>
        <div className="mt-1 flex justify-between text-sm">
          <span className="text-zinc-500">Phone</span>
          <span className="font-semibold text-foreground">{client?.phone}</span>
        </div>
        <div className="mt-1 flex justify-between text-sm">
          <span className="text-zinc-500">Service</span>
          <span className="font-semibold text-foreground">{booking.service.name}</span>
        </div>
        <div className="mt-1 flex justify-between text-sm">
          <span className="text-zinc-500">Time</span>
          <span className="font-semibold text-foreground">
            {booking.date} &middot; {booking.time}
          </span>
        </div>
        <div className="mt-1 flex justify-between text-sm">
          <span className="text-zinc-500">Amount</span>
          <span className="font-semibold text-foreground">{formatPeso(booking.service.price)}</span>
        </div>
        <div className="mt-1 flex justify-between text-sm">
          <span className="text-zinc-500">Method</span>
          <span className="font-semibold text-foreground">{booking.paymentMethod}</span>
        </div>
      </div>

      <p className="mt-6 text-sm font-semibold text-zinc-500">Proof of payment</p>
      <div className="mt-2 flex h-56 w-full items-center justify-center rounded-xl border border-divider bg-surface-gray text-xs text-zinc-400">
        [ {booking.proofImageUrl ?? "no image"} ]
      </div>

      <div className="flex-1" />

      <div className="mt-6 flex gap-3">
        <form action={rejectBooking.bind(null, booking.id)} className="flex-1">
          <button className="flex h-13 w-full items-center justify-center rounded-full border border-divider px-5 text-base font-bold text-foreground">
            Reject
          </button>
        </form>
        <form action={approveBooking.bind(null, booking.id)} className="flex-1">
          <button className="flex h-13 w-full items-center justify-center rounded-full bg-brand-gold px-5 text-base font-bold text-brand-black">
            Approve
          </button>
        </form>
      </div>
    </div>
  );
}
