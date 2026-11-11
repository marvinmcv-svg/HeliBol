You are given a task to integrate a component from the **kinetik** motion library into this codebase.

# Range Slider with Histogram (`range-slider`)

Dual-thumb range slider over a live histogram: bars inside the range light up, the active thumb grows with a value bubble, and thumbs can't cross.

## What it should do
Build a dual-thumb range slider: a track with a filled segment between thumbs; pointerdown picks the nearest thumb, captures the pointer and snaps values to step without crossing. Each thumb is role=slider with keyboard support and a value bubble while active (spring scale). Optional histogram bars above the track animate colour/scaleY when inside the range.

## Project requirements
- React 19 + TypeScript, Tailwind CSS v4, shadcn/ui-style CSS variables (`background`, `foreground`, `muted`, `muted-foreground`, `border`, `card`, `primary`, `ring`). If the project lacks shadcn, set it up first (`npx shadcn@latest init`).
- Animation engine: **motion**.
- Install dependencies: `npm i motion`
- Put the component at `components/kinetik/range-slider.tsx`.
- `cn` lives at `lib/kinetik/utils.ts` (source below).
- Shared hooks go at `lib/kinetik/core.ts` (source below).
- Motion tokens go at `lib/kinetik/tokens.ts` (source below). Use tokens instead of magic numbers.

## Non-negotiables
- **Accessibility:** Each thumb is a full ARIA slider (arrows, PageUp/Down, Home/End) with value text; pointer capture for dragging; histogram aria-hidden. Reduced motion: no scale or colour tweens.
- **Performance:** Bars tween colour/scale only when their in-range state flips.
- Respect `prefers-reduced-motion` (replace movement with opacity or an instant change).
- Animate only transform / opacity / filter / clip-path. No hard-coded theme colors — use CSS variables so it works in light and dark.

## Source — components/kinetik/range-slider.tsx
```tsx
"use client";
import { useId, useRef, useState } from "react";
import { motion } from "motion/react";
import { spring } from "@/lib/kinetik/tokens";
import { cn, useReducedMotion } from "@/lib/kinetik/core";

export interface RangeSliderProps {
  value: [number, number];
  onChange: (v: [number, number]) => void;
  min?: number;
  max?: number;
  step?: number;
  /** Optional histogram (any length) drawn behind the track; bars inside the range light up. */
  histogram?: number[];
  label: string;
  format?: (v: number) => string;
  className?: string;
}

/**
 * Dual-thumb range slider with a live histogram: bars inside the range light up, the active thumb
 * grows and shows a value bubble, thumbs can't cross, and each thumb is a full ARIA slider.
 */
export function RangeSlider({ value, onChange, min = 0, max = 100, step = 1, histogram, label, format = String, className }: RangeSliderProps) {
  const reduced = useReducedMotion();
  const id = useId();
  const track = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState<0 | 1 | null>(null);
  const pct = (v: number) => ((v - min) / (max - min)) * 100;
  const snap = (v: number) => Math.min(max, Math.max(min, Math.round((v - min) / step) * step + min));

  const set = (i: 0 | 1, v: number) => {
    const next: [number, number] = [...value];
    next[i] = i === 0 ? Math.min(snap(v), value[1]) : Math.max(snap(v), value[0]);
    if (next[0] !== value[0] || next[1] !== value[1]) onChange(next);
  };
  const fromPointer = (x: number) => {
    const r = track.current!.getBoundingClientRect();
    return min + ((x - r.left) / r.width) * (max - min);
  };

  return (
    <div className={cn("w-full select-none", className)}>
      <div className="mb-3 flex items-baseline justify-between">
        <span id={`${id}-l`} className="text-sm font-medium">{label}</span>
        <span className="text-sm tabular-nums text-muted-foreground">{format(value[0])} – {format(value[1])}</span>
      </div>
      {histogram && (
        <div aria-hidden className="flex h-14 items-end gap-px px-2.5">
          {histogram.map((h, i) => {
            const v = min + ((i + 0.5) / histogram.length) * (max - min);
            const on = v >= value[0] && v <= value[1];
            return <motion.span key={i} className="flex-1 rounded-t-sm" initial={false} animate={{ backgroundColor: on ? "var(--color-primary, #6366f1)" : "var(--color-muted, #e4e4e7)", scaleY: on ? 1 : 0.85 }} transition={reduced ? { duration: 0 } : { duration: 0.25 }} style={{ height: `${(h / Math.max(...histogram)) * 100}%`, transformOrigin: "bottom" }} />;
          })}
        </div>
      )}
      <div
        ref={track}
        className="relative mx-2.5 h-6 touch-none"
        onPointerDown={(e) => {
          const v = fromPointer(e.clientX);
          const i: 0 | 1 = Math.abs(v - value[0]) <= Math.abs(v - value[1]) ? 0 : 1;
          setActive(i);
          set(i, v);
          (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
          (e.currentTarget.querySelectorAll('[role="slider"]')[i] as HTMLElement).focus();
        }}
        onPointerMove={(e) => active !== null && set(active, fromPointer(e.clientX))}
        onPointerUp={() => setActive(null)}
      >
        <div className="absolute inset-x-0 top-1/2 h-1.5 -translate-y-1/2 rounded-full bg-muted" />
        <div className="absolute top-1/2 h-1.5 -translate-y-1/2 rounded-full bg-primary" style={{ left: `${pct(value[0])}%`, right: `${100 - pct(value[1])}%` }} />
        {([0, 1] as const).map((i) => (
          <div
            key={i}
            role="slider"
            tabIndex={0}
            aria-label={`${label} ${i === 0 ? "minimum" : "maximum"}`}
            aria-valuemin={i === 0 ? min : value[0]}
            aria-valuemax={i === 0 ? value[1] : max}
            aria-valuenow={value[i]}
            aria-valuetext={format(value[i])}
            onKeyDown={(e) => {
              const big = step * 10;
              const d = { ArrowRight: step, ArrowUp: step, ArrowLeft: -step, ArrowDown: -step, PageUp: big, PageDown: -big }[e.key];
              if (d) { e.preventDefault(); set(i, value[i] + d); }
              if (e.key === "Home") (e.preventDefault(), set(i, min));
              if (e.key === "End") (e.preventDefault(), set(i, max));
            }}
            onFocus={() => setActive((a) => a ?? i)}
            onBlur={() => setActive(null)}
            className="absolute top-1/2 -ml-2.5 -mt-2.5 size-5 rounded-full outline-none"
            style={{ left: `${pct(value[i])}%` }}
          >
            <motion.span animate={{ scale: active === i && !reduced ? 1.25 : 1 }} transition={reduced ? { duration: 0 } : spring.bouncy} className="block size-full rounded-full border-2 border-primary bg-background shadow-md ring-ring [[role=slider]:focus-visible>&]:ring-2" />
            {active === i && (
              <motion.span initial={reduced ? false : { opacity: 0, y: 4, scale: 0.8 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={spring.snappy} className="absolute bottom-full left-1/2 mb-2 -translate-x-1/2 whitespace-nowrap rounded-md bg-foreground px-2 py-0.5 text-xs font-medium tabular-nums text-background">
                {format(value[i])}
              </motion.span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
```

## Usage example
```tsx
"use client";
import { useState } from "react";
import { RangeSlider } from "@/components/kinetik/range-slider";

const histogram = [2, 4, 7, 12, 18, 26, 30, 28, 22, 19, 15, 13, 10, 8, 7, 5, 4, 3, 2, 2, 1, 1, 1, 1];

export default function Demo() {
  const [v, setV] = useState<[number, number]>([120, 340]);
  return (
    <div className="grid h-full place-items-center p-8">
      <RangeSlider label="Price per night" value={v} onChange={setV} min={0} max={600} step={10} histogram={histogram} format={(n) => `$${n}`} className="max-w-sm" />
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

## lib/kinetik/tokens.ts
```ts
/**
 * kinetik motion tokens — the single motion language shared by web (CSS / Motion / GSAP)
 * and native (Reanimated). Import tokens, never inline magic numbers.
 */

/** Durations in milliseconds. */
export const duration = {
  instant: 0,
  micro: 100,
  fast: 150,
  base: 220,
  moderate: 320,
  slow: 480,
  slower: 700,
  cinematic: 1200,
} as const;
export type DurationToken = keyof typeof duration;

/** Durations in seconds (Motion / GSAP use seconds). */
export const durationS = Object.fromEntries(
  Object.entries(duration).map(([k, v]) => [k, v / 1000]),
) as { [K in DurationToken]: number };

type Bezier = readonly [number, number, number, number];

/** Cubic-bezier control points (Motion accepts these arrays directly). */
export const easeBezier = {
  standard: [0.2, 0, 0, 1],
  enter: [0, 0, 0.2, 1],
  exit: [0.4, 0, 1, 1],
  emphasized: [0.2, 0, 0, 1],
  expoOut: [0.16, 1, 0.3, 1],
  backOut: [0.34, 1.56, 0.64, 1],
} as const satisfies Record<string, Bezier>;
export type EaseToken = keyof typeof easeBezier | "springCss" | "linear";

/** Spring-like easing in pure CSS via linear() (stiffness≈260, damping≈30). */
export const springCss =
  "linear(0, 0.009, 0.035 2.1%, 0.141 4.4%, 0.281 6.7%, 0.723 12.9%, 0.938 16.7%, 1.017 19.4%, 1.067, 1.099 24.3%, 1.108 26%, 1.100, 1.078 30.1%, 1.002 35.7%, 0.981 38.5%, 0.968 41.5%, 0.965 44.7%, 0.976 51.4%, 1.001 60%, 1.008 66.7%, 1.002 81%, 1)";

/** CSS easing strings. */
export const ease: Record<EaseToken, string> = {
  ...(Object.fromEntries(
    Object.entries(easeBezier).map(([k, v]) => [k, `cubic-bezier(${v.join(", ")})`]),
  ) as Record<keyof typeof easeBezier, string>),
  springCss,
  linear: "linear",
};

/** Matching GSAP ease names. */
export const gsapEase: Record<EaseToken, string> = {
  standard: "power3.out",
  enter: "power2.out",
  exit: "power2.in",
  emphasized: "power4.out",
  expoOut: "expo.out",
  backOut: "back.out(1.7)",
  springCss: "elastic.out(1, 0.6)",
  linear: "none",
};

/** Matching Anime.js v4 ease names. */
export const animeEase: Record<EaseToken, string> = {
  standard: "outCubic",
  enter: "outQuad",
  exit: "inQuad",
  emphasized: "outQuart",
  expoOut: "outExpo",
  backOut: "outBack(1.7)",
  springCss: "outElastic(1, .6)",
  linear: "linear",
};

export type SpringToken = "snappy" | "smooth" | "gentle" | "bouncy" | "heavy";

/** Spring presets — numbers are identical for Motion and Reanimated. */
export const springConfig: Record<SpringToken, { stiffness: number; damping: number; mass: number }> = {
  snappy: { stiffness: 500, damping: 35, mass: 1 },
  smooth: { stiffness: 260, damping: 30, mass: 1 },
  gentle: { stiffness: 120, damping: 20, mass: 1 },
  bouncy: { stiffness: 400, damping: 15, mass: 1 },
  heavy: { stiffness: 200, damping: 40, mass: 1.5 },
};

/** Ready-to-spread Motion transitions: `transition={spring.smooth}`. */
export const spring = Object.fromEntries(
  Object.entries(springConfig).map(([k, v]) => [k, { type: "spring" as const, ...v }]),
) as Record<SpringToken, { type: "spring"; stiffness: number; damping: number; mass: number }>;

/** Motion's perceptual equivalents ({ visualDuration, bounce }). */
export const springVisual: Record<SpringToken, { type: "spring"; visualDuration: number; bounce: number }> = {
  snappy: { type: "spring", visualDuration: 0.18, bounce: 0.05 },
  smooth: { type: "spring", visualDuration: 0.3, bounce: 0.1 },
  gentle: { type: "spring", visualDuration: 0.45, bounce: 0.15 },
  bouncy: { type: "spring", visualDuration: 0.3, bounce: 0.45 },
  heavy: { type: "spring", visualDuration: 0.5, bounce: 0 },
};

/** Reanimated `withSpring` configs (same physics). */
export const reanimatedSpring = springConfig;

export const distance = { xs: 4, sm: 8, md: 16, lg: 32, xl: 64 } as const;
export const stagger = { tight: 0.02, base: 0.05, loose: 0.1 } as const;
export const blur = { in: 8 } as const;
export const press = { scale: 0.97, hoverLift: -2 } as const;

/** CSS custom properties, e.g. for `:root`. */
export function toCssVars(): Record<string, string> {
  const vars: Record<string, string> = {};
  for (const [k, v] of Object.entries(duration)) vars[`--k-duration-${k}`] = `${v}ms`;
  for (const [k, v] of Object.entries(ease)) vars[`--k-ease-${k}`] = v;
  for (const [k, v] of Object.entries(distance)) vars[`--k-distance-${k}`] = `${v}px`;
  for (const [k, v] of Object.entries(stagger)) vars[`--k-stagger-${k}`] = `${v}s`;
  return vars;
}

export const tokens = { duration, durationS, ease, easeBezier, gsapEase, animeEase, spring, springConfig, springVisual, distance, stagger, blur, press };
export default tokens;
```

## Steps
1. Install the dependencies above.
2. Create the files exactly as given, fixing import aliases if the project doesn't use `@/`.
3. Drop the usage example into a page and adapt copy/colors to the project's design system.
4. Verify: toggle "Reduce motion" in OS settings — the component must still be fully usable.
