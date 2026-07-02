"use client";

import { useState } from "react";
import { TIME_SLOTS } from "@/lib/booking-data";
import { SHOP_SETTINGS, formatPeso, type Client } from "@/lib/dashboard-shared";
import { createWalkIn } from "@/app/dashboard/walk-in/actions";

const inputCls = "h-12 rounded-xl border border-divider bg-white px-4 text-base text-foreground outline-none transition-colors placeholder:text-zinc-300 focus:border-brand-gold focus:ring-2 focus:ring-brand-gold/10";
const selectCls = "h-12 rounded-xl border border-divider bg-white px-4 text-base text-foreground outline-none focus:border-brand-gold";

export function WalkInForm({ clients }: { clients: Client[] }) {
  const [clientChoice, setClientChoice] = useState("new");
  const today = new Date().toISOString().slice(0, 10);

  return (
    <div className="flex flex-1 flex-col">
      <div className="bg-brand-black px-6 pb-5 pt-6">
        <h1 className="font-[family-name:var(--font-bebas)] text-5xl text-white leading-none">Walk-in</h1>
        <p className="mt-1 text-xs text-zinc-500">Register a client who walked in today.</p>
      </div>

      <form action={createWalkIn} className="flex flex-1 flex-col px-6 py-6 gap-4">

        <label className="flex flex-col gap-1.5">
          <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-zinc-500">Client</span>
          <select
            name="clientChoice"
            value={clientChoice}
            onChange={(e) => setClientChoice(e.target.value)}
            className={selectCls}
          >
            <option value="new">+ New client</option>
            {clients.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </label>

        {clientChoice === "new" ? (
          <div className="flex flex-col gap-3">
            <input
              name="name"
              placeholder="Full name"
              className={inputCls}
            />
            <input
              name="phone"
              placeholder="Mobile number"
              type="tel"
              className={inputCls}
            />
          </div>
        ) : null}

        <label className="flex flex-col gap-1.5">
          <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-zinc-500">Service</span>
          <select name="service" className={selectCls}>
            {SHOP_SETTINGS.services.map((s) => (
              <option key={s.name} value={s.name}>
                {s.name} · {formatPeso(s.price)}
              </option>
            ))}
          </select>
        </label>

        <div className="flex gap-3">
          <label className="flex flex-1 flex-col gap-1.5">
            <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-zinc-500">Date</span>
            <input
              name="date"
              type="date"
              defaultValue={today}
              className={inputCls}
            />
          </label>
          <label className="flex flex-1 flex-col gap-1.5">
            <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-zinc-500">Time</span>
            <select name="time" className={selectCls}>
              {TIME_SLOTS.map((slot) => (
                <option key={slot} value={slot}>{slot}</option>
              ))}
            </select>
          </label>
        </div>

        <div className="flex-1" />

        <button
          type="submit"
          className="btn-dark h-12 w-full text-sm"
        >
          Confirm walk-in
        </button>
      </form>
    </div>
  );
}
