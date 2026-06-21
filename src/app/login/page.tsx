import { loginAction } from "./actions";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  return (
    <main className="flex flex-1 flex-col items-center bg-white">
      <section className="flex w-full max-w-md flex-1 flex-col px-6 py-10">
        <h1 className="text-2xl font-extrabold text-foreground">Banot&apos;s Barbershop</h1>
        <p className="mt-1 text-sm text-zinc-500">Owner login</p>

        <form action={loginAction} className="mt-8 flex flex-1 flex-col gap-4">
          <label className="flex flex-col gap-1.5">
            <span className="text-sm font-semibold text-zinc-500">Password</span>
            <input
              type="password"
              name="password"
              placeholder="••••••••"
              autoFocus
              className="h-12 rounded-xl border border-divider px-4 text-base text-foreground outline-none focus:border-brand-gold"
            />
          </label>

          {error ? (
            <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              Wrong password. Try again.
            </p>
          ) : null}

          <div className="flex-1" />

          <button
            type="submit"
            className="flex h-13 w-full items-center justify-center rounded-full bg-brand-gold px-5 text-base font-bold text-brand-black"
          >
            Log in
          </button>
        </form>
      </section>
    </main>
  );
}
