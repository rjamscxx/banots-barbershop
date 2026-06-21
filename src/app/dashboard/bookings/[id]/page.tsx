import Link from "next/link";
import { notFound } from "next/navigation";
import { formatPeso, getBookingById, getClientById } from "@/lib/dashboard-data";
import { formatDate } from "@/lib/format";
import { approveBooking, rejectBooking, completeBooking, markNoShow, cancelBooking } from "./actions";

const STATUS_LABELS: Record<string, string> = {
  pending_verification: "Pending verification",
  confirmed: "Confirmed",
  rejected: "Rejected",
  completed: "Completed",
  no_show: "No-show",
  cancelled: "Cancelled",
};

export default async function BookingDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const booking = await getBookingById(id);
  if (!booking) notFound();

  const client = await getClientById(booking.clientId);
  const backHref = booking.status === "pending_verification" ? "/dashboard/pending" : "/dashboard";

  return (
    <div className="flex flex-1 flex-col px-6 py-6">
      <div className="flex items-center gap-3">
        <Link href={backHref} className="text-sm font-semibold text-zinc-500">
          ← Back
        </Link>
      </div>

      <h1 className="mt-3 text-xl font-bold text-foreground">Booking</h1>
      <p className="text-sm text-zinc-500">
        {STATUS_LABELS[booking.status] ?? booking.status}
        {booking.reference ? ` · Ref: ${booking.reference}` : ""}
      </p>

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
          <span className="text-zinc-500">Date</span>
          <span className="font-semibold text-foreground">
            {formatDate(booking.date)}
          </span>
        </div>
        <div className="mt-1 flex justify-between text-sm">
          <span className="text-zinc-500">Time</span>
          <span className="font-semibold text-foreground">{booking.time}</span>
        </div>
        <div className="mt-1 flex justify-between text-sm">
          <span className="text-zinc-500">Amount</span>
          <span className="font-semibold text-foreground">{formatPeso(booking.service.price)}</span>
        </div>
        {booking.paymentMethod ? (
          <div className="mt-1 flex justify-between text-sm">
            <span className="text-zinc-500">Method</span>
            <span className="font-semibold text-foreground">{booking.paymentMethod}</span>
          </div>
        ) : null}
      </div>

      {booking.status === "pending_verification" ? (
        <>
          <p className="mt-6 text-sm font-semibold text-zinc-500">Proof of payment</p>
          {booking.proofImageUrl ? (
            <img
              src={booking.proofImageUrl}
              alt="Payment proof"
              className="mt-2 w-full rounded-xl border border-divider object-contain"
              style={{ maxHeight: "320px" }}
            />
          ) : (
            <div className="mt-2 flex h-40 w-full items-center justify-center rounded-xl border border-divider bg-surface-gray text-xs text-zinc-400">
              No image uploaded
            </div>
          )}
        </>
      ) : null}

      <div className="flex-1" />

      {booking.status === "pending_verification" ? (
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
      ) : null}

      {booking.status === "confirmed" ? (
        <div className="mt-6 flex flex-col gap-3">
          <form action={completeBooking.bind(null, booking.id)}>
            <button className="flex h-13 w-full items-center justify-center rounded-full bg-brand-gold px-5 text-base font-bold text-brand-black">
              Mark Completed
            </button>
          </form>
          <div className="flex gap-3">
            <form action={markNoShow.bind(null, booking.id)} className="flex-1">
              <button className="flex h-13 w-full items-center justify-center rounded-full border border-divider px-5 text-base font-bold text-foreground">
                No-show
              </button>
            </form>
            <form action={cancelBooking.bind(null, booking.id)} className="flex-1">
              <button className="flex h-13 w-full items-center justify-center rounded-full border border-divider px-5 text-base font-bold text-foreground">
                Cancel
              </button>
            </form>
          </div>
        </div>
      ) : null}
    </div>
  );
}
