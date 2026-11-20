You are given a task to integrate a component from the **kinetik** motion library into this codebase.

# Transition — Stairs (`transition-stairs`)

Staircase page transition: vertical columns drop in one after another, a big index number appears while the page swaps under cover, then the columns keep falling out the bottom in the same order.

## What it should do
Render N flex columns with initial y -100%, animate to 0 with a per-column delay, swap the page once all are down, then exit to y 100% with the same stagger.

## Project requirements
- React 19 + TypeScript, Tailwind CSS v4, shadcn/ui-style CSS variables (`background`, `foreground`, `muted`, `muted-foreground`, `border`, `card`, `primary`, `ring`). If the project lacks shadcn, set it up first (`npx shadcn@latest init`).
- Animation engine: **motion**.
- Install dependencies: `npm i motion`
- Put the component at `components/kinetik/transition-stairs.tsx`.
- `cn` lives at `lib/kinetik/utils.ts` (source below).
- Shared hooks go at `lib/kinetik/core.ts` (source below).

## Non-negotiables
- **Accessibility:** Columns are decorative; nav uses aria-current. Reduced motion swaps instantly.
- **Performance:** N transformed divs; no layout work.
- Respect `prefers-reduced-motion` (replace movement with opacity or an instant change).
- Animate only transform / opacity / filter / clip-path. No hard-coded theme colors — use CSS variables so it works in light and dark.

## Source — components/kinetik/transition-stairs.tsx
```tsx
"use client";
import { useState, type ReactNode } from "react";
import { AnimatePresence, motion } from "motion/react";
import { cn, useReducedMotion } from "@/lib/kinetik/core";

export interface TransitionStairsProps {
  pages: { title: string; content: ReactNode }[];
  /** Number of vertical columns. */
  steps?: number;
  color?: string;
  className?: string;
}

/**
 * "Stairs" page transition: vertical columns drop in one after another like a staircase, the page
 * swaps while covered (with a big index number), then the columns keep falling out of the bottom in
 * the same order. Reduced motion swaps instantly.
 */
export function TransitionStairs({ pages, steps = 6, color = "#111", className }: TransitionStairsProps) {
  const reduced = useReducedMotion();
  const [i, setI] = useState(0);
  const [cover, setCover] = useState<number | null>(null);
  const ease = [0.76, 0, 0.24, 1] as const;
  const inDur = 0.45, stagger = 0.05;
  const go = (n: number) => {
    if (n === i || cover !== null) return;
    if (reduced) return setI(n);
    setCover(n);
    const full = (inDur + stagger * (steps - 1)) * 1000;
    setTimeout(() => setI(n), full);
    setTimeout(() => setCover(null), full + 300);
  };
  return (
    <div className={cn("relative h-full overflow-hidden", className)}>
      <nav className="absolute left-1/2 top-3 z-30 flex -translate-x-1/2 gap-1 rounded-full border border-border bg-background/80 p-1 backdrop-blur">
        {pages.map((p, n) => (
          <button key={p.title} type="button" onClick={() => go(n)} aria-current={i === n ? "page" : undefined} className={cn("rounded-full px-3 py-1 text-xs", i === n ? "bg-foreground text-background" : "text-muted-foreground")}>{p.title}</button>
        ))}
      </nav>
      <div className="h-full">{pages[i]!.content}</div>
      <AnimatePresence>
        {cover !== null && (
          <motion.div key="stairs" className="pointer-events-none absolute inset-0 z-20 flex" style={{ containerType: "size" }} exit={{ opacity: 1 }} transition={{ duration: (inDur + stagger * steps) }}>
            {Array.from({ length: steps }, (_, s) => (
              <motion.div
                key={s}
                className="h-full flex-1"
                style={{ background: color, marginLeft: -1 }}
                initial={{ y: "-100%" }}
                animate={{ y: "0%", transition: { duration: inDur, delay: s * stagger, ease } }}
                exit={{ y: "100%", transition: { duration: inDur, delay: s * stagger, ease } }}
              />
            ))}
            <motion.span
              className="absolute inset-0 grid place-items-center font-mono text-[18cqw] font-bold leading-none text-white/90"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0, transition: { delay: 0.3 } }}
              exit={{ opacity: 0, transition: { duration: 0.15 } }}
            >
              {String(cover + 1).padStart(2, "0")}
            </motion.span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
```

## Usage example
```tsx
"use client";
import { photos } from "@/components/kinetik/demo-helpers" /* or inline */;
import { TransitionStairs } from "@/components/kinetik/transition-stairs";

const Screen = ({ img, kicker, title }: { img: string; kicker: string; title: string }) => (
  <div className="relative h-full w-full">
    <img src={img} alt="" className="absolute inset-0 h-full w-full object-cover" />
    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
    <div className="absolute bottom-14 left-6 text-white">
      <p className="text-[10px] uppercase tracking-[0.3em] opacity-70">{kicker}</p>
      <h3 className="text-5xl font-semibold tracking-tight">{title}</h3>
    </div>
  </div>
);

export default function Demo() {
  return (
    <TransitionStairs
      color="#18181b"
      pages={[
        { title: "Studio", content: <Screen img={photos[2]} kicker="01 — Studio" title="We build quiet things" /> },
        { title: "Work", content: <Screen img={photos[5]} kicker="02 — Work" title="Selected projects" /> },
        { title: "Contact", content: <Screen img={photos[0]} kicker="03 — Contact" title="Say hello" /> },
      ]}
    />
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
