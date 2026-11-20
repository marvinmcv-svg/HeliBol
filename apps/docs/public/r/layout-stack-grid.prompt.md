You are given a task to integrate a component from the **kinetik** motion library into this codebase.

# Layout — Stack ⇄ Grid ⇄ List (`layout-stack-grid`)

One collection, three layouts: a messy stacked deck, a tidy grid and a compact list. Switching animates every card from where it is to where it belongs with a per-card stagger, so the deck deals itself out.

## What it should do
Render items as motion.div with layout and per-index delayed springs; change container classes between a single grid cell (stack, with per-item rotation and z-index), a CSS grid and a flex column.

## Project requirements
- React 19 + TypeScript, Tailwind CSS v4, shadcn/ui-style CSS variables (`background`, `foreground`, `muted`, `muted-foreground`, `border`, `card`, `primary`, `ring`). If the project lacks shadcn, set it up first (`npx shadcn@latest init`).
- Animation engine: **motion**.
- Install dependencies: `npm i motion`
- Put the component at `components/kinetik/layout-stack-grid.tsx`.
- `cn` lives at `lib/kinetik/utils.ts` (source below).
- Shared hooks go at `lib/kinetik/core.ts` (source below).

## Non-negotiables
- **Accessibility:** Mode switch is a radiogroup; reduced motion switches instantly.
- **Performance:** Motion layout animations (transform-based FLIP).
- Respect `prefers-reduced-motion` (replace movement with opacity or an instant change).
- Animate only transform / opacity / filter / clip-path. No hard-coded theme colors — use CSS variables so it works in light and dark.

## Source — components/kinetik/layout-stack-grid.tsx
```tsx
"use client";
import { useState } from "react";
import { LayoutGroup, motion } from "motion/react";
import { cn, useReducedMotion } from "@/lib/kinetik/core";

export interface StackGridItem { id: string; src: string; title: string; meta?: string }
export type StackGridMode = "stack" | "grid" | "list";
export interface LayoutStackGridProps {
  items: StackGridItem[];
  defaultMode?: StackGridMode;
  className?: string;
}

const tilt = [-7, 5, -3, 8, -5, 3, -8, 6];

/**
 * One collection, three layouts: a messy stacked deck, a tidy grid and a compact list. Switching
 * animates every card from where it is to where it belongs (shared layout), with a per-card stagger
 * so the deck deals itself out. The segmented control's pill slides too.
 */
export function LayoutStackGrid({ items, defaultMode = "stack", className }: LayoutStackGridProps) {
  const reduced = useReducedMotion();
  const [mode, setMode] = useState<StackGridMode>(defaultMode);
  const t = (i: number) => (reduced ? { duration: 0 } : { type: "spring" as const, stiffness: 260, damping: 26, delay: i * 0.035 });
  return (
    <LayoutGroup>
      <div className={cn("flex flex-col items-center gap-5", className)}>
        <div role="radiogroup" aria-label="Layout" className="relative flex rounded-full bg-muted p-1">
          {(["stack", "grid", "list"] as const).map((m) => (
            <button key={m} type="button" role="radio" aria-checked={mode === m} onClick={() => setMode(m)} className={cn("relative rounded-full px-4 py-1 text-xs font-medium capitalize", mode === m ? "text-background" : "text-muted-foreground")}>
              {mode === m && <motion.span layoutId="kn-sg-pill" className="absolute inset-0 rounded-full bg-foreground" transition={t(0)} />}
              <span className="relative">{m}</span>
            </button>
          ))}
        </div>
        <div
          className={cn(
            "relative w-full",
            mode === "stack" && "grid h-[300px] place-items-center",
            mode === "grid" && "grid grid-cols-3 gap-3 sm:grid-cols-4",
            mode === "list" && "flex max-w-md flex-col gap-2",
          )}
        >
          {items.map((it, i) => (
            <motion.div
              key={it.id}
              layout
              transition={t(i)}
              className={cn(
                "overflow-hidden bg-card shadow-sm ring-1 ring-border",
                mode === "stack" && "col-start-1 row-start-1 w-44 rounded-2xl p-2 pb-3 shadow-xl",
                mode === "grid" && "rounded-xl",
                mode === "list" && "flex items-center gap-3 rounded-xl p-2",
              )}
              style={{ rotate: mode === "stack" ? tilt[i % tilt.length] : 0, zIndex: mode === "stack" ? items.length - i : 0 }}
            >
              <motion.img layout transition={t(i)} src={it.src} alt="" className={cn("object-cover", mode === "list" ? "size-12 rounded-lg" : "aspect-[4/3] w-full", mode === "stack" && "rounded-xl")} />
              <motion.div layout="position" transition={t(i)} className={cn(mode === "grid" && "p-2", mode === "stack" && "px-1 pt-2")}>
                <p className="text-sm font-medium leading-tight">{it.title}</p>
                {it.meta && mode !== "stack" && <p className="text-xs text-muted-foreground">{it.meta}</p>}
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>
    </LayoutGroup>
  );
}
```

## Usage example
```tsx
"use client";
import { DemoCenter, photos } from "@/components/kinetik/demo-helpers" /* or inline */;
import { LayoutStackGrid } from "@/components/kinetik/layout-stack-grid";

const names = ["Coral dunes", "Fjord light", "Night market", "Glass house", "Desert road", "Canopy", "Salt flats", "Harbour"];

export default function Demo() {
  return (
    <DemoCenter className="p-6">
      <LayoutStackGrid defaultMode="grid" className="w-full max-w-2xl" items={names.map((title, i) => ({ id: title, title, src: photos[i % photos.length]!, meta: `${3 + i} photos` }))} />
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
