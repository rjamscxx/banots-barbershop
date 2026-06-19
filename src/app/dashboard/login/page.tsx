import Link from "next/link";

export default function DashboardLoginPage() {
  return (
    <main className="flex flex-1 flex-col items-center bg-white">
      <section className="flex w-full max-w-md flex-1 flex-col px-6 py-10">
        <h1 className="text-2xl font-extrabold text-foreground">Banot&apos;s Barbershop</h1>
        <p className="mt-1 text-sm text-zinc-500">Owner login</p>

        <form className="mt-8 flex flex-1 flex-col gap-4">
          <label className="flex flex-col gap-1.5">
            <span className="text-sm font-semibold text-zinc-500">Email</span>
            <input
              type="email"
              placeholder="you@example.com"
              className="h-12 rounded-xl border border-divider px-4 text-base text-foreground outline-none focus:border-brand-gold"
            />
          </label>
          <label className="flex flex-col gap-1.5">
            <span className="text-sm font-semibold text-zinc-500">Password</span>
            <input
              type="password"
              placeholder="••••••••"
              className="h-12 rounded-xl border border-divider px-4 text-base text-foreground outline-none focus:border-brand-gold"
            />
          </label>

          <div className="flex-1" />

          <Link
            href="/dashboard"
            className="flex h-13 w-full items-center justify-center rounded-full bg-brand-gold px-5 text-base font-bold text-brand-black"
          >
            Log in
          </Link>
          <p className="text-center text-xs text-zinc-400">
            Auth not wired yet — this goes straight to the dashboard.
          </p>
        </form>
      </section>
    </main>
  );
}
