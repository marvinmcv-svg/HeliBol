You are given a task to integrate a component from the **kinetik** motion library into this codebase.

# Lens Zoom Card (`card-lens-zoom`)

Product-photo magnifier: a glass lens springs after the cursor and shows the image magnified underneath, with a refraction rim; scroll over the lens to change zoom; press-and-drag on touch.

## What it should do
Build a lens zoom: a container with an image; a circular element following the pointer through a spring whose background is the same image at zoom× size, positioned so the point under the cursor sits in the lens centre (bg position = −(x·zoom − size/2)). Pop in/out with a spring, wheel adjusts zoom 1.5–5, show the zoom readout.

## Project requirements
- React 19 + TypeScript, Tailwind CSS v4, shadcn/ui-style CSS variables (`background`, `foreground`, `muted`, `muted-foreground`, `border`, `card`, `primary`, `ring`). If the project lacks shadcn, set it up first (`npx shadcn@latest init`).
- Animation engine: **motion**.
- Install dependencies: `npm i motion`
- Put the component at `components/kinetik/card-lens-zoom.tsx`.
- `cn` lives at `lib/kinetik/utils.ts` (source below).
- Shared hooks go at `lib/kinetik/core.ts` (source below).

## Non-negotiables
- **Accessibility:** The image keeps its alt; the lens is aria-hidden decoration. Reduced motion: lens follows without spring.
- **Performance:** Background-position on one element driven by motion values (no re-render per move).
- Respect `prefers-reduced-motion` (replace movement with opacity or an instant change).
- Animate only transform / opacity / filter / clip-path. No hard-coded theme colors — use CSS variables so it works in light and dark.

## Source — components/kinetik/card-lens-zoom.tsx
```tsx
"use client";
import { useRef, useState } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "motion/react";
import { cn, useReducedMotion } from "@/lib/kinetik/core";

export interface CardLensZoomProps {
  image: string;
  alt: string;
  /** Magnification inside the lens. */
  zoom?: number;
  /** Lens diameter in px. */
  size?: number;
  className?: string;
}

/**
 * Product-photo magnifier: a glass lens springs after the cursor and shows the image at `zoom`×
 * underneath it, with a subtle refraction rim. Scroll wheel over the lens changes the zoom.
 * Touch: press and drag. Reduced motion: lens follows without spring.
 */
export function CardLensZoom({ image, alt, zoom: initialZoom = 2.5, size = 160, className }: CardLensZoomProps) {
  const reduced = useReducedMotion();
  const box = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(false);
  const [zoom, setZoom] = useState(initialZoom);
  const [dims, setDims] = useState({ w: 1, h: 1 });
  const x = useMotionValue(0), y = useMotionValue(0);
  const cfg = reduced ? { stiffness: 2000, damping: 100 } : { stiffness: 380, damping: 32, mass: 0.6 };
  const sx = useSpring(x, cfg), sy = useSpring(y, cfg);
  const bgX = useTransform(sx, (v) => `${-(v * zoom - size / 2)}px`);
  const bgY = useTransform(sy, (v) => `${-(v * zoom - size / 2)}px`);
  const left = useTransform(sx, (v) => v - size / 2);
  const top = useTransform(sy, (v) => v - size / 2);

  const track = (e: React.PointerEvent) => {
    const r = box.current!.getBoundingClientRect();
    setDims({ w: r.width, h: r.height });
    x.set(e.clientX - r.left);
    y.set(e.clientY - r.top);
  };

  return (
    <div
      ref={box}
      className={cn("relative aspect-[4/5] cursor-none touch-none overflow-hidden rounded-3xl bg-muted", className)}
      onPointerEnter={(e) => (track(e), e.pointerType !== "touch" && setActive(true))}
      onPointerDown={(e) => (track(e), setActive(true))}
      onPointerMove={track}
      onPointerUp={(e) => e.pointerType === "touch" && setActive(false)}
      onPointerLeave={() => setActive(false)}
      onWheel={(e) => active && setZoom((z) => Math.min(5, Math.max(1.5, z - e.deltaY * 0.004)))}
    >
      <img src={image} alt={alt} draggable={false} className="size-full object-cover" />
      <motion.div
        aria-hidden
        initial={false}
        animate={{ scale: active ? 1 : 0.2, opacity: active ? 1 : 0 }}
        transition={reduced ? { duration: 0 } : { type: "spring", stiffness: 420, damping: 26 }}
        className="pointer-events-none absolute rounded-full shadow-[0_20px_50px_-10px_rgb(0_0_0/.55),inset_0_0_0_2px_rgb(255_255_255/.85),inset_0_0_24px_rgb(255_255_255/.35)]"
        style={{
          width: size,
          height: size,
          left,
          top,
          backgroundImage: `url(${image})`,
          backgroundSize: `${dims.w * zoom}px ${dims.h * zoom}px`,
          backgroundPositionX: bgX,
          backgroundPositionY: bgY,
          backgroundRepeat: "no-repeat",
        }}
      >
        <span className="absolute inset-x-6 top-3 h-6 rounded-full bg-gradient-to-b from-white/50 to-transparent blur-[2px]" />
        <span className="absolute bottom-2 left-1/2 -translate-x-1/2 rounded-full bg-black/55 px-2 py-0.5 text-[10px] font-semibold tabular-nums text-white">{zoom.toFixed(1)}×</span>
      </motion.div>
    </div>
  );
}
```

## Usage example
```tsx
"use client";
import { photos } from "@/components/kinetik/demo-helpers" /* or inline */;
import { CardLensZoom } from "@/components/kinetik/card-lens-zoom";

export default function Demo() {
  return (
    <div className="flex h-full items-center justify-center gap-8 p-6">
      <CardLensZoom image={photos[5]} alt="Violet aurora sky" className="h-[90%] w-auto" />
      <div className="hidden max-w-[12rem] space-y-2 text-sm sm:block">
        <p className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground">Print · 50×70</p>
        <h3 className="text-xl font-semibold">Aurora, Lofoten</h3>
        <p className="text-muted-foreground">Hover to inspect the grain. Scroll over the lens to change zoom.</p>
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
