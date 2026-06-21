import Link from "next/link";
import Image from "next/image";
import { getNextOpenSlotToday, getWeeklyBookingCount } from "@/lib/dashboard-data";

export const dynamic = "force-dynamic";
import { SHOP_SETTINGS, formatPeso } from "@/lib/dashboard-shared";
import { Reveal } from "@/components/landing/Reveal";
import { HeroVideo } from "@/components/landing/HeroVideo";

/* ── Photo strip data ─────────────────────────────────────── */
const GALLERY = [
  {
    id: "897263",
    alt: "Barber at work",
    src: "https://images.pexels.com/photos/897263/pexels-photo-897263.jpeg?auto=compress&cs=tinysrgb&w=600&h=800&fit=crop",
  },
  {
    id: "785537",
    alt: "Classic barbershop interior",
    src: "https://images.pexels.com/photos/785537/pexels-photo-785537.jpeg?auto=compress&cs=tinysrgb&w=600&h=800&fit=crop",
  },
  {
    id: "2014809",
    alt: "Barber cutting hair",
    src: "https://images.pexels.com/photos/2014809/pexels-photo-2014809.jpeg?auto=compress&cs=tinysrgb&w=600&h=800&fit=crop",
  },
  {
    id: "6487888",
    alt: "Fresh haircut",
    src: "https://images.pexels.com/photos/6487888/pexels-photo-6487888.jpeg?auto=compress&cs=tinysrgb&w=600&h=800&fit=crop",
  },
];

/* ── How it works steps ───────────────────────────────────── */
const STEPS = [
  {
    n: "01",
    title: "Pick your service",
    body: "Choose a cut, shave, or combo — and see the price upfront.",
  },
  {
    n: "02",
    title: "Book a slot & pay",
    body: "Select a date and time, then settle your payment via GCash, Maya, or bank transfer.",
  },
  {
    n: "03",
    title: "Show up. Get your cut.",
    body: "Arrive at your booked time. Your chair is waiting — no queue, no wait.",
  },
];

/* ── Marquee items ────────────────────────────────────────── */
const TICKER = [
  "Haircut",
  "Shave",
  "Hot Towel Shave",
  "Haircut + Shave",
  "GCash · Maya · Bank",
  "Mon – Sat · 9 AM – 7 PM",
  "Quezon City",
];

export default async function Home() {
  const [nextSlot, weeklyCount] = await Promise.all([
    getNextOpenSlotToday(),
    getWeeklyBookingCount(),
  ]);

  const hours = SHOP_SETTINGS.workingHours[0];
  const sunday = SHOP_SETTINGS.workingHours[1];

  return (
    <main className="flex flex-1 flex-col bg-white">

      {/* ── Nav ─────────────────────────────────────────── */}
      <header className="sticky top-0 z-10 flex items-center justify-between border-b border-zinc-100 bg-white/90 px-6 py-4 backdrop-blur-sm">
        <span className="font-[family-name:var(--font-display)] text-lg font-semibold tracking-tight text-foreground">
          Banot&apos;s
        </span>
        <Link href="/book" className="btn-gold h-9 px-5 text-xs">
          Book Now
        </Link>
      </header>

      {/* ── Hero ────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-brand-black px-6 pb-28 pt-24 text-white sm:pb-40 sm:pt-36">
        <HeroVideo />
        <div className="absolute inset-0 bg-black/65" />
        <div className="absolute bottom-0 inset-x-0 h-24 bg-gradient-to-t from-white/10 to-transparent" />

        <div className="relative z-10 mx-auto max-w-3xl">
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
            {nextSlot ? (
              <span className="text-xs text-zinc-400">
                Next open today &mdash; {nextSlot}
              </span>
            ) : (
              <span className="text-xs text-zinc-400">
                Fully booked today &mdash; book for tomorrow
              </span>
            )}
          </div>
        </div>
      </section>

      {/* ── Photo strip ─────────────────────────────────── */}
      <section className="overflow-hidden">
        <div className="flex">
          {GALLERY.map((photo, i) => (
            <div
              key={photo.id}
              className={`relative aspect-[3/4] flex-1 min-w-0 overflow-hidden ${i === 3 ? "hidden sm:block" : ""}`}
            >
              <Image
                src={photo.src}
                alt={photo.alt}
                fill
                sizes="(max-width: 640px) 33vw, 25vw"
                className="object-cover"
                unoptimized
              />
            </div>
          ))}
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

      {/* ── How it works ────────────────────────────────── */}
      <section className="px-6 py-20 bg-surface-gray">
        <div className="mx-auto max-w-3xl">
          <Reveal>
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-zinc-400">
              How it works
            </p>
          </Reveal>

          <div className="mt-10 space-y-0">
            {STEPS.map((step, i) => (
              <Reveal key={step.n} delay={i * 0.08}>
                <div className="flex gap-8 border-t border-zinc-200 py-8 last:border-b last:border-zinc-200">
                  <span className="w-8 shrink-0 font-[family-name:var(--font-display)] text-3xl font-semibold leading-none text-zinc-200">
                    {step.n}
                  </span>
                  <div>
                    <p className="font-semibold text-foreground">{step.title}</p>
                    <p className="mt-1.5 text-sm leading-relaxed text-zinc-500">{step.body}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal delay={0.25}>
            <div className="mt-10">
              <Link href="/book" className="btn-gold h-12 px-8 text-sm">
                Book now — it takes 2 minutes
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── Brand statement ─────────────────────────────── */}
      <section className="px-6 py-20">
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

      {/* ── Marquee ticker ──────────────────────────────── */}
      <div className="overflow-hidden border-y border-brand-gold/30 bg-brand-black py-4">
        <div className="marquee-track flex w-max items-center gap-0">
          {/* doubled for seamless loop */}
          {[...TICKER, ...TICKER].map((item, i) => (
            <span key={i} className="flex items-center gap-6 px-6 text-xs font-semibold uppercase tracking-[0.18em] text-zinc-400">
              {item}
              <span className="h-1 w-1 rounded-full bg-brand-gold" />
            </span>
          ))}
        </div>
      </div>

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
      <footer className="border-t border-zinc-100 bg-white px-6 pb-10 pt-10">
        <div className="mx-auto max-w-3xl">
          <div className="grid gap-10 sm:grid-cols-3">

            {/* Brand */}
            <div>
              <span className="font-[family-name:var(--font-display)] text-base font-semibold text-foreground">
                Banot&apos;s Barbershop
              </span>
              <p className="mt-2 text-xs leading-relaxed text-zinc-400">
                {SHOP_SETTINGS.address}
              </p>
            </div>

            {/* Hours */}
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-widest text-zinc-400">
                Hours
              </p>
              <div className="mt-3 space-y-1.5">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-zinc-500">{hours.day}</span>
                  <span className="font-semibold text-foreground">{hours.openTime} – {hours.closeTime}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-zinc-500">{sunday.day}</span>
                  <span className="font-semibold text-zinc-400">{sunday.openTime}</span>
                </div>
              </div>
            </div>

            {/* Book */}
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-widest text-zinc-400">
                Book
              </p>
              <div className="mt-3">
                <Link href="/book" className="btn-gold h-10 px-6 text-xs">
                  Reserve a slot
                </Link>
              </div>
              <p className="mt-3 text-xs text-zinc-400">
                Online booking · Pay ahead · No queue
              </p>
            </div>

          </div>

          <div className="mt-10 border-t border-zinc-100 pt-6 flex items-center justify-between">
            <p className="text-xs text-zinc-400">
              &copy; {new Date().getFullYear()} Banot&apos;s Barbershop
            </p>
            <p className="text-xs text-zinc-300">
              Video: <a href="https://www.pexels.com" target="_blank" rel="noopener noreferrer" className="underline underline-offset-2">Pexels</a>
              &nbsp;&middot;&nbsp;
              Photos: <a href="https://www.pexels.com" target="_blank" rel="noopener noreferrer" className="underline underline-offset-2">Pexels</a>
            </p>
          </div>
        </div>
      </footer>

    </main>
  );
}
