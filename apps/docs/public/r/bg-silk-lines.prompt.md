You are given a task to integrate a component from the **kinetik** motion library into this codebase.

# Silk Lines (`bg-silk-lines`)

Dozens of thin strands flowing like one ribbon of silk: each line is a sum of slow sine waves offset by its index, so the bundle twists, folds and catches light; the pointer bends the fabric.

## What it should do
Build silk lines on canvas: for each strand k (0..1) draw a polyline across the width where y = centre + sin(u·3.2 + t·.35 + k·2.4)·(0.5 − k)·H·.38 (the twist) + small flow waves + a Gaussian bump toward the pointer; horizontal gradient stroke fading at both ends, alpha peaking in the middle strands, 'lighter' compositing.

## Project requirements
- React 19 + TypeScript, Tailwind CSS v4, shadcn/ui-style CSS variables (`background`, `foreground`, `muted`, `muted-foreground`, `border`, `card`, `primary`, `ring`). If the project lacks shadcn, set it up first (`npx shadcn@latest init`).
- Animation engine: **canvas**.
- No runtime dependencies (CSS only).
- Put the component at `components/kinetik/bg-silk-lines.tsx`.
- `cn` lives at `lib/kinetik/utils.ts` (source below).
- Shared hooks go at `lib/kinetik/core.ts` (source below).

## Non-negotiables
- **Accessibility:** Decorative canvas. Reduced motion: still frame.
- **Performance:** ~46 strokes per frame with additive blending; paused off-screen.
- Respect `prefers-reduced-motion` (replace movement with opacity or an instant change).
- Animate only transform / opacity / filter / clip-path. No hard-coded theme colors — use CSS variables so it works in light and dark.

## Source — components/kinetik/bg-silk-lines.tsx
```tsx
"use client";
import { cn, useCanvas } from "@/lib/kinetik/core";

export interface BgSilkLinesProps {
  /** Number of strands. */
  lines?: number;
  /** Gradient across strands (6-digit hex). */
  colors?: [string, string];
  /** Strand thickness in px. */
  width?: number;
  className?: string;
}

/**
 * Dozens of thin strands drawn as one flowing ribbon of silk: each line is a sum of slow sine
 * waves offset by its index, so the bundle twists, folds and catches light; the pointer gently
 * bends the fabric toward it. Canvas 2D, paused off-screen.
 */
export function BgSilkLines({ lines = 46, colors = ["#f0abfc", "#60a5fa"], width = 1.1, className }: BgSilkLinesProps) {
  const ref = useCanvas(({ ctx, width: W, height: H, time, pointer }) => {
    ctx.clearRect(0, 0, W, H);
    ctx.lineWidth = width;
    ctx.globalCompositeOperation = "lighter";
    const steps = Math.ceil(W / 8);
    const bend = pointer ? (pointer.y / H - 0.5) * 0.9 : 0;
    const bx = pointer ? pointer.x / W : 0.5;
    for (let i = 0; i < lines; i++) {
      const k = i / (lines - 1);
      const grad = ctx.createLinearGradient(0, 0, W, 0);
      grad.addColorStop(0, `${colors[0]}00`);
      grad.addColorStop(0.3, `${colors[0]}`);
      grad.addColorStop(0.7, `${colors[1]}`);
      grad.addColorStop(1, `${colors[1]}00`);
      ctx.strokeStyle = grad;
      ctx.globalAlpha = 0.18 + 0.5 * Math.sin(k * Math.PI) ** 2;
      ctx.beginPath();
      for (let s = 0; s <= steps; s++) {
        const x = (s / steps) * W;
        const u = x / W;
        // twist: phase shifts with index so strands cross and fold like fabric
        const twist = Math.sin(u * 3.2 + time * 0.35 + k * 2.4) * (0.5 - k) * H * 0.38;
        const flow = Math.sin(u * 5.5 - time * 0.6 + k * 0.6) * H * 0.06;
        const pull = bend * H * 0.3 * Math.exp(-((u - bx) ** 2) * 10);
        const y = H * 0.5 + twist + flow + pull + Math.sin(u * 1.4 + time * 0.2) * H * 0.12;
        if (s === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();
    }
    ctx.globalAlpha = 1;
    ctx.globalCompositeOperation = "source-over";
  });
  return <canvas ref={ref} aria-hidden className={cn("absolute inset-0 size-full", className)} />;
}
```

## Usage example
```tsx
"use client";
import { BgSilkLines } from "@/components/kinetik/bg-silk-lines";

export default function Demo() {
  return (
    <div className="relative grid h-full place-items-center overflow-hidden bg-[#0a0612] text-white">
      <BgSilkLines />
      <div className="relative text-center">
        <h3 className="text-4xl font-semibold tracking-tight sm:text-5xl">Woven in motion</h3>
        <p className="mt-2 text-sm text-white/60">Move your cursor to bend the silk</p>
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
