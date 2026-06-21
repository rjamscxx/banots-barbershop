import Link from "next/link";
import { getNextOpenSlotToday, getWeeklyBookingCount } from "@/lib/dashboard-data";

export const dynamic = "force-dynamic";
import { SHOP_SETTINGS, formatPeso } from "@/lib/dashboard-shared";
import { Reveal } from "@/components/landing/Reveal";

const STEPS = [
  {
    number: "01",
    title: "Pick your time",
    body: "Choose a service and an open slot, right from your phone.",
  },
  {
    number: "02",
    title: "Pay your way",
    body: "Scan your bank or e-wallet's QR — GCash, Maya, GoTyme, BDO, or BPI.",
  },
  {
    number: "03",
    title: "Walk in, no waiting",
    body: "Show up at your time. Your chair is already yours.",
  },
];

export default async function Home() {
  const [nextSlot, weeklyCount] = await Promise.all([
    getNextOpenSlotToday(),
    getWeeklyBookingCount(),
  ]);

  return (
    <main className="flex flex-1 flex-col bg-white">
      {/* Nav */}
      <header className="sticky top-0 z-10 flex items-center justify-between border-b border-divider bg-white/90 px-6 py-4 backdrop-blur-sm">
        <span className="font-[family-name:var(--font-display)] text-lg font-semibold text-foreground">
          Banot&apos;s
        </span>
        <Link
          href="/book"
          className="rounded-full bg-brand-black px-4 py-2 text-sm font-bold text-white"
        >
          Book Now
        </Link>
      </header>

      {/* Hero — CSS animation so content is visible even before JS hydrates */}
      <section className="hero-texture relative overflow-hidden bg-brand-black px-6 py-20 text-white">
        <div className="mx-auto flex max-w-3xl flex-col items-start">
          <p className="hero-anim hero-anim-1 text-xs font-bold uppercase tracking-[0.2em] text-brand-gold">
            Independent Barber &middot; Quezon City
          </p>

          <h1 className="hero-anim hero-anim-2 mt-4 font-[family-name:var(--font-display)] text-4xl font-semibold leading-[1.1] sm:text-6xl">
            Skip the wait.
            <br />
            Walk in to a guaranteed chair.
          </h1>

          <p className="hero-anim hero-anim-3 mt-5 max-w-lg text-base text-zinc-300 sm:text-lg">
            Book your slot online, pay your way, and walk in exactly when your chair is
            ready. No more guessing if there&apos;s a line.
          </p>

          <span className="hero-anim hero-anim-4 tabular mt-6 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm text-zinc-200">
            <span className="h-2 w-2 rounded-full bg-brand-gold" />
            {nextSlot ? `Next open today — ${nextSlot}` : "Fully booked today — book for tomorrow"}
          </span>

          <Link
            href="/book"
            className="hero-anim hero-anim-5 barber-cta mt-8 flex h-14 w-fit items-center justify-center rounded-full px-8 text-base font-bold text-brand-black"
          >
            Book your slot
          </Link>
        </div>
      </section>

      {/* Services */}
      <section className="px-6 py-16">
        <div className="mx-auto max-w-3xl">
          <Reveal>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-brand-gold">
              Services &amp; Pricing
            </p>
            <h2 className="mt-2 font-[family-name:var(--font-display)] text-3xl font-semibold text-foreground">
              Choose your service
            </h2>
          </Reveal>

          <div className="mt-8 divide-y divide-divider border-t border-divider">
            {SHOP_SETTINGS.services.map((service, i) => (
              <Reveal key={service.name} delay={i * 0.05}>
                <div className="flex items-center justify-between py-4">
                  <div>
                    <p className="font-semibold text-foreground">{service.name}</p>
                    <p className="text-sm text-zinc-500">{service.durationMinutes} min</p>
                  </div>
                  <p className="tabular text-lg font-bold text-foreground">
                    {formatPeso(service.price)}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="bg-surface-paper px-6 py-16">
        <div className="mx-auto max-w-3xl">
          <Reveal>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-brand-gold">
              How it works
            </p>
          </Reveal>

          <div className="mt-8 grid gap-8 sm:grid-cols-3">
            {STEPS.map((step, i) => (
              <Reveal key={step.number} delay={i * 0.1}>
                <p className="font-[family-name:var(--font-display)] text-3xl font-semibold text-brand-gold">
                  {step.number}
                </p>
                <h3 className="mt-2 font-semibold text-foreground">{step.title}</h3>
                <p className="mt-1 text-sm text-zinc-600">{step.body}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Trust strip */}
      <section className="px-6 py-12">
        <Reveal className="mx-auto flex max-w-3xl flex-col items-start gap-2 rounded-2xl border border-divider bg-surface-gray px-6 py-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm font-semibold text-foreground">
            {weeklyCount > 0 ? `${weeklyCount} client${weeklyCount === 1 ? "" : "s"} booked this week` : "Open for bookings this week"}
          </p>
          <p className="text-sm text-zinc-500">
            {SHOP_SETTINGS.workingHours[0].day} &middot; {SHOP_SETTINGS.workingHours[0].openTime}
            &ndash;{SHOP_SETTINGS.workingHours[0].closeTime} &middot; {SHOP_SETTINGS.address}
          </p>
        </Reveal>
      </section>

      {/* Closing CTA */}
      <section className="bg-brand-black px-6 py-20 text-center text-white">
        <Reveal className="mx-auto flex max-w-2xl flex-col items-center">
          <h2 className="font-[family-name:var(--font-display)] text-3xl font-semibold sm:text-4xl">
            Your next cut is one tap away.
          </h2>
          <Link
            href="/book"
            className="barber-cta mt-8 flex h-14 w-fit items-center justify-center rounded-full px-8 text-base font-bold text-brand-black"
          >
            Book your slot
          </Link>
        </Reveal>
      </section>

      {/* Footer */}
      <footer className="px-6 py-8 text-center text-xs text-zinc-400">
        {SHOP_SETTINGS.shopName} &middot; {SHOP_SETTINGS.address}
      </footer>
    </main>
  );
}
