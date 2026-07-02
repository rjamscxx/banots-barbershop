import { getShopSettings, getAllServices, getAllPaymentMethods } from "@/lib/settings-data";
import { ProfileForm } from "@/components/dashboard/settings/ProfileForm";
import { ServicesEditor } from "@/components/dashboard/settings/ServicesEditor";
import { HoursEditor } from "@/components/dashboard/settings/HoursEditor";
import { PaymentMethodsEditor } from "@/components/dashboard/settings/PaymentMethodsEditor";
import { logoutAction } from "@/app/login/actions";

export default async function SettingsPage() {
  const [settings, services, paymentMethods] = await Promise.all([
    getShopSettings(),
    getAllServices(),
    getAllPaymentMethods(),
  ]);

  return (
    <div className="flex flex-1 flex-col">

      <div className="bg-brand-black px-6 pb-5 pt-6">
        <h1 className="font-[family-name:var(--font-bebas)] text-5xl text-white leading-none">Settings</h1>
      </div>

      <div className="flex flex-col gap-6 px-6 py-6">

        {/* Shop profile */}
        <section>
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-zinc-400">Shop profile</p>
          <div className="mt-2">
            <ProfileForm
              profile={{
                shopName: settings.shopName,
                address: settings.address,
                phone: settings.phone,
              }}
            />
          </div>
        </section>

        {/* Services */}
        <section>
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-zinc-400">Services</p>
          <div className="mt-2">
            <ServicesEditor services={services} />
          </div>
        </section>

        {/* Working hours */}
        <section>
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-zinc-400">Working hours</p>
          <div className="mt-2">
            <HoursEditor hours={settings.hours} />
          </div>
        </section>

        {/* Payment methods */}
        <section>
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-zinc-400">Payment methods</p>
          <p className="mt-1 text-xs text-zinc-500">
            Upload a screenshot of each QR. Customers scan these to pay.
          </p>
          <div className="mt-3">
            <PaymentMethodsEditor methods={paymentMethods} />
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
