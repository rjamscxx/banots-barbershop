import { readdir } from "fs/promises";
import path from "path";
import { SHOP_SETTINGS, formatPeso } from "@/lib/dashboard-data";
import { PAYMENT_METHODS } from "@/lib/booking-data";
import { QrUploader } from "@/components/dashboard/QrUploader";

async function getQrUrls(): Promise<Record<string, string>> {
  try {
    const dir = path.join(process.cwd(), "public", "qr");
    const files = await readdir(dir);
    const map: Record<string, string> = {};
    for (const file of files) {
      const name = file.replace(/\.[^.]+$/, "");
      map[name] = `/qr/${file}`;
    }
    return map;
  } catch {
    return {};
  }
}

export default async function SettingsPage() {
  const qrUrls = await getQrUrls();

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
      <p className="mt-0.5 text-xs text-zinc-400">
        Upload a screenshot of each QR code. Customers will scan these to pay.
      </p>
      <div className="mt-3 grid grid-cols-3 gap-2 sm:grid-cols-5">
        {PAYMENT_METHODS.map((method) => (
          <QrUploader
            key={method.id}
            methodId={method.id}
            label={method.label}
            initialUrl={qrUrls[method.id]}
          />
        ))}
      </div>
    </div>
  );
}
