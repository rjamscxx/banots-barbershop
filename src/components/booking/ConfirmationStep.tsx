import type { BookingState } from "./types";
import { formatPeso } from "@/lib/booking-data";
import { formatDate } from "@/lib/format";

type ConfirmationStepProps = {
  booking: BookingState;
  onDone: () => void;
};

export function ConfirmationStep({ booking, onDone }: ConfirmationStepProps) {
  return (
    <div className="flex flex-1 flex-col">
      {/* Gold top bar */}
      <div className="h-[3px] bg-brand-gold" />

      <div className="flex flex-1 flex-col items-center px-6 py-10">

        {/* Icon */}
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-brand-gold shadow-[0_4px_20px_rgba(201,160,74,0.4)]">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M5 13L9 17L19 7" stroke="#121212" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>

        <h1 className="mt-5 font-[family-name:var(--font-bebas)] text-4xl text-foreground tracking-wide">
          You&apos;re booked!
        </h1>
        <p className="mt-2 max-w-[260px] text-center text-sm text-zinc-500">
          Banot&apos;s Barbershop will confirm once your payment proof is verified.
        </p>

        {/* Reference pill */}
        {booking.reference ? (
          <div className="mt-6 rounded-full border border-zinc-200 bg-surface-gray px-5 py-2">
            <p className="text-xs font-semibold uppercase tracking-widest text-zinc-500">
              Ref: <span className="text-foreground">{booking.reference}</span>
            </p>
          </div>
        ) : null}

        {/* Details card */}
        <div className="mt-5 w-full rounded-2xl border border-zinc-100 bg-white shadow-sm">
          <div className="px-5 py-4">
            <p className="text-[10px] font-semibold uppercase tracking-widest text-zinc-400">
              Booking summary
            </p>
          </div>
          <div className="border-t border-zinc-100">
            {[
              { label: "Service", value: booking.service?.name },
              { label: "Date", value: booking.date ? formatDate(booking.date) : null },
              { label: "Time", value: booking.time },
              { label: "Amount", value: booking.service ? formatPeso(booking.service.price) : null },
            ].map(({ label, value }) =>
              value ? (
                <div key={label} className="flex items-center justify-between border-t border-zinc-50 px-5 py-3 first:border-0">
                  <span className="text-sm text-zinc-500">{label}</span>
                  <span className="text-sm font-semibold text-foreground">{value}</span>
                </div>
              ) : null
            )}
          </div>
          {/* Status bar */}
          <div className="flex items-center gap-2 rounded-b-2xl border-t border-zinc-100 bg-amber-50 px-5 py-3">
            <span className="h-2 w-2 rounded-full bg-amber-400" />
            <span className="text-xs font-semibold text-amber-700">Pending verification</span>
          </div>
        </div>

        <div className="mt-6 w-full space-y-3">
          <button
            onClick={onDone}
            className="btn-gold h-12 w-full text-sm"
          >
            Back to home
          </button>
        </div>

      </div>
    </div>
  );
}
