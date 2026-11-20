You are given a task to integrate a component from the **kinetik** motion library into this codebase.

# Chart — Bar Race (`chart-bar-race`)

Animated bar-chart race: bars re-rank with layout springs as values change period by period, numbers tween, and the big period label rolls. Play/pause and a scrubber let you jump to any frame.

## What it should do
Sort each frame's entries, render the top N as motion.div with layout and key=series so re-ordering animates; width = value / max; tween the numbers; roll the period label with AnimatePresence; add play/pause and a range scrubber.

## Project requirements
- React 19 + TypeScript, Tailwind CSS v4, shadcn/ui-style CSS variables (`background`, `foreground`, `muted`, `muted-foreground`, `border`, `card`, `primary`, `ring`). If the project lacks shadcn, set it up first (`npx shadcn@latest init`).
- Animation engine: **motion**.
- Install dependencies: `npm i motion lucide-react`
- Put the component at `components/kinetik/chart-bar-race.tsx`.
- `cn` lives at `lib/kinetik/utils.ts` (source below).
- Shared hooks go at `lib/kinetik/core.ts` (source below).

## Non-negotiables
- **Accessibility:** Chart has a text summary of the current leader; controls are real buttons and a labelled range input. Reduced motion jumps between frames without springs.
- **Performance:** Only the visible top-N bars render; layout animations on transform.
- Respect `prefers-reduced-motion` (replace movement with opacity or an instant change).
- Animate only transform / opacity / filter / clip-path. No hard-coded theme colors — use CSS variables so it works in light and dark.

## Source — components/kinetik/chart-bar-race.tsx
```tsx
"use client";
import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, LayoutGroup, motion } from "motion/react";
import { Pause, Play } from "lucide-react";
import { cn, useReducedMotion } from "@/lib/kinetik/core";

export interface ChartBarRaceProps {
  /** Frame labels (e.g. years). */
  frames: string[];
  /** One series per entity: values per frame. */
  series: { name: string; color: string; values: number[] }[];
  /** Bars shown at once. */
  top?: number;
  /** ms per frame. */
  speed?: number;
  title?: string;
  className?: string;
}

/**
 * Bar chart race: each frame re-sorts the entities and the bars glide to their new rank (shared
 * layout), widths and values tween, the big period label rolls, and newcomers slide in from below
 * the cutoff. Play/pause and a scrubber; reduced motion steps without gliding.
 */
export function ChartBarRace({ frames, series, top = 6, speed = 1400, title = "Ranking", className }: ChartBarRaceProps) {
  const reduced = useReducedMotion();
  const [f, setF] = useState(0);
  const [playing, setPlaying] = useState(!reduced);

  useEffect(() => {
    if (!playing) return;
    const id = setTimeout(() => setF((n) => (n + 1) % frames.length), speed);
    return () => clearTimeout(id);
  }, [f, playing, speed, frames.length]);

  const rows = useMemo(() => series.map((s) => ({ ...s, v: s.values[f] ?? 0 })).sort((a, b) => b.v - a.v).slice(0, top), [series, f, top]);
  const max = rows[0]?.v || 1;
  const t = reduced ? { duration: 0 } : { type: "spring" as const, stiffness: 140, damping: 22 };

  return (
    <div className={cn("w-full rounded-3xl border border-border bg-card p-5", className)}>
      <div className="flex items-start justify-between">
        <p className="text-sm font-medium">{title}</p>
        <div className="relative h-10 overflow-hidden text-right" aria-live="polite">
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.p key={f} initial={reduced ? false : { y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={reduced ? undefined : { y: -30, opacity: 0 }} className="text-3xl font-bold tabular-nums tracking-tight text-muted-foreground">{frames[f]}</motion.p>
          </AnimatePresence>
        </div>
      </div>
      <LayoutGroup>
        <ol className="mt-3 space-y-1.5" aria-label={`${title}, ${frames[f]}`}>
          <AnimatePresence initial={false}>
            {rows.map((r, i) => (
              <motion.li key={r.name} layout={!reduced} transition={t} initial={reduced ? false : { opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 24 }} className="flex items-center gap-2 text-xs">
                <span className="w-4 text-right tabular-nums text-muted-foreground">{i + 1}</span>
                <div className="relative h-7 flex-1">
                  <motion.div className="flex h-full items-center rounded-lg px-2 font-medium text-white" style={{ background: r.color }} animate={{ width: `${Math.max(8, (r.v / max) * 100)}%` }} transition={t}>
                    <span className="truncate">{r.name}</span>
                  </motion.div>
                </div>
                <span className="w-12 text-right font-semibold tabular-nums">{Math.round(r.v).toLocaleString()}</span>
              </motion.li>
            ))}
          </AnimatePresence>
        </ol>
      </LayoutGroup>
      <div className="mt-4 flex items-center gap-3">
        <button type="button" onClick={() => setPlaying((p) => !p)} aria-label={playing ? "Pause" : "Play"} className="grid size-8 place-items-center rounded-full bg-foreground text-background">
          {playing ? <Pause className="size-3.5 fill-current" /> : <Play className="ml-0.5 size-3.5 fill-current" />}
        </button>
        <input type="range" min={0} max={frames.length - 1} value={f} onChange={(e) => (setPlaying(false), setF(Number(e.target.value)))} aria-label="Period" className="flex-1" />
      </div>
    </div>
  );
}
```

## Usage example
```tsx
"use client";
import { ChartBarRace } from "@/components/kinetik/chart-bar-race";

const frames = ["2019", "2020", "2021", "2022", "2023", "2024", "2025", "2026"];
const series = [
  { name: "Motion", color: "#d946ef", values: [20, 32, 48, 70, 96, 120, 150, 182] },
  { name: "GSAP", color: "#65a30d", values: [60, 64, 70, 78, 88, 104, 122, 140] },
  { name: "CSS", color: "#0284c7", values: [80, 82, 84, 90, 95, 100, 108, 118] },
  { name: "Lottie", color: "#14b8a6", values: [40, 52, 60, 64, 66, 66, 64, 60] },
  { name: "three.js", color: "#ea580c", values: [30, 36, 44, 56, 70, 88, 110, 136] },
  { name: "Anime.js", color: "#e11d48", values: [44, 46, 48, 50, 50, 52, 56, 62] },
  { name: "Rive", color: "#7c3aed", values: [2, 6, 14, 28, 46, 66, 84, 102] },
];

export default function Demo() {
  return (
    <div className="grid h-full place-items-center p-5">
      <ChartBarRace title="Animation engines by usage (index)" frames={frames} series={series} className="max-w-lg" />
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
