#!/usr/bin/env node
/**
 * Static README screenshots of the docs site.
 * Usage: start the docs app on :3100, then NODE_PATH=$(npm root -g) node scripts/screenshots.mjs [baseUrl]
 */
import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";

const { chromium } = createRequire(import.meta.url)("playwright");
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const base = process.argv[2] ?? "http://localhost:3100";
const out = path.join(root, "docs/media");
fs.mkdirSync(out, { recursive: true });

const shots = [
  { name: "home", path: "/" },
  { name: "home-light", path: "/", theme: "light" },
  { name: "components", path: "/components" },
  { name: "component-page", path: "/components/text/text-split-reveal" },
  { name: "flows", path: "/flows/flow-onboarding", scrollTo: "Screens in this flow" },
  { name: "blocks", path: "/blocks/pricing-toggle" },
  { name: "playground", path: "/playground" },
];

const browser = await chromium.launch({ args: ["--use-gl=swiftshader", "--enable-unsafe-swiftshader"] });
for (const s of shots) {
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 });
  await ctx.addInitScript((t) => localStorage.setItem("theme", t), s.theme ?? "dark");
  const page = await ctx.newPage();
  await page.goto(base + s.path, { waitUntil: "load" });
  if (s.scrollTo) await page.getByText(s.scrollTo).scrollIntoViewIfNeeded();
  if (s.scrollTo) await page.evaluate(() => window.scrollBy(0, -120));
  await page.waitForTimeout(3200);
  const png = path.join(out, `${s.name}.png`);
  await page.screenshot({ path: png });
  execFileSync("ffmpeg", ["-y", "-loglevel", "error", "-i", png, "-q:v", "3", png.replace(/\.png$/, ".jpg")]);
  fs.rmSync(png);
  console.log(`✓ ${s.name}.jpg`);
  await ctx.close();
}
await browser.close();
