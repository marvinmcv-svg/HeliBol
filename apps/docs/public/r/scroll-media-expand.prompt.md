You are given a task to integrate a component from the **kinetik** motion library into this codebase.

# Scroll — Media Expand (`scroll-media-expand`)

Keynote-style reveal: a small rounded image sits between the two halves of a headline; scrolling grows it to full-bleed, squares its corners and settles its zoom while the headline halves slide apart, then the caption rises in.

## What it should do
Pin a stage; map progress to the media box width 34%→100%, height 38%→100%, radius 28→0 and inner image scale 1.4→1; translate the headline halves outward and fade; fade the caption in near the end.

## Project requirements
- React 19 + TypeScript, Tailwind CSS v4, shadcn/ui-style CSS variables (`background`, `foreground`, `muted`, `muted-foreground`, `border`, `card`, `primary`, `ring`). If the project lacks shadcn, set it up first (`npx shadcn@latest init`).
- Animation engine: **motion**.
- Install dependencies: `npm i motion`
- Put the component at `components/kinetik/scroll-media-expand.tsx`.
- `cn` lives at `lib/kinetik/utils.ts` (source below).
- Shared hooks go at `lib/kinetik/core.ts` (source below).

## Non-negotiables
- **Accessibility:** Headline stays real text; reduced motion shows the full-bleed image with the headline.
- **Performance:** Width/height/radius from scroll progress; image scale on the GPU.
- Respect `prefers-reduced-motion` (replace movement with opacity or an instant change).
- Animate only transform / opacity / filter / clip-path. No hard-coded theme colors — use CSS variables so it works in light and dark.

## Source — components/kinetik/scroll-media-expand.tsx
```tsx
"use client";
import { useRef, type ReactNode, type RefObject } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { cn, useReducedMotion } from "@/lib/kinetik/core";

export interface ScrollMediaExpandProps {
  image: string;
  /** Two halves of the headline that part as the media grows. */
  title: [string, string];
  children?: ReactNode;
  container?: RefObject<HTMLElement | null>;
  className?: string;
}

/**
 * Keynote-style reveal: a small rounded image sits between the two halves of a headline; as you
 * scroll it grows to full-bleed, its corners square off and its zoom settles, while the headline
 * halves slide apart to the edges and fade. Then the caption rises in.
 */
export function ScrollMediaExpand({ image, title, children, container, className }: ScrollMediaExpandProps) {
  const reduced = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, container, offset: ["start start", "end end"] });
  const p = useTransform(scrollYProgress, [0, 0.7], [0, 1], { clamp: true });
  const w = useTransform(p, [0, 1], ["34%", "100%"]);
  const h = useTransform(p, [0, 1], ["38%", "100%"]);
  const radius = useTransform(p, [0, 0.9], [28, 0]);
  const imgScale = useTransform(p, [0, 1], [1.4, 1]);
  const left = useTransform(p, [0, 1], ["0%", "-60%"]);
  const right = useTransform(p, [0, 1], ["0%", "60%"]);
  const titleO = useTransform(p, [0.3, 0.8], [1, 0]);
  const cap = useTransform(scrollYProgress, [0.72, 0.92], [0, 1]);
  const capY = useTransform(scrollYProgress, [0.72, 0.92], [24, 0]);

  if (reduced)
    return (
      <div ref={ref} className={cn("relative h-[100cqh] overflow-hidden", className)}>
        <img src={image} alt="" className="size-full object-cover" />
        <div className="absolute inset-0 grid place-items-center bg-black/35 p-6 text-center text-white">
          <div><h3 className="text-5xl font-semibold tracking-tight">{title.join(" ")}</h3>{children}</div>
        </div>
      </div>
    );

  return (
    <div ref={ref} className={cn("relative h-[260cqh]", className)}>
      <div className="sticky top-0 grid h-[100cqh] place-items-center overflow-hidden">
        <motion.div className="relative z-10 overflow-hidden" style={{ width: w, height: h, borderRadius: radius }}>
          <motion.img src={image} alt="" className="size-full object-cover" style={{ scale: imgScale }} />
          <motion.div style={{ opacity: cap, y: capY }} className="absolute inset-0 grid place-items-end bg-gradient-to-t from-black/70 via-transparent p-8 text-white">
            <div className="w-full">{children}</div>
          </motion.div>
        </motion.div>
        <div className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center gap-[36%] whitespace-nowrap text-[9cqw] font-semibold leading-none tracking-tight mix-blend-difference text-white">
          <motion.span style={{ x: left, opacity: titleO }}>{title[0]}</motion.span>
          <motion.span style={{ x: right, opacity: titleO }}>{title[1]}</motion.span>
        </div>
      </div>
    </div>
  );
}
```

## Usage example
```tsx
"use client";
import { DemoScroller, photos, useDemoScroller } from "@/components/kinetik/demo-helpers" /* or inline */;
import { ScrollMediaExpand } from "@/components/kinetik/scroll-media-expand";

function Inner() {
  const s = useDemoScroller() ?? undefined;
  return (
    <ScrollMediaExpand container={s} image={photos[4]!} title={["Into", "the wild"]}>
      <p className="text-[10px] uppercase tracking-[0.3em] opacity-70">Episode 04</p>
      <p className="mt-1 text-2xl font-semibold">A season above the treeline</p>
    </ScrollMediaExpand>
  );
}

export default function Demo() {
  return (
    <DemoScroller thumbAt={0.18}>
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
