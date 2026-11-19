You are given a task to integrate a component from the **kinetik** motion library into this codebase.

# Scrubbable Area Chart (`chart-area-scrub`)

Stock-app area chart: the line draws in when visible, the gradient fill fades up, and scrubbing snaps a crosshair to the nearest point while the headline value rolls and the delta updates.

## What it should do
Build a scrubbable area chart in SVG + Motion: build a smooth cubic path through the points and an area path; draw the line with pathLength when in view; on pointer move pick the nearest x, clip a bright copy of the line to that x (dimming the rest), show a dashed crosshair and dot, and roll the big number via AnimatePresence.

## Project requirements
- React 19 + TypeScript, Tailwind CSS v4, shadcn/ui-style CSS variables (`background`, `foreground`, `muted`, `muted-foreground`, `border`, `card`, `primary`, `ring`). If the project lacks shadcn, set it up first (`npx shadcn@latest init`).
- Animation engine: **motion**.
- Install dependencies: `npm i motion`
- Put the component at `components/kinetik/chart-area-scrub.tsx`.
- `cn` lives at `lib/kinetik/utils.ts` (source below).
- Shared hooks go at `lib/kinetik/core.ts` (source below).

## Non-negotiables
- **Accessibility:** The plot is a keyboard slider (arrow keys) with value text; values are real text. Reduced motion: no draw-in or rolling.
- **Performance:** Precomputed smooth path; one clip rect animates on scrub.
- Respect `prefers-reduced-motion` (replace movement with opacity or an instant change).
- Animate only transform / opacity / filter / clip-path. No hard-coded theme colors — use CSS variables so it works in light and dark.

## Source — components/kinetik/chart-area-scrub.tsx
```tsx
"use client";
import { useId, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion, useInView } from "motion/react";
import { cn, useReducedMotion } from "@/lib/kinetik/core";

export interface ChartAreaScrubProps {
  data: { label: string; value: number }[];
  /** Format for the value readout. */
  format?: (v: number) => string;
  color?: string;
  title?: string;
  className?: string;
}

const W = 600, H = 220, PAD = 8;

/** Smooth path through points (monotone-ish cubic using midpoints). */
function smooth(pts: [number, number][]) {
  return pts.reduce((d, [x, y], i) => {
    if (i === 0) return `M${x},${y}`;
    const [px, py] = pts[i - 1];
    const cx = (px + x) / 2;
    return `${d} C${cx},${py} ${cx},${y} ${x},${y}`;
  }, "");
}

/**
 * Stock-app area chart: the line draws in when it scrolls into view and the gradient fill fades up;
 * scrubbing (pointer or arrow keys) snaps a crosshair to the nearest point, the headline number
 * rolls to that value, the delta vs. the first point updates, and everything right of the cursor
 * dims.
 */
export function ChartAreaScrub({ data, format = (v) => v.toLocaleString(), color = "#22c55e", title = "Revenue", className }: ChartAreaScrubProps) {
  const reduced = useReducedMotion();
  const id = useId().replace(/:/g, "");
  const ref = useRef<HTMLDivElement>(null);
  const seen = useInView(ref, { once: true, amount: 0.3 });
  const [hover, setHover] = useState<number | null>(null);
  const { pts, line, area } = useMemo(() => {
    const vs = data.map((d) => d.value);
    const min = Math.min(...vs), max = Math.max(...vs);
    const pts = data.map((d, i) => [PAD + (i / (data.length - 1)) * (W - PAD * 2), PAD + (1 - (d.value - min) / (max - min || 1)) * (H - PAD * 2 - 20)] as [number, number]);
    const line = smooth(pts);
    return { pts, line, area: `${line} L${pts.at(-1)![0]},${H} L${pts[0][0]},${H} Z` };
  }, [data]);
  const idx = hover ?? data.length - 1;
  const cur = data[idx];
  const delta = ((cur.value - data[0].value) / data[0].value) * 100;
  const up = delta >= 0;
  const pick = (clientX: number) => {
    const r = ref.current!.querySelector("svg")!.getBoundingClientRect();
    const x = ((clientX - r.left) / r.width) * W;
    let best = 0;
    pts.forEach(([px], i) => Math.abs(px - x) < Math.abs(pts[best][0] - x) && (best = i));
    setHover(best);
  };

  return (
    <div ref={ref} className={cn("w-full rounded-3xl border border-border bg-card p-5", className)}>
      <p className="text-sm text-muted-foreground">{title}</p>
      <div className="mt-1 flex items-baseline gap-3">
        <div className="relative h-9 overflow-hidden">
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.p key={idx} initial={reduced ? false : { y: 16, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={reduced ? undefined : { y: -16, opacity: 0 }} transition={{ duration: 0.18 }} className="text-3xl font-semibold tabular-nums tracking-tight">
              {format(cur.value)}
            </motion.p>
          </AnimatePresence>
        </div>
        <span className={cn("text-sm font-medium tabular-nums", up ? "text-emerald-500" : "text-rose-500")}>{up ? "▲" : "▼"} {Math.abs(delta).toFixed(1)}%</span>
        <span className="ml-auto text-xs text-muted-foreground">{cur.label}</span>
      </div>
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="mt-3 w-full touch-none overflow-visible outline-none focus-visible:ring-2 focus-visible:ring-ring"
        role="slider"
        tabIndex={0}
        aria-label={`${title} by period`}
        aria-valuemin={0}
        aria-valuemax={data.length - 1}
        aria-valuenow={idx}
        aria-valuetext={`${cur.label}: ${format(cur.value)}`}
        onPointerMove={(e) => pick(e.clientX)}
        onPointerDown={(e) => pick(e.clientX)}
        onPointerLeave={() => setHover(null)}
        onKeyDown={(e) => {
          if (e.key === "ArrowLeft") setHover(Math.max(0, idx - 1));
          if (e.key === "ArrowRight") setHover(Math.min(data.length - 1, idx + 1));
        }}
      >
        <defs>
          <linearGradient id={`${id}-f`} x1="0" x2="0" y1="0" y2="1"><stop offset="0" stopColor={color} stopOpacity=".35" /><stop offset="1" stopColor={color} stopOpacity="0" /></linearGradient>
          <clipPath id={`${id}-c`}><motion.rect x="0" y="-20" height={H + 40} animate={{ width: hover === null ? W : pts[idx][0] }} transition={{ type: "spring", stiffness: 500, damping: 40 }} /></clipPath>
        </defs>
        <motion.path d={area} fill={`url(#${id}-f)`} initial={reduced ? false : { opacity: 0 }} animate={{ opacity: seen || reduced ? 1 : 0 }} transition={{ duration: 0.8, delay: 0.6 }} />
        <path d={line} fill="none" stroke={color} strokeOpacity=".25" strokeWidth="2.5" />
        <motion.path d={line} fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" clipPath={`url(#${id}-c)`} initial={reduced ? false : { pathLength: 0 }} animate={{ pathLength: seen || reduced ? 1 : 0 }} transition={{ duration: 1.2, ease: [0.65, 0, 0.35, 1] }} />
        {hover !== null && (
          <g>
            <line x1={pts[idx][0]} x2={pts[idx][0]} y1="0" y2={H} stroke="currentColor" strokeOpacity=".25" strokeDasharray="3 4" />
            <motion.circle initial={false} animate={{ cx: pts[idx][0], cy: pts[idx][1] }} transition={{ type: "spring", stiffness: 500, damping: 40 }} r="6" fill={color} stroke="var(--color-card, #fff)" strokeWidth="3" />
          </g>
        )}
      </svg>
    </div>
  );
}
```

## Usage example
```tsx
"use client";
import { ChartAreaScrub } from "@/components/kinetik/chart-area-scrub";

const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const values = [42, 48, 45, 53, 61, 58, 67, 73, 70, 82, 91, 104];

export default function Demo() {
  return (
    <div className="grid h-full place-items-center p-6">
      <ChartAreaScrub className="max-w-lg" data={months.map((label, i) => ({ label: `${label} 2026`, value: values[i] * 1000 }))} format={(v) => `$${(v / 1000).toFixed(0)}k`} title="Monthly recurring revenue" />
    </div>
  );
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
