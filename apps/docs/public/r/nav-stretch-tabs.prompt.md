You are given a task to integrate a component from the **kinetik** motion library into this codebase.

# Tabs — Stretch Indicator (`nav-stretch-tabs`)

Tabs whose pill indicator moves like a caterpillar: the leading edge springs toward the new tab first while the trailing edge lags and catches up, so the pill stretches across the gap and snaps back.

## What it should do
Track left and right edges as separate motion values; when the tab changes animate the leading edge with a stiff spring and the trailing edge with a softer, delayed spring; width = right − left.

## Project requirements
- React 19 + TypeScript, Tailwind CSS v4, shadcn/ui-style CSS variables (`background`, `foreground`, `muted`, `muted-foreground`, `border`, `card`, `primary`, `ring`). If the project lacks shadcn, set it up first (`npx shadcn@latest init`).
- Animation engine: **motion**.
- Install dependencies: `npm i motion`
- Put the component at `components/kinetik/nav-stretch-tabs.tsx`.
- `cn` lives at `lib/kinetik/utils.ts` (source below).
- Shared hooks go at `lib/kinetik/core.ts` (source below).

## Non-negotiables
- **Accessibility:** role=tablist with roving tabindex and arrow-key navigation. Reduced motion jumps the indicator.
- **Performance:** Two motion values (left/right edges) on one absolutely positioned span.
- Respect `prefers-reduced-motion` (replace movement with opacity or an instant change).
- Animate only transform / opacity / filter / clip-path. No hard-coded theme colors — use CSS variables so it works in light and dark.

## Source — components/kinetik/nav-stretch-tabs.tsx
```tsx
"use client";
import { useLayoutEffect, useRef, useState } from "react";
import { animate, motion, useMotionValue } from "motion/react";
import { cn, useReducedMotion } from "@/lib/kinetik/core";

export interface NavStretchTabsProps {
  tabs: string[];
  defaultIndex?: number;
  onChange?: (i: number) => void;
  className?: string;
}

/**
 * Tabs whose indicator moves like a caterpillar: the leading edge springs out toward the new tab
 * first while the trailing edge lags and then catches up, so the pill stretches across the gap and
 * snaps back — two independently timed edges instead of one sliding box. Arrow keys move between tabs.
 */
export function NavStretchTabs({ tabs, defaultIndex = 0, onChange, className }: NavStretchTabsProps) {
  const reduced = useReducedMotion();
  const [active, setActive] = useState(defaultIndex);
  const list = useRef<HTMLDivElement>(null);
  const left = useMotionValue(0), right = useMotionValue(0);
  const width = useWidth(left, right);
  const first = useRef(true);

  useLayoutEffect(() => {
    const el = list.current?.children[active] as HTMLElement | undefined;
    if (!el) return;
    const l = el.offsetLeft, r = el.offsetLeft + el.offsetWidth;
    if (first.current || reduced) {
      left.set(l);
      right.set(r);
      first.current = false;
      return;
    }
    const goingRight = l > left.get();
    const lead = { type: "spring" as const, stiffness: 520, damping: 34 };
    const trail = { type: "spring" as const, stiffness: 260, damping: 26, delay: 0.07 };
    const a = animate(left, l, goingRight ? trail : lead);
    const b = animate(right, r, goingRight ? lead : trail);
    return () => (a.stop(), b.stop());
  }, [active, reduced, left, right]);

  const select = (i: number) => (setActive(i), onChange?.(i));
  return (
    <div className={cn("relative inline-flex rounded-full bg-muted p-1", className)}>
      <motion.span aria-hidden className="absolute bottom-1 top-1 rounded-full bg-foreground shadow" style={{ left, width }} />
      <div ref={list} role="tablist" className="relative flex">
        {tabs.map((t, i) => (
          <button
            key={t}
            role="tab"
            type="button"
            aria-selected={i === active}
            tabIndex={i === active ? 0 : -1}
            onClick={() => select(i)}
            onKeyDown={(e) => {
              const d = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0;
              if (!d) return;
              const n = (i + d + tabs.length) % tabs.length;
              select(n);
              (e.currentTarget.parentElement?.children[n] as HTMLElement)?.focus();
            }}
            className={cn("relative rounded-full px-4 py-1.5 text-sm font-medium transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring", i === active ? "text-background" : "text-muted-foreground hover:text-foreground")}
          >
            {t}
          </button>
        ))}
      </div>
    </div>
  );
}

function useWidth(left: ReturnType<typeof useMotionValue<number>>, right: ReturnType<typeof useMotionValue<number>>) {
  const w = useMotionValue(0);
  useLayoutEffect(() => {
    const update = () => w.set(Math.max(0, right.get() - left.get()));
    update();
    const u1 = left.on("change", update), u2 = right.on("change", update);
    return () => (u1(), u2());
  }, [left, right, w]);
  return w;
}
```

## Usage example
```tsx
"use client";
import { DemoCenter } from "@/components/kinetik/demo-helpers" /* or inline */;
import { NavStretchTabs } from "@/components/kinetik/nav-stretch-tabs";

export default function Demo() {
  return (
    <DemoCenter className="flex-col gap-5">
      <NavStretchTabs tabs={["Overview", "Analytics", "Reports", "Settings"]} defaultIndex={1} />
      <NavStretchTabs tabs={["Day", "Week", "Month", "Year"]} className="scale-90" />
      <p className="text-xs text-muted-foreground">Jump far — the pill stretches, then catches up</p>
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
