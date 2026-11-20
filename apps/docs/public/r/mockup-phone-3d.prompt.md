You are given a task to integrate a component from the **kinetik** motion library into this codebase.

# 3D Phone Mockup (`mockup-phone-3d`)

A real 3D phone in CSS — front, back and four sides with depth — resting at a three-quarter angle and turning toward the pointer on a spring, with glare sweeping the glass and the shadow shifting. Any React content renders live on the screen.

## What it should do
Build a CSS 3D phone: a preserve-3d box with a front (screen + bezel + island), a back translated by −depth and rotated 180°, and four side faces rotated ±90° about their edges; rotateX/Y springs follow the pointer around a three-quarter rest pose; a glare stripe's position and a soft floor shadow follow rotateY.

## Project requirements
- React 19 + TypeScript, Tailwind CSS v4, shadcn/ui-style CSS variables (`background`, `foreground`, `muted`, `muted-foreground`, `border`, `card`, `primary`, `ring`). If the project lacks shadcn, set it up first (`npx shadcn@latest init`).
- Animation engine: **motion**.
- Install dependencies: `npm i motion`
- Put the component at `components/kinetik/mockup-phone-3d.tsx`.
- `cn` lives at `lib/kinetik/utils.ts` (source below).
- Shared hooks go at `lib/kinetik/core.ts` (source below).

## Non-negotiables
- **Accessibility:** Screen content is live and keyboard-accessible; the device chrome is decorative. Rotation off on touch/reduced motion.
- **Performance:** CSS preserve-3d; rotation via springs (no re-render).
- Respect `prefers-reduced-motion` (replace movement with opacity or an instant change).
- Animate only transform / opacity / filter / clip-path. No hard-coded theme colors — use CSS variables so it works in light and dark.

## Source — components/kinetik/mockup-phone-3d.tsx
```tsx
"use client";
import { useRef, type ReactNode } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "motion/react";
import { cn, usePrefersTouch, useReducedMotion } from "@/lib/kinetik/core";

export interface MockupPhone3DProps {
  /** Screen content. */
  children: ReactNode;
  /** Resting rotation (deg) — a slight three-quarter view reads as "3D". */
  restY?: number;
  restX?: number;
  className?: string;
}

const W = 240, H = 500, D = 18; // px: width, height, depth

/**
 * A real 3D phone in CSS (front, back and four sides with depth), resting at a three-quarter angle
 * and turning toward the pointer with a spring; a moving glare sweeps the glass as it turns and the
 * shadow underneath shifts. Any React content renders live on the screen.
 */
export function MockupPhone3D({ children, restY = -22, restX = 8, className }: MockupPhone3DProps) {
  const reduced = useReducedMotion();
  const touch = usePrefersTouch();
  const box = useRef<HTMLDivElement>(null);
  const rx = useSpring(useMotionValue(restX), { stiffness: 90, damping: 16 });
  const ry = useSpring(useMotionValue(restY), { stiffness: 90, damping: 16 });
  const glare = useTransform(ry, [-40, 40], ["-60%", "160%"]);
  const shadowX = useTransform(ry, [-40, 40], [30, -30]);

  return (
    <div
      ref={box}
      className={cn("relative grid place-items-center", className)}
      style={{ perspective: 1400, width: W + 120, height: H + 80 }}
      onPointerMove={(e) => {
        if (reduced || touch) return;
        const r = box.current!.getBoundingClientRect();
        ry.set(restY + ((e.clientX - r.left) / r.width - 0.5) * 50);
        rx.set(restX - ((e.clientY - r.top) / r.height - 0.5) * 24);
      }}
      onPointerLeave={() => (ry.set(restY), rx.set(restX))}
    >
      <motion.span aria-hidden className="absolute bottom-2 h-6 w-48 rounded-[50%] bg-black/45 blur-xl" style={{ x: shadowX }} />
      <motion.div className="relative" style={{ width: W, height: H, transformStyle: "preserve-3d", rotateX: rx, rotateY: ry }}>
        {/* sides */}
        <span aria-hidden className="absolute left-0 top-0 h-full rounded-[2rem] bg-zinc-700" style={{ width: D, transform: `rotateY(-90deg) translateZ(${0}px)`, transformOrigin: "left" }} />
        <span aria-hidden className="absolute right-0 top-0 h-full rounded-[2rem] bg-zinc-600" style={{ width: D, transform: `rotateY(90deg)`, transformOrigin: "right" }} />
        <span aria-hidden className="absolute left-6 right-6 top-0 bg-zinc-600" style={{ height: D, transform: "rotateX(90deg)", transformOrigin: "top" }} />
        <span aria-hidden className="absolute bottom-0 left-6 right-6 bg-zinc-800" style={{ height: D, transform: "rotateX(-90deg)", transformOrigin: "bottom" }} />
        {/* back */}
        <span aria-hidden className="absolute inset-0 rounded-[2.4rem] bg-gradient-to-br from-zinc-600 to-zinc-800" style={{ transform: `translateZ(${-D}px) rotateY(180deg)` }}>
          <span className="absolute left-5 top-5 size-16 rounded-2xl bg-zinc-900/70 ring-1 ring-zinc-500" />
        </span>
        {/* front */}
        <div className="absolute inset-0 overflow-hidden rounded-[2.4rem] bg-black p-[9px] shadow-[inset_0_0_0_2px_rgb(120_120_130)]" style={{ transform: "translateZ(0.5px)" }}>
          <div className="relative size-full overflow-hidden rounded-[1.9rem] bg-background">
            {children}
            <span aria-hidden className="pointer-events-none absolute left-1/2 top-2.5 h-6 w-20 -translate-x-1/2 rounded-full bg-black" />
            {!reduced && <motion.span aria-hidden className="pointer-events-none absolute -top-1/4 h-[150%] w-1/3 rotate-12 bg-gradient-to-r from-transparent via-white/25 to-transparent" style={{ left: glare }} />}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
```

## Usage example
```tsx
"use client";
import { photos } from "@/components/kinetik/demo-helpers" /* or inline */;
import { MockupPhone3D } from "@/components/kinetik/mockup-phone-3d";

export default function Demo() {
  return (
    <div className="grid h-full place-items-center overflow-hidden bg-[radial-gradient(circle_at_50%_40%,#27272a,#09090b_70%)]">
      <MockupPhone3D className="scale-[0.8]">
        <div className="flex h-full flex-col bg-white text-zinc-900">
          <img src={photos[5]} alt="" className="h-1/2 w-full object-cover" />
          <div className="space-y-2 p-4">
            <p className="text-[10px] uppercase tracking-widest text-zinc-400">Tonight</p>
            <p className="text-lg font-semibold leading-tight">Aurora forecast: strong</p>
            <p className="text-xs text-zinc-500">Kp 6 · clear skies after 22:00</p>
            <div className="mt-3 h-1.5 rounded-full bg-zinc-100"><div className="h-full w-4/5 rounded-full bg-violet-500" /></div>
          </div>
        </div>
      </MockupPhone3D>
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
