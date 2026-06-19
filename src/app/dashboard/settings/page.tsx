import { SHOP_SETTINGS, formatPeso } from "@/lib/dashboard-data";

export default function SettingsPage() {
  return (
    <div className="flex flex-1 flex-col px-6 py-6">
      <h1 className="text-xl font-bold text-foreground">Settings</h1>

      <p className="mt-5 text-sm font-semibold text-zinc-500">Shop profile</p>
      <div className="mt-2 rounded-xl border border-divider px-4 py-3">
        <p className="font-semibold text-foreground">{SHOP_SETTINGS.shopName}</p>
        <p className="text-sm text-zinc-500">{SHOP_SETTINGS.address}</p>
      </div>

      <p className="mt-6 text-sm font-semibold text-zinc-500">Services</p>
      <div className="mt-2 flex flex-col gap-2">
        {SHOP_SETTINGS.services.map((service) => (
          <div
            key={service.name}
            className="flex items-center justify-between rounded-xl border border-divider px-4 py-3"
          >
            <div>
              <p className="font-semibold text-foreground">{service.name}</p>
              <p className="text-sm text-zinc-500">{service.durationMinutes} min</p>
            </div>
            <p className="font-bold text-foreground">{formatPeso(service.price)}</p>
          </div>
        ))}
      </div>

      <p className="mt-6 text-sm font-semibold text-zinc-500">Working hours</p>
      <div className="mt-2 flex flex-col gap-2">
        {SHOP_SETTINGS.workingHours.map((wh) => (
          <div
            key={wh.day}
            className="flex items-center justify-between rounded-xl border border-divider px-4 py-3"
          >
            <p className="font-semibold text-foreground">{wh.day}</p>
            <p className="text-sm text-zinc-500">
              {wh.openTime === "Closed" ? "Closed" : `${wh.openTime} – ${wh.closeTime}`}
            </p>
          </div>
        ))}
      </div>

      <p className="mt-6 text-sm font-semibold text-zinc-500">Payment QR codes</p>
      <div className="mt-2 grid grid-cols-3 gap-2">
        {SHOP_SETTINGS.paymentMethods.map((method) => (
          <div
            key={method}
            className="flex flex-col items-center gap-1 rounded-xl border border-divider px-2 py-3"
          >
            <div className="flex h-16 w-16 items-center justify-center rounded-lg border border-divider bg-surface-gray text-[10px] text-zinc-400">
              QR
            </div>
            <p className="text-xs font-semibold uppercase text-zinc-500">{method}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
