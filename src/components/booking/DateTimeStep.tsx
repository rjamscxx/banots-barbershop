"use client";

import { useEffect, useState } from "react";
import { TIME_SLOTS } from "@/lib/booking-data";
import { getBookedSlotsForDate } from "@/app/book/actions";
import { StepHeader } from "./StepHeader";

function nextOpenDays(count: number) {
  const days: Date[] = [];
  const d = new Date();
  while (days.length < count) {
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
    <div className="flex flex-1 flex-col bg-brand-black">
      <StepHeader title="Pick a date & time" step={2} totalSteps={5} onBack={onBack} />

      <div className="flex flex-1 flex-col px-6 py-5">
        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-zinc-600">Date</p>
        <div className="mt-3 flex gap-2 overflow-x-auto pb-2">
          {days.map((d) => {
            const iso = d.toISOString().slice(0, 10);
            const isSelected = date === iso;
            return (
              <button
                key={iso}
                onClick={() => { onSelectDate(iso); onSelectTime(""); }}
                className={`flex min-w-14 flex-col items-center rounded-xl border px-3 py-3 transition-all ${
                  isSelected
                    ? "border-brand-gold bg-brand-gold text-brand-black"
                    : "border-zinc-800 hover:border-zinc-600"
                }`}
              >
                <span className={`text-[10px] font-semibold uppercase tracking-wide ${
                  isSelected ? "text-brand-black/70" : "text-zinc-600"
                }`}>
                  {d.toLocaleDateString("en-US", { weekday: "short" })}
                </span>
                <span className={`font-[family-name:var(--font-bebas)] text-2xl leading-tight ${
                  isSelected ? "text-brand-black" : "text-white"
                }`}>
                  {d.getDate()}
                </span>
              </button>
            );
          })}
        </div>

        <p className="mt-6 text-[11px] font-semibold uppercase tracking-[0.2em] text-zinc-600">
          {loadingSlots ? "Checking availability…" : "Available times"}
        </p>
        <div className="mt-3 grid grid-cols-3 gap-2">
          {TIME_SLOTS.map((slot) => {
            const isTaken = takenSlots.has(slot);
            const isSelected = time === slot;
            return (
              <button
                key={slot}
                disabled={isTaken || !date || loadingSlots}
                onClick={() => onSelectTime(slot)}
                className={`rounded-xl border px-3 py-2.5 text-sm font-bold transition-all ${
                  isTaken
                    ? "border-zinc-800 text-zinc-700 line-through cursor-not-allowed"
                    : isSelected
                      ? "border-brand-gold bg-brand-gold text-brand-black"
                      : !date || loadingSlots
                        ? "border-zinc-800 text-zinc-700"
                        : "border-zinc-800 text-zinc-300 hover:border-zinc-500 hover:text-white"
                }`}
              >
                {slot}
              </button>
            );
          })}
        </div>

        {!date && (
          <p className="mt-4 text-xs text-zinc-700">Select a date to see available times.</p>
        )}
      </div>

      <div className="px-6 pb-8">
        <button
          onClick={onNext}
          disabled={!date || !time}
          className="btn-gold h-12 w-full text-sm disabled:opacity-30 disabled:shadow-none disabled:translate-y-0"
        >
          Continue
        </button>
      </div>
    </div>
  );
}
