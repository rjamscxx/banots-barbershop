import Link from "next/link";
import Image from "next/image";
import { getNextOpenSlotToday, getWeeklyBookingCount } from "@/lib/dashboard-data";
import { getShopSettings, getActiveServices } from "@/lib/settings-data";
import { formatPeso } from "@/lib/booking-data";
import type { DayHours } from "@/lib/slots";

export const dynamic = "force-dynamic";
import { Reveal } from "@/components/landing/Reveal";
import { RevealHeading } from "@/components/landing/RevealHeading";
import { StaggerList, StaggerItem } from "@/components/landing/StaggerList";
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
    body: "Choose a cut, shave, or combo. Prices shown upfront — no surprises.",
  },
  {
    n: "02",
    title: "Book a slot & pay",
    body: "Pick a date and time, then settle via GCash, Maya, or bank transfer.",
  },
  {
    n: "03",
    title: "Show up. Get your cut.",
    body: "Arrive at your booked time. Your chair is ready — no queue, no wait.",
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

/* ── Marquee items ────────────────────────────────────────── */
const TICKER_BASE = [
  "Haircut",
  "Shave",
  "Hot Towel Shave",
  "Haircut + Shave",
  "GCash · Maya · Bank",
];

/* Group consecutive days with identical hours into range rows,
   e.g. Mon..Sat @ 9-7 + Sun closed → "Mon – Sat" / "Sun". */
type HoursRow = { label: string; value: string; closed: boolean };

function groupHours(hours: DayHours[]): HoursRow[] {
  const rows: HoursRow[] = [];
  for (const h of hours) {
    const value = h.closed ? "Closed" : `${h.open} – ${h.close}`;
    const last = rows[rows.length - 1];
    if (last && last.value === value) {
      const firstDay = last.label.split(" – ")[0];
      last.label = `${firstDay} – ${h.day}`;
    } else {
      rows.push({ label: h.day, value, closed: h.closed });
    }
  }
  return rows;
}

export default async function Home() {
  const [nextSlot, weeklyCount, settings, services] = await Promise.all([
    getNextOpenSlotToday(),
    getWeeklyBookingCount(),
    getShopSettings(),
    getActiveServices(),
  ]);

  const hourGroups = groupHours(settings.hours);
  const openSummary = hourGroups
    .filter((g) => !g.closed)
    .map((g) => `${g.label} · ${g.value}`)
    .join(" / ");
  const ticker = [...TICKER_BASE, ...(openSummary ? [openSummary] : []), "Quezon City"];
  const serviceCount = services.length;

  return (
    <main className="flex flex-1 flex-col bg-white">

      {/* ── Nav ─────────────────────────────────────────── */}
      <NavBar />

      {/* ── Hero ────────────────────────────────────────── */}
      <section className="hero-grain relative -mt-[57px] overflow-hidden bg-brand-black px-6 pb-32 pt-36 text-white sm:pb-48 sm:pt-52">
        <HeroVideo />

        {/* layered cinematic gradients */}
        <div className="absolute inset-0 bg-black/60" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(201,160,74,0.06)_0%,transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,transparent_40%,rgba(0,0,0,0.55)_100%)]" />
        <div className="absolute bottom-0 inset-x-0 h-48 bg-gradient-to-t from-white to-transparent" />

        <div className="relative z-10 mx-auto max-w-3xl">
          <div className="hero-anim hero-anim-1 mb-4 flex items-center gap-3">
            <div className="h-px w-8 bg-brand-gold" />
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-zinc-400">
              Independent Barber &middot; Quezon City
            </p>
          </div>

          <h1 className="hero-anim hero-anim-2 font-[family-name:var(--font-bebas)] text-[6.5rem] leading-[0.88] tracking-tight sm:text-[9rem] lg:text-[12rem]">
            SKIP<br />
            THE LINE.
          </h1>

          <p className="hero-anim hero-anim-3 mt-4 font-[family-name:var(--font-display)] text-xl italic text-zinc-300 sm:text-2xl">
            Walk in on time.
          </p>

          <p className="hero-anim hero-anim-4 mt-5 max-w-[320px] text-[14px] leading-relaxed text-zinc-400">
            Book a slot, pay ahead, and show up when your chair is ready.
            No guessing. No queuing.
          </p>

          <div className="hero-anim hero-anim-4 mt-8 flex flex-wrap items-center gap-4">
            <Link href="/book" className="btn-gold h-12 px-9 text-sm">
              Book a slot
            </Link>
            <a href="#services" className="btn-ghost h-12 px-8 text-sm">
              See services
            </a>
          </div>

          {nextSlot ? (
            <div className="hero-anim hero-anim-5 mt-6 flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-brand-red animate-pulse" />
              <p className="text-xs font-semibold uppercase tracking-[0.15em] text-zinc-400">
                Open today &mdash; next slot at {nextSlot}
              </p>
            </div>
          ) : (
            <p className="hero-anim hero-anim-5 mt-6 text-xs text-zinc-500">
              Fully booked today &mdash; book for tomorrow
            </p>
          )}
        </div>
      </section>

      {/* ── Photo strip ─────────────────────────────────── */}
      <section className="overflow-x-auto sm:overflow-hidden" aria-hidden="true">
        <div className="flex h-64 sm:h-auto sm:grid sm:grid-cols-4">
          {GALLERY.map((photo, i) => (
            <div
              key={photo.id}
              className="group relative shrink-0 w-[55vw] sm:w-auto overflow-hidden"
              style={{ aspectRatio: i % 2 === 0 ? "3/4" : "4/5" }}
            >
              <Image
                src={photo.src}
                alt={photo.alt}
                fill
                sizes="(max-width: 640px) 55vw, 25vw"
                className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105"
                unoptimized
              />
              {/* Hover overlay — overlay fades in, text slides up */}
              <div className="absolute inset-0 bg-gradient-to-t from-brand-black/75 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="absolute inset-x-0 bottom-0 flex items-end justify-between p-4 translate-y-2 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]">
                <span className="font-[family-name:var(--font-bebas)] text-white/90 text-sm tracking-[0.2em]">
                  Banot&apos;s
                </span>
                <span className="text-brand-gold text-sm leading-none">✂</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Services ─────────────────────────────────────── */}
      <section id="services" className="scroll-mt-16 bg-brand-black px-6 py-24">
        <div className="mx-auto max-w-3xl">

          <div className="flex items-baseline justify-between">
            <RevealHeading>
              <p className="font-[family-name:var(--font-bebas)] text-4xl text-brand-gold tracking-wide">
                Services &amp; Pricing
              </p>
            </RevealHeading>
            <Reveal delay={0.1}>
              <p className="text-[11px] text-zinc-600">
                {serviceCount} services &middot; from ₱100
              </p>
            </Reveal>
          </div>

          <StaggerList className="mt-8">
            {services.map((service, i) => (
              <StaggerItem key={service.name}>
                <div
                  className={`service-row group -mx-3 flex cursor-default items-center justify-between rounded-lg border-t border-zinc-800 px-3 py-5 transition-colors hover:bg-white/[0.04] ${
                    i === serviceCount - 1 ? "border-b border-zinc-800" : ""
                  }`}
                >
                  <div className="flex items-start gap-5">
                    <span className="mt-0.5 w-5 shrink-0 font-[family-name:var(--font-bebas)] text-lg text-brand-gold/40 transition-colors group-hover:text-brand-gold">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <div>
                      <p className="font-semibold text-white">{service.name}</p>
                      <p className="mt-0.5 text-xs text-zinc-500">✂ {service.durationMinutes} min</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <p className="font-[family-name:var(--font-bebas)] text-2xl text-brand-gold tabular transition-all group-hover:text-[1.6rem]">
                      {formatPeso(service.price)}
                    </p>
                  </div>
                </div>
              </StaggerItem>
            ))}
          </StaggerList>

          <Reveal delay={0.28}>
            <div className="mt-10">
              <Link href="/book" className="btn-gold h-12 px-8 text-sm">
                Book a slot
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── How it works ────────────────────────────────── */}
      <section id="how-it-works" className="overflow-hidden bg-surface-dark px-6 py-24 text-white scroll-mt-16">
        <div className="mx-auto max-w-3xl">
          <RevealHeading>
            <p className="font-[family-name:var(--font-bebas)] text-4xl text-zinc-600 tracking-wide">
              How it works
            </p>
          </RevealHeading>

          <StaggerList className="mt-10">
            {STEPS.map((step) => (
              <StaggerItem key={step.n}>
                <div className="relative flex gap-6 border-t border-zinc-800 py-10 last:border-b last:border-zinc-800">
                  {/* Ghost large step number */}
                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute right-0 top-0 select-none font-[family-name:var(--font-bebas)] text-[8rem] leading-none text-white/[0.03] sm:text-[11rem]"
                  >
                    {step.n}
                  </span>

                  {/* Gold left accent bar */}
                  <div className="mt-2 h-5 w-[3px] shrink-0 rounded-full bg-brand-gold" />

                  <div className="relative z-10">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-zinc-600">
                      Step {step.n}
                    </p>
                    <p className="mt-2 font-[family-name:var(--font-bebas)] text-3xl text-white sm:text-4xl">
                      {step.title}
                    </p>
                    <p className="mt-3 max-w-xs text-sm leading-relaxed text-zinc-400">
                      {step.body}
                    </p>
                  </div>
                </div>
              </StaggerItem>
            ))}
          </StaggerList>

          <Reveal delay={0.1}>
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
            <h2 className="font-[family-name:var(--font-bebas)] text-5xl leading-[1.0] text-foreground sm:text-6xl">
              A guaranteed chair when you arrive.{" "}
              <span className="text-zinc-300">
                No surprise waits. Just your cut, on time.
              </span>
            </h2>
          </Reveal>

          <Reveal delay={0.12}>
            <div className="mt-12 grid grid-cols-3 divide-x divide-zinc-100 border-t border-zinc-100 pt-10">
              <div className="pr-6">
                <p className="font-[family-name:var(--font-bebas)] text-5xl text-foreground sm:text-6xl">
                  <CountUp to={30} suffix=" MIN" />
                </p>
                <p className="mt-1.5 text-xs text-zinc-500">average service</p>
              </div>
              <div className="px-6">
                <p className="font-[family-name:var(--font-bebas)] text-5xl text-foreground sm:text-6xl">
                  ₱<CountUp to={150} />
                </p>
                <p className="mt-1.5 text-xs text-zinc-500">starting price</p>
              </div>
              <div className="pl-6">
                <p className="font-[family-name:var(--font-bebas)] text-5xl text-brand-gold sm:text-6xl glow-gold">
                  {weeklyCount > 0 ? (
                    <CountUp to={weeklyCount} />
                  ) : (
                    <span>—</span>
                  )}
                </p>
                <p className="mt-1.5 text-xs text-zinc-500">clients this week</p>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── Testimonials ────────────────────────────────── */}
      <section className="bg-surface-gray px-6 py-24">
        <div className="mx-auto max-w-3xl">
          <RevealHeading>
            <p className="font-[family-name:var(--font-bebas)] text-4xl text-zinc-400 tracking-wide">
              What clients say
            </p>
          </RevealHeading>

          <StaggerList className="mt-10 grid gap-4 sm:grid-cols-3">
            {REVIEWS.map((r) => (
              <StaggerItem key={r.name}>
                <div className="relative flex h-full flex-col overflow-hidden rounded-2xl border border-zinc-200 bg-white p-6 shadow-md">
                  {/* Gold top accent */}
                  <div className="absolute inset-x-0 top-0 h-[3px] rounded-t-2xl bg-gradient-to-r from-brand-gold/90 via-brand-gold/50 to-transparent" />

                  {/* Large decorative quote mark */}
                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute -top-3 -left-1 select-none font-[family-name:var(--font-display)] text-[6.5rem] italic leading-none text-brand-gold/10"
                  >
                    &ldquo;
                  </span>

                  <div className="relative z-10 flex gap-0.5" aria-label="5 out of 5 stars">
                    {Array.from({ length: 5 }).map((_, s) => (
                      <span key={s} className="text-brand-gold text-sm">★</span>
                    ))}
                  </div>
                  <p className="relative z-10 mt-3 flex-1 text-sm leading-relaxed text-zinc-600">
                    &ldquo;{r.quote}&rdquo;
                  </p>
                  <div className="relative z-10 mt-5 border-t border-zinc-100 pt-4">
                    <p className="text-sm font-semibold text-foreground">{r.name}</p>
                    <p className="text-xs text-zinc-400">{r.label}</p>
                  </div>
                </div>
              </StaggerItem>
            ))}
          </StaggerList>
        </div>
      </section>

      {/* ── Marquee ticker ──────────────────────────────── */}
      <div className="overflow-hidden border-y border-white/5 bg-brand-black py-5">
        <div className="marquee-track flex w-max items-center">
          {[...ticker, ...ticker].map((item, i) => (
            <span
              key={i}
              className="flex items-center gap-7 px-7 font-[family-name:var(--font-bebas)] text-base tracking-[0.15em] text-zinc-500"
            >
              {item}
              <span className="h-[4px] w-[4px] shrink-0 rounded-full bg-brand-gold opacity-70" />
            </span>
          ))}
        </div>
      </div>

      {/* ── Closing CTA ─────────────────────────────────── */}
      <section className="relative overflow-hidden bg-brand-black px-6 pb-28 pt-24 text-white sm:pb-40 sm:pt-36">

        {/* Watermark background text */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 flex items-center justify-center select-none overflow-hidden"
        >
          <span className="font-[family-name:var(--font-bebas)] text-[12rem] leading-none text-white/[0.025] sm:text-[18rem] lg:text-[22rem] tracking-tighter whitespace-nowrap">
            BANOT&apos;S
          </span>
        </div>

        <Reveal className="relative z-10 mx-auto max-w-3xl">
          <div className="mb-6 h-px w-8 bg-brand-gold opacity-60" />
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-zinc-600">
            Ready for your next cut?
          </p>
          <h2 className="mt-5 font-[family-name:var(--font-bebas)] text-[5rem] leading-[0.9] sm:text-[7rem] lg:text-[9rem]">
            ONE TAP.<br />
            <span className="text-zinc-600">YOUR CHAIR AWAITS.</span>
          </h2>
          <p className="mt-6 max-w-xs text-sm leading-relaxed text-zinc-500">
            Book online in under 2 minutes. Pay ahead, skip the queue, show up on time.
          </p>
          <div className="mt-10 flex flex-wrap items-center gap-4">
            <Link href="/book" className="btn-gold h-12 px-9 text-sm">
              Book a slot
            </Link>
            <span className="text-xs text-zinc-600">
              {openSummary}
            </span>
          </div>
        </Reveal>
      </section>

      {/* ── Footer ──────────────────────────────────────── */}
      <footer className="border-t border-zinc-100 bg-white px-6 pb-10 pt-10">
        <div className="mx-auto max-w-3xl">
          <div className="grid gap-10 sm:grid-cols-3">

            <div>
              <span className="font-[family-name:var(--font-bebas)] text-3xl tracking-wide text-foreground leading-none">
                Banot&apos;s<br />Barbershop
              </span>
              <p className="mt-3 text-xs leading-relaxed text-zinc-400">
                {settings.address}
              </p>
              <p className="mt-2 text-[11px] font-semibold uppercase tracking-[0.15em] text-zinc-300">
                Book · Pay · Show up.
              </p>
            </div>

            <div>
              <p className="text-[11px] font-semibold uppercase tracking-widest text-zinc-400">
                Hours
              </p>
              <div className="mt-3 space-y-1.5">
                {hourGroups.map((g) => (
                  <div key={g.label} className="flex items-center justify-between text-sm">
                    <span className="text-zinc-500">{g.label}</span>
                    <span className={`font-semibold ${g.closed ? "text-zinc-400" : "text-foreground"}`}>
                      {g.value}
                    </span>
                  </div>
                ))}
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
                Online · Pay ahead · No queue
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
