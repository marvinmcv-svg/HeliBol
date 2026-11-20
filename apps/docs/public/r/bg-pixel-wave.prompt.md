You are given a task to integrate a component from the **kinetik** motion library into this codebase.

# Background — Pixel Wave (`bg-pixel-wave`)

A grid of square pixels driven by interfering sine waves — each cell's size and colour follow the wave height. Clicks (and an occasional automatic drop) send expanding rings across the grid, and the pointer leaves a soft bulge.

## What it should do
For each grid cell compute v = sum of two travelling sines + Gaussian rings from ripple origins (front = age × speed) + a Gaussian bump at the pointer; map v to square size, colour mix and alpha.

## Project requirements
- React 19 + TypeScript, Tailwind CSS v4, shadcn/ui-style CSS variables (`background`, `foreground`, `muted`, `muted-foreground`, `border`, `card`, `primary`, `ring`). If the project lacks shadcn, set it up first (`npx shadcn@latest init`).
- Animation engine: **canvas**.
- No runtime dependencies (CSS only).
- Put the component at `components/kinetik/bg-pixel-wave.tsx`.
- `cn` lives at `lib/kinetik/utils.ts` (source below).
- Shared hooks go at `lib/kinetik/core.ts` (source below).

## Non-negotiables
- **Accessibility:** Canvas is aria-hidden; content sits above it. Reduced motion draws one still frame.
- **Performance:** Single 2D canvas via useCanvas: DPR-aware, paused off-screen and in background tabs.
- Respect `prefers-reduced-motion` (replace movement with opacity or an instant change).
- Animate only transform / opacity / filter / clip-path. No hard-coded theme colors — use CSS variables so it works in light and dark.

## Source — components/kinetik/bg-pixel-wave.tsx
```tsx
"use client";
import { useRef, type ReactNode } from "react";
import { cn, useCanvas } from "@/lib/kinetik/core";

export interface BgPixelWaveProps {
  children?: ReactNode;
  /** Cell size in px. */
  cell?: number;
  /** Two colours the wave blends between. */
  colors?: [string, string];
  className?: string;
}

type Ripple = { x: number; y: number; t: number };

/**
 * A grid of square pixels driven by interfering sine waves; each cell's size and colour follow the
 * wave height. Clicks (and an occasional automatic drop) send out expanding rings that swell the
 * pixels they pass, and the pointer leaves a soft bulge. Reduced motion renders one still frame.
 */
export function BgPixelWave({ children, cell = 14, colors = ["#6366f1", "#22d3ee"], className }: BgPixelWaveProps) {
  const ripples = useRef<Ripple[]>([]);
  const nextAuto = useRef(0.6);
  const [a, b] = [hex(colors[0]), hex(colors[1])];
  const ref = useCanvas(({ ctx, width, height, time, pointer }) => {
    ctx.clearRect(0, 0, width, height);
    if (time > nextAuto.current) {
      ripples.current.push({ x: Math.random() * width, y: Math.random() * height, t: time });
      nextAuto.current = time + 2.4;
    }
    for (const r of ripples.current) if (r.t < 0) r.t = time; // clicks are stamped on the next frame
    ripples.current = ripples.current.filter((r) => time - r.t < 3);
    const cols = Math.ceil(width / cell), rows = Math.ceil(height / cell);
    for (let i = 0; i < cols; i++)
      for (let j = 0; j < rows; j++) {
        const x = i * cell + cell / 2, y = j * cell + cell / 2;
        let v = Math.sin(i * 0.28 + time * 1.3) * 0.5 + Math.sin(j * 0.22 - time * 0.9 + i * 0.08) * 0.5; // -1..1
        for (const r of ripples.current) {
          const age = time - r.t, d = Math.hypot(x - r.x, y - r.y), front = age * 260;
          v += Math.exp(-((d - front) ** 2) / 1800) * 1.6 * (1 - age / 3);
        }
        if (pointer) v += Math.exp(-((x - pointer.x) ** 2 + (y - pointer.y) ** 2) / 5000) * 1.2;
        const k = Math.max(0, Math.min(1, (v + 1) / 2.6));
        const s = cell * (0.12 + 0.72 * k);
        ctx.fillStyle = `rgba(${mix(a[0], b[0], k)},${mix(a[1], b[1], k)},${mix(a[2], b[2], k)},${0.18 + 0.82 * k})`;
        ctx.fillRect(x - s / 2, y - s / 2, s, s);
      }
  });
  const host = useRef<HTMLDivElement>(null);
  return (
    <div
      ref={host}
      className={cn("relative overflow-hidden bg-[#06060c]", className)}
      onPointerDown={(e) => {
        const r = host.current!.getBoundingClientRect();
        ripples.current.push({ x: e.clientX - r.left, y: e.clientY - r.top, t: -1 });
      }}
    >
      <canvas ref={ref} aria-hidden className="absolute inset-0 size-full" />
      {children && <div className="relative z-10 h-full">{children}</div>}
    </div>
  );
}

const hex = (h: string) => { const n = parseInt(h.slice(1), 16); return [n >> 16, (n >> 8) & 255, n & 255] as const; };
const mix = (x: number, y: number, k: number) => Math.round(x + (y - x) * k);
```

## Usage example
```tsx
"use client";
import { BgPixelWave } from "@/components/kinetik/bg-pixel-wave";

export default function Demo() {
  return (
    <BgPixelWave className="h-full">
      <div className="pointer-events-none grid h-full place-items-center p-6 text-center text-white">
        <div>
          <p className="text-[10px] uppercase tracking-[0.35em] text-white/60">Signal</p>
          <h3 className="mt-2 text-5xl font-semibold tracking-tight [text-shadow:0_2px_30px_rgb(0_0_0/.8)]">Every pixel listens</h3>
          <p className="mt-2 text-sm text-white/60">Click anywhere to drop a ripple</p>
        </div>
      </div>
    </BgPixelWave>
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
