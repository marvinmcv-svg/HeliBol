// Site audit: screenshots + JS/transfer weight, overflow, console errors, unlabelled buttons, OG tags.
// Usage: (cd apps/docs && npx next build && npx next start -p 3100) then
//        node scripts/audit-site.mjs http://localhost:3100 ./audit-out
import { createRequire } from "node:module";
const { chromium } = createRequire(import.meta.url)("playwright");
import fs from "node:fs";

const base = process.argv[2] ?? "http://localhost:3100";
const out = process.argv[3];
fs.mkdirSync(out, { recursive: true });
const pages = [
  ["home", "/"],
  ["components", "/components"],
  ["category-heroes", "/components/heroes"],
  ["component-coin", "/components/3d/three-coin"],
  ["component-button", "/components/buttons/button-magnetic"],
  ["blocks", "/blocks"],
  ["block-detail", "/blocks/hero-liquid-glass"],
  ["flows", "/flows"],
  ["flow-detail", "/flows/flow-paywall"],
  ["playground", "/playground"],
  ["docs", "/docs"],
  ["404", "/nope"],
  ["templates", "/templates"],
  ["template-detail", "/blocks/template-saas"],
  ["saved", "/saved"],
  ["changelog", "/changelog"],
  ["new-component", "/components/layout/kanban-board"],
];
const viewports = { desktop: { width: 1440, height: 900 }, mobile: { width: 390, height: 844 } };
const browser = await chromium.launch();
const report = [];
for (const [vpName, vp] of Object.entries(viewports)) {
  for (const [name, path] of pages) {
    if (vpName === "mobile" && !["home", "components", "component-coin", "flow-detail", "blocks", "templates"].includes(name)) continue;
    const ctx = await browser.newContext({ viewport: vp, deviceScaleFactor: 1, colorScheme: "dark" });
    const page = await ctx.newPage();
    const errors = [];
    let bytes = 0, js = 0, reqs = 0;
    page.on("console", (m) => m.type() === "error" && errors.push(m.text().slice(0, 160)));
    page.on("pageerror", (e) => errors.push(("pageerror: " + e.message).slice(0, 160)));
    page.on("response", async (r) => {
      reqs++;
      try {
        const len = Number(r.headers()["content-length"] ?? 0) || (await r.body()).length;
        bytes += len;
        if (r.url().endsWith(".js") || (r.headers()["content-type"] ?? "").includes("javascript")) js += len;
      } catch {}
    });
    const t0 = Date.now();
    await page.goto(base + path, { waitUntil: "load", timeout: 60000 }).catch((e) => errors.push("goto: " + e.message));
    const loadMs = Date.now() - t0;
    await page.waitForTimeout(2500);
    const m = await page.evaluate(() => ({
      overflowX: document.documentElement.scrollWidth > window.innerWidth + 1,
      height: document.documentElement.scrollHeight,
      h1: [...document.querySelectorAll("h1")].map((h) => h.textContent?.trim().slice(0, 80)),
      imgsNoAlt: [...document.querySelectorAll("img:not([alt])")].length,
      buttonsNoName: [...document.querySelectorAll("button")].filter((b) => !(b.textContent?.trim() || b.getAttribute("aria-label") || b.getAttribute("aria-labelledby") || b.title)).length,
      links: document.querySelectorAll("a").length,
      canvases: document.querySelectorAll("canvas").length,
      title: document.title,
      metaDesc: document.querySelector('meta[name="description"]')?.getAttribute("content")?.slice(0, 80) ?? null,
      ogImage: document.querySelector('meta[property="og:image"]')?.getAttribute("content") ?? null,
    }));
    await page.screenshot({ path: `${out}/${vpName}-${name}.jpg`, fullPage: true, quality: 60, type: "jpeg" }).catch(() => {});
    await page.screenshot({ path: `${out}/${vpName}-${name}-fold.jpg`, quality: 70, type: "jpeg" }).catch(() => {});
    report.push({ vp: vpName, name, path, loadMs, reqs, kb: Math.round(bytes / 1024), jsKb: Math.round(js / 1024), errors: errors.slice(0, 5), ...m });
    await ctx.close();
  }
}
await browser.close();
fs.writeFileSync(`${out}/report.json`, JSON.stringify(report, null, 2));
for (const r of report) console.log(`${r.vp.padEnd(7)} ${r.name.padEnd(18)} load ${String(r.loadMs).padStart(5)}ms req ${String(r.reqs).padStart(4)} ${String(r.kb).padStart(6)}KB js ${String(r.jsKb).padStart(5)}KB ovf ${r.overflowX} h ${r.height} err ${r.errors.length} noalt ${r.imgsNoAlt} noname ${r.buttonsNoName} og ${!!r.ogImage}`);
