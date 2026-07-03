"use client";

import { useRef, useState } from "react";
import { formatPeso } from "@/lib/booking-data";
import type { ServiceRecord, PaymentMethodRecord } from "@/lib/settings-data";
import { StepHeader } from "./StepHeader";

type PaymentStepProps = {
  service: ServiceRecord | null;
  paymentMethods: PaymentMethodRecord[];
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
  paymentMethods,
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

  const selectedMethod = paymentMethods.find((m) => m.id === paymentMethod) ?? null;

  return (
    <div className="flex flex-1 flex-col bg-brand-black">
      <StepHeader title="Pay to confirm" step={4} totalSteps={5} onBack={onBack} />

      <div className="flex flex-1 flex-col px-6 py-6">
        <p className="text-sm text-zinc-500">
          Scan a QR below to pay{" "}
          <span className="font-[family-name:var(--font-bebas)] text-xl text-brand-gold">
            {service ? formatPeso(service.price) : ""}
          </span>
          , then upload your proof of payment.
        </p>

        {/* Payment method selector */}
        <div className="mt-5 flex gap-2 overflow-x-auto pb-2">
          {paymentMethods.map((method) => {
            const isSelected = paymentMethod === method.id;
            return (
              <button
                key={method.id}
                onClick={() => onSelectMethod(method.id)}
                className={`min-w-fit rounded-full border px-4 py-2 text-sm font-bold transition-all ${
                  isSelected
                    ? "border-brand-gold bg-brand-gold text-brand-black"
                    : "border-zinc-800 text-zinc-400 hover:border-zinc-600 hover:text-zinc-200"
                }`}
              >
                {method.label}
              </button>
            );
          })}
        </div>

        {/* QR display */}
        {selectedMethod ? (
          <div className="mt-5 flex flex-col items-center rounded-2xl border border-zinc-800 bg-surface-dark py-6">
            {selectedMethod.qrImageUrl ? (
              <img
                src={selectedMethod.qrImageUrl}
                alt={`${selectedMethod.label} QR code`}
                className="h-40 w-40 rounded-xl object-contain"
              />
            ) : (
              <div className="flex h-40 w-40 flex-col items-center justify-center gap-2 rounded-xl border border-zinc-800 bg-brand-black text-center text-xs text-zinc-600">
                <span>QR not set up yet</span>
                <span className="text-[10px] text-zinc-700">Upload in Settings</span>
              </div>
            )}
            <p className="mt-3 text-sm font-semibold text-zinc-300">
              {selectedMethod.label} &middot; Banot&apos;s Barbershop
            </p>
            {(selectedMethod.accountName || selectedMethod.accountNumber) && (
              <p className="mt-1 text-xs text-zinc-500">
                {selectedMethod.accountName}
                {selectedMethod.accountName && selectedMethod.accountNumber ? " · " : ""}
                {selectedMethod.accountNumber}
              </p>
            )}
          </div>
        ) : null}

        {/* Proof upload */}
        <div className="mt-6 flex flex-col gap-2">
          <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-zinc-600">
            Upload proof of payment
          </span>
          <button
            onClick={() => inputRef.current?.click()}
            disabled={isUploading}
            className={`flex h-12 w-full items-center justify-center rounded-xl border text-sm font-semibold transition-all disabled:opacity-40 ${
              proofImageUrl
                ? "border-brand-gold bg-brand-gold/10 text-brand-gold"
                : "border-zinc-800 text-zinc-400 hover:border-zinc-600 hover:text-zinc-200"
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
              className="mt-1 h-28 w-full rounded-xl border border-zinc-800 object-contain"
            />
          ) : null}
        </div>

        {/* Slot conflict error */}
        {error ? (
          <div className="mt-4 rounded-xl border border-brand-red/30 bg-brand-red/10 px-4 py-3 text-sm text-brand-red">
            {error} Go back to{" "}
            <button onClick={onPickDifferentTime} className="font-bold underline underline-offset-2">
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
          className="btn-gold h-12 w-full text-sm disabled:opacity-30 disabled:shadow-none disabled:translate-y-0"
        >
          {isSubmitting ? "Submitting…" : "Submit booking request"}
        </button>
      </div>
    </div>
  );
}
