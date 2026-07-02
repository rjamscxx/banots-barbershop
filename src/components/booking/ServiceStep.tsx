import { SERVICES, formatPeso, type Service } from "@/lib/booking-data";
import { StepHeader } from "./StepHeader";

type ServiceStepProps = {
  selected: Service | null;
  onSelect: (service: Service) => void;
  onNext: () => void;
};

export function ServiceStep({ selected, onSelect, onNext }: ServiceStepProps) {
  return (
    <div className="flex flex-1 flex-col bg-brand-black">
      <StepHeader title="Pick a service" step={1} totalSteps={5} />

      <div className="flex flex-1 flex-col px-6 py-4">
        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-zinc-600">
          {SERVICES.length} services available
        </p>

        <div className="mt-4">
          {SERVICES.map((service, i) => {
            const isSelected = selected?.id === service.id;
            return (
              <button
                key={service.id}
                onClick={() => onSelect(service)}
                className={`group flex w-full items-center justify-between border-t py-5 text-left transition-all ${
                  isSelected
                    ? "border-brand-gold/40 bg-brand-gold/5 -mx-3 px-3 rounded-lg"
                    : "border-zinc-800"
                } ${i === SERVICES.length - 1 && !isSelected ? "border-b border-zinc-800" : ""}`}
              >
                <div className="flex items-start gap-4">
                  <span className={`mt-0.5 font-[family-name:var(--font-bebas)] text-xl tabular transition-colors ${
                    isSelected ? "text-brand-gold" : "text-zinc-700 group-hover:text-zinc-500"
                  }`}>
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <p className={`font-semibold transition-colors ${
                      isSelected ? "text-white" : "text-zinc-300 group-hover:text-white"
                    }`}>
                      {service.name}
                    </p>
                    <p className="mt-0.5 text-xs text-zinc-600">✂ {service.durationMinutes} min</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <p className={`font-[family-name:var(--font-bebas)] text-2xl tabular transition-colors ${
                    isSelected ? "text-brand-gold" : "text-zinc-400 group-hover:text-zinc-200"
                  }`}>
                    {formatPeso(service.price)}
                  </p>
                  <div className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border transition-all ${
                    isSelected
                      ? "border-brand-gold bg-brand-gold text-brand-black text-xs font-bold"
                      : "border-zinc-700 text-transparent"
                  }`}>
                    ✓
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <div className="px-6 pb-8">
        <button
          onClick={onNext}
          disabled={!selected}
          className="btn-gold h-12 w-full text-sm disabled:opacity-30 disabled:shadow-none disabled:translate-y-0"
        >
          Continue
        </button>
      </div>
    </div>
  );
}
