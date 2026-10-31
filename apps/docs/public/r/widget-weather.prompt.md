You are given a task to integrate a component from the **kinetik** motion library into this codebase.

# Weather Widget (`widget-weather`)

Weather card whose sky gradient and scene (rotating sun rays, drifting clouds, rain, twinkling stars) crossfade per condition.

## What it should do
Build a weather widget: rounded card with a per-condition gradient crossfading via AnimatePresence; scenes: a slowly rotating sun with 12 rays, clouds drifting across, rain streaks falling with staggered durations, twinkling stars at night; temperature and H/L text on top.

## Project requirements
- React 19 + TypeScript, Tailwind CSS v4, shadcn/ui-style CSS variables (`background`, `foreground`, `muted`, `muted-foreground`, `border`, `card`, `primary`, `ring`). If the project lacks shadcn, set it up first (`npx shadcn@latest init`).
- Animation engine: **motion**.
- Install dependencies: `npm i motion`
- Put the component at `components/kinetik/widget-weather.tsx`.
- `cn` lives at `lib/kinetik/utils.ts` (source below).
- Shared hooks go at `lib/kinetik/core.ts` (source below).

## Non-negotiables
- **Accessibility:** role=group labelled with city, temperature and condition; scene is aria-hidden and frozen under reduced motion.
- **Performance:** A handful of transformed elements per scene.
- Respect `prefers-reduced-motion` (replace movement with opacity or an instant change).
- Animate only transform / opacity / filter / clip-path. No hard-coded theme colors — use CSS variables so it works in light and dark.

## Source — components/kinetik/widget-weather.tsx
```tsx
"use client";
import { AnimatePresence, motion } from "motion/react";
import { cn, useReducedMotion } from "@/lib/kinetik/core";

export type Weather = "sunny" | "cloudy" | "rainy" | "night";

const themes: Record<Weather, string> = {
  sunny: "from-sky-400 to-blue-600",
  cloudy: "from-slate-400 to-slate-600",
  rainy: "from-slate-600 to-indigo-900",
  night: "from-indigo-950 to-slate-900",
};

function Scene({ w, reduced }: { w: Weather; reduced: boolean }) {
  const loop = (d: number) => (reduced ? { duration: 0 } : { duration: d, repeat: Infinity, ease: "linear" as const });
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      {w === "sunny" && (
        <motion.div className="absolute -top-8 -right-8 size-32" animate={{ rotate: 360 }} transition={loop(30)}>
          {Array.from({ length: 12 }, (_, i) => <span key={i} className="absolute top-1/2 left-1/2 h-1 w-14 origin-left rounded-full bg-yellow-200/60" style={{ rotate: `${i * 30}deg` }} />)}
          <span className="absolute inset-7 rounded-full bg-yellow-300 shadow-[0_0_40px_#fde047]" />
        </motion.div>
      )}
      {(w === "cloudy" || w === "rainy") &&
        [0, 1].map((i) => (
          <motion.div key={i} className="absolute h-10 w-24 rounded-full bg-white/70 blur-[1px]" style={{ top: 18 + i * 22 }} initial={{ x: i ? -120 : 40 }} animate={{ x: [i ? -120 : 40, 260] }} transition={loop(i ? 18 : 24)}>
            <span className="absolute -top-4 left-5 size-10 rounded-full bg-white/70" />
          </motion.div>
        ))}
      {w === "rainy" &&
        Array.from({ length: 18 }, (_, i) => (
          <motion.span key={i} className="absolute top-0 h-4 w-px bg-sky-200/70" style={{ left: `${(i * 37) % 100}%` }} animate={{ y: [-20, 220] }} transition={reduced ? { duration: 0 } : { duration: 0.8 + (i % 4) * 0.15, repeat: Infinity, delay: (i % 6) * 0.13, ease: "linear" }} />
        ))}
      {w === "night" &&
        Array.from({ length: 14 }, (_, i) => (
          <motion.span key={i} className="absolute size-0.5 rounded-full bg-white" style={{ left: `${(i * 41) % 100}%`, top: `${(i * 23) % 60}%` }} animate={{ opacity: [0.2, 1, 0.2] }} transition={reduced ? { duration: 0 } : { duration: 2 + (i % 3), repeat: Infinity, delay: i * 0.2 }} />
        ))}
    </div>
  );
}

/** Weather widget whose sky, scene (rays, drifting clouds, rain, twinkling stars) and gradient crossfade per condition. */
export function WidgetWeather({ weather, city, temp, hi, lo, className }: { weather: Weather; city: string; temp: number; hi: number; lo: number; className?: string }) {
  const reduced = useReducedMotion();
  return (
    <div className={cn("relative h-44 w-64 overflow-hidden rounded-3xl text-white shadow-xl", className)} role="group" aria-label={`${city}: ${temp}°, ${weather}`}>
      <AnimatePresence initial={false}>
        <motion.div key={weather} className={cn("absolute inset-0 bg-gradient-to-br", themes[weather])} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.6 }}>
          <Scene w={weather} reduced={reduced} />
        </motion.div>
      </AnimatePresence>
      <div className="relative flex h-full flex-col justify-between p-4">
        <div><p className="text-sm font-medium">{city}</p><p className="text-5xl font-light tabular-nums">{temp}°</p></div>
        <div className="text-xs"><p className="capitalize">{weather}</p><p className="opacity-80">H:{hi}° L:{lo}°</p></div>
      </div>
    </div>
  );
}
```

## Usage example
```tsx
"use client";
import { useState } from "react";
import { WidgetWeather, type Weather } from "@/components/kinetik/widget-weather";
const data: Record<Weather, [number, number, number]> = { sunny: [24, 27, 16], cloudy: [18, 20, 13], rainy: [12, 14, 9], night: [9, 15, 6] };
export default function Demo() {
  const [w, setW] = useState<Weather>("sunny");
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-4 p-6">
      <WidgetWeather weather={w} city="Lisbon" temp={data[w][0]} hi={data[w][1]} lo={data[w][2]} />
      <div className="flex gap-1.5">{(Object.keys(data) as Weather[]).map((k) => <button key={k} onClick={() => setW(k)} aria-pressed={w === k} className="rounded-full border border-border px-3 py-1 text-xs capitalize aria-pressed:bg-foreground aria-pressed:text-background">{k}</button>)}</div>
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
