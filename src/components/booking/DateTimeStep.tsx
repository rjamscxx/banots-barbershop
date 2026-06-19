import { TIME_SLOTS, UNAVAILABLE_SLOTS } from "@/lib/booking-data";
import { StepHeader } from "./StepHeader";

function nextDays(count: number) {
  const days = [];
  const today = new Date();
  for (let i = 0; i < count; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    days.push(d);
  }
  return days;
}

type DateTimeStepProps = {
  date: string | null;
  time: string | null;
  onSelectDate: (date: string) => void;
  onSelectTime: (time: string) => void;
  onBack: () => void;
  onNext: () => void;
};

export function DateTimeStep({
  date,
  time,
  onSelectDate,
  onSelectTime,
  onBack,
  onNext,
}: DateTimeStepProps) {
  const days = nextDays(7);

  return (
    <div className="flex flex-1 flex-col">
      <StepHeader title="Pick a date & time" step={2} totalSteps={5} onBack={onBack} />

      <div className="flex flex-1 flex-col px-6 py-6">
        <p className="text-sm font-semibold text-zinc-500">Date</p>
        <div className="mt-2 flex gap-2 overflow-x-auto pb-2">
          {days.map((d) => {
            const iso = d.toISOString().slice(0, 10);
            const isSelected = date === iso;
            return (
              <button
                key={iso}
                onClick={() => onSelectDate(iso)}
                className={`flex min-w-14 flex-col items-center rounded-xl border px-3 py-2 ${
                  isSelected ? "border-brand-gold bg-surface-gray" : "border-divider"
                }`}
              >
                <span className="text-xs text-zinc-500">
                  {d.toLocaleDateString("en-US", { weekday: "short" })}
                </span>
                <span className="text-base font-bold text-foreground">{d.getDate()}</span>
              </button>
            );
          })}
        </div>

        <p className="mt-6 text-sm font-semibold text-zinc-500">Available times</p>
        <div className="mt-2 grid grid-cols-3 gap-2">
          {TIME_SLOTS.map((slot) => {
            const isUnavailable = UNAVAILABLE_SLOTS.has(slot);
            const isSelected = time === slot;
            return (
              <button
                key={slot}
                disabled={isUnavailable}
                onClick={() => onSelectTime(slot)}
                className={`rounded-full border px-3 py-2 text-sm font-bold ${
                  isUnavailable
                    ? "border-divider text-zinc-300 line-through"
                    : isSelected
                      ? "border-brand-gold bg-brand-gold text-brand-black"
                      : "border-divider text-foreground"
                }`}
              >
                {slot}
              </button>
            );
          })}
        </div>
      </div>

      <div className="px-6 pb-8">
        <button
          onClick={onNext}
          disabled={!date || !time}
          className="flex h-13 w-full items-center justify-center rounded-full bg-brand-gold px-5 text-base font-bold text-brand-black transition-colors hover:bg-brand-gold-pressed disabled:opacity-40"
        >
          Continue
        </button>
      </div>
    </div>
  );
}
