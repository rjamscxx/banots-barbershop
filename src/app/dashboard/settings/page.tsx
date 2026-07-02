import { readdir } from "fs/promises";
import path from "path";
import { SHOP_SETTINGS, formatPeso } from "@/lib/dashboard-data";
import { PAYMENT_METHODS } from "@/lib/booking-data";
import { QrUploader } from "@/components/dashboard/QrUploader";
import { logoutAction } from "@/app/login/actions";

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
    <div className="flex flex-1 flex-col">

      <div className="bg-brand-black px-6 pb-5 pt-6">
        <h1 className="font-[family-name:var(--font-bebas)] text-5xl text-white leading-none">Settings</h1>
      </div>

      <div className="flex flex-col gap-6 px-6 py-6">

        {/* Shop profile */}
        <section>
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-zinc-400">Shop profile</p>
          <div className="mt-2 rounded-xl border border-divider px-4 py-3">
            <p className="font-bold text-foreground">{SHOP_SETTINGS.shopName}</p>
            <p className="text-sm text-zinc-500">{SHOP_SETTINGS.address}</p>
          </div>
        </section>

        {/* Services */}
        <section>
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-zinc-400">Services</p>
          <div className="mt-2 flex flex-col gap-2">
            {SHOP_SETTINGS.services.map((service) => (
              <div
                key={service.name}
                className="flex items-center justify-between rounded-xl border border-divider px-4 py-3"
              >
                <div>
                  <p className="font-semibold text-foreground">{service.name}</p>
                  <p className="text-xs text-zinc-500">✂ {service.durationMinutes} min</p>
                </div>
                <p className="font-[family-name:var(--font-bebas)] text-xl text-foreground tabular">
                  {formatPeso(service.price)}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Working hours */}
        <section>
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-zinc-400">Working hours</p>
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
        </section>

        {/* Payment QR codes */}
        <section>
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-zinc-400">Payment QR codes</p>
          <p className="mt-1 text-xs text-zinc-500">
            Upload a screenshot of each QR. Customers scan these to pay.
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
        </section>

        {/* Logout */}
        <form action={logoutAction} className="mt-2">
          <button
            type="submit"
            className="flex h-11 w-full items-center justify-center rounded-full border border-divider text-sm font-semibold text-zinc-500 transition-colors hover:border-zinc-400 hover:text-foreground"
          >
            Log out
          </button>
        </form>

      </div>
    </div>
  );
}
