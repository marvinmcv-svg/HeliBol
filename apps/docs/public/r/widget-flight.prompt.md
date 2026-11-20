You are given a task to integrate a component from the **kinetik** motion library into this codebase.

# Flight Tracker Widget (`widget-flight`)

Live flight widget: the plane glides along a curved route with offset-path, banking with the arc; the flown part of the route fills in and time remaining counts down.

## What it should do
Build a flight widget: a fixed-size box with an SVG quadratic arc (dashed track + solid flown path using pathLength = progress) and a plane element using CSS offset-path on the same path (identical px coordinates) with offset-rotate auto and offset-distance = progress; show codes, cities, times, time left and a progress bar.

## Project requirements
- React 19 + TypeScript, Tailwind CSS v4, shadcn/ui-style CSS variables (`background`, `foreground`, `muted`, `muted-foreground`, `border`, `card`, `primary`, `ring`). If the project lacks shadcn, set it up first (`npx shadcn@latest init`).
- Animation engine: **motion**.
- Install dependencies: `npm i motion lucide-react`
- Put the component at `components/kinetik/widget-flight.tsx`.
- `cn` lives at `lib/kinetik/utils.ts` (source below).
- Shared hooks go at `lib/kinetik/core.ts` (source below).

## Non-negotiables
- **Accessibility:** Grouped and labelled; progress is a real progressbar. Reduced motion: no simulated movement.
- **Performance:** offset-distance and pathLength on two elements.
- Respect `prefers-reduced-motion` (replace movement with opacity or an instant change).
- Animate only transform / opacity / filter / clip-path. No hard-coded theme colors — use CSS variables so it works in light and dark.

## Source — components/kinetik/widget-flight.tsx
```tsx
"use client";
import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { Plane } from "lucide-react";
import { cn, useReducedMotion } from "@/lib/kinetik/core";

export interface WidgetFlightProps {
  from: { code: string; city: string; time: string };
  to: { code: string; city: string; time: string };
  flight: string;
  /** 0–1 progress of the flight. Omit to simulate a live flight. */
  progress?: number;
  className?: string;
}

// px coordinates in a fixed 280×84 box so the SVG route and the CSS offset-path line up exactly
const ARC = "M14 76 Q 140 -8 266 76";

/**
 * Live flight widget: the plane glides along a curved route (offset-path), banking with the arc,
 * the flown part of the route fills in, a dotted contrail fades behind it, and time remaining
 * counts down. Pass `progress` from your data, or leave it to simulate.
 */
export function WidgetFlight({ from, to, flight, progress, className }: WidgetFlightProps) {
  const reduced = useReducedMotion();
  const [sim, setSim] = useState(0.18);
  useEffect(() => {
    if (progress !== undefined || reduced) return;
    const id = setInterval(() => setSim((p) => (p >= 0.98 ? 0.05 : p + 0.004)), 120);
    return () => clearInterval(id);
  }, [progress, reduced]);
  const p = progress ?? sim;
  const total = 165; // minutes
  const left = Math.round(total * (1 - p));
  return (
    <div className={cn("w-80 rounded-3xl bg-gradient-to-br from-sky-500 to-indigo-600 p-5 text-white shadow-2xl", className)} role="group" aria-label={`Flight ${flight} from ${from.city} to ${to.city}`}>
      <div className="flex items-center justify-between text-xs">
        <span className="rounded-full bg-white/20 px-2 py-0.5 font-semibold">{flight}</span>
        <span className="text-white/80">In flight · <span className="tabular-nums">{Math.floor(left / 60)}h {String(left % 60).padStart(2, "0")}m</span> left</span>
      </div>
      <div className="relative mx-auto mt-3 h-[84px] w-[280px]">
        <svg width="280" height="84" viewBox="0 0 280 84" className="absolute inset-0 overflow-visible" aria-hidden>
          <path d={ARC} fill="none" stroke="rgb(255 255 255 / .3)" strokeWidth="2" strokeDasharray="2 6" strokeLinecap="round" />
          <motion.path d={ARC} fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" initial={false} animate={{ pathLength: p }} transition={{ duration: reduced ? 0 : 0.4 }} />
          <circle cx="14" cy="76" r="4" fill="white" />
          <circle cx="266" cy="76" r="4" fill="none" stroke="white" strokeWidth="2" />
        </svg>
        <motion.span
          aria-hidden
          className="absolute left-0 top-0 grid place-items-center rounded-full bg-white text-indigo-600 shadow-lg"
          style={{ offsetPath: `path("${ARC}")`, offsetRotate: "auto 45deg", width: 28, height: 28 }}
          initial={false}
          animate={{ offsetDistance: `${p * 100}%` }}
          transition={{ duration: reduced ? 0 : 0.4, ease: "linear" }}
        >
          <Plane className="size-4 fill-current" />
        </motion.span>
      </div>
      <div className="mt-1 flex justify-between">
        <div><p className="text-3xl font-bold tracking-tight">{from.code}</p><p className="text-xs text-white/75">{from.city} · {from.time}</p></div>
        <div className="text-right"><p className="text-3xl font-bold tracking-tight">{to.code}</p><p className="text-xs text-white/75">{to.city} · {to.time}</p></div>
      </div>
      <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-white/20" role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(p * 100)} aria-label="Flight progress">
        <motion.div className="h-full rounded-full bg-white" initial={false} animate={{ width: `${p * 100}%` }} />
      </div>
    </div>
  );
}
```

## Usage example
```tsx
"use client";
import { DemoCenter } from "@/components/kinetik/demo-helpers" /* or inline */;
import { WidgetFlight } from "@/components/kinetik/widget-flight";

export default function Demo() {
  return (
    <DemoCenter>
      <WidgetFlight flight="KN 207" from={{ code: "LIS", city: "Lisbon", time: "09:40" }} to={{ code: "CPH", city: "Copenhagen", time: "14:25" }} />
    </DemoCenter>
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
