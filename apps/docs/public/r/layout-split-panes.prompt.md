You are given a task to integrate a component from the **kinetik** motion library into this codebase.

# Layout — Split Panes (`layout-split-panes`)

Resizable split view with feel: drag the handle and the panes resize live; release near a snap point (⅓, ½, ⅔) and it springs into place. The grip grows while dragging and shows the ratio. Arrow keys, Home/End and double-click to reset.

## What it should do
Store the split as a motion value; pointer capture on the handle maps clientX to a clamped ratio; on release spring to the nearest snap within 6%; render the ratio badge from the motion value.

## Project requirements
- React 19 + TypeScript, Tailwind CSS v4, shadcn/ui-style CSS variables (`background`, `foreground`, `muted`, `muted-foreground`, `border`, `card`, `primary`, `ring`). If the project lacks shadcn, set it up first (`npx shadcn@latest init`).
- Animation engine: **motion**.
- Install dependencies: `npm i motion`
- Put the component at `components/kinetik/layout-split-panes.tsx`.
- `cn` lives at `lib/kinetik/utils.ts` (source below).
- Shared hooks go at `lib/kinetik/core.ts` (source below).

## Non-negotiables
- **Accessibility:** Handle is role=separator with live aria-valuenow; ←/→, Home/End, Enter reset. Reduced motion snaps without springs.
- **Performance:** One motion value drives the left width; no layout thrash beyond the resize itself.
- Respect `prefers-reduced-motion` (replace movement with opacity or an instant change).
- Animate only transform / opacity / filter / clip-path. No hard-coded theme colors — use CSS variables so it works in light and dark.

## Source — components/kinetik/layout-split-panes.tsx
```tsx
"use client";
import { useRef, useState, type ReactNode } from "react";
import { animate, motion, useMotionValue, useMotionValueEvent, useTransform } from "motion/react";
import { cn, useReducedMotion } from "@/lib/kinetik/core";

export interface LayoutSplitPanesProps {
  left: ReactNode;
  right: ReactNode;
  /** Initial split, 0–1. */
  defaultSplit?: number;
  /** Positions the divider snaps to when released nearby. */
  snaps?: number[];
  min?: number;
  max?: number;
  className?: string;
}

/**
 * Resizable split view with feel: drag the handle and the panes resize live; release near a snap
 * point (⅓, ½, ⅔ by default) and it springs into place with a little overshoot. The handle grows
 * a grip while dragged and shows the current ratio. Keyboard: ←/→ moves 5%, Home/End to the
 * limits, double-click (or Enter) resets.
 */
export function LayoutSplitPanes({ left, right, defaultSplit = 0.5, snaps = [1 / 3, 0.5, 2 / 3], min = 0.2, max = 0.8, className }: LayoutSplitPanesProps) {
  const reduced = useReducedMotion();
  const box = useRef<HTMLDivElement>(null);
  const split = useMotionValue(defaultSplit);
  const [now, setNow] = useState(Math.round(defaultSplit * 100));
  useMotionValueEvent(split, "change", (v) => setNow(Math.round(v * 100)));
  const leftW = useTransform(split, (v) => `${v * 100}%`);
  const label = useTransform(split, (v) => `${Math.round(v * 100)} / ${Math.round((1 - v) * 100)}`);
  const dragging = useMotionValue(0);
  const gripH = useTransform(dragging, [0, 1], [28, 56]);
  const clamp = (v: number) => Math.max(min, Math.min(max, v));
  const go = (v: number) => (reduced ? split.set(clamp(v)) : animate(split, clamp(v), { type: "spring", stiffness: 380, damping: 22 }));
  const release = () => {
    dragging.set(0);
    const v = split.get();
    const near = snaps.reduce((a, s) => (Math.abs(s - v) < Math.abs(a - v) ? s : a), snaps[0] ?? v);
    if (Math.abs(near - v) < 0.06) go(near);
  };

  return (
    <div ref={box} className={cn("relative flex h-full overflow-hidden rounded-2xl border bg-card", className)}>
      <motion.div className="relative h-full min-w-0 overflow-hidden" style={{ width: leftW }}>{left}</motion.div>
      <div
        role="separator"
        aria-orientation="vertical"
        aria-valuemin={min * 100}
        aria-valuemax={max * 100}
        aria-valuenow={now}
        aria-label="Resize panes"
        tabIndex={0}
        className="group relative z-10 w-3 shrink-0 cursor-col-resize touch-none outline-none"
        onPointerDown={(e) => {
          e.currentTarget.setPointerCapture(e.pointerId);
          dragging.set(1);
        }}
        onPointerMove={(e) => {
          if (!dragging.get()) return;
          const b = box.current!.getBoundingClientRect();
          split.set(clamp((e.clientX - b.left) / b.width));
        }}
        onPointerUp={release}
        onPointerCancel={release}
        onDoubleClick={() => go(defaultSplit)}
        onKeyDown={(e) => {
          const k = e.key;
          if (k === "ArrowLeft" || k === "ArrowRight") (e.preventDefault(), go(split.get() + (k === "ArrowLeft" ? -0.05 : 0.05)));
          else if (k === "Home") go(min);
          else if (k === "End") go(max);
          else if (k === "Enter") go(defaultSplit);
        }}
      >
        <span className="absolute inset-y-0 left-1/2 w-px -translate-x-1/2 bg-border" />
        <motion.span style={{ height: gripH }} className="absolute left-1/2 top-1/2 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-foreground/70 ring-4 ring-card transition-colors group-hover:bg-foreground group-focus-visible:bg-sky-500" />
        <motion.span className="pointer-events-none absolute left-1/2 top-[calc(50%+40px)] -translate-x-1/2 whitespace-nowrap rounded-full bg-foreground px-2 py-0.5 font-mono text-[10px] text-background opacity-0 transition-opacity group-active:opacity-100 group-focus-visible:opacity-100">{label}</motion.span>
      </div>
      <div className="relative h-full min-w-0 flex-1 overflow-hidden">{right}</div>
    </div>
  );
}
```

## Usage example
```tsx
"use client";
import { DemoCenter, photos } from "@/components/kinetik/demo-helpers" /* or inline */;
import { LayoutSplitPanes } from "@/components/kinetik/layout-split-panes";

export default function Demo() {
  return (
    <DemoCenter>
      <div className="h-[340px] w-full max-w-2xl">
        <LayoutSplitPanes
          defaultSplit={0.42}
          left={
            <div className="h-full space-y-2 p-5 font-mono text-[12px] leading-relaxed">
              <p className="text-muted-foreground">{"// hero.tsx"}</p>
              <p><span className="text-violet-500">export function</span> <span className="text-sky-500">Hero</span>() {"{"}</p>
              <p className="pl-4"><span className="text-violet-500">return</span> {"<"}<span className="text-rose-500">section</span>{">"}</p>
              <p className="pl-8">{"<"}<span className="text-rose-500">h1</span>{">"}Ocean glass{"</"}<span className="text-rose-500">h1</span>{">"}</p>
              <p className="pl-8">{"<"}<span className="text-rose-500">img</span> <span className="text-amber-500">src</span>=<span className="text-emerald-500">"/sea.jpg"</span> {"/>"}</p>
              <p className="pl-4">{"</"}<span className="text-rose-500">section</span>{">"}</p>
              <p>{"}"}</p>
            </div>
          }
          right={
            <div className="relative h-full">
              <img src={photos[1]} alt="" className="absolute inset-0 size-full object-cover" />
              <h3 className="absolute bottom-5 left-5 text-3xl font-semibold text-white drop-shadow">Ocean glass</h3>
            </div>
          }
        />
      </div>
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
