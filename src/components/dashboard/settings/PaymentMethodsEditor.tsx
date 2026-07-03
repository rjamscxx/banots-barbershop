"use client";

import { useState, useTransition } from "react";
import { updatePaymentMethod, setPaymentMethodActive } from "@/app/dashboard/settings/actions";
import { QrUploader } from "@/components/dashboard/QrUploader";
import type { PaymentMethodRecord } from "@/lib/settings-data";

const field =
  "w-full rounded-xl border border-divider px-3 py-2 text-sm text-foreground focus:outline-none focus:border-zinc-400";

function MethodRow({ m }: { m: PaymentMethodRecord }) {
  const [form, setForm] = useState({
    accountName: m.accountName,
    accountNumber: m.accountNumber,
  });
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [savePending, startSave] = useTransition();
  const [togglePending, startToggle] = useTransition();

  function handleSave() {
    setError(null);
    setSaved(false);
    startSave(async () => {
      const result = await updatePaymentMethod({ id: m.id, ...form });
      if (!result.ok) setError("Save failed");
      else setSaved(true);
    });
  }

  function handleToggle() {
    startToggle(async () => {
      await setPaymentMethodActive(m.id, !m.active);
    });
  }

  return (
    <div className={`rounded-xl border border-divider px-4 py-3 flex flex-col gap-3 ${!m.active ? "opacity-50" : ""}`}>
      <div className="flex items-center gap-2">
        <span className="font-semibold text-foreground flex-1">{m.label}</span>
        {!m.active && (
          <span className="rounded-full bg-zinc-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-zinc-400">
            inactive
          </span>
        )}
      </div>

      {/* QR uploader (single source of truth for QR display) */}
      <div className="flex items-start">
        <QrUploader methodId={m.id} label={m.label} initialUrl={m.qrImageUrl || undefined} />
      </div>

      {/* Account name + number */}
      <div className="flex gap-2">
        <label className="flex flex-1 flex-col gap-1 text-xs text-zinc-500">
          Account name
          <input
            className={field}
            placeholder="e.g. Juan Dela Cruz"
            value={form.accountName}
            onChange={(e) => { setForm({ ...form, accountName: e.target.value }); setSaved(false); }}
          />
        </label>
        <label className="flex flex-1 flex-col gap-1 text-xs text-zinc-500">
          Account number / mobile
          <input
            className={field}
            placeholder="e.g. 0917 123 4567"
            value={form.accountNumber}
            onChange={(e) => { setForm({ ...form, accountNumber: e.target.value }); setSaved(false); }}
          />
        </label>
      </div>

      {error && <p className="text-xs text-red-600">{error}</p>}

      <div className="flex gap-2">
        <button
          onClick={handleSave}
          disabled={savePending}
          className="rounded-full bg-brand-black px-4 py-1.5 text-xs font-semibold text-white disabled:opacity-50"
        >
          {savePending ? "Saving…" : saved ? "Saved ✓" : "Save"}
        </button>
        <button
          onClick={handleToggle}
          disabled={togglePending}
          className="rounded-full border border-divider px-4 py-1.5 text-xs font-semibold text-zinc-500 hover:border-zinc-400 hover:text-foreground disabled:opacity-50"
        >
          {m.active ? "Deactivate" : "Activate"}
        </button>
      </div>
    </div>
  );
}

export function PaymentMethodsEditor({ methods }: { methods: PaymentMethodRecord[] }) {
  return (
    <div className="flex flex-col gap-3">
      {methods.map((m) => (
        <MethodRow key={m.id} m={m} />
      ))}
    </div>
  );
}
