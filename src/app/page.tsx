import Link from "next/link";
import Image from "next/image";
import { getNextOpenSlotToday, getWeeklyBookingCount } from "@/lib/dashboard-data";

export const dynamic = "force-dynamic";
import { SHOP_SETTINGS, formatPeso } from "@/lib/dashboard-shared";
import { Reveal } from "@/components/landing/Reveal";
import { HeroVideo } from "@/components/landing/HeroVideo";
import { NavBar } from "@/components/landing/NavBar";
import { CountUp } from "@/components/landing/CountUp";

/* ── Photo strip ──────────────────────────────────────────── */
const GALLERY = [
  {
    id: "897263",
    alt: "Barber at work",
    src: "https://images.pexels.com/photos/897263/pexels-photo-897263.jpeg?auto=compress&cs=tinysrgb&w=600&h=900&fit=crop",
  },
  {
    id: "785537",
    alt: "Classic barbershop",
    src: "https://images.pexels.com/photos/785537/pexels-photo-785537.jpeg?auto=compress&cs=tinysrgb&w=600&h=900&fit=crop",
  },
  {
    id: "2014809",
    alt: "Barber cutting hair",
    src: "https://images.pexels.com/photos/2014809/pexels-photo-2014809.jpeg?auto=compress&cs=tinysrgb&w=600&h=900&fit=crop",
  },
  {
    id: "6487888",
    alt: "Fresh haircut",
    src: "https://images.pexels.com/photos/6487888/pexels-photo-6487888.jpeg?auto=compress&cs=tinysrgb&w=600&h=900&fit=crop",
  },
];

/* ── How it works ─────────────────────────────────────────── */
const STEPS = [
  {
    n: "01",
    title: "Pick your service",
    body: "Choose a cut, shave, or combo. Prices shown upfront, no surprises.",
  },
  {
    n: "02",
    title: "Book a slot & pay",
    body: "Pick a date and time, then settle via GCash, Maya, or bank transfer.",
  },
  {
    n: "03",
    title: "Show up. Get your cut.",
    body: "Arrive at your time. Your chair is ready — no queue, no waiting.",
  },
];

/* ── Testimonials ─────────────────────────────────────────── */
const REVIEWS = [
  {
    quote: "Hindi na ako nag-aabang. Book-ahead talaga ang solusyon — sumasakto lagi.",
    name: "Mark T.",
    label: "Regular client",
  },
  {
    quote: "₱150 lang pero premium ang feel. Maayos ang barber, laging on-time.",
    name: "Bryan C.",
    label: "Quezon City",
  },
  {
    quote: "Nakakatuwa yung system — bayad na agad, tapos pumunta ka lang. Solid.",
    name: "Jomar R.",
    label: "Caloocan",
  },
];

/* ── Marquee ticker ───────────────────────────────────────── */
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

      {/* ── Nav (scroll-aware, transparent over hero) ────── */}
      <NavBar />

      {/* ── Hero ────────────────────────────────────────── */}
      <section className="relative -mt-[57px] overflow-hidden bg-brand-black px-6 pb-32 pt-36 text-white sm:pb-44 sm:pt-48">
        <HeroVideo />
        <div className="absolute inset-0 bg-black/60" />
        {/* Bottom gradient blends into white photo strip */}
        <div className="absolute bottom-0 inset-x-0 h-32 bg-gradient-to-t from-black/60 to-transparent" />

        <div className="relative z-10 mx-auto max-w-3xl">
          <div className="hero-anim hero-anim-1 mb-6 h-px w-12 bg-brand-gold" />
          <p className="hero-anim hero-anim-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-zinc-400">
            Independent Barber &middot; Quezon City
          </p>
          <h1 className="hero-anim hero-anim-2 mt-5 font-[family-name:var(--font-display)] text-6xl font-semibold leading-[0.95] tracking-tight sm:text-7xl lg:text-8xl">
            Skip the line.
            <br />
            <span className="text-zinc-300">Walk in on time.</span>
          </h1>
          <p className="hero-anim hero-anim-3 mt-8 max-w-sm text-[15px] leading-relaxed text-zinc-300">
            Book a slot, pay ahead, and show up when your chair is waiting.
            No guessing. No queuing.
          </p>
          <div className="hero-anim hero-anim-4 mt-10 flex flex-wrap items-center gap-6">
            <Link href="/book" className="btn-gold h-12 px-9 text-sm">
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
              /* alternate aspect to create visual rhythm */
              className={`relative min-w-0 flex-1 overflow-hidden ${
                i % 2 === 0 ? "aspect-[3/4]" : "aspect-[2/3]"
              } ${i === 3 ? "hidden sm:block" : ""}`}
            >
              <Image
                src={photo.src}
                alt={photo.alt}
                fill
                sizes="(max-width: 640px) 33vw, 25vw"
                className="object-cover transition-transform duration-700 hover:scale-105"
                unoptimized
              />
            </div>
          ))}
        </div>
      </section>

      {/* ── Services ────────────────────────────────────── */}
      <section className="px-6 py-24">
        <div className="mx-auto max-w-3xl">
          <Reveal>
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-zinc-400">
              Services &amp; Pricing
            </p>
          </Reveal>

          <div className="mt-8">
            {SHOP_SETTINGS.services.map((service, i) => (
              <Reveal key={service.name} delay={i * 0.06}>
                <div className="group flex cursor-default items-center justify-between border-t border-zinc-100 py-5 transition-colors hover:bg-zinc-50 last:border-b last:border-zinc-100 -mx-3 px-3 rounded-lg">
                  <div className="flex items-start gap-5">
                    <span className="mt-0.5 w-5 shrink-0 text-xs tabular text-zinc-300 group-hover:text-zinc-400 transition-colors">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <div>
                      <p className="font-semibold text-foreground">{service.name}</p>
                      <p className="mt-0.5 text-xs text-zinc-400">{service.durationMinutes} min</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <p className="tabular text-base font-bold text-foreground">
                      {formatPeso(service.price)}
                    </p>
                    <span className="text-zinc-200 opacity-0 transition-opacity group-hover:opacity-100">
                      →
                    </span>
                  </div>
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
      <section className="overflow-hidden bg-brand-black px-6 py-24 text-white">
        <div className="mx-auto max-w-3xl">
          <Reveal>
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-zinc-500">
              How it works
            </p>
          </Reveal>

          <div className="mt-10 space-y-0">
            {STEPS.map((step, i) => (
              <Reveal key={step.n} delay={i * 0.1}>
                <div className="relative flex gap-6 border-t border-zinc-800 py-10 last:border-b last:border-zinc-800">
                  {/* Giant background number */}
                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute right-0 top-4 select-none font-[family-name:var(--font-display)] text-[7rem] font-semibold leading-none text-zinc-800 sm:text-[9rem]"
                  >
                    {step.n}
                  </span>
                  {/* Gold accent line */}
                  <div className="mt-2 h-5 w-px shrink-0 bg-brand-gold" />
                  <div className="relative z-10">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-zinc-500">
                      Step {step.n}
                    </p>
                    <p className="mt-2 font-[family-name:var(--font-display)] text-2xl font-semibold text-white sm:text-3xl">
                      {step.title}
                    </p>
                    <p className="mt-3 max-w-xs text-sm leading-relaxed text-zinc-400">
                      {step.body}
                    </p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal delay={0.3}>
            <div className="mt-12">
              <Link href="/book" className="btn-gold h-12 px-8 text-sm">
                Book now — takes 2 minutes
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── Brand statement + stats ──────────────────────── */}
      <section className="px-6 py-24">
        <div className="mx-auto max-w-3xl">
          <Reveal>
            <h2 className="font-[family-name:var(--font-display)] text-3xl font-semibold leading-[1.12] text-foreground sm:text-4xl">
              A guaranteed chair when you arrive.
              <span className="text-zinc-400"> No surprise waits. Just your cut, on time.</span>
            </h2>
          </Reveal>

          <Reveal delay={0.12}>
            <div className="mt-12 grid grid-cols-3 gap-6 border-t border-zinc-100 pt-10">
              <div>
                <p className="text-2xl font-bold text-foreground">
                  <CountUp to={30} suffix=" min" />
                </p>
                <p className="mt-1 text-xs text-zinc-500">average service</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">
                  ₱<CountUp to={150} />
                </p>
                <p className="mt-1 text-xs text-zinc-500">starting price</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">
                  {weeklyCount > 0 ? (
                    <CountUp to={weeklyCount} />
                  ) : (
                    <span className="tabular">—</span>
                  )}
                </p>
                <p className="mt-1 text-xs text-zinc-500">clients this week</p>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── Testimonials ────────────────────────────────── */}
      <section className="bg-surface-gray px-6 py-24">
        <div className="mx-auto max-w-3xl">
          <Reveal>
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-zinc-400">
              What clients say
            </p>
          </Reveal>

          <div className="mt-10 grid gap-5 sm:grid-cols-3">
            {REVIEWS.map((r, i) => (
              <Reveal key={r.name} delay={i * 0.08}>
                <div className="flex h-full flex-col justify-between rounded-2xl border border-zinc-200 bg-white p-6">
                  <div>
                    <span className="font-[family-name:var(--font-display)] text-3xl leading-none text-brand-gold">&ldquo;</span>
                    <p className="mt-2 text-sm leading-relaxed text-zinc-600">{r.quote}</p>
                  </div>
                  <div className="mt-6 border-t border-zinc-100 pt-4">
                    <p className="text-sm font-semibold text-foreground">{r.name}</p>
                    <p className="text-xs text-zinc-400">{r.label}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── Marquee ticker ──────────────────────────────── */}
      <div className="overflow-hidden border-y border-brand-gold/30 bg-brand-black py-5">
        <div className="marquee-track flex w-max items-center gap-0">
          {[...TICKER, ...TICKER].map((item, i) => (
            <span
              key={i}
              className="flex items-center gap-8 px-8 text-[11px] font-semibold uppercase tracking-[0.2em] text-zinc-500"
            >
              {item}
              <span className="h-1 w-1 shrink-0 rounded-full bg-brand-gold" />
            </span>
          ))}
        </div>
      </div>

      {/* ── Closing CTA ─────────────────────────────────── */}
      <section className="bg-brand-black px-6 pb-28 pt-24 text-white sm:pb-36 sm:pt-32">
        <Reveal className="mx-auto max-w-3xl">
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-zinc-500">
            Ready?
          </p>
          <h2 className="mt-5 font-[family-name:var(--font-display)] text-5xl font-semibold leading-[0.98] sm:text-6xl">
            One tap to your
            <br />
            <span className="text-zinc-400">next cut.</span>
          </h2>
          <div className="mt-12">
            <Link href="/book" className="btn-gold h-13 px-10 text-base">
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

            <div>
              <span className="font-[family-name:var(--font-display)] text-base font-semibold text-foreground">
                Banot&apos;s Barbershop
              </span>
              <p className="mt-2 text-xs leading-relaxed text-zinc-400">
                {SHOP_SETTINGS.address}
              </p>
            </div>

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

          <div className="mt-10 flex items-center justify-between border-t border-zinc-100 pt-6">
            <p className="text-xs text-zinc-400">
              &copy; {new Date().getFullYear()} Banot&apos;s Barbershop
            </p>
            <p className="text-xs text-zinc-300">
              Media:{" "}
              <a href="https://www.pexels.com" target="_blank" rel="noopener noreferrer" className="underline underline-offset-2">
                Pexels
              </a>
            </p>
          </div>
        </div>
      </footer>

    </main>
  );
}
