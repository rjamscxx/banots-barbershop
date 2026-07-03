"use client";

import { useRef, useState } from "react";
import { setPaymentMethodQr } from "@/app/dashboard/settings/actions";

type Props = {
  methodId: string;
  label: string;
  initialUrl?: string;
};

export function QrUploader({ methodId, label, initialUrl }: Props) {
  const [url, setUrl] = useState(initialUrl);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploading(true);
    setUploadError(null);
    const form = new FormData();
    form.append("file", file);
    const res = await fetch(`/api/upload?type=qr&method=${methodId}`, {
      method: "POST",
      body: form,
    });
    const data = await res.json();
    setIsUploading(false);
    if (!res.ok) {
      setUploadError(data?.error ?? "Upload failed — please try again");
      if (inputRef.current) inputRef.current.value = "";
      return;
    }
    if (data.url) {
      const result = await setPaymentMethodQr(methodId, data.url);
      if (result.ok) setUrl(`${data.url}?t=${Date.now()}`);
      else setUploadError(result.error);
    }
    if (inputRef.current) inputRef.current.value = "";
  }

  return (
    <div className="flex flex-col items-center gap-2 rounded-xl border border-divider bg-surface-gray px-3 py-4">
      {url ? (
        <img
          src={url}
          alt={`${label} QR`}
          className="h-24 w-24 rounded-lg object-contain"
        />
      ) : (
        <div className="flex h-24 w-24 items-center justify-center rounded-lg border border-dashed border-zinc-200 bg-white text-xs text-zinc-400">
          No QR
        </div>
      )}
      <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">{label}</p>
      <button
        onClick={() => inputRef.current?.click()}
        disabled={isUploading}
        className="rounded-full border border-divider bg-white px-3 py-1 text-xs font-semibold text-foreground transition-colors hover:border-zinc-400 disabled:opacity-40"
      >
        {isUploading ? "Uploading…" : url ? "Replace" : "Upload"}
      </button>
      {uploadError && (
        <p className="text-center text-[10px] text-red-500">{uploadError}</p>
      )}
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
