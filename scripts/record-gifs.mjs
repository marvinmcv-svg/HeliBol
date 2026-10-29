#!/usr/bin/env node
/**
 * Records real interactions with live component previews and converts them to GIFs for the README.
 * Usage: start the docs app (pnpm --filter @kinetik/docs start -p 3100), then
 *   NODE_PATH=$(npm root -g) node scripts/record-gifs.mjs [baseUrl]
 * Requires Playwright and ffmpeg on PATH.
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
const tmp = path.join(out, ".tmp");
fs.mkdirSync(tmp, { recursive: true });

const W = 1100;
const H = 640;
const preview = (p) => p.locator("main .k-preview").first();
const wait = (p, ms) => p.waitForTimeout(ms);

/** Each clip: page path + a script of interactions inside the fullscreen preview. */
const clips = [
  { name: "text-split-reveal", path: "/components/text/text-split-reveal", run: async (p) => { await wait(p, 2600); } },
  { name: "like-burst", path: "/components/buttons/like-burst", run: async (p) => {
      const heart = preview(p).getByRole("button", { name: /like/i });
      for (let i = 0; i < 3; i++) { await heart.click(); await wait(p, 900); await heart.click(); await wait(p, 500); }
    } },
  { name: "dynamic-island", path: "/components/layout/dynamic-island", run: async (p) => {
      for (const s of ["ring", "music", "timer", "idle", "music"]) { await preview(p).getByRole("button", { name: s }).click(); await wait(p, 1100); }
    } },
  { name: "toast-stack", path: "/components/overlays/toast-stack", run: async (p) => {
      const btn = preview(p).getByRole("button", { name: "Show toast" });
      for (let i = 0; i < 4; i++) { await btn.click(); await wait(p, 450); }
      const box = await preview(p).locator("ol").boundingBox();
      if (box) { await p.mouse.move(box.x + box.width / 2, box.y - 30, { steps: 8 }); await wait(p, 1400); await p.mouse.move(10, 300, { steps: 8 }); }
      await wait(p, 1000);
    } },
  { name: "button-stateful", path: "/components/buttons/button-stateful", run: async (p) => {
      await preview(p).getByRole("button", { name: "Save changes" }).click(); await wait(p, 2600);
      await preview(p).getByRole("button", { name: /Pay/ }).click(); await wait(p, 2600);
    } },
  { name: "otp-input", path: "/components/forms/otp-input", run: async (p) => {
      await preview(p).locator("input").click();
      await p.keyboard.type("123456", { delay: 140 }); await wait(p, 1300);
      await p.keyboard.type("424242", { delay: 140 }); await wait(p, 1400);
    } },
  { name: "expandable-card", path: "/components/layout/expandable-card", run: async (p) => {
      await preview(p).getByRole("button", { name: /Open/ }).nth(1).click(); await wait(p, 1600);
      await p.keyboard.press("Escape"); await wait(p, 1200);
    } },
  { name: "flow-paywall", path: "/flows/flow-paywall", run: async (p) => {
      for (const n of ["Monthly", "Lifetime", "Yearly"]) { await preview(p).getByRole("radio", { name: new RegExp(n) }).click(); await wait(p, 700); }
      await preview(p).getByRole("switch").click(); await wait(p, 700);
      await preview(p).getByRole("button", { name: /Subscribe|Start free trial/ }).click(); await wait(p, 1500);
    } },
  { name: "flow-habit-check-in", path: "/flows/flow-habit-check-in", run: async (p) => {
      for (const n of ["Drink water", "Move 30 min", "Read 10 pages", "In bed by 11"]) { await preview(p).getByRole("button", { name: n }).click(); await wait(p, 750); }
      await wait(p, 1200);
    } },
];

const browser = await chromium.launch();
for (const clip of clips) {
  const ctx = await browser.newContext({ viewport: { width: W, height: H }, recordVideo: { dir: tmp, size: { width: W, height: H } } });
  await ctx.addInitScript(() => localStorage.setItem("theme", "dark"));
  const page = await ctx.newPage();
  await page.goto(base + clip.path, { waitUntil: "load" });
  await page.getByRole("button", { name: "Toggle fullscreen" }).click();
  await page.getByRole("button", { name: "Replay" }).click();
  const started = Date.now();
  await wait(page, 300);
  await clip.run(page);
  const dur = (Date.now() - started) / 1000;
  const video = page.video();
  await ctx.close();
  const src = await video.path();
  const gif = path.join(out, `${clip.name}.gif`);
  // crop away the preview toolbar; take the last `dur` seconds (skip page load)
  const total = Number(execFileSync("ffprobe", ["-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", src]).toString().trim()) || dur;
  const ss = Math.max(0, total - dur);
  const filter = `crop=${W - 20}:${H - 70}:10:60,fps=18,scale=640:-1:flags=lanczos,split[a][b];[a]palettegen=max_colors=128:stats_mode=diff[p];[b][p]paletteuse=dither=bayer:bayer_scale=4`;
  execFileSync("ffmpeg", ["-y", "-loglevel", "error", "-ss", String(ss), "-i", src, "-vf", filter, "-loop", "0", gif]);
  fs.rmSync(src);
  console.log(`✓ ${clip.name}.gif (${dur.toFixed(1)}s, ${(fs.statSync(gif).size / 1024).toFixed(0)} KB)`);
}
await browser.close();
fs.rmSync(tmp, { recursive: true, force: true });
