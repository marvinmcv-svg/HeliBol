You are given a task to integrate a component from the **kinetik** motion library into this codebase.

# Slice Transition Slider (`media-slice-slider`)

Editorial slider whose transition cuts the incoming photo into vertical slices that drop in with a staggered, alternating direction; the caption and title rise line by line.

## What it should do
Build a slice slider: render the previous image full-size, then the new image as N flex slices each showing its portion (img width N×100%, left −k×100%); animate odd slices from y:−100% and even from +100% with stagger (ease [.76,0,.24,1]); caption/title lines rise from y:110% after a delay.

## Project requirements
- React 19 + TypeScript, Tailwind CSS v4, shadcn/ui-style CSS variables (`background`, `foreground`, `muted`, `muted-foreground`, `border`, `card`, `primary`, `ring`). If the project lacks shadcn, set it up first (`npx shadcn@latest init`).
- Animation engine: **motion**.
- Install dependencies: `npm i motion lucide-react`
- Put the component at `components/kinetik/media-slice-slider.tsx`.
- `cn` lives at `lib/kinetik/utils.ts` (source below).
- Shared hooks go at `lib/kinetik/core.ts` (source below).

## Non-negotiables
- **Accessibility:** Carousel region with arrow keys, labelled buttons, aria-live title, autoplay paused on hover/focus and disabled under reduced motion (crossfade).
- **Performance:** N slices each with one transform; previous image stays underneath.
- Respect `prefers-reduced-motion` (replace movement with opacity or an instant change).
- Animate only transform / opacity / filter / clip-path. No hard-coded theme colors — use CSS variables so it works in light and dark.

## Source — components/kinetik/media-slice-slider.tsx
```tsx
"use client";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { cn, useReducedMotion } from "@/lib/kinetik/core";

export interface MediaSliceSliderProps {
  slides: { image: string; title: string; caption?: string }[];
  /** Number of vertical slices in the transition. */
  slices?: number;
  /** Autoplay interval in ms (0 = off). Pauses on hover/focus. */
  autoplay?: number;
  className?: string;
}

/**
 * Editorial slider whose transition cuts the incoming photo into vertical slices that drop in with a
 * staggered, alternating direction (odd slices from above, even from below) over the outgoing one;
 * the title rises line by line. Arrow keys, buttons and autoplay that pauses on hover.
 */
export function MediaSliceSlider({ slides, slices = 6, autoplay = 4500, className }: MediaSliceSliderProps) {
  const reduced = useReducedMotion();
  const [i, setI] = useState(0);
  const [prev, setPrev] = useState<number | null>(null);
  const [dir, setDir] = useState(1);
  const [paused, setPaused] = useState(false);
  const busy = useRef(false);

  const go = (d: 1 | -1) => {
    if (busy.current) return;
    busy.current = true;
    setDir(d);
    setPrev(i);
    setI((n) => (n + d + slides.length) % slides.length);
    setTimeout(() => (busy.current = false), reduced ? 0 : 900);
  };
  useEffect(() => {
    if (!autoplay || paused || reduced) return;
    const id = setTimeout(() => go(1), autoplay);
    return () => clearTimeout(id);
  });

  const s = slides[i];
  return (
    <div
      role="region"
      aria-roledescription="carousel"
      aria-label="Featured stories"
      tabIndex={0}
      onKeyDown={(e) => (e.key === "ArrowRight" ? go(1) : e.key === "ArrowLeft" ? go(-1) : null)}
      onPointerEnter={() => setPaused(true)}
      onPointerLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
      className={cn("relative h-full overflow-hidden rounded-3xl bg-black text-white outline-none focus-visible:ring-2 focus-visible:ring-ring", className)}
    >
      {prev !== null && <img src={slides[prev].image} alt="" className="absolute inset-0 size-full object-cover" />}
      <div key={i} className="absolute inset-0 flex">
        {Array.from({ length: slices }, (_, k) => (
          <motion.div
            key={k}
            className="relative h-full flex-1 overflow-hidden"
            initial={reduced || prev === null ? { opacity: prev === null ? 1 : 0 } : { y: (k % 2 ? -1 : 1) * 100 * dir + "%" }}
            animate={{ y: "0%", opacity: 1 }}
            transition={reduced ? { duration: 0.3 } : { duration: 0.85, ease: [0.76, 0, 0.24, 1], delay: (dir > 0 ? k : slices - 1 - k) * 0.05 }}
          >
            <img src={s.image} alt="" className="absolute top-0 h-full max-w-none object-cover" style={{ width: `${slices * 100}%`, left: `${-k * 100}%` }} />
          </motion.div>
        ))}
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
      <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-6">
        <div aria-live="polite" className="min-w-0">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div key={i} initial="h" animate="s" exit="x" variants={{ s: { transition: { staggerChildren: 0.08, delayChildren: reduced ? 0 : 0.35 } } }}>
              {[s.caption, s.title].filter(Boolean).map((line, n) => (
                <div key={n} className="overflow-hidden">
                  <motion.p
                    variants={{ h: { y: reduced ? 0 : "110%", opacity: reduced ? 0 : 1 }, s: { y: 0, opacity: 1, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } }, x: { opacity: 0, transition: { duration: 0.2 } } }}
                    className={n === 0 && s.caption ? "text-[10px] uppercase tracking-[0.3em] text-white/70" : "text-3xl font-semibold tracking-tight"}
                  >
                    {line}
                  </motion.p>
                </div>
              ))}
            </motion.div>
          </AnimatePresence>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <span className="mr-2 text-xs tabular-nums text-white/70">{String(i + 1).padStart(2, "0")} / {String(slides.length).padStart(2, "0")}</span>
          <button type="button" onClick={() => go(-1)} aria-label="Previous" className="grid size-10 place-items-center rounded-full border border-white/30 backdrop-blur hover:bg-white/15"><ArrowLeft className="size-4" /></button>
          <button type="button" onClick={() => go(1)} aria-label="Next" className="grid size-10 place-items-center rounded-full border border-white/30 backdrop-blur hover:bg-white/15"><ArrowRight className="size-4" /></button>
        </div>
      </div>
    </div>
  );
}
```

## Usage example
```tsx
"use client";
import { photoAlt, photos } from "@/components/kinetik/demo-helpers" /* or inline */;
import { MediaSliceSlider } from "@/components/kinetik/media-slice-slider";

const slides = [1, 3, 5, 6, 0].map((n, i) => ({ image: photos[n], title: photoAlt[n], caption: `Chapter ${i + 1}` }));

export default function Demo() {
  return (
    <div className="h-full p-3">
      <MediaSliceSlider slides={slides} />
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
