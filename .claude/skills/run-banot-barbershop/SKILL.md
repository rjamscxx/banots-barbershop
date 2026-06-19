---
name: run-banot-barbershop
description: Build, run, and drive Banot's Barbershop (Next.js booking app). Use when asked to start the app, run it in a browser, take a screenshot of its UI, smoke-test the routes, or test the walk-in booking flow.
---

This is a Next.js 16 (App Router, Turbopack) app with no backend yet —
all data is in-memory mock data in `src/lib/*-data.ts`. It's driven
with a Playwright script at
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
npm install
npx playwright install chromium   # one-time browser binary download
```

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
```

Screenshots land in `.claude/skills/run-banot-barbershop/screenshots/`.
Each run prints a JSON result with route statuses (or flow-specific
assertions) and any browser console errors.

| scenario | what it does |
|---|---|
| `smoke` | Visits `/`, `/book`, `/dashboard`, `/dashboard/pending`, `/dashboard/clients`, `/dashboard/settings`, `/dashboard/walk-in`, `/dashboard/login`; screenshots each; reports HTTP status + console errors per route |
| `walkin` | Drives the full "Add walk-in" flow from `/dashboard`: fills client name/phone, picks a service + time, submits, and asserts the new booking appears on Today's view with the "Walk-in" marker |

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
- **Driver can't find the dev server**: the `smoke`/`walkin` scenarios
  assume `http://localhost:3050` by default — pass the real URL as a
  second arg if you started the server on a different port.
