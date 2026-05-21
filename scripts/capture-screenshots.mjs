/**
 * Portfolio screenshots for ClipScribe AI.
 * Uses production server (next start) to avoid dev overlays.
 *
 * Usage: npm run screenshots
 * Env: SCREENSHOT_BASE_URL=http://localhost:3000
 */

import { chromium } from "playwright";
import { mkdir, stat, access } from "fs/promises";
import { existsSync } from "fs";
import { spawn } from "child_process";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const OUT_DIR = join(ROOT, "docs", "screenshots");
const FIXTURE = join(__dirname, "fixtures", "demo.wav");
const BASE_URL = process.env.SCREENSHOT_BASE_URL || "http://localhost:3000";

const SHOTS = [
  { name: "clipscribe-homepage.png", width: 1440, height: 900 },
  { name: "clipscribe-upload.png", width: 1440, height: 900, scrollUpload: true },
  { name: "clipscribe-processing.png", width: 1440, height: 900, flow: "processing" },
  { name: "clipscribe-result.png", width: 1440, height: 900, flow: "result" },
  { name: "clipscribe-mobile.png", width: 390, height: 844, mobileHome: true },
];

const MIN_BYTES = 8000;

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function urlReachable(url) {
  try {
    const res = await fetch(url, { signal: AbortSignal.timeout(3000) });
    return res.ok;
  } catch {
    return false;
  }
}

function startProductionServer() {
  return new Promise((resolve, reject) => {
    const proc = spawn("npm", ["run", "start"], {
      cwd: ROOT,
      shell: true,
      stdio: "ignore",
      detached: process.platform !== "win32",
    });
    proc.on("error", reject);
    resolve(proc);
  });
}

async function waitForServer(url, timeoutMs = 120000) {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    if (await urlReachable(url)) return true;
    await sleep(500);
  }
  return false;
}

async function ensureFixture() {
  if (!existsSync(FIXTURE)) {
    await import("./fixtures/create-demo-wav.mjs");
  }
  await access(FIXTURE);
}

async function verifyPng(path) {
  const s = await stat(path);
  if (s.size < MIN_BYTES) {
    throw new Error(`${path} looks blank or too small (${s.size} bytes)`);
  }
}

async function runFlow(page) {
  await ensureFixture();
  const fileInput = page.locator('input[type="file"]');
  await fileInput.setInputFiles(FIXTURE);
  await page.getByText("Transcribing your clip").waitFor({ timeout: 30000 });
  await page.screenshot({
    path: join(OUT_DIR, "clipscribe-processing.png"),
    fullPage: false,
  });
  await page.getByText("Full transcript").waitFor({ timeout: 60000 });
  await page.screenshot({
    path: join(OUT_DIR, "clipscribe-result.png"),
    fullPage: false,
  });
}

async function main() {
  const nextDir = join(ROOT, ".next");
  if (!existsSync(nextDir)) {
    console.error("Run npm run build before screenshots.");
    process.exit(1);
  }

  await mkdir(OUT_DIR, { recursive: true });
  await ensureFixture();

  let serverProc = null;
  if (!(await urlReachable(BASE_URL))) {
    console.log("Starting production server…");
    serverProc = await startProductionServer();
    if (!(await waitForServer(BASE_URL))) {
      console.error(`Server not reachable at ${BASE_URL}`);
      process.exit(1);
    }
  }

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    deviceScaleFactor: 2,
    colorScheme: "dark",
  });
  const page = await context.newPage();

  try {
    // 1. Homepage desktop
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto(BASE_URL, { waitUntil: "networkidle" });
    await page.waitForSelector("h1");
    await sleep(800);
    await page.screenshot({
      path: join(OUT_DIR, "clipscribe-homepage.png"),
      fullPage: false,
    });

    // 2. Upload section
    const upload = page.locator("#upload");
    await upload.scrollIntoViewIfNeeded();
    await sleep(400);
    await page.screenshot({
      path: join(OUT_DIR, "clipscribe-upload.png"),
      fullPage: false,
    });

    // 3–4. Processing + result (same session)
    await runFlow(page);

    // 5. Mobile homepage (fresh load)
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(BASE_URL, { waitUntil: "networkidle" });
    await page.waitForSelector("h1");
    await sleep(600);
    await page.screenshot({
      path: join(OUT_DIR, "clipscribe-mobile.png"),
      fullPage: false,
    });

    for (const { name } of SHOTS) {
      const p = join(OUT_DIR, name);
      await verifyPng(p);
      const s = await stat(p);
      console.log(`OK ${name} (${Math.round(s.size / 1024)} KB)`);
    }

    console.log(`\nScreenshots saved to docs/screenshots/`);
  } finally {
    await browser.close();
    if (serverProc?.pid) {
      try {
        if (process.platform === "win32") {
          spawn("taskkill", ["/pid", String(serverProc.pid), "/f", "/t"], {
            shell: true,
            stdio: "ignore",
          });
        } else {
          process.kill(-serverProc.pid);
        }
      } catch {
        /* ignore */
      }
    }
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
