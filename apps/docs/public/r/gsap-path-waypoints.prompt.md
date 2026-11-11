You are given a task to integrate a component from the **kinetik** motion library into this codebase.

# Motion Path Waypoints (`gsap-path-waypoints`)

Delivery-tracker route: a marker drives along a winding path to any waypoint (from wherever it is), facing the road, while the travelled route draws itself.

## What it should do
gsap.to(marker, { motionPath: { path, align: path, alignOrigin [.5,.5], autoRotate: true, start: currentProgress, end: target.at }, duration .6 + |Δ|·2.2, power2.inOut }) together with gsap.to(trail, { drawSVG: `0% ${target.at·100}%` }); position stop circles with path.getPointAtLength(total·at).

## Project requirements
- React 19 + TypeScript, Tailwind CSS v4, shadcn/ui-style CSS variables (`background`, `foreground`, `muted`, `muted-foreground`, `border`, `card`, `primary`, `ring`). If the project lacks shadcn, set it up first (`npx shadcn@latest init`).
- Animation engine: **gsap**.
- Install dependencies: `npm i gsap @gsap/react`
- Put the component at `components/kinetik/gsap-path-waypoints.tsx`.
- `cn` lives at `lib/kinetik/utils.ts` (source below).
- Shared hooks go at `lib/kinetik/core.ts` (source below).

## Non-negotiables
- **Accessibility:** SVG labelled with the current stop; stops are buttons with aria-pressed and a text detail line. Reduced motion jumps.
- **Performance:** motionPath start/end on one marker + one drawSVG tween.
- Respect `prefers-reduced-motion` (replace movement with opacity or an instant change).
- Animate only transform / opacity / filter / clip-path. No hard-coded theme colors — use CSS variables so it works in light and dark.

## Source — components/kinetik/gsap-path-waypoints.tsx
```tsx
"use client";
import { useRef, useState } from "react";
import gsap from "gsap";
import { MotionPathPlugin } from "gsap/MotionPathPlugin";
import { DrawSVGPlugin } from "gsap/DrawSVGPlugin";
import { useGSAP } from "@gsap/react";
import { cn, useReducedMotion } from "@/lib/kinetik/core";

gsap.registerPlugin(MotionPathPlugin, DrawSVGPlugin, useGSAP);

export interface Waypoint {
  label: string;
  /** Position along the path, 0..1. */
  at: number;
  detail?: string;
}

export interface GsapPathWaypointsProps {
  waypoints: Waypoint[];
  /** Path in a 0..600 × 0..300 viewBox. */
  d?: string;
  className?: string;
}

const ROUTE = "M30,250 C120,250 110,60 220,70 S330,240 410,200 S470,40 570,50";

/**
 * A marker travels a winding route between waypoints (MotionPathPlugin with `start`/`end`
 * so it can go to any stop from wherever it is, autoRotate to face the road) while the
 * travelled part of the route draws itself with DrawSVG.
 */
export function GsapPathWaypoints({ waypoints, d = ROUTE, className }: GsapPathWaypointsProps) {
  const root = useRef<HTMLDivElement>(null);
  const pos = useRef(0);
  const [active, setActive] = useState(0);
  const reduced = useReducedMotion();

  const { contextSafe } = useGSAP(
    () => {
      const q = gsap.utils.selector(root);
      const path = q("[data-route]")[0] as unknown as SVGPathElement;
      q("[data-stop]").forEach((el, i) => {
        if (typeof path?.getTotalLength !== "function") return;
        const p = path.getPointAtLength(path.getTotalLength() * waypoints[i].at);
        if (p) gsap.set(el, { x: p.x, y: p.y });
      });
      gsap.set(q("[data-trail]"), { drawSVG: "0%" });
      place(waypoints[0].at, 0);
    },
    { scope: root },
  );

  const place = contextSafe((at: number, dur: number) => {
    const q = gsap.utils.selector(root);
    const from = pos.current;
    pos.current = at;
    const route = q("[data-route]")[0] as unknown as SVGPathElement;
    // no SVG layout (SSR / jsdom): nothing to measure
    if (typeof route?.getCTM !== "function" || typeof route.getTotalLength !== "function") return;
    gsap.to(q("[data-marker]"), {
      motionPath: { path: route, align: route, alignOrigin: [0.5, 0.5], autoRotate: true, start: from, end: at },
      duration: reduced ? 0 : dur,
      ease: "power2.inOut",
      overwrite: true,
    });
    gsap.to(q("[data-trail]"), { drawSVG: `0% ${at * 100}%`, duration: reduced ? 0 : dur, ease: "power2.inOut", overwrite: true });
  });

  const go = (i: number) => {
    setActive(i);
    place(waypoints[i].at, 0.6 + Math.abs(waypoints[i].at - pos.current) * 2.2);
  };

  return (
    <div ref={root} className={cn("w-full", className)}>
      <svg viewBox="0 0 600 300" className="w-full overflow-visible" role="img" aria-label={`Route, currently at ${waypoints[active].label}`}>
        <path data-route d={d} fill="none" stroke="currentColor" strokeOpacity="0.15" strokeWidth="10" strokeLinecap="round" />
        <path d={d} fill="none" stroke="currentColor" strokeOpacity="0.35" strokeWidth="1.5" strokeDasharray="4 8" />
        <path data-trail d={d} fill="none" stroke="#8b5cf6" strokeWidth="5" strokeLinecap="round" />
        {waypoints.map((w, i) => (
          <g key={w.label} data-stop>
            <circle r="9" fill="var(--background, #000)" stroke={i <= active ? "#8b5cf6" : "currentColor"} strokeOpacity={i <= active ? 1 : 0.4} strokeWidth="3" />
            <text y="-18" textAnchor="middle" fontSize="13" fill="currentColor" opacity={i === active ? 1 : 0.55}>{w.label}</text>
          </g>
        ))}
        <g data-marker>
          <path d="M-12,-9 L14,0 L-12,9 L-6,0 Z" fill="#f59e0b" />
        </g>
      </svg>
      <div className="mt-4 flex flex-wrap justify-center gap-2">
        {waypoints.map((w, i) => (
          <button key={w.label} onClick={() => go(i)} aria-pressed={active === i} className={cn("rounded-full border px-3 py-1 text-xs transition-colors", active === i ? "border-foreground bg-foreground text-background" : "border-border text-muted-foreground")}>
            {w.label}
          </button>
        ))}
      </div>
      {waypoints[active].detail && <p className="mt-2 text-center text-xs text-muted-foreground">{waypoints[active].detail}</p>}
    </div>
  );
}
```

## Usage example
```tsx
"use client";
import { GsapPathWaypoints } from "@/components/kinetik/gsap-path-waypoints";

export default function Demo() {
  return (
    <div className="grid h-full w-full place-items-center p-6">
      <GsapPathWaypoints
        className="max-w-xl"
        waypoints={[
          { label: "Order placed", at: 0, detail: "We got it — 09:12" },
          { label: "Packed", at: 0.27, detail: "Boxed with care in Lisbon" },
          { label: "In transit", at: 0.55, detail: "Somewhere over the Pyrenees" },
          { label: "Out for delivery", at: 0.8, detail: "Driver is 4 stops away" },
          { label: "Delivered", at: 1, detail: "Left at the front door" },
        ]}
      />
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
