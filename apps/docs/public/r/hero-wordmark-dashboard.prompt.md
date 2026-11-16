You are given a task to integrate a component from the **kinetik** motion library into this codebase.

# Hero — Wordmark + Dashboard (`hero-wordmark-dashboard`)

Product-launch hero: a giant condensed wordmark drops in letter by letter, then a violet stage rises with a condensed tagline and a full store-admin mock whose chart draws itself.

## What it should do
Recreate a product-launch hero: dark #140b26 top with a giant condensed wordmark (Anton, ~12.5vw, scaleX .72) whose letters drop in with back-out; then a violet gradient stage (with a soft diagonal shine) holding a condensed Oswald 300 tagline, small subtitle, frosted 'Learn more ↗' pill and an 85%-wide store-admin mock: dark top bar with search, sidebar nav, date/channel chips, a KPI row and a line chart drawn with stroke-dashoffset under a pulsing play button, then task chips.

## Project requirements
- React 19 + TypeScript, Tailwind CSS v4, shadcn/ui-style CSS variables (`background`, `foreground`, `muted`, `muted-foreground`, `border`, `card`, `primary`, `ring`). If the project lacks shadcn, set it up first (`npx shadcn@latest init`).
- Animation engine: **css**.
- No runtime dependencies (CSS only).
- Put the component at `components/kinetik/hero-wordmark-dashboard.tsx`.
- `cn` lives at `lib/kinetik/utils.ts` (source below).
- Shared hooks go at `lib/kinetik/core.ts` (source below).

## Non-negotiables
- **Accessibility:** h1 has aria-label with the full word, letters aria-hidden; mock dashboard is aria-hidden; reduced motion shows the final state.
- **Performance:** Per-letter CSS transforms and one SVG line draw.
- Respect `prefers-reduced-motion` (replace movement with opacity or an instant change).
- Animate only transform / opacity / filter / clip-path. No hard-coded theme colors — use CSS variables so it works in light and dark.

## Source — components/kinetik/hero-wordmark-dashboard.tsx
```tsx
"use client";
import { cn } from "@/lib/kinetik/core";

const FONT = "https://fonts.googleapis.com/css2?family=Anton&family=Oswald:wght@300;400&display=swap";
const css = `
.k-hwd .ch{display:inline-block;animation:k-hwd-drop .9s cubic-bezier(.34,1.56,.64,1) both;animation-delay:calc(var(--i)*60ms)}
@keyframes k-hwd-drop{from{opacity:0;transform:translateY(-50%) scaleY(1.3)}}
.k-hwd .panel{animation:k-hwd-panel 1.1s cubic-bezier(.16,1,.3,1) .45s both}
@keyframes k-hwd-panel{from{opacity:0;transform:translateY(70px)}}
.k-hwd .shine{background:linear-gradient(115deg,transparent 30%,#ffffff22 45%,transparent 60%) 0 0/250% 100%;animation:k-hwd-shine 6s ease-in-out infinite}
@keyframes k-hwd-shine{to{background-position:-150% 0}}
.k-hwd .line{stroke-dasharray:900;stroke-dashoffset:900;animation:k-hwd-line 2.4s ease-out 1.2s forwards}
@keyframes k-hwd-line{to{stroke-dashoffset:0}}
.k-hwd .play{animation:k-hwd-ping 2.4s ease-out infinite 2s}
@keyframes k-hwd-ping{0%{box-shadow:0 0 0 0 #fff8}100%{box-shadow:0 0 0 22px #fff0}}
@media (prefers-reduced-motion:reduce){.k-hwd *{animation:none!important;stroke-dashoffset:0!important}}
[data-reduce-motion] .k-hwd *{animation:none!important;stroke-dashoffset:0!important}`;

const side = ["Home", "Orders", "Products", "Customers", "Marketing", "Discounts", "Content", "Markets", "Finance", "Analytics"];

/** Product-launch hero: a giant condensed wordmark drops in letter by letter, then a violet stage rises with a condensed tagline and a full store-admin mock whose chart draws itself. */
export function HeroWordmarkDashboard({ word = "COPILOT", tagline = "A smarter, more powerful Copilot", className }: { word?: string; tagline?: string; className?: string }) {
  return (
    <section className={cn("k-hwd flex flex-col overflow-hidden bg-[#140b26] pt-[3.5%] text-white", className)}>
      <link rel="stylesheet" href={FONT} precedence="kinetik-font" />
      <style href="k-hwd" precedence="kinetik">{css}</style>
      <h1 aria-label={word} className="text-center text-[clamp(4rem,12.5vw,12rem)] leading-[.9] tracking-[-.02em] [transform:scaleX(.72)]" style={{ fontFamily: "Anton,Impact,sans-serif" }}>
        {[...word].map((c, i) => <span key={i} aria-hidden className="ch" style={{ ["--i" as string]: i }}>{c}</span>)}
      </h1>
      <div className="panel relative mx-[0.6%] mt-[3.5%] flex-1 overflow-hidden rounded-t-sm bg-[linear-gradient(180deg,#8f5cff,#7647f5_40%,#6a3ff0)] px-[7%] pt-[3%] text-center">
        <div aria-hidden className="shine absolute inset-0" />
        <p className="relative text-[clamp(1.6rem,3.8vw,3.5rem)] leading-none tracking-[-.03em] [transform:scaleX(.82)]" style={{ fontFamily: "Oswald,sans-serif", fontWeight: 300 }}>{tagline}</p>
        <p className="relative mx-auto mt-3 max-w-xl text-[clamp(.75rem,1.1vw,1rem)] text-white/80">Copilot now uses multi-step reasoning and goes deeper to provide data-driven strategies based on an analysis of your business.</p>
        <a href="#" className="relative mt-4 inline-block rounded-full bg-white/20 px-3 py-1 text-[12px] backdrop-blur">Learn more ↗</a>
        <div aria-hidden className="relative mx-auto mt-[4.5%] w-[85%] max-w-none overflow-hidden rounded-t-xl bg-[#f1f1f1] text-left text-[11px] text-zinc-800 shadow-2xl">
          <div className="flex items-center justify-between bg-[#1a1a1a] px-3 py-2 text-white"><span className="font-bold">◧ storefront</span><span className="w-1/3 rounded-md bg-[#303030] px-3 py-1 text-white/50">⌕ Search</span><span className="flex items-center gap-3"><span>◫</span><span>🔔</span><span className="rounded bg-[#ffd76a] px-1 text-black">VI</span> Villa</span></div>
          <div className="flex">
            <ul className="w-44 shrink-0 space-y-1 p-3">{side.map((s, i) => <li key={s} className={cn("rounded-md px-2 py-0.5", i === 0 && "bg-white font-semibold")}>▪ {s}{i === 1 && <span className="float-right rounded bg-zinc-200 px-1">15</span>}</li>)}<li className="pt-3 text-zinc-500">Sales channels</li><li className="px-2">▪ Online store</li><li className="px-2">▪ Point of Sale</li></ul>
            <div className="flex-1 p-4">
              <div className="flex gap-2"><span className="rounded-md border border-zinc-300 bg-white px-2 py-1">▣ Today</span><span className="rounded-md border border-zinc-300 bg-white px-2 py-1">All channels ⌄</span><span className="rounded-md border border-zinc-300 bg-white px-2 py-1"><span className="text-emerald-600">●</span> 124 live visitors</span><span className="ml-auto rounded-md border border-zinc-300 bg-white px-2 py-1">Next payout: $23,456.24</span></div>
              <div className="relative mt-3 rounded-xl bg-white p-3 shadow-sm">
                <div className="grid grid-cols-4 gap-2">{[["Online store sessions", "195,567", "↑ 1%"], ["Total sales", "$189,657.98", "↑ 2%"], ["Total orders", "2,978", "↑ 10%"], ["Conversion rate", "3.65%", "↑ 5%"]].map(([k, v, d], i) => <div key={k} className={cn("rounded-lg p-2", i === 0 && "bg-zinc-100")}><p className="text-zinc-500 underline decoration-dotted">{k}</p><p className="text-sm font-semibold">{v} <span className="text-[10px] font-normal text-emerald-600">{d}</span></p></div>)}</div>
                <div className="mt-1 flex text-[9px] text-zinc-400"><span className="w-6">12K</span></div><svg viewBox="0 0 600 120" className="h-40 w-full"><path d="M0 70 C 40 20, 60 110, 100 70 S 160 10, 200 60 S 260 120, 300 60 S 360 0, 400 50 S 460 110, 500 50 S 560 20, 600 60" fill="none" stroke="#d4d4d8" strokeWidth="2" /><path className="line" d="M0 50 C 30 10, 70 90, 110 40 S 170 100, 210 30 S 280 110, 320 60 S 380 20, 420 80 S 480 10, 520 50 S 570 90, 600 40" fill="none" stroke="#4fb6e8" strokeWidth="2.5" /></svg>
                <span className="play absolute top-1/2 left-1/2 grid size-14 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-zinc-700/85 text-xl text-white">▶</span>
              </div>
              <div className="mt-3 grid grid-cols-3 gap-2">{["▣ 5 orders to fulfill", "⇄ 50+ payments to capture", "▤ 8 return requests"].map((t) => <span key={t} className="rounded-md border border-zinc-300 bg-white px-2 py-1">{t}</span>)}</div>
              <p className="mt-3 text-center text-zinc-500">◎ All caught up</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
```

## Usage example
```tsx
"use client";
import { HeroWordmarkDashboard } from "@/components/kinetik/hero-wordmark-dashboard";
export default function Demo() {
  return <HeroWordmarkDashboard className="h-full" />;
}
```

## lib/kinetik/utils.ts
```ts
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/** Server-safe class merger (same as shadcn's `cn`). */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

## lib/kinetik/core.ts
```ts
"use client";
import { useEffect, useRef, useState, useSyncExternalStore, type RefObject } from "react";

export { cn } from "./utils";

const REDUCE_QUERY = "(prefers-reduced-motion: reduce)";
const ATTR = "data-reduce-motion";

function subscribeReduced(cb: () => void) {
  if (typeof window === "undefined") return () => {};
  const mq = window.matchMedia(REDUCE_QUERY);
  mq.addEventListener("change", cb);
  // Docs (or an app setting) can force reduced motion with <html data-reduce-motion>.
  const mo = new MutationObserver(cb);
  mo.observe(document.documentElement, { attributes: true, attributeFilter: [ATTR] });
  return () => {
    mq.removeEventListener("change", cb);
    mo.disconnect();
  };
}

function getReduced() {
  if (typeof window === "undefined") return false;
  return window.matchMedia(REDUCE_QUERY).matches || document.documentElement.hasAttribute(ATTR);
}

/**
 * True when the user prefers reduced motion (OS setting) or the app forced it via
 * `<html data-reduce-motion>`. Components must swap movement for opacity / instant changes.
 */
export function useReducedMotion(): boolean {
  return useSyncExternalStore(subscribeReduced, getReduced, () => false);
}

/** Non-hook check for imperative code (GSAP timelines, canvas loops). */
export const prefersReducedMotion = getReduced;

/** Becomes true the first time `ref` enters the viewport (or every time when once=false). */
export function useInView<T extends Element>(
  ref: RefObject<T | null>,
  { once = true, amount = 0.2, rootMargin = "0px", root }: { once?: boolean; amount?: number; rootMargin?: string; root?: RefObject<Element | null> } = {},
) {
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") {
      setInView(true);
      return;
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          if (once) io.disconnect();
        } else if (!once) setInView(false);
      },
      { threshold: amount, rootMargin, root: root?.current ?? null },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [ref, once, amount, rootMargin, root]);
  return inView;
}

/** Coarse-pointer / touch device — pointer effects should switch off. */
export function usePrefersTouch(): boolean {
  return useSyncExternalStore(
    (cb) => {
      if (typeof window === "undefined") return () => {};
      const mq = window.matchMedia("(hover: none), (pointer: coarse)");
      mq.addEventListener("change", cb);
      return () => mq.removeEventListener("change", cb);
    },
    () => typeof window !== "undefined" && window.matchMedia("(hover: none), (pointer: coarse)").matches,
    () => false,
  );
}

/** False while the tab is hidden — pause loops. */
export function usePageVisible(): boolean {
  return useSyncExternalStore(
    (cb) => {
      document.addEventListener("visibilitychange", cb);
      return () => document.removeEventListener("visibilitychange", cb);
    },
    () => !document.hidden,
    () => true,
  );
}

/** Runs `cb` each animation frame while `active`; cleans up automatically. */
export function useRafLoop(cb: (t: number, dt: number) => void, active = true) {
  const saved = useRef(cb);
  saved.current = cb;
  useEffect(() => {
    if (!active) return;
    let id = 0;
    let last = performance.now();
    const tick = (t: number) => {
      saved.current(t, t - last);
      last = t;
      id = requestAnimationFrame(tick);
    };
    id = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(id);
  }, [active]);
}

/** Bumping this key remounts children — used by "Replay" in previews. */
export function useReplayKey() {
  const [key, setKey] = useState(0);
  return [key, () => setKey((k) => k + 1)] as const;
}

export interface CanvasFrame {
  ctx: CanvasRenderingContext2D;
  width: number;
  height: number;
  /** seconds since start */
  time: number;
  /** seconds since last frame */
  dt: number;
  /** pointer position in CSS px relative to the canvas, or null when outside */
  pointer: { x: number; y: number } | null;
}

/**
 * Canvas animation loop with the boring parts done: DPR-aware sizing (ResizeObserver), pausing while
 * off-screen or in a background tab, pointer tracking, and a single static frame under reduced motion.
 */
export function useCanvas(draw: (f: CanvasFrame) => void, { maxDpr = 2, interactive = true }: { maxDpr?: number; interactive?: boolean } = {}) {
  const ref = useRef<HTMLCanvasElement>(null);
  const saved = useRef(draw);
  saved.current = draw;
  const reduced = useReducedMotion();
  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    let w = 0;
    let h = 0;
    let visible = true;
    let raf = 0;
    let start = performance.now();
    let last = start;
    let pointer: CanvasFrame["pointer"] = null;
    const frame = (now: number) => {
      saved.current({ ctx, width: w, height: h, time: (now - start) / 1000, dt: Math.min(0.05, (now - last) / 1000), pointer });
      last = now;
    };
    const loop = (now: number) => {
      frame(now);
      raf = requestAnimationFrame(loop);
    };
    const play = () => {
      cancelAnimationFrame(raf);
      if (reduced) {
        frame(performance.now());
        return;
      }
      if (visible && !document.hidden) {
        last = performance.now();
        raf = requestAnimationFrame(loop);
      }
    };
    const ro = new ResizeObserver(() => {
      const dpr = Math.min(maxDpr, window.devicePixelRatio || 1);
      const r = canvas.getBoundingClientRect();
      w = r.width;
      h = r.height;
      canvas.width = Math.max(1, Math.round(w * dpr));
      canvas.height = Math.max(1, Math.round(h * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      if (reduced) frame(performance.now());
    });
    ro.observe(canvas);
    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      play();
    });
    io.observe(canvas);
    const onVis = () => play();
    document.addEventListener("visibilitychange", onVis);
    const host = canvas.parentElement ?? canvas;
    const move = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect();
      pointer = { x: e.clientX - r.left, y: e.clientY - r.top };
    };
    const leave = () => (pointer = null);
    if (interactive) {
      host.addEventListener("pointermove", move);
      host.addEventListener("pointerleave", leave);
    }
    start = performance.now();
    play();
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      document.removeEventListener("visibilitychange", onVis);
      host.removeEventListener("pointermove", move);
      host.removeEventListener("pointerleave", leave);
    };
  }, [reduced, maxDpr, interactive]);
  return ref;
}
```

## Steps
1. Install the dependencies above.
2. Create the files exactly as given, fixing import aliases if the project doesn't use `@/`.
3. Drop the usage example into a page and adapt copy/colors to the project's design system.
4. Verify: toggle "Reduce motion" in OS settings — the component must still be fully usable.
