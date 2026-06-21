"use client";

import { useEffect, useState } from "react";
import { TIME_SLOTS } from "@/lib/booking-data";
import { getBookedSlotsForDate } from "@/app/book/actions";
import { StepHeader } from "./StepHeader";

function nextOpenDays(count: number) {
  const days: Date[] = [];
  const d = new Date();
  while (days.length < count) {
    // skip Sundays (day 0)
    if (d.getDay() !== 0) days.push(new Date(d));
    d.setDate(d.getDate() + 1);
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
  const days = nextOpenDays(7);
  const [takenSlots, setTakenSlots] = useState<Set<string>>(new Set());
  const [loadingSlots, setLoadingSlots] = useState(false);

  useEffect(() => {
    if (!date) return;
    setLoadingSlots(true);
    getBookedSlotsForDate(date).then((slots) => {
      setTakenSlots(new Set(slots));
      setLoadingSlots(false);
    });
  }, [date]);

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
                onClick={() => { onSelectDate(iso); onSelectTime(""); }}
                className={`flex min-w-14 flex-col items-center rounded-xl border px-3 py-2 transition-colors ${
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

        <p className="mt-6 text-sm font-semibold text-zinc-500">
          {loadingSlots ? "Checking availability…" : "Available times"}
        </p>
        <div className="mt-2 grid grid-cols-3 gap-2">
          {TIME_SLOTS.map((slot) => {
            const isTaken = takenSlots.has(slot);
            const isSelected = time === slot;
            return (
              <button
                key={slot}
                disabled={isTaken || !date || loadingSlots}
                onClick={() => onSelectTime(slot)}
                className={`rounded-full border px-3 py-2 text-sm font-bold transition-colors ${
                  isTaken
                    ? "border-divider text-zinc-300 line-through"
                    : isSelected
                      ? "border-brand-gold bg-brand-gold text-brand-black"
                      : !date || loadingSlots
                        ? "border-divider text-zinc-400"
                        : "border-divider text-foreground hover:border-zinc-400"
                }`}
              >
                {slot}
              </button>
            );
          })}
        </div>

        {!date && (
          <p className="mt-4 text-xs text-zinc-400">Select a date to see available times.</p>
        )}
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
