You are given a task to integrate a component from the **kinetik** motion library into this codebase.

# Hero — Product Orbit (`hero-product-orbit`)

Product hero with feature chips riding a tilted 3D ellipse around the product: chips in front are larger and sharp, chips behind shrink, blur and pass behind it. The orbit tilts toward the pointer; hovering a chip pauses it.

## What it should do
Build a product-orbit hero with Motion: animate an angle 0→360 linearly forever; each chip computes x = cos(a)·R, y = sin(a)·R·cos(tilt), depth z = sin(a); map depth to scale, blur, opacity and z-index (behind/in front of the centre product). Tilt springs follow the pointer; hovering a chip stops the angle animation.

## Project requirements
- React 19 + TypeScript, Tailwind CSS v4, shadcn/ui-style CSS variables (`background`, `foreground`, `muted`, `muted-foreground`, `border`, `card`, `primary`, `ring`). If the project lacks shadcn, set it up first (`npx shadcn@latest init`).
- Animation engine: **motion**.
- Install dependencies: `npm i motion`
- Put the component at `components/kinetik/hero-product-orbit.tsx`.
- `cn` lives at `lib/kinetik/utils.ts` (source below).
- Shared hooks go at `lib/kinetik/core.ts` (source below).

## Non-negotiables
- **Accessibility:** Chips are decorative labels; the feature list should also exist as text elsewhere. Reduced motion: static orbit.
- **Performance:** One angle motion value; chip positions via useTransform (no React renders per frame).
- Respect `prefers-reduced-motion` (replace movement with opacity or an instant change).
- Animate only transform / opacity / filter / clip-path. No hard-coded theme colors — use CSS variables so it works in light and dark.

## Source — components/kinetik/hero-product-orbit.tsx
```tsx
"use client";
import { useEffect, useState, type ReactNode } from "react";
import { motion, useMotionValue, useSpring, useTransform, animate, type MotionValue } from "motion/react";
import { cn, usePrefersTouch, useReducedMotion } from "@/lib/kinetik/core";

export interface OrbitChip {
  icon: ReactNode;
  label: string;
}

export interface HeroProductOrbitProps {
  /** The product visual in the centre (an app card, device, logo…). */
  product: ReactNode;
  chips: OrbitChip[];
  children?: ReactNode;
  className?: string;
}

/**
 * Product hero with feature chips riding a tilted 3D ellipse around the product: chips in front are
 * larger and sharp, chips behind shrink, blur and pass behind the product (z-index by depth). The
 * whole orbit tilts toward the pointer; hovering a chip pauses the orbit.
 */
export function HeroProductOrbit({ product, chips, children, className }: HeroProductOrbitProps) {
  const reduced = useReducedMotion();
  const touch = usePrefersTouch();
  const angle = useMotionValue(0);
  const [paused, setPaused] = useState(false);
  const tiltX = useSpring(useMotionValue(62), { stiffness: 80, damping: 18 });
  const tiltY = useSpring(useMotionValue(0), { stiffness: 80, damping: 18 });

  useEffect(() => {
    if (reduced || paused) return;
    const ctl = animate(angle, angle.get() + 360, { duration: 26, ease: "linear", repeat: Infinity });
    return () => ctl.stop();
  }, [reduced, paused, angle]);

  return (
    <section
      className={cn("relative isolate grid h-full min-h-[480px] place-items-center overflow-hidden", className)}
      onPointerMove={(e) => {
        if (touch || reduced) return;
        const r = e.currentTarget.getBoundingClientRect();
        tiltX.set(62 + ((e.clientY - r.top) / r.height - 0.5) * -14);
        tiltY.set(((e.clientX - r.left) / r.width - 0.5) * 16);
      }}
    >
      {children && <div className="absolute inset-x-0 top-8 z-30 px-6 text-center">{children}</div>}
      <div className="relative mt-16 size-[min(78vw,420px)]" style={{ perspective: 1000 }}>
        <div className="absolute inset-0 z-[5] grid place-items-center">{product}</div>
        {chips.map((c, i) => (
          <Chip key={c.label} i={i} n={chips.length} chip={c} angle={angle} tiltX={tiltX} tiltY={tiltY} onHover={setPaused} />
        ))}
      </div>
    </section>
  );
}

function Chip({ i, n, chip, angle, tiltX, tiltY, onHover }: { i: number; n: number; chip: OrbitChip; angle: MotionValue<number>; tiltX: MotionValue<number>; tiltY: MotionValue<number>; onHover: (b: boolean) => void }) {
  const base = (i / n) * 360;
  // project a point on a circle tilted by tiltX around the x-axis (and nudged by tiltY)
  const pos = useTransform([angle, tiltX, tiltY], ([a, tx, ty]: number[]) => {
    const t = ((a + base) * Math.PI) / 180;
    const R = 46; // % of container
    const x = Math.cos(t) * R + ty * 0.2 * Math.sin(t);
    const zRaw = Math.sin(t);
    const y = zRaw * R * Math.cos((tx * Math.PI) / 180);
    return { x, y, z: zRaw };
  });
  const left = useTransform(pos, (p) => `${50 + p.x}%`);
  const top = useTransform(pos, (p) => `${50 + p.y}%`);
  const scale = useTransform(pos, (p) => 0.75 + (p.z + 1) * 0.2);
  const filter = useTransform(pos, (p) => `blur(${Math.max(0, -p.z) * 2.5}px)`);
  const opacity = useTransform(pos, (p) => 0.55 + (p.z + 1) * 0.225);
  const zIndex = useTransform(pos, (p) => (p.z > 0 ? 10 : 1));
  return (
    <motion.div
      className="absolute -translate-x-1/2 -translate-y-1/2"
      style={{ left, top, scale, filter, opacity, zIndex }}
      onPointerEnter={() => onHover(true)}
      onPointerLeave={() => onHover(false)}
    >
      <span className="flex items-center gap-2 whitespace-nowrap rounded-full border border-white/15 bg-zinc-900/80 px-3 py-1.5 text-xs font-medium text-white shadow-lg backdrop-blur">
        <span aria-hidden className="grid size-5 place-items-center">{chip.icon}</span>
        {chip.label}
      </span>
    </motion.div>
  );
}
```

## Usage example
```tsx
"use client";
import { Bot, Calendar, CreditCard, Lock, Mail, Zap } from "lucide-react";
import { HeroProductOrbit } from "@/components/kinetik/hero-product-orbit";

export default function Demo() {
  return (
    <HeroProductOrbit
      className="bg-[radial-gradient(ellipse_at_center,#1e1b4b,#05050a_70%)] text-white"
      product={
        <div className="grid size-28 place-items-center rounded-[2rem] bg-gradient-to-br from-violet-500 to-fuchsia-500 text-4xl font-black text-white shadow-[0_30px_80px_-10px_rgb(168_85_247/.7)]">K</div>
      }
      chips={[
        { icon: <Zap className="size-3.5 text-amber-300" />, label: "Instant sync" },
        { icon: <Lock className="size-3.5 text-emerald-300" />, label: "End-to-end encrypted" },
        { icon: <Bot className="size-3.5 text-sky-300" />, label: "AI drafts" },
        { icon: <Calendar className="size-3.5 text-rose-300" />, label: "Smart scheduling" },
        { icon: <Mail className="size-3.5 text-violet-300" />, label: "Unified inbox" },
        { icon: <CreditCard className="size-3.5 text-lime-300" />, label: "Built-in billing" },
      ]}
    >
      <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">Everything orbits your work.</h1>
    </HeroProductOrbit>
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
