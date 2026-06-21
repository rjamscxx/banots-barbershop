import Link from "next/link";
import { getNextOpenSlotToday, getWeeklyBookingCount } from "@/lib/dashboard-data";

export const dynamic = "force-dynamic";
import { SHOP_SETTINGS, formatPeso } from "@/lib/dashboard-shared";
import { Reveal } from "@/components/landing/Reveal";
import { HeroVideo } from "@/components/landing/HeroVideo";

export default async function Home() {
  const [nextSlot, weeklyCount] = await Promise.all([
    getNextOpenSlotToday(),
    getWeeklyBookingCount(),
  ]);

  const hours = SHOP_SETTINGS.workingHours[0];

  return (
    <main className="flex flex-1 flex-col bg-white">

      {/* ── Nav ─────────────────────────────────────────── */}
      <header className="sticky top-0 z-10 flex items-center justify-between border-b border-zinc-100 bg-white/90 px-6 py-4 backdrop-blur-sm">
        <span className="font-[family-name:var(--font-display)] text-lg font-semibold tracking-tight text-foreground">
          Banot&apos;s
        </span>
        <Link
          href="/book"
          className="btn-gold h-9 px-5 text-xs"
        >
          Book Now
        </Link>
      </header>

      {/* ── Hero ────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-brand-black px-6 pb-28 pt-24 text-white sm:pb-40 sm:pt-36">
        {/* Video background */}
        <HeroVideo />

        {/* Dark overlay — lets video breathe while keeping text legible */}
        <div className="absolute inset-0 bg-black/65" />

        {/* Subtle bottom fade to white (for smooth section transition) */}
        <div className="absolute bottom-0 inset-x-0 h-24 bg-gradient-to-t from-white/10 to-transparent" />

        <div className="relative z-10 mx-auto max-w-3xl">

          {/* Thin gold rule */}
          <div className="hero-anim hero-anim-1 mb-6 h-px w-12 bg-brand-gold" />

          <p className="hero-anim hero-anim-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-zinc-400">
            Independent Barber &middot; Quezon City
          </p>

          <h1 className="hero-anim hero-anim-2 mt-6 font-[family-name:var(--font-display)] text-5xl font-semibold leading-[1.0] tracking-tight sm:text-6xl lg:text-7xl">
            Skip the line.
            <br />
            <span className="text-zinc-300">Walk in on time.</span>
          </h1>

          <p className="hero-anim hero-anim-3 mt-7 max-w-sm text-[15px] leading-relaxed text-zinc-300">
            Book a slot, pay ahead, and show up when your chair is waiting.
            No guessing. No queuing.
          </p>

          <div className="hero-anim hero-anim-4 mt-10 flex flex-wrap items-center gap-5">
            <Link href="/book" className="btn-gold h-12 px-8 text-sm">
              Book a slot
            </Link>
            {nextSlot && (
              <span className="text-xs text-zinc-400">
                Next open today &mdash; {nextSlot}
              </span>
            )}
            {!nextSlot && (
              <span className="text-xs text-zinc-400">
                Fully booked today &mdash; book for tomorrow
              </span>
            )}
          </div>

        </div>
      </section>

      {/* ── Services ────────────────────────────────────── */}
      <section className="px-6 py-20">
        <div className="mx-auto max-w-3xl">

          <Reveal>
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-zinc-400">
              Services &amp; Pricing
            </p>
          </Reveal>

          <div className="mt-8">
            {SHOP_SETTINGS.services.map((service, i) => (
              <Reveal key={service.name} delay={i * 0.06}>
                <div className="flex items-center justify-between border-t border-zinc-100 py-5 last:border-b last:border-zinc-100">
                  <div className="flex items-start gap-5">
                    <span className="mt-0.5 w-5 shrink-0 text-xs tabular text-zinc-300">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <div>
                      <p className="font-semibold text-foreground">{service.name}</p>
                      <p className="mt-0.5 text-xs text-zinc-400">{service.durationMinutes} min</p>
                    </div>
                  </div>
                  <p className="tabular text-base font-bold text-foreground">
                    {formatPeso(service.price)}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal delay={0.25}>
            <div className="mt-10">
              <Link href="/book" className="btn-gold h-12 px-8 text-sm">
                Book a slot
              </Link>
            </div>
          </Reveal>

        </div>
      </section>

      {/* ── Brand statement ─────────────────────────────── */}
      <section className="bg-surface-gray px-6 py-20">
        <div className="mx-auto max-w-3xl">

          <Reveal>
            <h2 className="font-[family-name:var(--font-display)] text-3xl font-semibold leading-[1.15] text-foreground sm:text-4xl">
              A guaranteed chair when you arrive.
              <span className="text-zinc-400"> No surprise waits. Just your cut, on time.</span>
            </h2>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="mt-12 grid grid-cols-3 gap-6 border-t border-zinc-200 pt-10">
              <div>
                <p className="tabular text-2xl font-bold text-foreground">30</p>
                <p className="mt-1 text-xs text-zinc-500">min average service</p>
              </div>
              <div>
                <p className="tabular text-2xl font-bold text-foreground">₱150</p>
                <p className="mt-1 text-xs text-zinc-500">starting price</p>
              </div>
              <div>
                <p className="tabular text-2xl font-bold text-foreground">
                  {weeklyCount > 0 ? weeklyCount : "—"}
                </p>
                <p className="mt-1 text-xs text-zinc-500">clients this week</p>
              </div>
            </div>
          </Reveal>

        </div>
      </section>

      {/* ── Closing CTA ─────────────────────────────────── */}
      <section className="bg-brand-black px-6 pb-24 pt-20 text-white sm:pb-32 sm:pt-28">
        <Reveal className="mx-auto max-w-3xl">
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-zinc-500">
            Ready?
          </p>
          <h2 className="mt-5 font-[family-name:var(--font-display)] text-4xl font-semibold leading-[1.05] sm:text-5xl">
            One tap to your
            <br />next cut.
          </h2>
          <div className="mt-10">
            <Link href="/book" className="btn-gold h-12 px-8 text-sm">
              Book a slot
            </Link>
          </div>
          <p className="mt-8 text-xs text-zinc-600">
            {hours.day} &middot; {hours.openTime}–{hours.closeTime} &middot; {SHOP_SETTINGS.address}
          </p>
        </Reveal>
      </section>

      {/* ── Footer ──────────────────────────────────────── */}
      <footer className="border-t border-zinc-100 px-6 py-8">
        <div className="mx-auto flex max-w-3xl flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
          <span className="font-[family-name:var(--font-display)] text-sm font-semibold text-foreground">
            Banot&apos;s Barbershop
          </span>
          <p className="text-xs text-zinc-400">
            {SHOP_SETTINGS.address} &middot; {hours.openTime}–{hours.closeTime}
          </p>
        </div>
      </footer>

    </main>
  );
}
