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
  return (
    <div className="flex flex-1 flex-col">
      <StepHeader title="Your details" step={3} totalSteps={5} onBack={onBack} />

      <div className="flex flex-1 flex-col gap-4 px-6 py-6">
        <label className="flex flex-col gap-1.5">
          <span className="text-sm font-semibold text-zinc-500">Full name</span>
          <input
            value={name}
            onChange={(e) => onChangeName(e.target.value)}
            placeholder="Juan Dela Cruz"
            className="h-12 rounded-xl border border-divider px-4 text-base text-foreground outline-none focus:border-brand-gold"
          />
        </label>

        <label className="flex flex-col gap-1.5">
          <span className="text-sm font-semibold text-zinc-500">Mobile number</span>
          <input
            value={phone}
            onChange={(e) => onChangePhone(e.target.value)}
            placeholder="09XX XXX XXXX"
            type="tel"
            className="h-12 rounded-xl border border-divider px-4 text-base text-foreground outline-none focus:border-brand-gold"
          />
        </label>
      </div>

      <div className="px-6 pb-8">
        <button
          onClick={onNext}
          disabled={!name.trim() || !phone.trim()}
          className="flex h-13 w-full items-center justify-center rounded-full bg-brand-gold px-5 text-base font-bold text-brand-black transition-colors hover:bg-brand-gold-pressed disabled:opacity-40"
        >
          Continue
        </button>
      </div>
    </div>
  );
}
