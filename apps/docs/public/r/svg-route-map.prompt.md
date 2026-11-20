You are given a task to integrate a component from the **kinetik** motion library into this codebase.

# SVG — Live Route Map (`svg-route-map`)

Delivery-tracking map: a stylised street grid, the route draws itself, a courier marker follows the path and turns to its heading, stops light up as it passes and an ETA counts down.

## What it should do
Draw the route with pathLength=1 and animate dashoffset; each frame get the point at progress × length plus a point 1px ahead for the heading; light stops whose position ≤ progress; derive the ETA.

## Project requirements
- React 19 + TypeScript, Tailwind CSS v4, shadcn/ui-style CSS variables (`background`, `foreground`, `muted`, `muted-foreground`, `border`, `card`, `primary`, `ring`). If the project lacks shadcn, set it up first (`npx shadcn@latest init`).
- Animation engine: **svg**.
- No runtime dependencies (CSS only).
- Put the component at `components/kinetik/svg-route-map.tsx`.
- `cn` lives at `lib/kinetik/utils.ts` (source below).
- Shared hooks go at `lib/kinetik/core.ts` (source below).

## Non-negotiables
- **Accessibility:** role=img with an aria-label carrying the ETA. Reduced motion shows the completed route.
- **Performance:** getPointAtLength each frame on one path; the marker is a single transformed group.
- Respect `prefers-reduced-motion` (replace movement with opacity or an instant change).
- Animate only transform / opacity / filter / clip-path. No hard-coded theme colors — use CSS variables so it works in light and dark.

## Source — components/kinetik/svg-route-map.tsx
```tsx
"use client";
import { useEffect, useId, useRef, useState } from "react";
import { cn, useReducedMotion, useInView } from "@/lib/kinetik/core";

export interface RouteStop { label: string; /** 0–1 along the route */ at: number }
export interface SvgRouteMapProps {
  /** SVG path in a 400×260 viewBox. */
  route?: string;
  stops?: RouteStop[];
  /** Seconds for one trip. */
  duration?: number;
  /** Minutes the trip represents, for the ETA readout. */
  minutes?: number;
  className?: string;
}

const DEFAULT_ROUTE = "M30 220 C 80 220, 90 150, 140 150 S 200 70, 250 90 S 320 200, 370 40";
const DEFAULT_STOPS: RouteStop[] = [
  { label: "Depot", at: 0 },
  { label: "Market St", at: 0.33 },
  { label: "Harbour", at: 0.62 },
  { label: "You", at: 1 },
];

/**
 * Live-delivery map: a stylised street grid, the route draws itself, then a courier marker follows
 * the path (rotating to its heading) with a fading trail, stops light up as it passes and an ETA
 * counts down. Plays when scrolled into view and loops. Reduced motion shows the finished route.
 */
export function SvgRouteMap({ route = DEFAULT_ROUTE, stops = DEFAULT_STOPS, duration = 8, minutes = 18, className }: SvgRouteMapProps) {
  const reduced = useReducedMotion();
  const id = useId().replace(/:/g, "");
  const wrap = useRef<HTMLDivElement>(null);
  const inView = useInView(wrap, { amount: 0.3 });
  const path = useRef<SVGPathElement>(null);
  const [p, setP] = useState(reduced ? 1 : 0);
  const [pos, setPos] = useState({ x: 30, y: 220, a: 0 });
  const [stopPts, setStopPts] = useState<{ x: number; y: number }[]>([]);
  const len = useRef(0);

  useEffect(() => {
    const el = path.current;
    if (!el || typeof el.getTotalLength !== "function") return;
    len.current = el.getTotalLength();
    setStopPts(stops.map((s) => el.getPointAtLength(s.at * len.current)));
  }, [route, stops]);

  useEffect(() => {
    if (reduced) return setP(1);
    if (!inView) return;
    let raf = 0;
    const t0 = performance.now();
    const tick = (now: number) => {
      const cycle = ((now - t0) / 1000) % (duration + 1.5);
      setP(Math.min(1, cycle / duration));
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, reduced, duration]);

  useEffect(() => {
    const el = path.current;
    if (!el || !len.current || typeof el.getPointAtLength !== "function") return;
    const e = ease(p);
    const a = el.getPointAtLength(e * len.current);
    const b = el.getPointAtLength(Math.min(len.current, e * len.current + 1));
    setPos({ x: a.x, y: a.y, a: (Math.atan2(b.y - a.y, b.x - a.x) * 180) / Math.PI });
  }, [p]);

  const e = ease(p);
  const eta = Math.max(0, Math.ceil(minutes * (1 - e)));
  return (
    <div ref={wrap} className={cn("relative overflow-hidden rounded-3xl border bg-[#0d1117] text-white", className)}>
      <svg viewBox="0 0 400 260" className="block w-full" role="img" aria-label={`Delivery route, ${eta} minutes away`}>
        <defs>
          <pattern id={`g-${id}`} width="26" height="26" patternUnits="userSpaceOnUse" patternTransform="rotate(-8)">
            <path d="M0 0H26M0 0V26" stroke="#ffffff" strokeOpacity=".06" strokeWidth="6" />
          </pattern>
          <linearGradient id={`r-${id}`} x1="0" x2="1">
            <stop offset="0" stopColor="#22d3ee" />
            <stop offset="1" stopColor="#a78bfa" />
          </linearGradient>
        </defs>
        <rect width="400" height="260" fill={`url(#g-${id})`} />
        <path d="M0 120 Q 120 90 220 130 T 400 110 V 160 Q 300 175 220 180 T 0 170Z" fill="#1e3a5f" opacity=".35" />
        <path d={route} stroke="#fff" strokeOpacity=".12" strokeWidth="8" fill="none" strokeLinecap="round" />
        <path ref={path} d={route} stroke={`url(#r-${id})`} strokeWidth="4" fill="none" strokeLinecap="round" pathLength={1} strokeDasharray="1" strokeDashoffset={1 - Math.min(1, e + 0.0001)} />
        {stopPts.map((s, i) => {
          const passed = e >= stops[i]!.at - 0.001;
          return (
            <g key={i} transform={`translate(${s.x} ${s.y})`}>
              {passed && !reduced && <circle r="12" fill="#22d3ee" opacity=".18"><animate attributeName="r" values="6;14;6" dur="2s" repeatCount="indefinite" /></circle>}
              <circle r="5.5" fill={passed ? "#22d3ee" : "#0d1117"} stroke={passed ? "#fff" : "#ffffff55"} strokeWidth="2" />
              <text y={i % 2 ? 22 : -12} textAnchor="middle" fontSize="10" fill={passed ? "#fff" : "#ffffff80"} fontFamily="ui-sans-serif, system-ui">{stops[i]!.label}</text>
            </g>
          );
        })}
        {stopPts.length > 0 && (
          <g transform={`translate(${pos.x} ${pos.y}) rotate(${pos.a})`}>
            <circle r="11" fill="#fff" />
            <path d="M-4 -4 L5 0 L-4 4 Z" fill="#0d1117" />
          </g>
        )}
      </svg>
      <div className="absolute left-4 top-4 rounded-2xl bg-white/10 px-3 py-2 backdrop-blur-md">
        <p className="text-[10px] uppercase tracking-widest text-white/60">Arriving in</p>
        <p className="font-mono text-2xl font-semibold tabular-nums">{eta === 0 ? "Here" : `${eta} min`}</p>
      </div>
    </div>
  );
}

const ease = (t: number) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2);
```

## Usage example
```tsx
"use client";
import { DemoCenter } from "@/components/kinetik/demo-helpers" /* or inline */;
import { SvgRouteMap } from "@/components/kinetik/svg-route-map";

export default function Demo() {
  return (
    <DemoCenter>
      <SvgRouteMap className="w-full max-w-lg" />
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
