You are given a task to integrate a component from the **kinetik** motion library into this codebase.

# Widget — Thermostat (`widget-thermostat`)

Smart-thermostat dial: drag around the ring or use the arrow keys to set the target; the arc fills along a blue-to-orange gradient, the number ticks, and the mode switches between heating, cooling and idle with a breathing glow.

## What it should do
Convert pointer angle around the centre to a value across a 270° sweep; render a dashed circle whose dash length follows the value, a knob at the arc end, and derive heat/cool/idle from target vs current.

## Project requirements
- React 19 + TypeScript, Tailwind CSS v4, shadcn/ui-style CSS variables (`background`, `foreground`, `muted`, `muted-foreground`, `border`, `card`, `primary`, `ring`). If the project lacks shadcn, set it up first (`npx shadcn@latest init`).
- Animation engine: **motion**.
- Install dependencies: `npm i motion lucide-react`
- Put the component at `components/kinetik/widget-thermostat.tsx`.
- `cn` lives at `lib/kinetik/utils.ts` (source below).
- Shared hooks go at `lib/kinetik/core.ts` (source below).

## Non-negotiables
- **Accessibility:** role=slider with value text including the mode; arrow keys step 0.5°. Reduced motion stops the glow.
- **Performance:** Motion values drive the arc dash and knob position.
- Respect `prefers-reduced-motion` (replace movement with opacity or an instant change).
- Animate only transform / opacity / filter / clip-path. No hard-coded theme colors — use CSS variables so it works in light and dark.

## Source — components/kinetik/widget-thermostat.tsx
```tsx
"use client";
import { useRef, useState } from "react";
import { animate, motion, useMotionValue, useMotionValueEvent, useTransform } from "motion/react";
import { Flame, Snowflake, Wind } from "lucide-react";
import { cn, useReducedMotion } from "@/lib/kinetik/core";

export interface WidgetThermostatProps {
  defaultTarget?: number;
  current?: number;
  min?: number;
  max?: number;
  className?: string;
}

const START = 135, SWEEP = 270; // degrees, gauge opens at the bottom

/**
 * Smart-thermostat dial: drag around the ring (or use the arrow keys) to set the target; the arc
 * fills and its gradient shifts from icy blue to ember orange, the big number ticks, and the mode
 * switches to heating, cooling or idle depending on the current room temperature, with a matching
 * glow that breathes.
 */
export function WidgetThermostat({ defaultTarget = 21, current = 19, min = 10, max = 30, className }: WidgetThermostatProps) {
  const reduced = useReducedMotion();
  const target = useMotionValue(defaultTarget);
  const [t, setT] = useState(defaultTarget);
  useMotionValueEvent(target, "change", (v) => setT(Math.round(v * 2) / 2));
  const frac = useTransform(target, [min, max], [0, 1]);
  const angle = useTransform(frac, (f) => START + f * SWEEP);
  const knobX = useTransform(angle, (a) => 100 + Math.cos((a * Math.PI) / 180) * 80);
  const knobY = useTransform(angle, (a) => 100 + Math.sin((a * Math.PI) / 180) * 80);
  const ARC = 2 * Math.PI * 80 * (SWEEP / 360);
  const dash = useTransform(frac, (f) => `${f * ARC} 999`);
  const mode = t > current + 0.4 ? "heat" : t < current - 0.4 ? "cool" : "idle";
  const glow = mode === "heat" ? "#f97316" : mode === "cool" ? "#38bdf8" : "#a1a1aa";
  const svg = useRef<SVGSVGElement>(null);

  const setFromPointer = (x: number, y: number) => {
    const b = svg.current!.getBoundingClientRect();
    let a = (Math.atan2(y - (b.top + b.height / 2), x - (b.left + b.width / 2)) * 180) / Math.PI;
    a = ((a - START) % 360 + 360) % 360;
    if (a > SWEEP) a = a - SWEEP < (360 - SWEEP) / 2 ? SWEEP : 0;
    target.set(Math.round((min + (a / SWEEP) * (max - min)) * 2) / 2);
  };
  const step = (d: number) => {
    const v = Math.max(min, Math.min(max, t + d));
    reduced ? target.set(v) : animate(target, v, { type: "spring", stiffness: 300, damping: 30 });
  };

  return (
    <div className={cn("relative w-[260px] rounded-[36px] bg-zinc-950 p-5 text-white shadow-2xl", className)}>
      <motion.div aria-hidden className="absolute inset-8 rounded-full blur-3xl" animate={{ backgroundColor: glow, opacity: reduced ? 0.25 : mode === "idle" ? 0.12 : [0.2, 0.38, 0.2] }} transition={{ duration: 2.4, repeat: reduced ? 0 : Infinity }} />
      <div
        role="slider"
        tabIndex={0}
        aria-label="Target temperature"
        aria-valuemin={min}
        aria-valuemax={max}
        aria-valuenow={t}
        aria-valuetext={`${t} degrees, ${mode === "heat" ? "heating" : mode === "cool" ? "cooling" : "holding"}`}
        onKeyDown={(e) => {
          if (e.key === "ArrowUp" || e.key === "ArrowRight") (e.preventDefault(), step(0.5));
          if (e.key === "ArrowDown" || e.key === "ArrowLeft") (e.preventDefault(), step(-0.5));
        }}
        className="relative rounded-full outline-none focus-visible:ring-2 focus-visible:ring-white/60"
      >
        <svg
          ref={svg}
          viewBox="0 0 200 200"
          className="block w-full cursor-grab touch-none active:cursor-grabbing"
          onPointerDown={(e) => (e.currentTarget.setPointerCapture(e.pointerId), setFromPointer(e.clientX, e.clientY))}
          onPointerMove={(e) => e.buttons && setFromPointer(e.clientX, e.clientY)}
        >
          <defs>
            <linearGradient id="kn-thermo" x1="0" x2="1" y1="1" y2="0">
              <stop offset="0" stopColor="#38bdf8" />
              <stop offset=".5" stopColor="#a78bfa" />
              <stop offset="1" stopColor="#f97316" />
            </linearGradient>
          </defs>
          {Array.from({ length: 55 }, (_, i) => {
            const a = ((START + (i / 54) * SWEEP) * Math.PI) / 180;
            return <line key={i} x1={100 + Math.cos(a) * 94} y1={100 + Math.sin(a) * 94} x2={100 + Math.cos(a) * (i % 9 ? 90 : 87)} y2={100 + Math.sin(a) * (i % 9 ? 90 : 87)} stroke="#fff" strokeOpacity={i % 9 ? 0.18 : 0.45} strokeWidth="1" />;
          })}
          <circle r="80" cx="100" cy="100" fill="none" stroke="#fff" strokeOpacity=".08" strokeWidth="12" strokeLinecap="round" strokeDasharray={`${ARC} 999`} transform={`rotate(${START} 100 100)`} />
          <motion.circle r="80" cx="100" cy="100" fill="none" stroke="url(#kn-thermo)" strokeWidth="12" strokeLinecap="round" style={{ strokeDasharray: dash }} transform={`rotate(${START} 100 100)`} />
          <motion.circle r="9" fill="#fff" style={{ cx: knobX, cy: knobY }} />
        </svg>
        <div className="pointer-events-none absolute inset-0 grid place-items-center text-center">
          <div>
            <p className="text-[10px] uppercase tracking-[0.25em] text-white/50">{mode === "heat" ? "Heating to" : mode === "cool" ? "Cooling to" : "Holding"}</p>
            <p className="font-mono text-5xl font-light tabular-nums">{t.toFixed(1)}<span className="text-2xl text-white/50">°</span></p>
            <p className="text-xs text-white/50">Inside {current}°</p>
          </div>
        </div>
      </div>
      <div className="relative mt-2 flex justify-center gap-2">
        {([["heat", Flame], ["idle", Wind], ["cool", Snowflake]] as const).map(([m, Icon]) => (
          <span key={m} className={cn("grid size-9 place-items-center rounded-full transition-colors", mode === m ? "bg-white text-black" : "bg-white/5 text-white/40")} aria-hidden>
            <Icon className="size-4" />
          </span>
        ))}
      </div>
    </div>
  );
}
```

## Usage example
```tsx
"use client";
import { DemoCenter } from "@/components/kinetik/demo-helpers" /* or inline */;
import { WidgetThermostat } from "@/components/kinetik/widget-thermostat";

export default function Demo() {
  return (
    <DemoCenter>
      <WidgetThermostat defaultTarget={23.5} current={19} />
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
