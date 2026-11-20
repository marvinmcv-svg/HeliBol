You are given a task to integrate a component from the **kinetik** motion library into this codebase.

# Scroll — Cards Fan (`scroll-cards-fan`)

Pinned section where a tight stack of cards deals itself into a wide arc as you scroll, each card rotating around a pivot far below the stage like a hand of playing cards, while the heading rises. Scroll back and they gather.

## What it should do
Pin a stage; map scroll progress to each card's rotate = (i − mid) × spread × p with transform-origin far below the card (50% 260%), plus a small y lift for outer cards.

## Project requirements
- React 19 + TypeScript, Tailwind CSS v4, shadcn/ui-style CSS variables (`background`, `foreground`, `muted`, `muted-foreground`, `border`, `card`, `primary`, `ring`). If the project lacks shadcn, set it up first (`npx shadcn@latest init`).
- Animation engine: **motion**.
- Install dependencies: `npm i motion`
- Put the component at `components/kinetik/scroll-cards-fan.tsx`.
- `cn` lives at `lib/kinetik/utils.ts` (source below).
- Shared hooks go at `lib/kinetik/core.ts` (source below).

## Non-negotiables
- **Accessibility:** Cards are figures with captions; reduced motion shows the finished fan without pinning.
- **Performance:** Transform-only, driven by one scroll progress value.
- Respect `prefers-reduced-motion` (replace movement with opacity or an instant change).
- Animate only transform / opacity / filter / clip-path. No hard-coded theme colors — use CSS variables so it works in light and dark.

## Source — components/kinetik/scroll-cards-fan.tsx
```tsx
"use client";
import { useRef, type RefObject } from "react";
import { motion, useScroll, useTransform, type MotionValue } from "motion/react";
import { cn, useReducedMotion } from "@/lib/kinetik/core";

export interface FanCard { src: string; title: string; alt?: string }
export interface ScrollCardsFanProps {
  cards: FanCard[];
  heading?: string;
  container?: RefObject<HTMLElement | null>;
  className?: string;
}

/**
 * Pinned section where a tight stack of cards deals itself into a wide arc as you scroll: each card
 * rotates around a pivot far below the stage, spreading like a hand of playing cards, while the
 * heading rises above. Scroll back and they gather again. Reduced motion shows the finished fan.
 */
export function ScrollCardsFan({ cards, heading = "A hand worth holding", container, className }: ScrollCardsFanProps) {
  const reduced = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, container, offset: ["start start", "end end"] });
  const p = useTransform(scrollYProgress, [0.05, 0.75], [0, 1], { clamp: true });
  const headY = useTransform(p, [0, 1], [40, 0]);
  const headO = useTransform(p, [0, 0.5], [0.2, 1]);
  const n = cards.length;
  return (
    <div ref={ref} className={cn("relative", reduced ? "h-[100cqh]" : "h-[260cqh]", className)}>
      <div className="sticky top-0 grid h-[100cqh] place-items-center overflow-hidden">
        <motion.h3 style={reduced ? undefined : { y: headY, opacity: headO }} className="absolute top-[12%] px-6 text-center text-4xl font-semibold tracking-tight">{heading}</motion.h3>
        <div className="relative mt-[12cqh] h-[46cqh] w-[30cqh]">
          {cards.map((c, i) => (
            <Card key={c.src + i} c={c} i={i} n={n} p={p} reduced={reduced} />
          ))}
        </div>
      </div>
    </div>
  );
}

function Card({ c, i, n, p, reduced }: { c: FanCard; i: number; n: number; p: MotionValue<number>; reduced: boolean }) {
  const mid = (n - 1) / 2;
  const spread = 13; // degrees between cards when fully fanned
  const target = (i - mid) * spread;
  const rotate = useTransform(p, (v) => (reduced ? target : target * v + (i - mid) * 1.5 * (1 - v)));
  const y = useTransform(p, (v) => (reduced ? Math.abs(i - mid) * 8 : Math.abs(i - mid) * 8 * v - (1 - v) * i * 2));
  return (
    <motion.figure
      className="absolute inset-0 overflow-hidden rounded-2xl border border-white/20 bg-card shadow-[0_20px_40px_-15px_rgb(0_0_0/.5)]"
      style={{ rotate, y, transformOrigin: "50% 260%", zIndex: i }}
    >
      <img src={c.src} alt={c.alt ?? ""} className="h-full w-full object-cover" />
      <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-3 pt-8 text-sm font-medium text-white">{c.title}</figcaption>
    </motion.figure>
  );
}
```

## Usage example
```tsx
"use client";
import { DemoScroller, photos, useDemoScroller } from "@/components/kinetik/demo-helpers" /* or inline */;
import { ScrollCardsFan } from "@/components/kinetik/scroll-cards-fan";

const titles = ["Coral", "Fjord", "Neon", "Glass", "Dune", "Canopy", "Salt"];

function Inner() {
  const s = useDemoScroller() ?? undefined;
  return <ScrollCardsFan container={s} cards={titles.map((title, i) => ({ src: photos[i % photos.length]!, title }))} />;
}

export default function Demo() {
  return (
    <DemoScroller thumbAt={0.55}>
      <Inner />
    </DemoScroller>
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
