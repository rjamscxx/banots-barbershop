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

      <div className="flex flex-1 flex-col gap-3 px-6 py-6">
        {SERVICES.map((service) => {
          const isSelected = selected?.id === service.id;
          return (
            <button
              key={service.id}
              onClick={() => onSelect(service)}
              className={`flex items-center justify-between rounded-xl border px-4 py-4 text-left transition-colors ${
                isSelected
                  ? "border-brand-gold bg-brand-gold/8 ring-1 ring-brand-gold"
                  : "border-divider bg-white"
              }`}
            >
              <div>
                <p className="font-semibold text-foreground">{service.name}</p>
                <p className="text-sm text-zinc-500">{service.durationMinutes} min</p>
              </div>
              <div className="flex items-center gap-3">
                <p className="font-bold text-foreground">{formatPeso(service.price)}</p>
                {isSelected && (
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand-gold text-xs font-bold text-brand-black">
                    ✓
                  </span>
                )}
              </div>
            </button>
          );
        })}
      </div>

      <div className="px-6 pb-8">
        <button
          onClick={onNext}
          disabled={!selected}
          className="flex h-13 w-full items-center justify-center rounded-full bg-brand-gold px-5 text-base font-bold text-brand-black transition-colors hover:bg-brand-gold-pressed disabled:opacity-40"
        >
          Continue
        </button>
      </div>
    </div>
  );
}
