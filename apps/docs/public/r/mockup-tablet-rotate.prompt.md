You are given a task to integrate a component from the **kinetik** motion library into this codebase.

# Mockup — Rotating Tablet (`mockup-tablet-rotate`)

Tablet mockup that physically turns between portrait and landscape with a spring while the screen content reflows — pass a render function and lay out differently per orientation; layout-animated children glide to their new spots.

## What it should do
Animate the device frame's width/height between landscape and portrait with a spring; render children(orientation) inside a layout container so motion children reflow; a rotate button with a small spinning device glyph.

## Project requirements
- React 19 + TypeScript, Tailwind CSS v4, shadcn/ui-style CSS variables (`background`, `foreground`, `muted`, `muted-foreground`, `border`, `card`, `primary`, `ring`). If the project lacks shadcn, set it up first (`npx shadcn@latest init`).
- Animation engine: **motion**.
- Install dependencies: `npm i motion`
- Put the component at `components/kinetik/mockup-tablet-rotate.tsx`.
- `cn` lives at `lib/kinetik/utils.ts` (source below).
- Shared hooks go at `lib/kinetik/core.ts` (source below).

## Non-negotiables
- **Accessibility:** Rotate control is a labelled button; content stays upright and readable. Reduced motion switches instantly.
- **Performance:** Device size animates via springs; inner content uses layout animations.
- Respect `prefers-reduced-motion` (replace movement with opacity or an instant change).
- Animate only transform / opacity / filter / clip-path. No hard-coded theme colors — use CSS variables so it works in light and dark.

## Source — components/kinetik/mockup-tablet-rotate.tsx
```tsx
"use client";
import { useState, type ReactNode } from "react";
import { motion } from "motion/react";
import { cn, useReducedMotion } from "@/lib/kinetik/core";

export interface MockupTabletRotateProps {
  /** Render the screen for an orientation; reflow your layout per orientation. */
  children: (orientation: "portrait" | "landscape") => ReactNode;
  defaultOrientation?: "portrait" | "landscape";
  /** Width of the long side in px. */
  size?: number;
  className?: string;
}

/**
 * Tablet mockup that physically rotates between portrait and landscape: the device spins 90° with a
 * spring while the screen counter-rotates so the content stays upright and reflows — pass a render
 * function and lay out differently per orientation (children with `layout` animate to new spots).
 */
export function MockupTabletRotate({ children, defaultOrientation = "landscape", size = 440, className }: MockupTabletRotateProps) {
  const reduced = useReducedMotion();
  const [o, setO] = useState(defaultOrientation);
  const land = o === "landscape";
  const long = size, short = Math.round(size * 0.72);
  const t = reduced ? { duration: 0 } : { type: "spring" as const, stiffness: 120, damping: 18 };
  return (
    <div className={cn("flex flex-col items-center gap-5", className)}>
      <div className="grid place-items-center" style={{ width: long, height: long * 0.86 }}>
        <motion.div
          className="relative rounded-[28px] bg-gradient-to-br from-zinc-300 via-zinc-400 to-zinc-500 p-[3px] shadow-[0_40px_80px_-30px_rgb(0_0_0/.55)] dark:from-zinc-600 dark:via-zinc-800 dark:to-zinc-700"
          initial={false}
          animate={{ width: land ? long : short, height: land ? short : long * 0.86 }}
          transition={t}
        >
          <div className="relative h-full w-full overflow-hidden rounded-[25px] bg-black p-[12px]">
            <span aria-hidden className={cn("absolute size-1.5 rounded-full bg-zinc-700", land ? "left-[5px] top-1/2 -translate-y-1/2" : "left-1/2 top-[5px] -translate-x-1/2")} />
            <motion.div layout transition={t} className="relative h-full w-full overflow-hidden rounded-[14px] bg-background">
              {children(o)}
            </motion.div>
          </div>
        </motion.div>
      </div>
      <button type="button" onClick={() => setO(land ? "portrait" : "landscape")} aria-label={`Rotate to ${land ? "portrait" : "landscape"}`} className="inline-flex items-center gap-2 rounded-full border bg-background px-4 py-1.5 text-xs font-medium">
        <motion.span aria-hidden animate={{ rotate: land ? 0 : 90 }} transition={t} className="inline-block h-3 w-4 rounded-[3px] border-2 border-current" />
        {land ? "Portrait" : "Landscape"}
      </button>
    </div>
  );
}
```

## Usage example
```tsx
"use client";
import { motion } from "motion/react";
import { DemoCenter, photos } from "@/components/kinetik/demo-helpers" /* or inline */;
import { MockupTabletRotate } from "@/components/kinetik/mockup-tablet-rotate";

const spring = { type: "spring" as const, stiffness: 140, damping: 20 };

export default function Demo() {
  return (
    <DemoCenter>
      <MockupTabletRotate size={420}>
        {(o) => (
          <div className={o === "landscape" ? "grid h-full grid-cols-[1.2fr_1fr] gap-2 p-2" : "grid h-full grid-rows-[1fr_auto] gap-2 p-2"}>
            <motion.img layout transition={spring} src={photos[3]} alt="" className="h-full min-h-0 w-full rounded-lg object-cover" />
            <motion.div layout transition={spring} className={o === "landscape" ? "flex flex-col justify-center gap-1.5 p-2" : "grid grid-cols-3 gap-2"}>
              <motion.p layout="position" className="text-[9px] uppercase tracking-[0.25em] text-muted-foreground">Field notes</motion.p>
              <motion.h3 layout="position" className="text-lg font-semibold leading-tight tracking-tight">Canopy at dawn</motion.h3>
              {o === "landscape" && <p className="text-[11px] leading-snug text-muted-foreground">Rotate the tablet — the device spins and the layout reflows to fit.</p>}
              {o === "portrait" && <motion.img layout src={photos[1]} alt="" className="aspect-square w-full rounded-md object-cover" />}
            </motion.div>
          </div>
        )}
      </MockupTabletRotate>
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
