You are given a task to integrate a component from the **kinetik** motion library into this codebase.

# Proximity Scale Grid (`gsap-proximity-grid`)

Icon tiles swell and brighten by how close they are to the cursor — distance mapped to 0..1 with gsap.utils.mapRange — then settle back with an elastic ripple.

## What it should do
Build a proximity grid: on pointermove over the grid, for every tile compute distance from its center to the pointer with Math.hypot, map it with gsap.utils.mapRange(0, radius, 1, 0) and clamp to 0..1 (p), then gsap.to(tile, { scale: 1 + (maxScale−1)·p, filter: brightness(1+p·.25), zIndex: p·10, duration .35, ease power2.out, overwrite: true }). On pointerleave tween all back to 1 with elastic.out(1,.5) and stagger from center. Skip for touch and reduced motion.

## Project requirements
- React 19 + TypeScript, Tailwind CSS v4, shadcn/ui-style CSS variables (`background`, `foreground`, `muted`, `muted-foreground`, `border`, `card`, `primary`, `ring`). If the project lacks shadcn, set it up first (`npx shadcn@latest init`).
- Animation engine: **gsap**.
- Install dependencies: `npm i gsap @gsap/react`
- Put the component at `components/kinetik/gsap-proximity-grid.tsx`.
- `cn` lives at `lib/kinetik/utils.ts` (source below).
- Shared hooks go at `lib/kinetik/core.ts` (source below).

## Non-negotiables
- **Accessibility:** Tiles are presentational; put real controls inside if needed. Effect is pointer-only (off on touch) and disabled under reduced motion.
- **Performance:** One overwrite:true tween per tile per pointermove; transforms + filter only.
- Respect `prefers-reduced-motion` (replace movement with opacity or an instant change).
- Animate only transform / opacity / filter / clip-path. No hard-coded theme colors — use CSS variables so it works in light and dark.

## Source — components/kinetik/gsap-proximity-grid.tsx
```tsx
"use client";
import { useRef, type ReactNode } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { cn, useReducedMotion } from "@/lib/kinetik/core";

gsap.registerPlugin(useGSAP);

export interface GsapProximityGridProps {
  items: ReactNode[];
  /** Influence radius in px. */
  radius?: number;
  /** Scale reached right under the cursor. */
  maxScale?: number;
  columns?: number;
  className?: string;
}

/**
 * Every tile scales (and lifts) by how close it is to the pointer: distance → 0..1 with
 * gsap.utils.mapRange, one overwrite:true tween per tile per move so nothing fights.
 */
export function GsapProximityGrid({ items, radius = 180, maxScale = 1.9, columns = 6, className }: GsapProximityGridProps) {
  const root = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  const { contextSafe } = useGSAP({ scope: root });

  const onMove = contextSafe((e: React.PointerEvent) => {
    if (reduced || e.pointerType === "touch") return;
    root.current!.querySelectorAll<HTMLElement>("[data-tile]").forEach((tile) => {
      const r = tile.getBoundingClientRect();
      const d = Math.hypot(e.clientX - (r.left + r.width / 2), e.clientY - (r.top + r.height / 2));
      const p = gsap.utils.clamp(0, 1, gsap.utils.mapRange(0, radius, 1, 0, d));
      gsap.to(tile, { scale: 1 + (maxScale - 1) * p, zIndex: Math.round(p * 10), filter: `brightness(${1 + p * 0.25})`, duration: 0.35, ease: "power2.out", overwrite: true });
    });
  });

  const onLeave = contextSafe(() => {
    gsap.to(root.current!.querySelectorAll("[data-tile]"), { scale: 1, filter: "brightness(1)", duration: 0.6, ease: "elastic.out(1, 0.5)", overwrite: true, stagger: { each: 0.01, from: "center" } });
  });

  return (
    <div ref={root} onPointerMove={onMove} onPointerLeave={onLeave} className={cn("grid gap-3", className)} style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}>
      {items.map((item, i) => (
        <div key={i} data-tile className="relative grid aspect-square place-items-center rounded-2xl border border-border bg-card shadow-sm will-change-transform">
          {item}
        </div>
      ))}
    </div>
  );
}
```

## Usage example
```tsx
"use client";
import { Bell, Camera, Cloud, Code2, Compass, Cpu, Feather, Flame, Gem, Globe, Heart, Leaf, Music, Palette, Rocket, Sparkles, Star, Sun, Zap, Moon, Anchor, Coffee, Gift, Key } from "lucide-react";
import { GsapProximityGrid } from "@/components/kinetik/gsap-proximity-grid";

const icons = [Rocket, Sparkles, Palette, Music, Camera, Globe, Code2, Cpu, Heart, Flame, Leaf, Gem, Zap, Star, Sun, Moon, Cloud, Compass, Feather, Bell, Anchor, Coffee, Gift, Key];
const hues = ["text-violet-400", "text-sky-400", "text-pink-400", "text-amber-400", "text-emerald-400", "text-rose-400"];

export default function Demo() {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-4 p-6">
      <GsapProximityGrid
        className="w-full max-w-xl"
        columns={8}
        items={icons.map((I, i) => <I key={i} className={`size-5 ${hues[i % hues.length]}`} />)}
      />
      <p className="text-xs text-muted-foreground">Move your cursor across the grid</p>
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
