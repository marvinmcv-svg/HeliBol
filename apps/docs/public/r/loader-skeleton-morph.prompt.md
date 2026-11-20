You are given a task to integrate a component from the **kinetik** motion library into this codebase.

# Skeleton → Content Morph (`loader-skeleton-morph`)

Skeleton placeholders that dissolve with a blur while the real content resolves in from a blur in the same box — no layout jump — with a shimmer sweeping across the bars while loading.

## What it should do
Stack skeleton and content in the same grid cell; exit the skeleton with blur+fade, enter the content from blur(10px) and y 6; shimmer is a gradient span sliding across each bar.

## Project requirements
- React 19 + TypeScript, Tailwind CSS v4, shadcn/ui-style CSS variables (`background`, `foreground`, `muted`, `muted-foreground`, `border`, `card`, `primary`, `ring`). If the project lacks shadcn, set it up first (`npx shadcn@latest init`).
- Animation engine: **motion**.
- Install dependencies: `npm i motion`
- Put the component at `components/kinetik/loader-skeleton-morph.tsx`.
- `cn` lives at `lib/kinetik/utils.ts` (source below).
- Shared hooks go at `lib/kinetik/core.ts` (source below).

## Non-negotiables
- **Accessibility:** Container toggles aria-busy; skeleton is aria-hidden. Reduced motion stops the shimmer and cross-fades.
- **Performance:** Grid stacking keeps both states in one cell; filter only during the swap.
- Respect `prefers-reduced-motion` (replace movement with opacity or an instant change).
- Animate only transform / opacity / filter / clip-path. No hard-coded theme colors — use CSS variables so it works in light and dark.

## Source — components/kinetik/loader-skeleton-morph.tsx
```tsx
"use client";
import { useEffect, useState, type ReactNode } from "react";
import { AnimatePresence, motion } from "motion/react";
import { cn, useReducedMotion } from "@/lib/kinetik/core";

export interface LoaderSkeletonMorphProps {
  /** When true, the real content replaces the skeleton. */
  loaded: boolean;
  children: ReactNode;
  /** Rows of skeleton bars; numbers are widths in %. Default looks like a profile card. */
  rows?: number[];
  avatar?: boolean;
  className?: string;
}

/**
 * Skeleton → content morph: shimmering placeholder bars dissolve with a blur while the real content
 * resolves in from a blur, row by row, in the same box — no layout jump. Under reduced motion the
 * shimmer stops and the swap is an instant cross-fade.
 */
export function LoaderSkeletonMorph({ loaded, children, rows = [70, 45, 90, 80], avatar = true, className }: LoaderSkeletonMorphProps) {
  const reduced = useReducedMotion();
  return (
    <div className={cn("relative grid", className)} aria-busy={!loaded}>
      <AnimatePresence initial={false}>
        {!loaded && (
          <motion.div
            key="sk"
            aria-hidden
            className="col-start-1 row-start-1 space-y-3"
            exit={reduced ? { opacity: 0, transition: { duration: 0.15 } } : { opacity: 0, filter: "blur(8px)", scale: 0.98, transition: { duration: 0.45 } }}
          >
            {avatar && (
              <div className="flex items-center gap-3">
                <Bar reduced={reduced} className="size-11 rounded-full" />
                <div className="flex-1 space-y-2"><Bar reduced={reduced} className="h-3 w-1/2" /><Bar reduced={reduced} className="h-2.5 w-1/3" /></div>
              </div>
            )}
            {rows.map((w, i) => <Bar key={i} reduced={reduced} className="h-3" style={{ width: `${w}%` }} />)}
          </motion.div>
        )}
      </AnimatePresence>
      {loaded && (
        <motion.div
          className="col-start-1 row-start-1"
          initial={reduced ? { opacity: 0 } : { opacity: 0, filter: "blur(10px)", y: 6 }}
          animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
          transition={{ duration: reduced ? 0.15 : 0.6, delay: reduced ? 0 : 0.12, ease: [0.22, 1, 0.36, 1] }}
        >
          {children}
        </motion.div>
      )}
    </div>
  );
}

function Bar({ className, style, reduced }: { className?: string; style?: React.CSSProperties; reduced: boolean }) {
  return (
    <div className={cn("relative overflow-hidden rounded-md bg-muted", className)} style={style}>
      {!reduced && (
        <motion.span
          className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-foreground/10 to-transparent"
          animate={{ x: ["-100%", "100%"] }}
          transition={{ duration: 1.3, repeat: Infinity, ease: "easeInOut" }}
        />
      )}
    </div>
  );
}

/** Convenience hook for demos: flips to loaded after `ms`. */
export function useFakeLoad(ms = 1600, key: unknown = 0) {
  const [loaded, setLoaded] = useState(false);
  useEffect(() => {
    setLoaded(false);
    const t = setTimeout(() => setLoaded(true), ms);
    return () => clearTimeout(t);
  }, [ms, key]);
  return loaded;
}
```

## Usage example
```tsx
"use client";
import { useState } from "react";
import { DemoCenter, photos } from "@/components/kinetik/demo-helpers" /* or inline */;
import { LoaderSkeletonMorph, useFakeLoad } from "@/components/kinetik/loader-skeleton-morph";

export default function Demo() {
  const [k, setK] = useState(0);
  const loaded = useFakeLoad(1600, k);
  return (
    <DemoCenter className="flex-col gap-4">
      <div className="w-80 rounded-2xl border bg-card p-5 shadow-sm">
        <LoaderSkeletonMorph loaded={loaded}>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <img src={photos[2]} alt="" className="size-11 rounded-full object-cover" />
              <div><p className="text-sm font-semibold">Mila Torres</p><p className="text-xs text-muted-foreground">Product designer · Lisbon</p></div>
            </div>
            <p className="text-sm leading-relaxed text-muted-foreground">Shipping a new onboarding flow this week. Looking for two beta testers who use screen readers daily — DM me.</p>
            <div className="flex gap-2 text-xs"><span className="rounded-full bg-muted px-2 py-1">Design</span><span className="rounded-full bg-muted px-2 py-1">A11y</span></div>
          </div>
        </LoaderSkeletonMorph>
      </div>
      <button type="button" onClick={() => setK((x) => x + 1)} className="rounded-full border px-3 py-1 text-xs">Reload</button>
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
