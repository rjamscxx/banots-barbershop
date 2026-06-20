"use client";

import { useRef, useState } from "react";

type Props = {
  methodId: string;
  label: string;
  initialUrl?: string;
};

export function QrUploader({ methodId, label, initialUrl }: Props) {
  const [url, setUrl] = useState(initialUrl);
  const [isUploading, setIsUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploading(true);
    const form = new FormData();
    form.append("file", file);
    const res = await fetch(`/api/upload?type=qr&method=${methodId}`, {
      method: "POST",
      body: form,
    });
    const data = await res.json();
    setIsUploading(false);
    if (data.url) setUrl(`${data.url}?t=${Date.now()}`);
    // reset input so same file can be re-selected
    if (inputRef.current) inputRef.current.value = "";
  }

  return (
    <div className="flex flex-col items-center gap-2 rounded-xl border border-divider px-3 py-4">
      {url ? (
        <img
          src={url}
          alt={`${label} QR`}
          className="h-24 w-24 rounded-lg object-contain"
        />
      ) : (
        <div className="flex h-24 w-24 items-center justify-center rounded-lg border border-divider bg-surface-gray text-xs text-zinc-400">
          No QR
        </div>
      )}
      <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500">{label}</p>
      <button
        onClick={() => inputRef.current?.click()}
        disabled={isUploading}
        className="rounded-full border border-divider px-3 py-1 text-xs font-semibold text-foreground transition-colors hover:bg-surface-gray disabled:opacity-40"
      >
        {isUploading ? "Uploading…" : url ? "Replace" : "Upload"}
      </button>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleChange}
      />
    </div>
  );
}
