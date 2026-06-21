import { loginAction } from "./actions";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  return (
    <main className="flex min-h-full flex-col bg-brand-black">

      {/* top gold rule */}
      <div className="h-[3px] bg-brand-gold" />

      <div className="flex flex-1 flex-col items-center justify-center px-6 py-16">
        <div className="w-full max-w-sm">

          {/* Brand */}
          <div className="mb-10 text-center">
            <span className="font-[family-name:var(--font-display)] text-2xl font-semibold tracking-tight text-white">
              Banot&apos;s
            </span>
            <p className="mt-1 text-xs font-medium uppercase tracking-[0.2em] text-zinc-600">
              Owner dashboard
            </p>
          </div>

          {/* Card */}
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900 px-8 py-8">
            <p className="text-sm font-semibold text-zinc-400">Enter your password to continue</p>

            <form action={loginAction} className="mt-5 flex flex-col gap-4">
              <label className="flex flex-col gap-1.5">
                <span className="text-xs font-semibold uppercase tracking-widest text-zinc-600">
                  Password
                </span>
                <input
                  type="password"
                  name="password"
                  placeholder="••••••••"
                  autoFocus
                  className="h-12 rounded-xl border border-zinc-700 bg-zinc-800 px-4 text-base text-white placeholder:text-zinc-700 outline-none transition-colors focus:border-brand-gold"
                />
              </label>

              {error ? (
                <p className="rounded-xl border border-red-900/50 bg-red-950/40 px-4 py-3 text-sm text-red-400">
                  Wrong password. Try again.
                </p>
              ) : null}

              <button
                type="submit"
                className="btn-gold mt-2 h-12 w-full text-sm"
              >
                Log in
              </button>
            </form>
          </div>

          <p className="mt-6 text-center text-xs text-zinc-700">
            Banot&apos;s Barbershop &middot; Quezon City
          </p>
        </div>
      </div>
    </main>
  );
}
