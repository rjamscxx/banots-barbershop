export default function Home() {
  return (
    <main className="flex flex-1 flex-col items-center bg-white">
      <section className="flex w-full max-w-md flex-1 flex-col">
        <div className="relative h-64 w-full bg-brand-black" />

        <div className="flex flex-1 flex-col px-6 py-6">
          <h1 className="text-2xl font-extrabold tracking-tight text-foreground">
            Banot&apos;s Barbershop
          </h1>
          <p className="mt-1 text-sm text-zinc-500">
            Independent barber &middot; Walk-ins &amp; appointments
          </p>

          <div className="mt-4 flex items-center gap-2 text-sm text-zinc-500">
            <span>Open today &middot; 9:00 AM&ndash;7:00 PM</span>
          </div>

          <div className="mt-6 rounded-xl border border-divider bg-surface-gray px-4 py-3 text-sm text-zinc-600">
            12 clients booked this week
          </div>

          <div className="flex-1" />

          <a
            href="/book"
            className="mt-8 flex h-13 w-full items-center justify-center rounded-full bg-brand-gold px-5 text-base font-bold text-brand-black transition-colors hover:bg-brand-gold-pressed"
          >
            Book Now
          </a>
        </div>
      </section>
    </main>
  );
}
