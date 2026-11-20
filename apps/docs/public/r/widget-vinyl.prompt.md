You are given a task to integrate a component from the **kinetik** motion library into this codebase.

# Vinyl Player Widget (`widget-vinyl`)

Turntable now-playing widget: the record spins up with inertia on play and coasts to a stop on pause, the tonearm swings on, grooves catch a moving highlight and an equaliser dances. Skip slides a new record in.

## What it should do
Build a vinyl widget: a repeating-radial-gradient record with conic sheen and centre label image; a rAF loop eases angular speed toward 200°/s when playing or 0 when paused (spin-up faster than coast-down) and accumulates rotation into a motion value; the tonearm rotates on a spring; equaliser bars animate height while playing; skip re-keys the record so it slides in.

## Project requirements
- React 19 + TypeScript, Tailwind CSS v4, shadcn/ui-style CSS variables (`background`, `foreground`, `muted`, `muted-foreground`, `border`, `card`, `primary`, `ring`). If the project lacks shadcn, set it up first (`npx shadcn@latest init`).
- Animation engine: **motion**.
- Install dependencies: `npm i motion lucide-react`
- Put the component at `components/kinetik/widget-vinyl.tsx`.
- `cn` lives at `lib/kinetik/utils.ts` (source below).
- Shared hooks go at `lib/kinetik/core.ts` (source below).

## Non-negotiables
- **Accessibility:** Play/pause and next are labelled buttons; visuals are decorative. Reduced motion: record stays still.
- **Performance:** One rAF loop easing angular speed; transforms only.
- Respect `prefers-reduced-motion` (replace movement with opacity or an instant change).
- Animate only transform / opacity / filter / clip-path. No hard-coded theme colors — use CSS variables so it works in light and dark.

## Source — components/kinetik/widget-vinyl.tsx
```tsx
"use client";
import { useEffect, useRef, useState } from "react";
import { animate, motion, useMotionValue } from "motion/react";
import { Pause, Play, SkipForward } from "lucide-react";
import { cn, useReducedMotion } from "@/lib/kinetik/core";

export interface WidgetVinylProps {
  cover: string;
  title: string;
  artist: string;
  className?: string;
}

/**
 * Turntable now-playing widget: the record spins up with inertia when you press play and coasts to
 * a stop on pause, the tonearm swings onto the record, grooves catch a moving highlight and an
 * equaliser dances. Skip slides the record out and a new one in.
 */
export function WidgetVinyl({ cover, title, artist, className }: WidgetVinylProps) {
  const reduced = useReducedMotion();
  const [playing, setPlaying] = useState(true);
  const [track, setTrack] = useState(0);
  const rot = useMotionValue(0);
  const speed = useRef(0);
  const target = useRef(1);

  useEffect(() => {
    target.current = playing && !reduced ? 1 : 0;
  }, [playing, reduced]);
  useEffect(() => {
    let raf = 0;
    let last = performance.now();
    const tick = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      // spin-up / coast-down: ease speed toward target (33⅓ rpm ≈ 200°/s)
      speed.current += (target.current - speed.current) * Math.min(1, dt * (target.current ? 2.2 : 0.9));
      rot.set(rot.get() + speed.current * 200 * dt);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [rot]);

  const skip = () => {
    setTrack((t) => t + 1);
    if (!reduced) animate(rot, rot.get() + 120, { duration: 0.6 });
  };

  return (
    <div className={cn("relative w-80 overflow-hidden rounded-3xl bg-zinc-900 p-5 text-white shadow-2xl", className)}>
      <div className="relative mx-auto aspect-square w-52">
        <motion.div key={track} className="absolute inset-0" initial={reduced ? false : { x: -240, rotate: -90, opacity: 0 }} animate={{ x: 0, rotate: 0, opacity: 1 }} transition={{ type: "spring", stiffness: 120, damping: 18 }}>
          <motion.div className="size-full rounded-full shadow-[0_20px_40px_rgb(0_0_0/.6)]" style={{ rotate: rot, background: "repeating-radial-gradient(circle, #111 0 1.5px, #1c1c1c 1.5px 3px)" }}>
            <span aria-hidden className="absolute inset-0 rounded-full bg-[conic-gradient(from_20deg,transparent_0deg,rgb(255_255_255/.12)_30deg,transparent_60deg,transparent_180deg,rgb(255_255_255/.08)_210deg,transparent_240deg)]" />
            <img src={cover} alt="" className="absolute left-1/2 top-1/2 size-[38%] -translate-x-1/2 -translate-y-1/2 rounded-full object-cover ring-4 ring-zinc-950" />
            <span aria-hidden className="absolute left-1/2 top-1/2 size-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-zinc-300" />
          </motion.div>
        </motion.div>
        {/* tonearm */}
        <motion.div aria-hidden className="absolute -right-6 -top-3 h-40 w-3 origin-top" animate={{ rotate: playing ? 24 : 4 }} transition={reduced ? { duration: 0 } : { type: "spring", stiffness: 60, damping: 12 }}>
          <span className="absolute -left-2.5 -top-2.5 size-8 rounded-full bg-gradient-to-br from-zinc-300 to-zinc-500 shadow" />
          <span className="absolute left-1 top-2 h-36 w-1 rounded-full bg-gradient-to-b from-zinc-300 to-zinc-400" />
          <span className="absolute -left-0.5 bottom-0 h-6 w-4 rounded-sm bg-zinc-200" />
        </motion.div>
      </div>
      <div className="mt-4 flex items-end justify-between">
        <div className="min-w-0">
          <p className="truncate font-semibold">{title}</p>
          <p className="truncate text-sm text-white/60">{artist}</p>
        </div>
        <div aria-hidden className="flex h-5 items-end gap-0.5">
          {[0, 1, 2, 3].map((i) => (
            <motion.span key={i} className="w-1 rounded-full bg-emerald-400" animate={playing && !reduced ? { height: ["20%", "100%", "45%", "80%", "20%"] } : { height: "20%" }} transition={{ duration: 0.9 + i * 0.15, repeat: Infinity, ease: "easeInOut", delay: i * 0.1 }} />
          ))}
        </div>
      </div>
      <div className="mt-4 flex items-center justify-center gap-6">
        <button type="button" onClick={() => setPlaying((p) => !p)} aria-label={playing ? "Pause" : "Play"} className="grid size-12 place-items-center rounded-full bg-white text-black transition-transform active:scale-90">
          {playing ? <Pause className="size-5 fill-current" /> : <Play className="ml-0.5 size-5 fill-current" />}
        </button>
        <button type="button" onClick={skip} aria-label="Next track" className="grid size-10 place-items-center rounded-full text-white/80 hover:bg-white/10"><SkipForward className="size-5 fill-current" /></button>
      </div>
    </div>
  );
}
```

## Usage example
```tsx
"use client";
import { DemoCenter, photos } from "@/components/kinetik/demo-helpers" /* or inline */;
import { WidgetVinyl } from "@/components/kinetik/widget-vinyl";

export default function Demo() {
  return (
    <DemoCenter>
      <WidgetVinyl cover={photos[7]} title="Rose Quartz" artist="The Kinetik Sessions" />
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
