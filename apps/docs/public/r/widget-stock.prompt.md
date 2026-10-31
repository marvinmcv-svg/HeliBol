You are given a task to integrate a component from the **kinetik** motion library into this codebase.

# Live Stock Ticker (`widget-stock`)

Ticker card with a streaming sparkline, a price that flashes green/red on each change, and a delta badge.

## What it should do
Build a live ticker card: keep a rolling 40-point series updated every 900ms; draw an area + polyline sparkline green or red by overall delta; the price text flashes a tinted background that fades out on each change; ▲/▼ percentage badge.

## Project requirements
- React 19 + TypeScript, Tailwind CSS v4, shadcn/ui-style CSS variables (`background`, `foreground`, `muted`, `muted-foreground`, `border`, `card`, `primary`, `ring`). If the project lacks shadcn, set it up first (`npx shadcn@latest init`).
- Animation engine: **js**.
- Install dependencies: `npm i motion`
- Put the component at `components/kinetik/widget-stock.tsx`.
- `cn` lives at `lib/kinetik/utils.ts` (source below).
- Shared hooks go at `lib/kinetik/core.ts` (source below).

## Non-negotiables
- **Accessibility:** Chart has role=img with a label; color is paired with ▲/▼ glyphs.
- **Performance:** 40-point series updated ~1×/s; polyline re-render.
- Respect `prefers-reduced-motion` (replace movement with opacity or an instant change).
- Animate only transform / opacity / filter / clip-path. No hard-coded theme colors — use CSS variables so it works in light and dark.

## Source — components/kinetik/widget-stock.tsx
```tsx
"use client";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { cn, useReducedMotion } from "@/lib/kinetik/core";

/** Live ticker card: a streaming sparkline, a price that flashes green/red on change, and an animated delta badge. */
export function WidgetStock({ symbol, name, start = 182.4, className }: { symbol: string; name: string; start?: number; className?: string }) {
  const [series, setSeries] = useState(() => Array.from({ length: 40 }, (_, i) => start + Math.sin(i / 4) * 2 + i * 0.05));
  const prev = useRef(start);
  const reduced = useReducedMotion();
  useEffect(() => {
    const t = setInterval(() => setSeries((s) => [...s.slice(1), +(s[s.length - 1] + (Math.random() - 0.47) * 1.4).toFixed(2)]), 900);
    return () => clearInterval(t);
  }, []);
  const price = series[series.length - 1];
  const up = price >= prev.current;
  useEffect(() => void (prev.current = price), [price]);
  const delta = ((price - series[0]) / series[0]) * 100;
  const min = Math.min(...series);
  const max = Math.max(...series);
  const pts = series.map((v, i) => `${(i / (series.length - 1)) * 200},${58 - ((v - min) / (max - min || 1)) * 54}`).join(" ");
  const pos = delta >= 0;
  return (
    <div className={cn("w-72 rounded-3xl border border-border bg-card p-4", className)}>
      <div className="flex items-start justify-between">
        <div><p className="font-semibold">{symbol}</p><p className="text-xs text-muted-foreground">{name}</p></div>
        <div className="text-right">
          <motion.p key={price} initial={reduced ? false : { backgroundColor: up ? "rgb(34 197 94 / .3)" : "rgb(239 68 68 / .3)" }} animate={{ backgroundColor: "rgb(0 0 0 / 0)" }} transition={{ duration: 0.8 }} className="rounded px-1 font-mono text-lg font-semibold tabular-nums" aria-live="off">${price.toFixed(2)}</motion.p>
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.span key={pos ? "u" : "d"} initial={{ y: 8, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className={cn("inline-block rounded-md px-1.5 text-xs font-medium", pos ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400" : "bg-red-500/15 text-red-600 dark:text-red-400")}>{pos ? "▲" : "▼"} {Math.abs(delta).toFixed(2)}%</motion.span>
          </AnimatePresence>
        </div>
      </div>
      <svg viewBox="0 0 200 60" className="mt-3 h-16 w-full" preserveAspectRatio="none" role="img" aria-label={`${symbol} price chart`}>
        <defs><linearGradient id={`k-stk-${symbol}`} x1="0" x2="0" y1="0" y2="1"><stop offset="0" stopColor={pos ? "#22c55e" : "#ef4444"} stopOpacity=".3" /><stop offset="1" stopColor={pos ? "#22c55e" : "#ef4444"} stopOpacity="0" /></linearGradient></defs>
        <polygon points={`0,60 ${pts} 200,60`} fill={`url(#k-stk-${symbol})`} />
        <polyline points={pts} fill="none" stroke={pos ? "#22c55e" : "#ef4444"} strokeWidth="2" vectorEffect="non-scaling-stroke" strokeLinejoin="round" />
      </svg>
    </div>
  );
}
```

## Usage example
```tsx
"use client";
import { WidgetStock } from "@/components/kinetik/widget-stock";
export default function Demo() {
  return <div className="flex h-full w-full flex-wrap items-center justify-center gap-4 p-6"><WidgetStock symbol="KNTK" name="Kinetik Labs" /><WidgetStock symbol="SPRG" name="Spring Dynamics" start={64.1} className="hidden sm:block" /></div>;
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
