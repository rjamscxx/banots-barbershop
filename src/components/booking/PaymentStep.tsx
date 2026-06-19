import { PAYMENT_METHODS, type Service, formatPeso } from "@/lib/booking-data";
import { StepHeader } from "./StepHeader";

type PaymentStepProps = {
  service: Service | null;
  paymentMethod: string | null;
  proofFileName: string | null;
  onSelectMethod: (id: string) => void;
  onUploadProof: (fileName: string) => void;
  onBack: () => void;
  onNext: () => void;
};

export function PaymentStep({
  service,
  paymentMethod,
  proofFileName,
  onSelectMethod,
  onUploadProof,
  onBack,
  onNext,
}: PaymentStepProps) {
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
                onClick={() => onSelectMethod(method.id)}
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

        {paymentMethod ? (
          <div className="mt-4 flex flex-col items-center rounded-xl border border-divider bg-surface-gray py-8">
            <div className="flex h-40 w-40 items-center justify-center rounded-lg border border-divider bg-white text-xs text-zinc-400">
              [ QR placeholder ]
            </div>
            <p className="mt-3 text-sm font-semibold text-foreground">
              {PAYMENT_METHODS.find((m) => m.id === paymentMethod)?.label} &middot; Banot&apos;s Barbershop
            </p>
          </div>
        ) : null}

        <label className="mt-6 flex flex-col gap-1.5">
          <span className="text-sm font-semibold text-zinc-500">Upload proof of payment</span>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => onUploadProof(e.target.files?.[0]?.name ?? "")}
            className="rounded-xl border border-divider px-4 py-3 text-sm text-foreground"
          />
          {proofFileName ? (
            <span className="text-xs text-zinc-500">Selected: {proofFileName}</span>
          ) : null}
        </label>
      </div>

      <div className="px-6 pb-8">
        <button
          onClick={onNext}
          disabled={!paymentMethod || !proofFileName}
          className="flex h-13 w-full items-center justify-center rounded-full bg-brand-gold px-5 text-base font-bold text-brand-black transition-colors hover:bg-brand-gold-pressed disabled:opacity-40"
        >
          Submit booking request
        </button>
      </div>
    </div>
  );
}
