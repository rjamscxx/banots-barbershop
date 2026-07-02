"use client";

import { useState, useTransition } from "react";
import { updateHours } from "@/app/dashboard/settings/actions";
import type { DayHours } from "@/lib/slots";

function generateTimeOptions(): string[] {
  const options: string[] = [];
  for (let h = 6; h <= 22; h++) {
    for (const m of [0, 30]) {
      if (h === 22 && m === 30) break;
      const suffix = h >= 12 ? "PM" : "AM";
      const h12 = h % 12 === 0 ? 12 : h % 12;
      options.push(`${h12}:${String(m).padStart(2, "0")} ${suffix}`);
    }
  }
  return options;
}

const TIME_OPTIONS = generateTimeOptions();

const selectCls =
  "rounded-lg border border-divider bg-white px-2 py-2 text-sm text-foreground focus:outline-none focus:border-zinc-400 disabled:opacity-40";

export function HoursEditor({ hours }: { hours: DayHours[] }) {
  const [rows, setRows] = useState<DayHours[]>(hours);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [pending, startTransition] = useTransition();

  function setRow(index: number, patch: Partial<DayHours>) {
    setSaved(false);
    setRows((prev) => prev.map((r, i) => (i === index ? { ...r, ...patch } : r)));
  }

  function submit() {
    setError(null);
    setSaved(false);
    startTransition(async () => {
      const result = await updateHours(rows);
      if (!result.ok) setError(result.error);
      else setSaved(true);
    });
  }

  return (
    <div className="flex flex-col gap-3">
      {rows.map((row, i) => (
        <div
          key={row.day}
          className="flex items-center gap-3 rounded-xl border border-divider px-4 py-3"
        >
          <span className="w-8 shrink-0 font-semibold text-foreground text-sm">{row.day}</span>
          <label className="flex items-center gap-1.5 text-xs text-zinc-500 shrink-0">
            <input
              type="checkbox"
              checked={row.closed}
              onChange={(e) => setRow(i, { closed: e.target.checked })}
              className="accent-brand-black"
            />
            Closed
          </label>
          <select
            value={row.open}
            disabled={row.closed}
            onChange={(e) => setRow(i, { open: e.target.value })}
            className={selectCls}
          >
            {TIME_OPTIONS.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
          <span className="text-xs text-zinc-400">–</span>
          <select
            value={row.close}
            disabled={row.closed}
            onChange={(e) => setRow(i, { close: e.target.value })}
            className={selectCls}
          >
            {TIME_OPTIONS.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>
      ))}
      {error && <p className="text-sm text-red-600">{error}</p>}
      <button
        onClick={submit}
        disabled={pending}
        className="mt-1 rounded-full bg-brand-black px-5 py-2.5 font-semibold text-white disabled:opacity-50"
      >
        {pending ? "Saving…" : saved ? "Saved ✓" : "Save hours"}
      </button>
    </div>
  );
}
