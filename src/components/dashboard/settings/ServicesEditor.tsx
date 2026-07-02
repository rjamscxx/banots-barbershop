"use client";

import { useState, useTransition } from "react";
import { saveService, setServiceActive } from "@/app/dashboard/settings/actions";
import type { ServiceRecord } from "@/lib/settings-data";

const field =
  "w-full rounded-xl border border-divider px-3 py-2 text-sm text-foreground focus:outline-none focus:border-zinc-400";

type EditRow = { name: string; price: string; durationMinutes: string };

function ServiceRow({ s }: { s: ServiceRecord }) {
  const [form, setForm] = useState<EditRow>({
    name: s.name,
    price: String(s.price),
    durationMinutes: String(s.durationMinutes),
  });
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [savePending, startSave] = useTransition();
  const [togglePending, startToggle] = useTransition();

  function handleSave() {
    setError(null);
    setSaved(false);
    startSave(async () => {
      const result = await saveService({
        id: s.id,
        name: form.name,
        price: Number(form.price),
        durationMinutes: Number(form.durationMinutes),
      });
      if (!result.ok) setError(result.error);
      else setSaved(true);
    });
  }

  function handleToggle() {
    startToggle(async () => {
      await setServiceActive(s.id, !s.active);
    });
  }

  return (
    <div className={`rounded-xl border border-divider px-4 py-3 flex flex-col gap-2 ${!s.active ? "opacity-50" : ""}`}>
      <div className="flex items-center gap-2">
        <span className="font-semibold text-sm text-foreground flex-1">{s.name}</span>
        {!s.active && (
          <span className="rounded-full bg-zinc-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-zinc-400">
            inactive
          </span>
        )}
      </div>
      <div className="flex gap-2">
        <label className="flex flex-1 flex-col gap-1 text-xs text-zinc-500">
          Name
          <input
            className={field}
            value={form.name}
            onChange={(e) => { setForm({ ...form, name: e.target.value }); setSaved(false); }}
          />
        </label>
        <label className="flex w-24 flex-col gap-1 text-xs text-zinc-500">
          Price (₱)
          <input
            type="number"
            min={1}
            className={field}
            value={form.price}
            data-testid={`service-price-${s.id}`}
            onChange={(e) => { setForm({ ...form, price: e.target.value }); setSaved(false); }}
          />
        </label>
        <label className="flex w-20 flex-col gap-1 text-xs text-zinc-500">
          Mins
          <input
            type="number"
            min={1}
            className={field}
            value={form.durationMinutes}
            onChange={(e) => { setForm({ ...form, durationMinutes: e.target.value }); setSaved(false); }}
          />
        </label>
      </div>
      {error && <p className="text-xs text-red-600">{error}</p>}
      <div className="flex gap-2">
        <button
          onClick={handleSave}
          disabled={savePending}
          data-testid={`service-save-${s.id}`}
          className="rounded-full bg-brand-black px-4 py-1.5 text-xs font-semibold text-white disabled:opacity-50"
        >
          {savePending ? "Saving…" : saved ? "Saved ✓" : "Save"}
        </button>
        <button
          onClick={handleToggle}
          disabled={togglePending}
          className="rounded-full border border-divider px-4 py-1.5 text-xs font-semibold text-zinc-500 hover:border-zinc-400 hover:text-foreground disabled:opacity-50"
        >
          {s.active ? "Deactivate" : "Activate"}
        </button>
      </div>
    </div>
  );
}

function AddServiceForm() {
  const [form, setForm] = useState<EditRow>({ name: "", price: "", durationMinutes: "" });
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function handleAdd() {
    setError(null);
    startTransition(async () => {
      const result = await saveService({
        name: form.name,
        price: Number(form.price),
        durationMinutes: Number(form.durationMinutes),
      });
      if (!result.ok) setError(result.error);
      else setForm({ name: "", price: "", durationMinutes: "" });
    });
  }

  return (
    <div className="rounded-xl border border-dashed border-divider px-4 py-3 flex flex-col gap-2">
      <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Add service</p>
      <div className="flex gap-2">
        <label className="flex flex-1 flex-col gap-1 text-xs text-zinc-500">
          Name
          <input
            className={field}
            placeholder="e.g. Kids Haircut"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
        </label>
        <label className="flex w-24 flex-col gap-1 text-xs text-zinc-500">
          Price (₱)
          <input
            type="number"
            min={1}
            className={field}
            placeholder="150"
            value={form.price}
            onChange={(e) => setForm({ ...form, price: e.target.value })}
          />
        </label>
        <label className="flex w-20 flex-col gap-1 text-xs text-zinc-500">
          Mins
          <input
            type="number"
            min={1}
            className={field}
            placeholder="30"
            value={form.durationMinutes}
            onChange={(e) => setForm({ ...form, durationMinutes: e.target.value })}
          />
        </label>
      </div>
      {error && <p className="text-xs text-red-600">{error}</p>}
      <button
        onClick={handleAdd}
        disabled={pending}
        className="self-start rounded-full bg-brand-black px-4 py-1.5 text-xs font-semibold text-white disabled:opacity-50"
      >
        {pending ? "Adding…" : "Add service"}
      </button>
    </div>
  );
}

export function ServicesEditor({ services }: { services: ServiceRecord[] }) {
  return (
    <div className="flex flex-col gap-2">
      {services.map((s) => (
        <ServiceRow key={s.id} s={s} />
      ))}
      <AddServiceForm />
    </div>
  );
}
