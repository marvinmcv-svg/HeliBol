You are given a task to integrate a component from the **kinetik** motion library into this codebase.

# Polaroid Stack (`media-polaroid-stack`)

A messy pile of polaroids with hand-written captions. Fling the top photo in any direction and it flies off and slides back in at the bottom while the rest shuffle up with new tilts.

## What it should do
Keep an order array; render the first four with depth-based scale/rotate; the top card drags on x with rotate derived from x; on a throw past a threshold rotate the order and exit the card off-screen.

## Project requirements
- React 19 + TypeScript, Tailwind CSS v4, shadcn/ui-style CSS variables (`background`, `foreground`, `muted`, `muted-foreground`, `border`, `card`, `primary`, `ring`). If the project lacks shadcn, set it up first (`npx shadcn@latest init`).
- Animation engine: **motion**.
- Install dependencies: `npm i motion`
- Put the component at `components/kinetik/media-polaroid-stack.tsx`.
- `cn` lives at `lib/kinetik/utils.ts` (source below).
- Shared hooks go at `lib/kinetik/core.ts` (source below).

## Non-negotiables
- **Accessibility:** Group is focusable with ←/→ and labelled with the current caption; Back/Next buttons. Reduced motion cycles without the throw.
- **Performance:** At most 4 cards rendered; drag on one motion value.
- Respect `prefers-reduced-motion` (replace movement with opacity or an instant change).
- Animate only transform / opacity / filter / clip-path. No hard-coded theme colors — use CSS variables so it works in light and dark.

## Source — components/kinetik/media-polaroid-stack.tsx
```tsx
"use client";
import { useState } from "react";
import { AnimatePresence, motion, useMotionValue, useTransform, type PanInfo } from "motion/react";
import { cn, useReducedMotion } from "@/lib/kinetik/core";

export interface Polaroid { src: string; caption: string; alt?: string }
export interface MediaPolaroidStackProps {
  photos: Polaroid[];
  className?: string;
}

const tilt = (i: number) => [-6, 4, -2, 7, -4, 3][i % 6]!;

/**
 * A messy pile of polaroids. Fling the top one in any direction and it flies off and slides back in
 * at the bottom of the pile; the others shuffle up with a new tilt. Hand-written captions. Buttons and
 * ←/→ do the same for keyboard users. Reduced motion just cycles without the throw.
 */
export function MediaPolaroidStack({ photos, className }: MediaPolaroidStackProps) {
  const reduced = useReducedMotion();
  const [order, setOrder] = useState(() => photos.map((_, i) => i));
  const [exitX, setExitX] = useState(400);
  const next = (dir = 1) => {
    setExitX(dir * 420);
    setOrder((o) => [...o.slice(1), o[0]!]);
  };
  const prev = () => setOrder((o) => [o[o.length - 1]!, ...o.slice(0, -1)]);
  const visible = order.slice(0, 4);

  return (
    <div
      className={cn("relative grid place-items-center", className)}
      tabIndex={0}
      role="group"
      aria-roledescription="photo stack"
      aria-label={`Photo ${order[0]! + 1} of ${photos.length}: ${photos[order[0]!]!.caption}`}
      onKeyDown={(e) => (e.key === "ArrowRight" ? next(1) : e.key === "ArrowLeft" ? prev() : null)}
    >
      <div className="relative h-[340px] w-[260px]">
        <AnimatePresence initial={false} custom={exitX}>
          {visible.slice().reverse().map((idx) => {
            const depth = visible.indexOf(idx);
            return depth === 0 ? (
              <TopCard key={idx} p={photos[idx]!} rot={tilt(idx)} reduced={reduced} onThrow={next} exitX={exitX} />
            ) : (
              <motion.div
                key={idx}
                className="absolute inset-0"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 - depth * 0.03, rotate: tilt(idx) * (1 + depth * 0.2), y: depth * 6, zIndex: 10 - depth }}
                transition={{ type: "spring", stiffness: 260, damping: 24 }}
              >
                <Frame p={photos[idx]!} />
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
      <div className="mt-6 flex gap-2">
        <button type="button" onClick={prev} className="rounded-full border bg-background px-3 py-1 text-xs">← Back</button>
        <button type="button" onClick={() => next(1)} className="rounded-full border bg-background px-3 py-1 text-xs">Next →</button>
      </div>
    </div>
  );
}

function TopCard({ p, rot, reduced, onThrow, exitX }: { p: Polaroid; rot: number; reduced: boolean; onThrow: (dir: number) => void; exitX: number }) {
  const x = useMotionValue(0);
  const r = useTransform(x, [-300, 300], [rot - 18, rot + 18]);
  const end = (_: unknown, info: PanInfo) => {
    if (Math.abs(info.offset.x) > 110 || Math.abs(info.velocity.x) > 600) onThrow(Math.sign(info.offset.x) || 1);
  };
  return (
    <motion.div
      className="absolute inset-0 z-20 cursor-grab touch-pan-y active:cursor-grabbing"
      style={{ x, rotate: reduced ? rot : r }}
      drag={reduced ? false : "x"}
      dragSnapToOrigin
      dragElastic={0.9}
      onDragEnd={end}
      initial={{ scale: 0.97, y: 6 }}
      animate={{ scale: 1, y: 0 }}
      exit={reduced ? { opacity: 0, transition: { duration: 0.15 } } : { x: exitX, y: 60, rotate: exitX > 0 ? 30 : -30, opacity: 0, transition: { duration: 0.45, ease: [0.3, 0, 0.2, 1] } }}
      whileTap={reduced ? undefined : { scale: 1.03 }}
    >
      <Frame p={p} />
    </motion.div>
  );
}

function Frame({ p }: { p: Polaroid }) {
  return (
    <figure className="h-full w-full select-none rounded-sm bg-[#fbfaf6] p-3 pb-0 shadow-[0_12px_30px_-8px_rgb(0_0_0/.35),0_2px_4px_rgb(0_0_0/.12)]">
      <img src={p.src} alt={p.alt ?? ""} draggable={false} className="aspect-square w-full object-cover saturate-[.9] sepia-[.12]" />
      <figcaption className="grid h-[64px] place-items-center text-center text-xl text-zinc-700" style={{ fontFamily: "'Segoe Print','Bradley Hand','Comic Sans MS',cursive" }}>{p.caption}</figcaption>
    </figure>
  );
}
```

## Usage example
```tsx
"use client";
import { DemoCenter, photos } from "@/components/kinetik/demo-helpers" /* or inline */;
import { MediaPolaroidStack } from "@/components/kinetik/media-polaroid-stack";

const captions = ["summer '24 ☀︎", "the long drive", "lake day", "mum's garden", "first snow", "rooftop"];

export default function Demo() {
  return (
    <DemoCenter className="bg-[radial-gradient(circle_at_50%_40%,#e7e1d4,transparent_70%)]">
      <MediaPolaroidStack photos={captions.map((caption, i) => ({ src: photos[i]!, caption }))} />
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
