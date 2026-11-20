You are given a task to integrate a component from the **kinetik** motion library into this codebase.

# Widget — Habit Tracker (`widget-habit-tracker`)

Habit tracker grid: tap a day and it fills with a pop and a ring burst; the streak flame counter rolls to its new value and flickers bigger the longer the streak. Today is outlined.

## What it should do
Render a 7-row column-flow grid; filled state springs a coloured square to scale 1 and spawns an expanding ring; compute the streak backward from today and roll it with AnimatePresence.

## Project requirements
- React 19 + TypeScript, Tailwind CSS v4, shadcn/ui-style CSS variables (`background`, `foreground`, `muted`, `muted-foreground`, `border`, `card`, `primary`, `ring`). If the project lacks shadcn, set it up first (`npx shadcn@latest init`).
- Animation engine: **motion**.
- Install dependencies: `npm i motion lucide-react`
- Put the component at `components/kinetik/widget-habit-tracker.tsx`.
- `cn` lives at `lib/kinetik/utils.ts` (source below).
- Shared hooks go at `lib/kinetik/core.ts` (source below).

## Non-negotiables
- **Accessibility:** Each day is a toggle button with its relative date; the streak has an aria-label. Reduced motion removes pops.
- **Performance:** Small grid of buttons; springs on scale only.
- Respect `prefers-reduced-motion` (replace movement with opacity or an instant change).
- Animate only transform / opacity / filter / clip-path. No hard-coded theme colors — use CSS variables so it works in light and dark.

## Source — components/kinetik/widget-habit-tracker.tsx
```tsx
"use client";
import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Flame } from "lucide-react";
import { cn, useReducedMotion } from "@/lib/kinetik/core";

export interface WidgetHabitTrackerProps {
  habit: string;
  /** Number of weeks shown (7 days each). */
  weeks?: number;
  /** Initially completed day indexes (0 = oldest). */
  defaultDone?: number[];
  color?: string;
  className?: string;
}

/**
 * Habit tracker grid: tap a day and it fills with a pop and a ring burst; the streak flame counter
 * rolls to the new value and flickers bigger the longer the streak. Today is outlined. Each cell is a
 * toggle button with its date in the label.
 */
export function WidgetHabitTracker({ habit, weeks = 6, defaultDone = [], color = "#22c55e", className }: WidgetHabitTrackerProps) {
  const reduced = useReducedMotion();
  const total = weeks * 7, today = total - 1;
  const [done, setDone] = useState(() => new Set(defaultDone));
  const [burst, setBurst] = useState<number | null>(null);
  const streak = useMemo(() => {
    let s = 0;
    for (let d = done.has(today) ? today : today - 1; d >= 0 && done.has(d); d--) s++;
    return s;
  }, [done, today]);
  const toggle = (d: number) => {
    const n = new Set(done);
    if (n.has(d)) n.delete(d);
    else (n.add(d), setBurst(d));
    setDone(n);
  };
  const label = (d: number) => (d === today ? "Today" : `${today - d} day${today - d > 1 ? "s" : ""} ago`);

  return (
    <div className={cn("w-[300px] rounded-[28px] border bg-card p-5 shadow-lg", className)}>
      <div className="mb-4 flex items-start justify-between">
        <div>
          <p className="text-xs uppercase tracking-widest text-muted-foreground">Habit</p>
          <p className="text-lg font-semibold">{habit}</p>
        </div>
        <div className="flex items-center gap-1 rounded-full bg-orange-500/10 px-2.5 py-1 text-orange-500" aria-label={`${streak} day streak`}>
          <motion.span animate={reduced || !streak ? {} : { scale: [1, 1 + Math.min(streak, 10) * 0.03, 1], rotate: [-4, 4, -4] }} transition={{ duration: 0.9, repeat: Infinity }}>
            <Flame className="size-4" fill="currentColor" />
          </motion.span>
          <span className="relative h-5 min-w-4 overflow-hidden font-mono text-sm font-semibold tabular-nums">
            <AnimatePresence initial={false} mode="popLayout">
              <motion.span key={streak} className="block" initial={{ y: reduced ? 0 : 16, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: reduced ? 0 : -16, opacity: 0 }}>{streak}</motion.span>
            </AnimatePresence>
          </span>
        </div>
      </div>
      <div className="grid grid-flow-col grid-rows-7 gap-1.5">
        {Array.from({ length: total }, (_, d) => {
          const on = done.has(d);
          return (
            <button key={d} type="button" aria-pressed={on} aria-label={`${label(d)}: ${on ? "done" : "not done"}`} onClick={() => toggle(d)} className={cn("relative aspect-square rounded-[6px] bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring", d === today && "ring-1 ring-foreground/40")}>
              <motion.span className="absolute inset-0 rounded-[6px]" style={{ background: color }} initial={false} animate={{ scale: on ? 1 : 0, opacity: on ? 1 : 0 }} transition={reduced ? { duration: 0 } : { type: "spring", stiffness: 500, damping: 18 }} />
              {burst === d && on && !reduced && (
                <motion.span key={`b${d}`} className="pointer-events-none absolute inset-0 rounded-[6px] border-2" style={{ borderColor: color }} initial={{ scale: 1, opacity: 0.9 }} animate={{ scale: 2.4, opacity: 0 }} transition={{ duration: 0.55 }} onAnimationComplete={() => setBurst(null)} />
              )}
            </button>
          );
        })}
      </div>
      <p className="mt-3 text-xs text-muted-foreground">{done.size} of {total} days · tap a day to log it</p>
    </div>
  );
}
```

## Usage example
```tsx
"use client";
import { DemoCenter } from "@/components/kinetik/demo-helpers" /* or inline */;
import { WidgetHabitTracker } from "@/components/kinetik/widget-habit-tracker";

const done = [0, 1, 2, 4, 5, 7, 8, 9, 10, 13, 14, 15, 16, 18, 21, 22, 23, 24, 25, 28, 29, 30, 32, 33, 34, 35, 36, 37, 38, 39, 40];

export default function Demo() {
  return (
    <DemoCenter>
      <WidgetHabitTracker habit="Morning run" defaultDone={done} />
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
