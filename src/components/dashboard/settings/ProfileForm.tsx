"use client";

import { useState, useTransition } from "react";
import { updateShopProfile } from "@/app/dashboard/settings/actions";

export function ProfileForm({
  profile,
}: {
  profile: { shopName: string; address: string; phone: string };
}) {
  const [form, setForm] = useState(profile);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [pending, startTransition] = useTransition();

  function submit() {
    setError(null);
    setSaved(false);
    startTransition(async () => {
      const result = await updateShopProfile(form);
      if (!result.ok) setError(result.error);
      else setSaved(true);
    });
  }

  const field =
    "w-full rounded-xl border border-divider px-4 py-3 text-foreground focus:outline-none focus:border-zinc-400";

  return (
    <div className="flex flex-col gap-2">
      <label className="flex flex-col gap-1 text-xs text-zinc-500">
        Shop name
        <input
          className={field}
          value={form.shopName}
          onChange={(e) => { setForm({ ...form, shopName: e.target.value }); setSaved(false); }}
        />
      </label>
      <label className="flex flex-col gap-1 text-xs text-zinc-500">
        Address
        <input
          className={field}
          value={form.address}
          onChange={(e) => { setForm({ ...form, address: e.target.value }); setSaved(false); }}
        />
      </label>
      <label className="flex flex-col gap-1 text-xs text-zinc-500">
        Phone
        <input
          className={field}
          value={form.phone}
          onChange={(e) => { setForm({ ...form, phone: e.target.value }); setSaved(false); }}
        />
      </label>
      {error && <p className="text-sm text-red-600">{error}</p>}
      <button
        onClick={submit}
        disabled={pending}
        className="mt-1 rounded-full bg-brand-black px-5 py-2.5 font-semibold text-white disabled:opacity-50"
      >
        {pending ? "Saving…" : saved ? "Saved ✓" : "Save profile"}
      </button>
    </div>
  );
}
