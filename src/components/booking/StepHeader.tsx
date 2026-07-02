type StepHeaderProps = {
  title: string;
  step: number;
  totalSteps: number;
  onBack?: () => void;
};

export function StepHeader({ title, step, totalSteps, onBack }: StepHeaderProps) {
  return (
    <div className="bg-brand-black px-6 pt-6 pb-4">
      {/* Progress bars */}
      <div className="flex gap-1.5">
        {Array.from({ length: totalSteps }).map((_, i) => (
          <div
            key={i}
            className={`h-1 flex-1 rounded-full transition-all duration-300 ${
              i < step ? "bg-brand-gold" : "bg-zinc-800"
            }`}
          />
        ))}
      </div>

      {/* Back + title row */}
      <div className="mt-5 flex items-center gap-4">
        {onBack ? (
          <button
            onClick={onBack}
            aria-label="Back"
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-zinc-700 text-zinc-400 transition-colors hover:border-zinc-500 hover:text-white"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M9 2L4 7L9 12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        ) : null}
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-zinc-600">
            {step}/{totalSteps}
          </p>
          <h1 className="mt-0.5 font-[family-name:var(--font-bebas)] text-3xl text-white leading-none">
            {title}
          </h1>
        </div>
      </div>
    </div>
  );
}
