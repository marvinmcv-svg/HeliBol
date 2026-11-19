You are given a task to integrate a component from the **kinetik** motion library into this codebase.

# Liquid Orb Loader (`loader-liquid`)

A glass orb filling with liquid: two counter-moving waves rise to the value with a soft ease, bubbles drift up, and the percentage flips contrast as the liquid passes behind it. Indeterminate mode bobs.

## What it should do
Build a liquid orb loader in SVG: a circle clip containing a group translated to (100 − value) with two seamless wave paths looping in opposite directions (animateTransform), rising bubbles (animate cy/opacity), a glass highlight gradient on top and a mix-blend-difference percentage in the centre.

## Project requirements
- React 19 + TypeScript, Tailwind CSS v4, shadcn/ui-style CSS variables (`background`, `foreground`, `muted`, `muted-foreground`, `border`, `card`, `primary`, `ring`). If the project lacks shadcn, set it up first (`npx shadcn@latest init`).
- Animation engine: **svg**.
- No runtime dependencies (CSS only).
- Put the component at `components/kinetik/loader-liquid.tsx`.
- `cn` lives at `lib/kinetik/utils.ts` (source below).
- Shared hooks go at `lib/kinetik/core.ts` (source below).

## Non-negotiables
- **Accessibility:** role=progressbar with valuenow (omitted when indeterminate). Reduced motion: still surface.
- **Performance:** SVG only: SMIL loops, one CSS transform transition.
- Respect `prefers-reduced-motion` (replace movement with opacity or an instant change).
- Animate only transform / opacity / filter / clip-path. No hard-coded theme colors — use CSS variables so it works in light and dark.

## Source — components/kinetik/loader-liquid.tsx
```tsx
"use client";
import { useId } from "react";
import { cn, useReducedMotion } from "@/lib/kinetik/core";

export interface LoaderLiquidProps {
  /** 0–100. Omit for an indeterminate slosh. */
  value?: number;
  size?: number;
  color?: string;
  label?: string;
  className?: string;
}

/**
 * A glass orb filling with liquid: two counter-moving waves (SVG paths with SMIL loops) rise to the
 * value with a soft ease, bubbles drift up, and the number sits on top with a contrast flip where the
 * liquid passes behind it. Indeterminate mode bobs half full.
 */
export function LoaderLiquid({ value, size = 140, color = "#8b5cf6", label = "Loading", className }: LoaderLiquidProps) {
  const reduced = useReducedMotion();
  const id = `ll-${useId().replace(/:/g, "")}`;
  const v = value === undefined ? 50 : Math.max(0, Math.min(100, value));
  const level = 100 - v; // y of the surface in a 0–100 viewBox
  const wave = "M0 4 Q 12.5 0 25 4 T 50 4 T 75 4 T 100 4 T 125 4 T 150 4 T 175 4 T 200 4 V 120 H 0 Z";
  return (
    <div
      role="progressbar"
      aria-label={label}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={value === undefined ? undefined : Math.round(v)}
      className={cn("relative inline-grid place-items-center", className)}
      style={{ width: size, height: size }}
    >
      <svg viewBox="0 0 100 100" className="absolute inset-0 size-full" aria-hidden>
        <defs>
          <clipPath id={id}><circle cx="50" cy="50" r="46" /></clipPath>
          <radialGradient id={`${id}-g`} cx="35%" cy="30%" r="70%"><stop offset="0" stopColor="#fff" stopOpacity=".35" /><stop offset="1" stopColor="#fff" stopOpacity="0" /></radialGradient>
        </defs>
        <circle cx="50" cy="50" r="48" fill="none" stroke={color} strokeOpacity=".35" strokeWidth="2" />
        <g clipPath={`url(#${id})`}>
          <g style={{ transform: `translateY(${level}px)`, transition: reduced ? undefined : "transform 1s cubic-bezier(.22,1,.36,1)" }}>
            <g>
            <g opacity=".5">
              <path d={wave} fill={color} />
              {!reduced && <animateTransform attributeName="transform" type="translate" from="-100 0" to="0 0" dur="3.2s" repeatCount="indefinite" />}
            </g>
            <g>
              <path d={wave} fill={color} transform="translate(0 3)" />
              {!reduced && <animateTransform attributeName="transform" type="translate" from="0 0" to="-100 0" dur="2s" repeatCount="indefinite" />}
            </g>
              {value === undefined && !reduced && <animateTransform attributeName="transform" type="translate" values="0 -4;0 4;0 -4" dur="2.4s" repeatCount="indefinite" />}
            </g>
          </g>
          {!reduced &&
            [18, 42, 64, 80].map((x, i) => (
              <circle key={x} cx={x} cy="100" r={1 + (i % 2)} fill="#fff" opacity=".55">
                <animate attributeName="cy" from="100" to={String(Math.max(level, 20))} dur={`${2 + i * 0.6}s`} begin={`${i * 0.5}s`} repeatCount="indefinite" />
                <animate attributeName="opacity" values=".6;0" dur={`${2 + i * 0.6}s`} begin={`${i * 0.5}s`} repeatCount="indefinite" />
              </circle>
            ))}
        </g>
        <circle cx="50" cy="50" r="46" fill={`url(#${id}-g)`} />
      </svg>
      {value !== undefined && (
        <span className="relative text-2xl font-semibold tabular-nums mix-blend-difference text-white">{Math.round(v)}%</span>
      )}
    </div>
  );
}
```

## Usage example
```tsx
"use client";
import { useEffect, useState } from "react";
import { DemoCenter } from "@/components/kinetik/demo-helpers" /* or inline */;
import { LoaderLiquid } from "@/components/kinetik/loader-liquid";

export default function Demo() {
  const [v, setV] = useState(12);
  useEffect(() => {
    const id = setInterval(() => setV((x) => (x >= 100 ? 8 : Math.min(100, x + 11))), 900);
    return () => clearInterval(id);
  }, []);
  return (
    <DemoCenter className="gap-10">
      <LoaderLiquid value={v} label="Uploading" />
      <LoaderLiquid size={90} color="#14b8a6" label="Syncing" />
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
