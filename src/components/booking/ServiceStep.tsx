import { SERVICES, formatPeso, type Service } from "@/lib/booking-data";
import { StepHeader } from "./StepHeader";

type ServiceStepProps = {
  selected: Service | null;
  onSelect: (service: Service) => void;
  onNext: () => void;
};

export function ServiceStep({ selected, onSelect, onNext }: ServiceStepProps) {
  return (
    <div className="flex flex-1 flex-col">
      <StepHeader title="Select a service" step={1} totalSteps={5} />

      <div className="flex flex-1 flex-col px-6 py-6">
        <p className="text-xs text-zinc-400">{SERVICES.length} services available</p>

        <div className="mt-4">
          {SERVICES.map((service, i) => {
            const isSelected = selected?.id === service.id;
            return (
              <button
                key={service.id}
                onClick={() => onSelect(service)}
                className={`group flex w-full items-center justify-between border-t py-4 text-left transition-colors last:border-b ${
                  isSelected
                    ? "border-brand-gold/30"
                    : "border-zinc-100"
                }`}
              >
                <div className="flex items-start gap-4">
                  <span className={`mt-0.5 w-5 shrink-0 text-xs tabular transition-colors ${
                    isSelected ? "text-brand-gold" : "text-zinc-300 group-hover:text-zinc-400"
                  }`}>
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <p className={`font-semibold transition-colors ${
                      isSelected ? "text-brand-gold-pressed" : "text-foreground"
                    }`}>
                      {service.name}
                    </p>
                    <p className="mt-0.5 text-xs text-zinc-400">{service.durationMinutes} min</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <p className="tabular font-bold text-foreground">{formatPeso(service.price)}</p>
                  <div className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border transition-all ${
                    isSelected
                      ? "border-brand-gold bg-brand-gold text-brand-black text-xs font-bold"
                      : "border-zinc-200 text-transparent"
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
          className="btn-gold h-12 w-full text-sm disabled:opacity-40 disabled:shadow-none disabled:translate-y-0"
        >
          Continue
        </button>
      </div>
    </div>
  );
}
