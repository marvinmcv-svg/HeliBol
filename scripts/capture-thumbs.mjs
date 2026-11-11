#!/usr/bin/env node
/**
 * Gallery thumbnails captured with REA (https://github.com/morluto/rea).
 *
 * 1. Launches headless Chromium with a CDP endpoint.
 * 2. For every registry item, opens /thumb/<id> (chrome-less demo) at 800×500, dark theme.
 * 3. Calls `rea capture-web-screenshot <cdp> <target> --allowed-origins <origin>` and decodes the
 *    PNG artifact from REA's Evidence, then converts it to an 800×500 WebP with ffmpeg.
 * 4. Writes apps/docs/public/thumbs/<id>.webp and a manifest with each REA evidence_id + sha256.
 *
 * Usage (docs app running on :3100):
 *   REA_BIN="npx rea" node scripts/capture-thumbs.mjs [baseUrl] [--only id,id] [--missing]
 * Env: CHROME (browser binary), REA_BIN (default "npx -y rea-agents@latest"), CONCURRENCY (default 3).
 */
import fs from "node:fs";
import path from "node:path";
import { spawn, execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const args = process.argv.slice(2);
const base = args.find((a) => a.startsWith("http")) ?? "http://localhost:3100";
const origin = new URL(base).origin;
const only = args.includes("--only") ? args[args.indexOf("--only") + 1].split(",") : null;
const missingOnly = args.includes("--missing");
const out = path.join(root, "apps/docs/public/thumbs");
fs.mkdirSync(out, { recursive: true });
const manifestPath = path.join(out, "manifest.json");
const manifest = fs.existsSync(manifestPath) ? JSON.parse(fs.readFileSync(manifestPath, "utf8")) : {};
const REA = (process.env.REA_BIN ?? "npx -y rea-agents@latest").split(" ");
const CHROME = process.env.CHROME ?? "/opt/pw-browsers/chromium-1243/chrome-linux64/chrome";
const PORT = 9333;
const CDP = `http://127.0.0.1:${PORT}`;
const W = 800;
const H = 500;

const registry = JSON.parse(fs.readFileSync(path.join(root, "apps/docs/registry.json"), "utf8"));
let ids = registry.items.filter((i) => i.name !== "kinetik-core").map((i) => i.name);
if (only) ids = ids.filter((id) => only.includes(id));
if (missingOnly) ids = ids.filter((id) => !fs.existsSync(path.join(out, `${id}.webp`)));

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const run = (cmd, argv) =>
  new Promise((resolve) => {
    const p = spawn(cmd, argv, { stdio: ["ignore", "pipe", "pipe"] });
    const chunks = [];
    p.stdout.on("data", (c) => chunks.push(c));
    p.stderr.on("data", () => {});
    p.on("close", (code) => resolve({ code, stdout: Buffer.concat(chunks).toString() }));
  });

/** Minimal CDP session over the target's WebSocket (Node 22 has a global WebSocket). */
async function cdpSession(wsUrl) {
  const ws = new WebSocket(wsUrl);
  await new Promise((res, rej) => ((ws.onopen = res), (ws.onerror = rej)));
  let id = 0;
  const pending = new Map();
  ws.onmessage = (m) => {
    const msg = JSON.parse(m.data);
    if (msg.id && pending.has(msg.id)) {
      pending.get(msg.id)(msg);
      pending.delete(msg.id);
    }
  };
  const send = (method, params = {}) =>
    new Promise((res) => {
      const i = ++id;
      pending.set(i, res);
      ws.send(JSON.stringify({ id: i, method, params }));
    });
  return { send, close: () => ws.close() };
}

async function captureOne(id) {
  const target = await (await fetch(`${CDP}/json/new?about:blank`, { method: "PUT" })).json();
  const s = await cdpSession(target.webSocketDebuggerUrl);
  try {
    await s.send("Emulation.setDeviceMetricsOverride", { width: W, height: H, deviceScaleFactor: 1, mobile: false });
    await s.send("Page.enable");
    // background tabs get throttled rAF — keep every capture tab "focused" so tickers run
    await s.send("Emulation.setFocusEmulationEnabled", { enabled: true });
    await s.send("Page.bringToFront");
    await s.send("Page.addScriptToEvaluateOnNewDocument", { source: "try{localStorage.setItem('theme','dark')}catch(e){}" });
    await s.send("Page.navigate", { url: `${base}/thumb/${id}` });
    for (let t = 0; t < 40; t++) {
      await sleep(250);
      const r = await s.send("Runtime.evaluate", { expression: "!!document.querySelector('[data-thumb-ready]')", returnByValue: true });
      if (r.result?.result?.value) break;
    }
    await sleep(400);
    const { code, stdout } = await run(REA[0], [...REA.slice(1), "capture-web-screenshot", CDP, target.id, "--allowed-origins", origin, "--format", "json"]);
    if (code !== 0) throw new Error(`REA exited ${code}: ${stdout.slice(0, 300)}`);
    const ev = JSON.parse(stdout);
    const art = ev.normalized_result.artifact;
    const png = path.join(out, `${id}.png`);
    fs.writeFileSync(png, Buffer.from(art.data_base64, "base64"));
    execFileSync("ffmpeg", ["-y", "-loglevel", "error", "-i", png, "-vf", "scale=800:-1:flags=lanczos", "-quality", "80", path.join(out, `${id}.webp`)]);
    fs.rmSync(png);
    manifest[id] = { evidence_id: ev.evidence_id, png_sha256: art.sha256, viewport: ev.normalized_result.viewport, captured_at: ev.normalized_result.captured_at, provider: ev.provider?.id };
    return true;
  } finally {
    s.close();
    await fetch(`${CDP}/json/close/${target.id}`).catch(() => {});
  }
}

const chrome = spawn(CHROME, ["--headless=new", "--no-sandbox", `--remote-debugging-port=${PORT}`, "--hide-scrollbars", "--use-gl=swiftshader", "--enable-unsafe-swiftshader", "--mute-audio", "--disable-background-timer-throttling", "--disable-renderer-backgrounding", "--disable-backgrounding-occluded-windows", "about:blank"], { stdio: "ignore" });
for (let i = 0; i < 50; i++) {
  try {
    await fetch(`${CDP}/json/version`);
    break;
  } catch {
    await sleep(200);
  }
}

const queue = [...ids];
let done = 0;
const failed = [];
await Promise.all(
  Array.from({ length: Number(process.env.CONCURRENCY ?? 3) }, async () => {
    while (queue.length) {
      const id = queue.shift();
      try {
        // REA refuses captures whose viewport changed mid-shot (e.g. a demo still resizing) — retry.
        for (let attempt = 1; ; attempt++) {
          try {
            await captureOne(id);
            break;
          } catch (e) {
            if (attempt >= 3) throw e;
            await sleep(800);
          }
        }
        done++;
        process.stdout.write(`\r${done}/${ids.length} ${id.padEnd(40)}`);
      } catch (e) {
        failed.push(id);
        console.error(`\n✗ ${id}: ${e.message}`);
      }
    }
  }),
);
fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));
chrome.kill();
console.log(`\nREA thumbnails: ${done} captured, ${failed.length} failed${failed.length ? ` (${failed.join(", ")})` : ""}`);
