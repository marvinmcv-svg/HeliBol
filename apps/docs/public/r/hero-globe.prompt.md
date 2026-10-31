You are given a task to integrate a component from the **kinetik** motion library into this codebase.

# Hero — Dotted Globe (`hero-globe`)

Canvas dotted globe (orthographic projection, no WebGL) that rotates, tilts toward the pointer and draws travelling arcs between cities.

## What it should do
Draw a dotted globe on canvas: Fibonacci-sphere points filtered by a pseudo-land mask; orthographic projection with rotation = t·.25 and a pointer-driven tilt; draw only front-facing dots with depth-based alpha; arcs interpolate lat/lon, lift outward by sin(πf)·.18 and sweep along with a 40% trailing window.

## Project requirements
- React 19 + TypeScript, Tailwind CSS v4, shadcn/ui-style CSS variables (`background`, `foreground`, `muted`, `muted-foreground`, `border`, `card`, `primary`, `ring`). If the project lacks shadcn, set it up first (`npx shadcn@latest init`).
- Animation engine: **canvas**.
- No runtime dependencies (CSS only).
- Put the component at `components/kinetik/hero-globe.tsx`.
- `cn` lives at `lib/kinetik/utils.ts` (source below).
- Shared hooks go at `lib/kinetik/core.ts` (source below).

## Non-negotiables
- **Accessibility:** Canvas has role=img and a description; static frame under reduced motion.
- **Performance:** ~800 dots + arcs on a 2D canvas; pauses off-screen.
- Respect `prefers-reduced-motion` (replace movement with opacity or an instant change).
- Animate only transform / opacity / filter / clip-path. No hard-coded theme colors — use CSS variables so it works in light and dark.

## Source — components/kinetik/hero-globe.tsx
```tsx
"use client";
import { useMemo, useRef, type ReactNode } from "react";
import { cn, useCanvas } from "@/lib/kinetik/core";

export interface GlobeArc {
  from: [number, number];
  to: [number, number];
}

/** Dotted rotating globe on canvas (orthographic projection, no WebGL) with animated arcs between cities. Drag-free, pointer tilts it. */
export function HeroGlobe({ arcs = [], children, color = "139 92 246", className }: { arcs?: GlobeArc[]; children?: ReactNode; color?: string; className?: string }) {
  const tilt = useRef(0);
  const pts = useMemo(() => {
    const out: [number, number][] = [];
    const N = 1600;
    for (let i = 0; i < N; i++) {
      const y = 1 - (i / (N - 1)) * 2;
      const r = Math.sqrt(1 - y * y);
      const th = i * 2.399963;
      // crude "land" mask so it reads as a planet, not a ball
      const lat = Math.asin(y);
      const lon = th % (Math.PI * 2);
      const land = Math.sin(lon * 3 + lat * 2) + Math.cos(lat * 4 - lon) > 0.35;
      if (land) out.push([Math.atan2(Math.sin(th) * r, Math.cos(th) * r), lat]);
    }
    return out;
  }, []);
  const ref = useCanvas(({ ctx, width, height, time, pointer }) => {
    ctx.clearRect(0, 0, width, height);
    const R = Math.min(width, height) * 0.42;
    const cx = width / 2;
    const cy = height / 2;
    const rot = time * 0.25;
    if (pointer) tilt.current += ((pointer.y / height - 0.5) * 0.6 - tilt.current) * 0.05;
    const tl = tilt.current;
    const project = (lon: number, lat: number) => {
      const x = Math.cos(lat) * Math.sin(lon + rot);
      const y0 = Math.sin(lat);
      const z0 = Math.cos(lat) * Math.cos(lon + rot);
      const y = y0 * Math.cos(tl) - z0 * Math.sin(tl);
      const z = y0 * Math.sin(tl) + z0 * Math.cos(tl);
      return { x: cx + x * R, y: cy - y * R, z };
    };
    const g = ctx.createRadialGradient(cx - R * 0.3, cy - R * 0.3, R * 0.1, cx, cy, R);
    g.addColorStop(0, `rgb(${color} / .18)`);
    g.addColorStop(1, `rgb(${color} / .02)`);
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(cx, cy, R, 0, Math.PI * 2);
    ctx.fill();
    for (const [lon, lat] of pts) {
      const p = project(lon, lat);
      if (p.z < 0) continue;
      ctx.fillStyle = `rgb(${color} / ${0.25 + p.z * 0.7})`;
      ctx.fillRect(p.x, p.y, 1.6, 1.6);
    }
    const rad = (d: number) => (d * Math.PI) / 180;
    arcs.forEach((a, i) => {
      const t = ((time * 0.35 + i * 0.27) % 1.4) / 1;
      const steps = 40;
      ctx.strokeStyle = "rgb(244 114 182 / .9)";
      ctx.lineWidth = 1.6;
      ctx.beginPath();
      let started = false;
      for (let s = 0; s <= steps; s++) {
        const f = s / steps;
        if (f > Math.min(1, t)) break;
        if (f < Math.max(0, t - 0.4)) continue;
        const lon = rad(a.from[1] + (a.to[1] - a.from[1]) * f);
        const lat = rad(a.from[0] + (a.to[0] - a.from[0]) * f);
        const lift = 1 + Math.sin(f * Math.PI) * 0.18;
        const p = project(lon, lat);
        const x = cx + (p.x - cx) * lift;
        const y = cy + (p.y - cy) * lift;
        if (p.z < -0.1) continue;
        if (!started) ctx.moveTo(x, y), (started = true);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();
    });
  });
  return (
    <div className={cn("relative isolate overflow-hidden", className)}>
      <canvas ref={ref} role="img" aria-label="Rotating globe with connections between cities" className="absolute inset-0 -z-10 h-full w-full" />
      {children}
    </div>
  );
}
```

## Usage example
```tsx
"use client";
import { HeroGlobe } from "@/components/kinetik/hero-globe";
export default function Demo() {
  return (
    <HeroGlobe className="flex h-full w-full items-end justify-center p-8" arcs={[{ from: [38.7, -9.1], to: [40.7, -74] }, { from: [51.5, -0.1], to: [35.7, 139.7] }, { from: [-23.5, -46.6], to: [48.9, 2.3] }, { from: [1.35, 103.8], to: [37.8, -122.4] }]}>
      <div className="rounded-2xl border border-border bg-background/70 px-5 py-3 text-center backdrop-blur"><p className="text-xl font-semibold tracking-tight">Deployed to 38 regions</p><p className="text-xs text-muted-foreground">Edge-fast, everywhere.</p></div>
    </HeroGlobe>
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
