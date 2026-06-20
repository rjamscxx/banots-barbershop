---
name: run-banot-barbershop
description: Build, run, and drive Banot's Barbershop (Next.js booking app). Use when asked to start the app, run it in a browser, take a screenshot of its UI, smoke-test the routes, test the walk-in booking flow, or test the public online booking flow end-to-end into the dashboard.
---

This is a Next.js 16 (App Router, Turbopack) app backed by SQLite via
Prisma (`prisma/schema.prisma`, data access in `src/lib/dashboard-data.ts`).
Client-safe types/constants that get imported by client components
live in `src/lib/dashboard-shared.ts` instead — keep DB-importing code
out of that file or the client bundle breaks (see Gotchas). It's
driven with a Playwright script at
`.claude/skills/run-banot-barbershop/driver.mjs` (Playwright is a
project devDependency already installed).

All paths below are relative to this app's root (`<repo>/app/` if you
cloned the parent `FLUX LABS` folder, or just the repo root if this is
the whole repo).

## Prerequisites

Node.js 24+ and npm (already required by the project). No OS packages
needed — this runs on Windows/Linux/macOS without xvfb since Playwright
launches Chromium headless.

## Setup

```bash
npm install                        # also runs `prisma generate` via postinstall
cp .env.example .env                # sets DATABASE_URL="file:./dev.db"
npm run db:migrate                  # creates dev.db from prisma/migrations
npm run db:seed                     # seeds the 4 demo clients/bookings
npx playwright install chromium     # one-time browser binary download
```

`dev.db` is gitignored — every fresh clone starts from an empty
database until you run the two `db:*` commands above.

## Build

```bash
npm run build
```

## Run (agent path)

1. Start the dev server on a dedicated port (use a fixed port so it
   doesn't collide with other projects' dev servers on 3000/3001 —
   check with `netstat -ano | grep LISTENING` first if unsure):

```bash
npm run dev -- --port 3050 > /tmp/banot-dev.log 2>&1 &
timeout 60 bash -c 'until curl -sf http://localhost:3050 >/dev/null; do sleep 1; done'
```

2. Run the driver with a scenario name:

```bash
node .claude/skills/run-banot-barbershop/driver.mjs smoke
node .claude/skills/run-banot-barbershop/driver.mjs walkin
node .claude/skills/run-banot-barbershop/driver.mjs fullbooking
node .claude/skills/run-banot-barbershop/driver.mjs completebooking
node .claude/skills/run-banot-barbershop/driver.mjs responsive
```

Screenshots land in `.claude/skills/run-banot-barbershop/screenshots/`.
Each run prints a JSON result with route statuses (or flow-specific
assertions) and any browser console errors.

| scenario | what it does |
|---|---|
| `smoke` | Visits `/`, `/book`, `/dashboard`, `/dashboard/pending`, `/dashboard/clients`, `/dashboard/settings`, `/dashboard/walk-in`, `/dashboard/login`; screenshots each; reports HTTP status + console errors per route |
| `walkin` | Drives the full "Add walk-in" flow from `/dashboard`: fills client name/phone, picks a service + time, submits, and asserts the new booking appears on Today's view with the "Walk-in" marker |
| `fullbooking` | Drives the full public `/book` flow (service → date/time → details → payment + fake proof upload → submit), then checks `/dashboard/pending` for the new request — proves the public booking page and dashboard are wired to the same store, not two disconnected mocks |
| `completebooking` | Creates a walk-in for today, opens its booking detail page (`/dashboard/bookings/[id]`), clicks "Mark Completed", and asserts it disappears from Today's view and the client's visit history shows it as completed — exercises the `lastVisitDate` update that feeds the "due for rebooking" badge |
| `responsive` | Screenshots `/`, `/book`, `/dashboard`, `/dashboard/clients` at 4 viewport widths (360, 414, 768, 1440px) — no assertions, just produces screenshots to eyeball for layout breakage |

All scenarios create real rows in `dev.db`. Test client names are
prefixed (`Test Client `, `Online Client `, `Complete Test `) so
they're easy to clean up afterward — see Gotchas.

The driver reads `BASE_URL` env var or a second CLI arg if you used a
different port: `node driver.mjs smoke http://localhost:3050`.

3. Stop the dev server when done:

```bash
netstat -ano | grep ":3050" | grep LISTENING   # find the PID
taskkill //F //PID <pid>
```

## Run (human path)

```bash
npm run dev
```

Opens on `http://localhost:3000` (or the next free port if 3000 is
taken by another project — Next.js prints the actual port). Ctrl-C to
stop.

## Test

No test suite exists yet — `npm run build` (typecheck + compile) is
the current correctness gate. The `smoke` driver scenario is the
closest thing to an integration test right now.

## Gotchas

- **An `absolute`-positioned badge next to flexbox-centered text breaks
  at narrow viewports.** `DashboardNav`'s pending-count badge used
  `absolute right-6` relative to the tab's flex cell — on a 4-column
  nav at 360px width, that fixed offset overlapped the centered label
  text ("Pending" rendered as "Pend" with the badge on top). Fixed by
  putting the label and badge in the same inline flex row instead of
  absolutely positioning the badge — caught by the `responsive`
  scenario, invisible at the default 414px test viewport.
- **Seed/demo bookings are dated to whatever day they were seeded on**
  (e.g. `2026-06-19`). Once real calendar time moves past that date,
  `/dashboard`'s Today view legitimately shows "No confirmed bookings
  today" for them — that's correct filtering, not a bug. To test
  Today-view features, create a fresh walk-in (defaults its date to
  the actual current day) rather than relying on seed data.
- **Don't run `prisma migrate reset` to clean up test data.** Prisma
  itself blocks this for AI agents without explicit user consent
  (it's a full destructive wipe). Instead delete just the rows the
  driver created — all scenarios prefix test client names
  (`Test Client `, `Online Client `, `Complete Test `), so a targeted
  `prisma.client.deleteMany({ where: { name: { startsWith: ... } } })`
  (cascade-delete their bookings first) cleans up without touching
  seed data. There's no standing script for this — write one
  ad hoc in `prisma/` and delete it after running.
- **First boot after killing a previous dev server can take well over
  30s wall-clock**, even though Next.js itself logs "Ready in ~650ms" —
  that figure is internal bootstrap time, not the time from when you
  ran `npm run dev`. A `timeout 30` poll loop hit `exit 124` once even
  though the server came up correctly seconds later; use `timeout 60`.
- **Don't write driver/script files to a path starting with `/tmp/...`
  on this Windows setup** — file-write tools resolve that to
  `C:\Users\<user>\AppData\Local\Temp\...`, but a plain Node script
  using the literal string `/tmp/...` as a path resolves to
  `C:\tmp\...` (drive-root-relative) instead — same-looking path,
  two different real locations. The driver avoids this entirely by
  computing `SHOT_DIR` from `import.meta.url`, not a hardcoded
  `/tmp` string.
- **Port collisions across unrelated projects are real** — `npm run
  dev` defaults to 3000, but other Next.js projects on this machine
  may already be running there. Always pass `--port` explicitly and
  verify with `netstat` rather than assuming 3000/3001 are free.
- **A `"use client"` component that imports straight from
  `src/lib/dashboard-data.ts` and calls a function like
  `getBookingsByStatus(...)` gets a frozen snapshot baked into the
  client bundle, not live server data.** `DashboardNav`'s pending
  badge count was stale this way until fixed — compute counts in a
  server component (e.g. the layout) and pass them down as props
  instead of calling data functions directly inside client components.
- **After moving to Prisma + `better-sqlite3`, any client component
  importing from `dashboard-data.ts` breaks the build** — Turbopack
  tries to bundle `better-sqlite3`'s native bindings (`fs`, `node:module`)
  into the browser chunk and fails with `Module not found: Can't
  resolve 'fs'`. Fix: keep client-safe types/constants in
  `src/lib/dashboard-shared.ts` (no Prisma import) and have client
  components (e.g. `WalkInForm.tsx`) import from there, never from
  `dashboard-data.ts` directly.
- **Prisma 7's new `prisma-client` generator requires a driver
  adapter** — `new PrismaClient()` with no args throws
  `PrismaClientInitializationError`. For SQLite, install
  `@prisma/adapter-better-sqlite3` and pass `new PrismaClient({ adapter })`.
  Also note the export is `PrismaBetterSqlite3` (lowercase "ql"), not
  `PrismaBetterSQLite3`.
- **`npx playwright install chromium` silently no-ops with just a
  warning banner** if Playwright isn't a listed dependency of the
  current directory's `package.json` yet — install it as a real
  devDependency (`npm install -D playwright`) before running the
  install command, otherwise no browser binary actually downloads.

## Troubleshooting

- **`page.selectOption` throws `expected string, got object`**: don't
  pass a regex to `{ label: ... }` — Playwright's `selectOption` wants
  a literal string for `value`/`label`. Use `{ value: 'ExactOptionValue' }`
  matching the `<option value=...>` in the JSX.
- **Driver can't find the dev server**: all scenarios assume
  `http://localhost:3050` by default — pass the real URL as a second
  arg if you started the server on a different port.
- **`fullbooking` picks a date 4 days out, not today**: the seed mock
  data and the `walkin` scenario both create bookings dated "today,"
  so picking a same-day slot risks colliding with `isSlotTaken` (the
  online flow now actually enforces the first-come-first-served slot
  lock against the dashboard's data). Picking a future date sidesteps
  that without the driver needing to inspect existing bookings first.
