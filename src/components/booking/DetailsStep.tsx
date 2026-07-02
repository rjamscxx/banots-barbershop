import { StepHeader } from "./StepHeader";

type DetailsStepProps = {
  name: string;
  phone: string;
  onChangeName: (value: string) => void;
  onChangePhone: (value: string) => void;
  onBack: () => void;
  onNext: () => void;
};

export function DetailsStep({
  name,
  phone,
  onChangeName,
  onChangePhone,
  onBack,
  onNext,
}: DetailsStepProps) {
  const canContinue = name.trim().length > 1 && phone.trim().length > 6;

  return (
    <div className="flex flex-1 flex-col bg-brand-black">
      <StepHeader title="Your details" step={3} totalSteps={5} onBack={onBack} />

      <div className="flex flex-1 flex-col gap-5 px-6 py-6">
        <p className="text-sm text-zinc-500">
          We&apos;ll use this to identify your booking. No spam — ever.
        </p>

        <label className="flex flex-col gap-1.5">
          <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-zinc-600">
            Full name
          </span>
          <input
            value={name}
            onChange={(e) => onChangeName(e.target.value)}
            placeholder="Juan Dela Cruz"
            autoComplete="name"
            className="h-12 rounded-xl border border-zinc-800 bg-surface-dark px-4 text-base text-white outline-none transition-colors placeholder:text-zinc-700 focus:border-brand-gold focus:ring-2 focus:ring-brand-gold/10"
          />
        </label>

        <label className="flex flex-col gap-1.5">
          <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-zinc-600">
            Mobile number
          </span>
          <input
            value={phone}
            onChange={(e) => onChangePhone(e.target.value)}
            placeholder="09XX XXX XXXX"
            type="tel"
            inputMode="numeric"
            autoComplete="tel"
            className="h-12 rounded-xl border border-zinc-800 bg-surface-dark px-4 text-base text-white outline-none transition-colors placeholder:text-zinc-700 focus:border-brand-gold focus:ring-2 focus:ring-brand-gold/10"
          />
        </label>

        <p className="text-xs text-zinc-700">
          Your number is used to look up your booking at the shop.
        </p>
      </div>

      <div className="px-6 pb-8">
        <button
          onClick={onNext}
          disabled={!canContinue}
          className="btn-gold h-12 w-full text-sm disabled:opacity-30 disabled:shadow-none disabled:translate-y-0"
        >
          Continue
        </button>
      </div>
    </div>
  );
}
