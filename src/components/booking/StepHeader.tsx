type StepHeaderProps = {
  title: string;
  step: number;
  totalSteps: number;
  onBack?: () => void;
};

export function StepHeader({ title, step, totalSteps, onBack }: StepHeaderProps) {
  return (
    <div className="px-6 pt-6 pb-2">
      {/* Progress bar */}
      <div className="flex gap-1">
        {Array.from({ length: totalSteps }).map((_, i) => (
          <div
            key={i}
            className={`h-[3px] flex-1 rounded-full transition-all duration-300 ${
              i < step ? "bg-brand-gold" : "bg-zinc-100"
            }`}
          />
        ))}
      </div>

      {/* Back + title row */}
      <div className="mt-5 flex items-center gap-3">
        {onBack ? (
          <button
            onClick={onBack}
            aria-label="Back"
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-zinc-200 text-zinc-500 transition-colors hover:border-zinc-300 hover:text-foreground"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M9 2L4 7L9 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        ) : null}
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-zinc-400">
            Step {step} of {totalSteps}
          </p>
          <h1 className="mt-0.5 text-xl font-bold text-foreground">{title}</h1>
        </div>
      </div>
    </div>
  );
}
