You are given a task to integrate a component from the **kinetik** motion library into this codebase.

# Chart — Gauge (`chart-gauge`)

Speedometer gauge with a weighted needle: on view and on change the needle sweeps past the target and settles with a damped wobble, the active zone lights up and the readout counts. Zones are configurable.

## What it should do
Draw zone arcs across a 240° sweep and tick marks; rotate the needle group from its bottom-centre with an underdamped spring toward the value; derive the readout from the same motion value.

## Project requirements
- React 19 + TypeScript, Tailwind CSS v4, shadcn/ui-style CSS variables (`background`, `foreground`, `muted`, `muted-foreground`, `border`, `card`, `primary`, `ring`). If the project lacks shadcn, set it up first (`npx shadcn@latest init`).
- Animation engine: **svg**.
- Install dependencies: `npm i motion`
- Put the component at `components/kinetik/chart-gauge.tsx`.
- `cn` lives at `lib/kinetik/utils.ts` (source below).
- Shared hooks go at `lib/kinetik/core.ts` (source below).

## Non-negotiables
- **Accessibility:** role=img labelled with value and max. Reduced motion places the needle directly.
- **Performance:** A low-damping spring on one motion value drives rotation and the number.
- Respect `prefers-reduced-motion` (replace movement with opacity or an instant change).
- Animate only transform / opacity / filter / clip-path. No hard-coded theme colors — use CSS variables so it works in light and dark.

## Source — components/kinetik/chart-gauge.tsx
```tsx
"use client";
import { useEffect, useRef } from "react";
import { animate, motion, useMotionValue, useTransform } from "motion/react";
import { cn, useInView, useReducedMotion } from "@/lib/kinetik/core";

export interface GaugeZone { to: number; color: string }
export interface ChartGaugeProps {
  value: number;
  min?: number;
  max?: number;
  label?: string;
  unit?: string;
  zones?: GaugeZone[];
  className?: string;
}

const A0 = -120, A1 = 120;

/**
 * Speedometer gauge with a weighted needle: on view (and whenever the value changes) the needle
 * sweeps past the target and settles with a damped wobble, the active zone of the coloured track
 * lights up, and the readout counts. Zones are configurable.
 */
export function ChartGauge({ value, min = 0, max = 100, label = "Score", unit = "", zones = [{ to: 40, color: "#ef4444" }, { to: 70, color: "#f59e0b" }, { to: 100, color: "#22c55e" }], className }: ChartGaugeProps) {
  const reduced = useReducedMotion();
  const box = useRef<HTMLDivElement>(null);
  const inView = useInView(box, { amount: 0.5 });
  const v = useMotionValue(reduced ? value : min);
  const rot = useTransform(v, [min, max], [A0, A1], { clamp: false });
  const shown = useTransform(v, (x) => `${Math.round(Math.max(min, Math.min(max, x)))}${unit}`);
  useEffect(() => {
    if (reduced) return v.set(value);
    if (!inView) return;
    const c = animate(v, value, { type: "spring", stiffness: 60, damping: 7, mass: 1.2 });
    return () => c.stop();
  }, [value, inView, reduced, v]);
  const pt = (a: number, r: number) => [100 + Math.sin((a * Math.PI) / 180) * r, 110 - Math.cos((a * Math.PI) / 180) * r] as const;
  const arc = (from: number, to: number, r: number) => {
    const [x0, y0] = pt(from, r), [x1, y1] = pt(to, r);
    return `M${x0} ${y0} A${r} ${r} 0 ${to - from > 180 ? 1 : 0} 1 ${x1} ${y1}`;
  };
  const ang = (x: number) => A0 + ((x - min) / (max - min)) * (A1 - A0);
  const active = zones.findIndex((z) => value <= z.to);

  return (
    <div ref={box} className={cn("w-72 rounded-3xl border bg-card p-5", className)}>
      <svg viewBox="0 0 200 150" className="w-full" role="img" aria-label={`${label}: ${value}${unit} of ${max}`}>
        {zones.map((z, i) => {
          const from = ang(i ? zones[i - 1]!.to : min) + (i ? 1.5 : 0), to = ang(z.to);
          return <path key={i} d={arc(from, to, 80)} fill="none" stroke={z.color} strokeWidth="14" strokeLinecap={i === 0 || i === zones.length - 1 ? "round" : "butt"} opacity={i === active ? 1 : 0.25} style={{ transition: "opacity .4s" }} />;
        })}
        {Array.from({ length: 11 }, (_, i) => {
          const a = A0 + (i / 10) * (A1 - A0), [x0, y0] = pt(a, 64), [x1, y1] = pt(a, i % 5 ? 60 : 56);
          return <line key={i} x1={x0} y1={y0} x2={x1} y2={y1} className="stroke-muted-foreground" strokeWidth={i % 5 ? 1 : 2} />;
        })}
        <motion.g style={{ rotate: rot, originX: 0.5, originY: 1 }} /* motion measures SVG origins from the element's own box: bottom-centre = pivot */>
          <path d="M97 110 L100 40 L103 110 Z" className="fill-foreground" />
        </motion.g>
        <circle cx="100" cy="110" r="9" className="fill-foreground" />
        <circle cx="100" cy="110" r="3.5" className="fill-card" />
      </svg>
      <div className="-mt-6 text-center">
        <motion.p className="font-mono text-3xl font-semibold tabular-nums">{shown}</motion.p>
        <p className="text-xs uppercase tracking-widest text-muted-foreground">{label}</p>
      </div>
    </div>
  );
}
```

## Usage example
```tsx
"use client";
import { useState } from "react";
import { DemoCenter } from "@/components/kinetik/demo-helpers" /* or inline */;
import { ChartGauge } from "@/components/kinetik/chart-gauge";

export default function Demo() {
  const [v, setV] = useState(78);
  return (
    <DemoCenter className="flex-col gap-4">
      <div className="flex flex-wrap justify-center gap-4">
        <ChartGauge value={v} label="Performance" />
        <ChartGauge value={42} label="Disk used" unit="%" zones={[{ to: 60, color: "#22c55e" }, { to: 85, color: "#f59e0b" }, { to: 100, color: "#ef4444" }]} className="hidden sm:block" />
      </div>
      <button type="button" onClick={() => setV(Math.round(10 + Math.random() * 88))} className="rounded-full border px-3 py-1 text-xs">Re-measure</button>
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
