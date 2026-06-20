// Driver for Banot's Barbershop (Next.js app). Drives the running dev
// server with Playwright. Usage:
//   node .claude/skills/run-banot-barbershop/driver.mjs <scenario> [baseUrl]
// Scenarios: smoke, walkin, fullbooking
//
// Requires the dev server already running (see SKILL.md "Run").

import { chromium } from "playwright";
import { mkdirSync, writeFileSync } from "fs";
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

async function scenarioFullBooking() {
  const clientName = `Online Client ${Date.now()}`;
  const proofPath = path.join(SHOT_DIR, "fake-proof.png");
  writeFileSync(proofPath, Buffer.from([0x89, 0x50, 0x4e, 0x47])); // minimal stub, just needs to exist

  let reference = null;
  let pendingCardVisible = false;

  const consoleErrors = await withBrowser(async (page) => {
    await page.goto(`${BASE}/book`, { waitUntil: "networkidle" });
    await page.screenshot({ path: shotPath("fullbooking-1-services") });

    // exact-match "Haircut" so it doesn't also match "Haircut + Shave"
    await page.click('text="Haircut"');
    await page.click("text=Continue");

    // date buttons: [0]=back, [1..7]=date chips — pick offset 3 (a date with no
    // pre-existing mock bookings, since seed/test data clusters on "today")
    await page.locator("button").nth(4).click();
    await page.click('text="9:00 AM"');
    await page.click("text=Continue");
    await page.screenshot({ path: shotPath("fullbooking-2-datetime") });

    await page.fill('input[placeholder="Juan Dela Cruz"]', clientName);
    await page.fill('input[type="tel"]', "0917 000 1111");
    await page.click("text=Continue");

    await page.click("text=GCash");
    await page.setInputFiles('input[type="file"]', proofPath);
    await page.screenshot({ path: shotPath("fullbooking-3-payment") });

    await page.click("text=Submit booking request");
    await page.waitForSelector("text=Booking request sent");
    await page.screenshot({ path: shotPath("fullbooking-4-confirmation") });

    const refText = await page.locator("text=BNT-").first().textContent();
    reference = refText?.trim() ?? null;

    await page.goto(`${BASE}/dashboard/pending`, { waitUntil: "networkidle" });
    await page.screenshot({ path: shotPath("fullbooking-5-pending-list") });
    pendingCardVisible = await page.isVisible(`text=${clientName}`);
  });

  console.log(
    JSON.stringify(
      { scenario: "fullbooking", clientName, reference, pendingCardVisible, consoleErrors },
      null,
      2
    )
  );
}

async function scenarioCompleteBooking() {
  const clientName = `Complete Test ${Date.now()}`;
  let bookingGoneFromToday = false;
  let clientShowsCompletedVisit = false;

  const consoleErrors = await withBrowser(async (page) => {
    // create a walk-in for today so there's a confirmed booking to complete
    await page.goto(`${BASE}/dashboard/walk-in`, { waitUntil: "networkidle" });
    await page.fill('input[name="name"]', clientName);
    await page.fill('input[name="phone"]', "0900 111 2222");
    await page.selectOption('select[name="service"]', { value: "Haircut" });
    await page.click("text=Confirm walk-in");
    await page.waitForURL(`${BASE}/dashboard`);
    await page.waitForSelector(`text=${clientName}`);
    await page.screenshot({ path: shotPath("completebooking-1-today-before") });

    await page.click(`text=${clientName}`);
    await page.waitForSelector("text=Mark Completed");
    await page.screenshot({ path: shotPath("completebooking-2-detail") });

    await page.click("text=Mark Completed");
    await page.waitForURL(`${BASE}/dashboard`);
    await page.screenshot({ path: shotPath("completebooking-3-today-after") });
    bookingGoneFromToday = !(await page.isVisible(`text=${clientName}`));

    await page.goto(`${BASE}/dashboard/clients`, { waitUntil: "networkidle" });
    await page.click(`text=${clientName}`);
    await page.waitForSelector("text=Visit history");
    await page.screenshot({ path: shotPath("completebooking-4-client-detail") });
    clientShowsCompletedVisit = await page.isVisible("text=completed");
  });

  console.log(
    JSON.stringify(
      { scenario: "completebooking", clientName, bookingGoneFromToday, clientShowsCompletedVisit, consoleErrors },
      null,
      2
    )
  );
}

const scenarios = {
  smoke: scenarioSmoke,
  walkin: scenarioWalkin,
  fullbooking: scenarioFullBooking,
  completebooking: scenarioCompleteBooking,
};
const run = scenarios[scenario];
if (!run) {
  console.error(`Unknown scenario "${scenario}". Available: ${Object.keys(scenarios).join(", ")}`);
  process.exit(1);
}

run().catch((err) => {
  console.error("DRIVER FAILED:", err);
  process.exit(1);
});
