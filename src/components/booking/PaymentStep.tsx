"use client";

import { useRef, useState } from "react";
import { PAYMENT_METHODS, type Service, formatPeso } from "@/lib/booking-data";
import { StepHeader } from "./StepHeader";

type PaymentStepProps = {
  service: Service | null;
  paymentMethod: string | null;
  proofImageUrl: string | null;
  error?: string | null;
  isSubmitting?: boolean;
  onSelectMethod: (id: string) => void;
  onUploadProof: (url: string) => void;
  onBack: () => void;
  onPickDifferentTime: () => void;
  onNext: () => void;
};

export function PaymentStep({
  service,
  paymentMethod,
  proofImageUrl,
  error,
  isSubmitting,
  onSelectMethod,
  onUploadProof,
  onBack,
  onPickDifferentTime,
  onNext,
}: PaymentStepProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [qrError, setQrError] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploading(true);
    const form = new FormData();
    form.append("file", file);
    const res = await fetch("/api/upload?type=proof", { method: "POST", body: form });
    const data = await res.json();
    setIsUploading(false);
    if (data.url) onUploadProof(data.url);
  }

  const qrSrc = paymentMethod ? `/qr/${paymentMethod}.png` : null;

  return (
    <div className="flex flex-1 flex-col">
      <StepHeader title="Pay to confirm" step={4} totalSteps={5} onBack={onBack} />

      <div className="flex flex-1 flex-col px-6 py-6">
        <p className="text-sm text-zinc-500">
          Scan a QR below to pay{" "}
          <span className="font-bold text-foreground">
            {service ? formatPeso(service.price) : ""}
          </span>
          , then upload your proof of payment.
        </p>

        <div className="mt-4 flex gap-2 overflow-x-auto pb-2">
          {PAYMENT_METHODS.map((method) => {
            const isSelected = paymentMethod === method.id;
            return (
              <button
                key={method.id}
                onClick={() => { onSelectMethod(method.id); setQrError(false); }}
                className={`min-w-fit rounded-full border px-4 py-2 text-sm font-bold ${
                  isSelected
                    ? "border-brand-gold bg-brand-gold text-brand-black"
                    : "border-divider text-foreground"
                }`}
              >
                {method.label}
              </button>
            );
          })}
        </div>

        {qrSrc ? (
          <div className="mt-4 flex flex-col items-center rounded-xl border border-divider bg-surface-gray py-6">
            {qrError ? (
              <div className="flex h-40 w-40 flex-col items-center justify-center gap-2 rounded-lg border border-divider bg-white text-center text-xs text-zinc-400">
                <span>QR not set up yet</span>
                <span className="text-[10px]">Upload in Settings</span>
              </div>
            ) : (
              <img
                src={qrSrc}
                alt={`${paymentMethod} QR code`}
                className="h-40 w-40 rounded-lg object-contain"
                onError={() => setQrError(true)}
              />
            )}
            <p className="mt-3 text-sm font-semibold text-foreground">
              {PAYMENT_METHODS.find((m) => m.id === paymentMethod)?.label} &middot; Banot&apos;s Barbershop
            </p>
          </div>
        ) : null}

        <div className="mt-6 flex flex-col gap-1.5">
          <span className="text-sm font-semibold text-zinc-500">Upload proof of payment</span>
          <button
            onClick={() => inputRef.current?.click()}
            disabled={isUploading}
            className={`flex h-12 w-full items-center justify-center rounded-xl border text-sm font-semibold transition-colors disabled:opacity-40 ${
              proofImageUrl
                ? "border-brand-gold bg-brand-gold/10 text-brand-gold-pressed"
                : "border-divider text-foreground"
            }`}
          >
            {isUploading
              ? "Uploading…"
              : proofImageUrl
              ? "✓ Proof uploaded — tap to replace"
              : "Choose screenshot"}
          </button>
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
          />
          {proofImageUrl && !isUploading ? (
            <img
              src={proofImageUrl}
              alt="Payment proof preview"
              className="mt-1 h-28 w-full rounded-xl border border-divider object-contain"
            />
          ) : null}
        </div>

        {error ? (
          <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error} Go back to{" "}
            <button onClick={onPickDifferentTime} className="font-semibold underline">
              pick a different time
            </button>
            .
          </div>
        ) : null}
      </div>

      <div className="px-6 pb-8">
        <button
          onClick={onNext}
          disabled={!paymentMethod || !proofImageUrl || isUploading || isSubmitting}
          className="flex h-13 w-full items-center justify-center rounded-full bg-brand-gold px-5 text-base font-bold text-brand-black transition-colors hover:bg-brand-gold-pressed disabled:opacity-40"
        >
          {isSubmitting ? "Submitting…" : "Submit booking request"}
        </button>
      </div>
    </div>
  );
}
