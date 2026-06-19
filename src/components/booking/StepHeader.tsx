type StepHeaderProps = {
  title: string;
  step: number;
  totalSteps: number;
  onBack?: () => void;
};

export function StepHeader({ title, step, totalSteps, onBack }: StepHeaderProps) {
  return (
    <div className="px-6 pt-6">
      <div className="flex items-center gap-3">
        {onBack ? (
          <button
            onClick={onBack}
            aria-label="Back"
            className="flex h-8 w-8 items-center justify-center rounded-full border border-divider text-foreground"
          >
            ←
          </button>
        ) : null}
        <h1 className="text-xl font-bold text-foreground">{title}</h1>
      </div>
      <div className="mt-4 flex gap-1.5">
        {Array.from({ length: totalSteps }).map((_, i) => (
          <div
            key={i}
            className={`h-1.5 flex-1 rounded-full ${
              i < step ? "bg-brand-gold" : "bg-divider"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
