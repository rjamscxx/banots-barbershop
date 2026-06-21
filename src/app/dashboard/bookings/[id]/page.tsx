import Link from "next/link";
import { notFound } from "next/navigation";
import { formatPeso, getBookingById, getClientById } from "@/lib/dashboard-data";
import { formatDate } from "@/lib/format";
import { approveBooking, rejectBooking, completeBooking, markNoShow, cancelBooking } from "./actions";
import type { BookingStatus } from "@/lib/dashboard-shared";

const STATUS_CONFIG: Record<BookingStatus, { label: string; color: string }> = {
  pending_verification: { label: "Pending verification", color: "bg-amber-100 text-amber-700" },
  confirmed:            { label: "Confirmed",            color: "bg-green-100 text-green-700" },
  rejected:             { label: "Rejected",             color: "bg-red-100 text-red-600" },
  completed:            { label: "Completed",            color: "bg-zinc-100 text-zinc-600" },
  no_show:              { label: "No-show",              color: "bg-zinc-100 text-zinc-600" },
  cancelled:            { label: "Cancelled",            color: "bg-zinc-100 text-zinc-600" },
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
  const statusCfg = STATUS_CONFIG[booking.status as BookingStatus] ?? { label: booking.status, color: "bg-zinc-100 text-zinc-600" };

  return (
    <div className="flex flex-1 flex-col">

      {/* Header */}
      <div className="border-b border-divider px-6 pb-5 pt-6">
        <Link href={backHref} className="flex items-center gap-1.5 text-xs font-semibold text-zinc-400 hover:text-foreground transition-colors">
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path d="M7.5 2L3.5 6L7.5 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Back
        </Link>
        <div className="mt-3 flex items-center justify-between">
          <h1 className="text-xl font-bold text-foreground">Booking</h1>
          <span className={`rounded-full px-3 py-1 text-xs font-semibold ${statusCfg.color}`}>
            {statusCfg.label}
          </span>
        </div>
        {booking.reference ? (
          <p className="mt-1 text-xs text-zinc-400">Ref: {booking.reference}</p>
        ) : null}
      </div>

      <div className="flex flex-1 flex-col px-6 py-5 gap-5">

        {/* Client + booking info */}
        <div className="rounded-2xl border border-divider overflow-hidden">
          <div className="bg-surface-gray px-5 py-3">
            <p className="text-[10px] font-semibold uppercase tracking-widest text-zinc-500">Client</p>
            <p className="mt-0.5 font-semibold text-foreground">{client?.name}</p>
            <p className="text-sm text-zinc-500">{client?.phone}</p>
          </div>
          <div className="divide-y divide-zinc-50">
            {[
              { label: "Service",   value: booking.service.name },
              { label: "Date",      value: formatDate(booking.date) },
              { label: "Time",      value: booking.time },
              { label: "Amount",    value: formatPeso(booking.service.price) },
              { label: "Payment",   value: booking.paymentMethod ?? null },
            ].filter(r => r.value).map(({ label, value }) => (
              <div key={label} className="flex justify-between px-5 py-3">
                <span className="text-sm text-zinc-500">{label}</span>
                <span className="text-sm font-semibold text-foreground">{value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Proof of payment */}
        {booking.status === "pending_verification" ? (
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-zinc-400">
              Proof of payment
            </p>
            {booking.proofImageUrl ? (
              <img
                src={booking.proofImageUrl}
                alt="Payment proof"
                className="mt-3 w-full rounded-2xl border border-divider object-contain"
                style={{ maxHeight: "320px" }}
              />
            ) : (
              <div className="mt-3 flex h-32 w-full items-center justify-center rounded-2xl border border-dashed border-zinc-200 text-xs text-zinc-400">
                No image uploaded
              </div>
            )}
          </div>
        ) : null}

        <div className="flex-1" />

        {/* Actions */}
        {booking.status === "pending_verification" ? (
          <div className="flex gap-3">
            <form action={rejectBooking.bind(null, booking.id)} className="flex-1">
              <button className="flex h-12 w-full items-center justify-center rounded-full border border-divider text-sm font-bold text-foreground transition-colors hover:bg-zinc-50">
                Reject
              </button>
            </form>
            <form action={approveBooking.bind(null, booking.id)} className="flex-1">
              <button className="btn-gold h-12 w-full text-sm">
                Approve
              </button>
            </form>
          </div>
        ) : null}

        {booking.status === "confirmed" ? (
          <div className="flex flex-col gap-3">
            <form action={completeBooking.bind(null, booking.id)}>
              <button className="btn-gold h-12 w-full text-sm">
                Mark completed
              </button>
            </form>
            <div className="flex gap-3">
              <form action={markNoShow.bind(null, booking.id)} className="flex-1">
                <button className="flex h-12 w-full items-center justify-center rounded-full border border-divider text-sm font-bold text-foreground hover:bg-zinc-50">
                  No-show
                </button>
              </form>
              <form action={cancelBooking.bind(null, booking.id)} className="flex-1">
                <button className="flex h-12 w-full items-center justify-center rounded-full border border-divider text-sm font-bold text-foreground hover:bg-zinc-50">
                  Cancel
                </button>
              </form>
            </div>
          </div>
        ) : null}

      </div>
    </div>
  );
}
