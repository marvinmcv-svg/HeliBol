You are given a task to integrate a component from the **kinetik** motion library into this codebase.

# Square Pattern (`bg-square-pattern`)

A grid of small squares lit by a travelling wave — diagonal sweep, radial pulse or digital rain — with a soft glow under the cursor.

## What it should do
Build a square-pattern background on canvas: a grid of cell−gap squares. Brightness = .06 + max(0, wave)³·.55 where wave is sin((x+y)·.35 − 2.4t) (diagonal), sin(dist·.5 − 2.6t) (radial) or a per-column falling head with an 8-cell tail (rain); add a glow within 140 px of the pointer.

## Project requirements
- React 19 + TypeScript, Tailwind CSS v4, shadcn/ui-style CSS variables (`background`, `foreground`, `muted`, `muted-foreground`, `border`, `card`, `primary`, `ring`). If the project lacks shadcn, set it up first (`npx shadcn@latest init`).
- Animation engine: **canvas**.
- No runtime dependencies (CSS only).
- Put the component at `components/kinetik/bg-square-pattern.tsx`.
- `cn` lives at `lib/kinetik/utils.ts` (source below).
- Shared hooks go at `lib/kinetik/core.ts` (source below).

## Non-negotiables
- **Accessibility:** Decorative canvas. Reduced motion: one static frame.
- **Performance:** fillRect per cell (~2–3k cells), paused off-screen.
- Respect `prefers-reduced-motion` (replace movement with opacity or an instant change).
- Animate only transform / opacity / filter / clip-path. No hard-coded theme colors — use CSS variables so it works in light and dark.

## Source — components/kinetik/bg-square-pattern.tsx
```tsx
"use client";
import { cn, useCanvas } from "@/lib/kinetik/core";

export interface BgSquarePatternProps {
  /** Cell size in CSS px. */
  cell?: number;
  /** Gap between squares in CSS px. */
  gap?: number;
  /** RGB triplet for lit squares, e.g. "167,139,250". */
  color?: string;
  /** Wave pattern travelling across the grid. */
  pattern?: "diagonal" | "radial" | "rain";
  className?: string;
}

/**
 * A grid of small squares lit by a travelling wave (diagonal sweep, radial pulse or digital rain),
 * plus a soft glow that follows the cursor. Static dim grid under reduced motion.
 */
export function BgSquarePattern({ cell = 18, gap = 3, color = "167,139,250", pattern = "diagonal", className }: BgSquarePatternProps) {
  const ref = useCanvas(({ ctx, width, height, time, pointer }) => {
    ctx.clearRect(0, 0, width, height);
    const cols = Math.ceil(width / cell), rows = Math.ceil(height / cell);
    const cx = cols / 2, cy = rows / 2;
    const size = cell - gap;
    for (let x = 0; x < cols; x++) {
      for (let y = 0; y < rows; y++) {
        let w = 0;
        if (pattern === "diagonal") w = Math.sin((x + y) * 0.35 - time * 2.4);
        else if (pattern === "radial") w = Math.sin(Math.hypot(x - cx, y - cy) * 0.5 - time * 2.6);
        else {
          // rain: each column has its own falling head
          const head = ((time * (6 + ((x * 7919) % 11)) + x * 13) % (rows + 12)) - 6;
          const d = head - y;
          w = d >= 0 && d < 8 ? 1 - d / 8 : -1;
        }
        let a = 0.06 + Math.max(0, w) ** 3 * 0.55;
        if (pointer) {
          const d = Math.hypot(x * cell + cell / 2 - pointer.x, y * cell + cell / 2 - pointer.y);
          a += Math.max(0, 1 - d / 140) * 0.5;
        }
        ctx.fillStyle = `rgba(${color},${Math.min(0.9, a)})`;
        ctx.fillRect(x * cell + gap / 2, y * cell + gap / 2, size, size);
      }
    }
  });
  return <canvas ref={ref} aria-hidden className={cn("absolute inset-0 size-full", className)} />;
}
```

## Usage example
```tsx
"use client";
import { useState } from "react";
import { BgSquarePattern, type BgSquarePatternProps } from "@/components/kinetik/bg-square-pattern";

const patterns: NonNullable<BgSquarePatternProps["pattern"]>[] = ["diagonal", "radial", "rain"];

export default function Demo() {
  const [p, setP] = useState<(typeof patterns)[number]>("diagonal");
  return (
    <div className="relative grid h-full place-items-center overflow-hidden bg-[#0a0a12] text-white">
      <BgSquarePattern pattern={p} />
      <div className="relative flex gap-1.5 rounded-full border border-white/10 bg-black/60 p-1 text-xs backdrop-blur">
        {patterns.map((x) => (
          <button key={x} onClick={() => setP(x)} aria-pressed={x === p} className={`rounded-full px-3 py-1 capitalize ${x === p ? "bg-white text-black" : "text-white/70"}`}>{x}</button>
        ))}
      </div>
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
