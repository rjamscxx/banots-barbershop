"use client";

import { useState } from "react";
import { TIME_SLOTS } from "@/lib/booking-data";
import { SHOP_SETTINGS, formatPeso, type Client } from "@/lib/dashboard-shared";
import { createWalkIn } from "@/app/dashboard/walk-in/actions";

export function WalkInForm({ clients }: { clients: Client[] }) {
  const [clientChoice, setClientChoice] = useState("new");
  const today = new Date().toISOString().slice(0, 10);

  return (
    <form action={createWalkIn} className="flex flex-1 flex-col px-6 py-6">
      <h1 className="text-xl font-bold text-foreground">Add walk-in</h1>

      <label className="mt-5 flex flex-col gap-1.5">
        <span className="text-sm font-semibold text-zinc-500">Client</span>
        <select
          name="clientChoice"
          value={clientChoice}
          onChange={(e) => setClientChoice(e.target.value)}
          className="h-12 rounded-xl border border-divider px-4 text-base text-foreground"
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
        <div className="mt-3 flex flex-col gap-3">
          <input
            name="name"
            placeholder="Full name"
            className="h-12 rounded-xl border border-divider px-4 text-base text-foreground outline-none focus:border-brand-gold"
          />
          <input
            name="phone"
            placeholder="Mobile number"
            type="tel"
            className="h-12 rounded-xl border border-divider px-4 text-base text-foreground outline-none focus:border-brand-gold"
          />
        </div>
      ) : null}

      <label className="mt-5 flex flex-col gap-1.5">
        <span className="text-sm font-semibold text-zinc-500">Service</span>
        <select
          name="service"
          className="h-12 rounded-xl border border-divider px-4 text-base text-foreground"
        >
          {SHOP_SETTINGS.services.map((s) => (
            <option key={s.name} value={s.name}>
              {s.name} &middot; {formatPeso(s.price)}
            </option>
          ))}
        </select>
      </label>

      <div className="mt-5 flex gap-3">
        <label className="flex flex-1 flex-col gap-1.5">
          <span className="text-sm font-semibold text-zinc-500">Date</span>
          <input
            name="date"
            type="date"
            defaultValue={today}
            className="h-12 rounded-xl border border-divider px-3 text-base text-foreground"
          />
        </label>
        <label className="flex flex-1 flex-col gap-1.5">
          <span className="text-sm font-semibold text-zinc-500">Time</span>
          <select
            name="time"
            className="h-12 rounded-xl border border-divider px-3 text-base text-foreground"
          >
            {TIME_SLOTS.map((slot) => (
              <option key={slot} value={slot}>
                {slot}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="flex-1" />

      <button
        type="submit"
        className="mt-8 flex h-13 w-full items-center justify-center rounded-full bg-brand-gold px-5 text-base font-bold text-brand-black"
      >
        Confirm walk-in
      </button>
    </form>
  );
}
