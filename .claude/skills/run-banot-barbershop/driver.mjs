// Driver for Banot's Barbershop (Next.js app). Drives the running dev
// server with Playwright. Usage:
//   node .claude/skills/run-banot-barbershop/driver.mjs <scenario> [baseUrl]
// Scenarios: smoke, walkin
//
// Requires the dev server already running (see SKILL.md "Run").

import { chromium } from "playwright";
import { mkdirSync } from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SHOT_DIR = path.join(__dirname, "screenshots");
mkdirSync(SHOT_DIR, { recursive: true });

const scenario = process.argv[2] ?? "smoke";
const BASE = process.argv[3] ?? process.env.BASE_URL ?? "http://localhost:3050";

function shotPath(name) {
  return path.join(SHOT_DIR, `${name}.png`);
}

async function withBrowser(fn) {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 414, height: 896 } });
  const consoleErrors = [];
  page.on("console", (msg) => {
    if (msg.type() === "error") consoleErrors.push(msg.text());
  });
  page.on("pageerror", (err) => consoleErrors.push(String(err)));
  try {
    await fn(page);
  } finally {
    await browser.close();
  }
  return consoleErrors;
}

async function scenarioSmoke() {
  const routes = [
    "/",
    "/book",
    "/dashboard",
    "/dashboard/pending",
    "/dashboard/clients",
    "/dashboard/settings",
    "/dashboard/walk-in",
    "/dashboard/login",
  ];
  const results = [];
  const consoleErrors = await withBrowser(async (page) => {
    for (const route of routes) {
      const res = await page.goto(`${BASE}${route}`, { waitUntil: "networkidle" });
      const name = route === "/" ? "home" : route.slice(1).replace(/\//g, "-");
      await page.screenshot({ path: shotPath(name) });
      results.push({ route, status: res?.status() ?? null });
    }
  });
  console.log(JSON.stringify({ scenario: "smoke", results, consoleErrors }, null, 2));
}

async function scenarioWalkin() {
  let walkInMarkerVisible = false;
  let clientCardVisible = false;
  const clientName = `Test Client ${Date.now()}`;

  const consoleErrors = await withBrowser(async (page) => {
    await page.goto(`${BASE}/dashboard`, { waitUntil: "networkidle" });
    await page.waitForSelector("text=Banot's Barbershop");
    await page.screenshot({ path: shotPath("walkin-1-today-before") });

    await page.click("text=+ Add walk-in");
    await page.waitForSelector("text=Add walk-in");

    await page.fill('input[name="name"]', clientName);
    await page.fill('input[name="phone"]', "0900 000 0000");
    await page.selectOption('select[name="service"]', { value: "Shave" });
    await page.selectOption('select[name="time"]', { index: 0 });
    await page.screenshot({ path: shotPath("walkin-2-filled") });

    await page.click("text=Confirm walk-in");
    await page.waitForURL(`${BASE}/dashboard`);
    await page.waitForSelector(`text=${clientName}`);
    await page.screenshot({ path: shotPath("walkin-3-today-after") });

    walkInMarkerVisible = await page.isVisible("text=Walk-in");
    clientCardVisible = await page.isVisible(`text=${clientName}`);
  });

  console.log(
    JSON.stringify(
      { scenario: "walkin", clientName, walkInMarkerVisible, clientCardVisible, consoleErrors },
      null,
      2
    )
  );
}

const scenarios = { smoke: scenarioSmoke, walkin: scenarioWalkin };
const run = scenarios[scenario];
if (!run) {
  console.error(`Unknown scenario "${scenario}". Available: ${Object.keys(scenarios).join(", ")}`);
  process.exit(1);
}

run().catch((err) => {
  console.error("DRIVER FAILED:", err);
  process.exit(1);
});
