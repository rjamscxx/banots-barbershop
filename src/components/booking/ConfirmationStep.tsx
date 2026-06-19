import type { BookingState } from "./types";
import { formatPeso } from "@/lib/booking-data";

type ConfirmationStepProps = {
  booking: BookingState;
  onDone: () => void;
};

export function ConfirmationStep({ booking, onDone }: ConfirmationStepProps) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center px-6 py-10 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-brand-gold text-2xl text-brand-black">
        ✓
      </div>
      <h1 className="mt-4 text-xl font-bold text-foreground">Booking request sent</h1>
      <p className="mt-1 text-sm text-zinc-500">
        Banot&apos;s Barbershop will confirm once your payment proof is verified.
      </p>

      <div className="mt-6 w-full rounded-xl border border-divider bg-surface-gray px-4 py-4 text-left">
        <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
          Reference
        </p>
        <p className="text-lg font-bold text-foreground">{booking.reference}</p>

        <div className="mt-3 flex justify-between text-sm">
          <span className="text-zinc-500">Service</span>
          <span className="font-semibold text-foreground">{booking.service?.name}</span>
        </div>
        <div className="mt-1 flex justify-between text-sm">
          <span className="text-zinc-500">Date</span>
          <span className="font-semibold text-foreground">{booking.date}</span>
        </div>
        <div className="mt-1 flex justify-between text-sm">
          <span className="text-zinc-500">Time</span>
          <span className="font-semibold text-foreground">{booking.time}</span>
        </div>
        <div className="mt-1 flex justify-between text-sm">
          <span className="text-zinc-500">Amount</span>
          <span className="font-semibold text-foreground">
            {booking.service ? formatPeso(booking.service.price) : ""}
          </span>
        </div>
        <div className="mt-1 flex justify-between text-sm">
          <span className="text-zinc-500">Status</span>
          <span className="font-semibold text-brand-gold-pressed">Pending verification</span>
        </div>
      </div>

      <button
        onClick={onDone}
        className="mt-8 flex h-13 w-full items-center justify-center rounded-full bg-brand-black px-5 text-base font-bold text-white"
      >
        Back to home
      </button>
    </div>
  );
}
