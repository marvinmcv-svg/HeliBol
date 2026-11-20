You are given a task to integrate a component from the **kinetik** motion library into this codebase.

# Hero — Depth Landscape (`hero-depth-landscape`)

Editorial landscape hero: five ridge layers, a glowing sun and drifting fog move at different depths with the pointer (spring) and with scroll, while the headline sits between the mountains — in front of the far ridges, behind the near ones.

## What it should do
Build a depth-landscape hero: generate N deterministic jagged ridge paths (wider than the view), stack them as absolutely positioned SVGs; each layer's x/y = pointer offset × depth (springs) + scroll offset × depth; render the headline between the far and near halves of the stack so near ridges overlap it; add a glowing sun and a drifting blurred fog band.

## Project requirements
- React 19 + TypeScript, Tailwind CSS v4, shadcn/ui-style CSS variables (`background`, `foreground`, `muted`, `muted-foreground`, `border`, `card`, `primary`, `ring`). If the project lacks shadcn, set it up first (`npx shadcn@latest init`).
- Animation engine: **motion**.
- Install dependencies: `npm i motion`
- Put the component at `components/kinetik/hero-depth-landscape.tsx`.
- `cn` lives at `lib/kinetik/utils.ts` (source below).
- Shared hooks go at `lib/kinetik/core.ts` (source below).

## Non-negotiables
- **Accessibility:** Headline is real HTML; layers aria-hidden. Pointer parallax off on touch; reduced motion: static scene.
- **Performance:** Five SVG layers with transforms from motion values; no re-renders while moving.
- Respect `prefers-reduced-motion` (replace movement with opacity or an instant change).
- Animate only transform / opacity / filter / clip-path. No hard-coded theme colors — use CSS variables so it works in light and dark.

## Source — components/kinetik/hero-depth-landscape.tsx
```tsx
"use client";
import { useRef, type ReactNode } from "react";
import { motion, useMotionValue, useScroll, useSpring, useTransform, type MotionValue } from "motion/react";
import { cn, usePrefersTouch, useReducedMotion } from "@/lib/kinetik/core";

export interface HeroDepthLandscapeProps {
  children?: ReactNode;
  /** Sky gradient top → horizon. */
  sky?: [string, string];
  /** Ridge colours, far → near. */
  ridges?: string[];
  className?: string;
}

const DEFAULT_RIDGES = ["#7c5cbf", "#5b3f9e", "#40287a", "#2a1757", "#170b33"];

function ridgePath(seed: number, base: number, amp: number) {
  // deterministic jagged ridge across a 1600-wide canvas (wider than the view for parallax room)
  let d = `M-200 ${base}`;
  for (let x = -200; x <= 1800; x += 80) {
    const y = base - Math.abs(Math.sin(x * 0.004 * (seed + 1) + seed * 1.7)) * amp - Math.sin(x * 0.013 + seed) * amp * 0.25;
    d += ` L${x} ${y.toFixed(1)}`;
  }
  return `${d} L1800 600 L-200 600 Z`;
}

function Layer({ i, n, d, color, mx, my, scroll, reduced }: { i: number; n: number; d: string; color: string; mx: MotionValue<number>; my: MotionValue<number>; scroll: MotionValue<number>; reduced: boolean }) {
  const depth = (i + 1) / n; // 0 far … 1 near
  const x = useTransform(mx, (v) => (reduced ? 0 : v * 40 * depth));
  const yPointer = useTransform(my, (v) => (reduced ? 0 : v * 14 * depth));
  const yScroll = useTransform(scroll, [0, 1], [0, reduced ? 0 : 220 * depth]);
  const y = useTransform([yPointer, yScroll] as MotionValue<number>[], ([a, b]: number[]) => a + b);
  return (
    <motion.svg aria-hidden viewBox="0 0 1600 600" preserveAspectRatio="xMidYMax slice" className="absolute inset-x-[-6%] bottom-0 h-full w-[112%]" style={{ x, y }}>
      <path d={d} fill={color} />
    </motion.svg>
  );
}

/**
 * Editorial landscape hero: five ridge layers, a glowing sun and drifting fog move at different
 * depths with the pointer (spring) and with scroll (near ridges fall away fastest), while the
 * headline sits between the mountains — in front of the far ridges, behind the near ones.
 */
export function HeroDepthLandscape({ children, sky = ["#1b0f3b", "#f59e7b"], ridges = DEFAULT_RIDGES, className }: HeroDepthLandscapeProps) {
  const reduced = useReducedMotion();
  const touch = usePrefersTouch();
  const ref = useRef<HTMLElement>(null);
  const mxRaw = useMotionValue(0), myRaw = useMotionValue(0);
  const mx = useSpring(mxRaw, { stiffness: 60, damping: 20 }), my = useSpring(myRaw, { stiffness: 60, damping: 20 });
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const textY = useTransform(scrollYProgress, [0, 1], [0, reduced ? 0 : 120]);
  const sunY = useTransform(scrollYProgress, [0, 1], [0, reduced ? 0 : 60]);
  const sunX = useTransform(mx, (v) => (reduced ? 0 : v * 8));
  const paths = ridges.map((_, i) => ridgePath(i + 2, 330 + i * 55, 150 - i * 18));
  const split = Math.ceil(ridges.length / 2);

  return (
    <section
      ref={ref}
      onPointerMove={(e) => {
        if (touch || reduced) return;
        const r = e.currentTarget.getBoundingClientRect();
        mxRaw.set(((e.clientX - r.left) / r.width - 0.5) * -2);
        myRaw.set(((e.clientY - r.top) / r.height - 0.5) * -2);
      }}
      className={cn("relative isolate h-full min-h-[480px] overflow-hidden", className)}
      style={{ background: `linear-gradient(to bottom, ${sky[0]}, ${sky[1]})` }}
    >
      <motion.div aria-hidden className="absolute left-1/2 top-[38%] size-40 -translate-x-1/2 rounded-full bg-[#ffd9b0] shadow-[0_0_120px_60px_rgb(255_190_140/.55)]" style={{ y: sunY, x: sunX }} />
      {ridges.slice(0, split).map((c, i) => <Layer key={i} i={i} n={ridges.length} d={paths[i]} color={c} mx={mx} my={my} scroll={scrollYProgress} reduced={reduced} />)}
      <motion.div className="absolute inset-x-0 top-[16%] z-10 px-6 text-center text-white" style={{ y: textY }}>
        {children}
      </motion.div>
      {ridges.slice(split).map((c, i) => <Layer key={i + split} i={i + split} n={ridges.length} d={paths[i + split]} color={c} mx={mx} my={my} scroll={scrollYProgress} reduced={reduced} />)}
      {!reduced && (
        <motion.div
          aria-hidden
          className="pointer-events-none absolute inset-x-[-20%] bottom-[18%] h-32 bg-[radial-gradient(ellipse_at_center,rgb(255_255_255/.18),transparent_70%)] blur-2xl"
          animate={{ x: ["-6%", "6%", "-6%"] }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
        />
      )}
    </section>
  );
}
```

## Usage example
```tsx
"use client";
import { HeroDepthLandscape } from "@/components/kinetik/hero-depth-landscape";

export default function Demo() {
  return (
    <HeroDepthLandscape>
      <p className="text-[10px] uppercase tracking-[0.4em] text-white/70">Expeditions · 2027</p>
      <h1 className="mt-3 font-serif text-5xl leading-none tracking-tight sm:text-7xl">Beyond the ridge</h1>
      <a href="#trips" className="mt-6 inline-flex rounded-full bg-white/90 px-5 py-2 text-sm font-medium text-zinc-900">See the trips</a>
    </HeroDepthLandscape>
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
