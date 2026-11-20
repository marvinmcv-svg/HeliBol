You are given a task to integrate a component from the **kinetik** motion library into this codebase.

# Button — Like Counter (`button-like-counter`)

Like button with the full ceremony: the heart squashes then bursts — a ring expands and confetti dots fly out — and the counter rolls digit by digit, only the digits that change, up for a like and down for an unlike.

## What it should do
Render each character of the formatted count in its own slot with AnimatePresence keyed by the character so only changed digits animate (direction by like/unlike); burst ring + radial dots on like.

## Project requirements
- React 19 + TypeScript, Tailwind CSS v4, shadcn/ui-style CSS variables (`background`, `foreground`, `muted`, `muted-foreground`, `border`, `card`, `primary`, `ring`). If the project lacks shadcn, set it up first (`npx shadcn@latest init`).
- Animation engine: **motion**.
- Install dependencies: `npm i motion`
- Put the component at `components/kinetik/button-like-counter.tsx`.
- `cn` lives at `lib/kinetik/utils.ts` (source below).
- Shared hooks go at `lib/kinetik/core.ts` (source below).

## Non-negotiables
- **Accessibility:** aria-pressed with the count in the label. Reduced motion skips burst and roll.
- **Performance:** Short-lived transform animations; digits are separate spans keyed by value.
- Respect `prefers-reduced-motion` (replace movement with opacity or an instant change).
- Animate only transform / opacity / filter / clip-path. No hard-coded theme colors — use CSS variables so it works in light and dark.

## Source — components/kinetik/button-like-counter.tsx
```tsx
"use client";
import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { cn, useReducedMotion } from "@/lib/kinetik/core";

export interface ButtonLikeCounterProps {
  count: number;
  defaultLiked?: boolean;
  onChange?: (liked: boolean) => void;
  className?: string;
}

const fmt = (n: number) => (n >= 10000 ? `${(n / 1000).toFixed(n >= 100000 ? 0 : 1)}k` : n.toLocaleString());

/**
 * Like button with the full ceremony: the heart squashes, then bursts — a ring expands and
 * confetti dots fly out on a spiral — and the counter rolls digit by digit (only the digits that
 * change move, up for a like, down for an unlike).
 */
export function ButtonLikeCounter({ count, defaultLiked = false, onChange, className }: ButtonLikeCounterProps) {
  const reduced = useReducedMotion();
  const [liked, setLiked] = useState(defaultLiked);
  const [burst, setBurst] = useState(0);
  const n = count + (liked ? 1 : 0);
  const toggle = () => {
    const next = !liked;
    setLiked(next);
    if (next) setBurst((b) => b + 1);
    onChange?.(next);
  };
  const dir = liked ? 1 : -1;
  return (
    <button
      type="button"
      aria-pressed={liked}
      aria-label={`${liked ? "Unlike" : "Like"}, ${n.toLocaleString()} likes`}
      onClick={toggle}
      className={cn("group inline-flex h-11 items-center gap-2 rounded-full border bg-card pl-2.5 pr-4 text-sm font-medium transition-colors", liked ? "border-rose-500/30 text-rose-500" : "text-muted-foreground hover:text-foreground", className)}
    >
      <span className="relative grid size-7 place-items-center">
        {!reduced && burst > 0 && liked && (
          <span key={burst} aria-hidden className="pointer-events-none absolute inset-0">
            <motion.span className="absolute inset-0 rounded-full border-2 border-rose-500" initial={{ scale: 0.3, opacity: 1 }} animate={{ scale: 1.8, opacity: 0, borderWidth: 0 }} transition={{ duration: 0.5 }} />
            {Array.from({ length: 10 }, (_, i) => {
              const a = (i / 10) * Math.PI * 2;
              return (
                <motion.span
                  key={i}
                  className="absolute left-1/2 top-1/2 size-1.5 rounded-full"
                  style={{ background: ["#f43f5e", "#f59e0b", "#8b5cf6", "#22d3ee", "#22c55e"][i % 5], marginLeft: -3, marginTop: -3 }}
                  initial={{ x: 0, y: 0, scale: 1 }}
                  animate={{ x: Math.cos(a + 0.4) * 22, y: Math.sin(a + 0.4) * 22, scale: 0 }}
                  transition={{ duration: 0.6, ease: "easeOut", delay: 0.08 }}
                />
              );
            })}
          </span>
        )}
        <motion.svg viewBox="0 0 24 24" className="size-6" animate={reduced ? {} : liked ? { scale: [1, 0.6, 1.25, 1] } : { scale: [1, 0.85, 1] }} transition={{ duration: 0.45 }} key={String(liked)}>
          <path d="M12 20.5s-7.5-4.6-7.5-10.3A4.3 4.3 0 0 1 12 7.6a4.3 4.3 0 0 1 7.5 2.6c0 5.7-7.5 10.3-7.5 10.3z" fill={liked ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
        </motion.svg>
      </span>
      <span aria-hidden className="inline-flex overflow-hidden font-mono tabular-nums">
        {[...fmt(n)].map((ch, i, arr) => (
          <span key={arr.length - i} className="relative inline-grid h-5 overflow-hidden">
            <AnimatePresence initial={false} mode="popLayout">
              <motion.span key={ch} className="col-start-1 row-start-1" initial={{ y: reduced ? 0 : 18 * dir, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: reduced ? 0 : -18 * dir, opacity: 0 }} transition={{ type: "spring", stiffness: 500, damping: 30 }}>
                {ch}
              </motion.span>
            </AnimatePresence>
          </span>
        ))}
      </span>
    </button>
  );
}
```

## Usage example
```tsx
"use client";
import { DemoCenter } from "@/components/kinetik/demo-helpers" /* or inline */;
import { ButtonLikeCounter } from "@/components/kinetik/button-like-counter";

export default function Demo() {
  return (
    <DemoCenter className="flex-col gap-5">
      <div className="flex flex-wrap items-center justify-center gap-3">
        <ButtonLikeCounter count={1299} />
        <ButtonLikeCounter count={48} defaultLiked />
        <ButtonLikeCounter count={23999} />
      </div>
      <p className="text-xs text-muted-foreground">Watch only the changing digits roll</p>
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
