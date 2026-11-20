You are given a task to integrate a component from the **kinetik** motion library into this codebase.

# Text — Gravity Letters (`text-gravity-hover`)

Letters that come unstuck: brush a letter and it drops off the line, tumbles and bounces on an invisible floor with a spin, then floats back into place on a spring. A Shake button drops them all.

## What it should do
Split into letter spans with y/rotate motion values; on pointerenter animate y through bounce keyframes to the floor with a random spin, wait, then spring back to 0.

## Project requirements
- React 19 + TypeScript, Tailwind CSS v4, shadcn/ui-style CSS variables (`background`, `foreground`, `muted`, `muted-foreground`, `border`, `card`, `primary`, `ring`). If the project lacks shadcn, set it up first (`npx shadcn@latest init`).
- Animation engine: **motion**.
- Install dependencies: `npm i motion`
- Put the component at `components/kinetik/text-gravity-hover.tsx`.
- `cn` lives at `lib/kinetik/utils.ts` (source below).
- Shared hooks go at `lib/kinetik/core.ts` (source below).

## Non-negotiables
- **Accessibility:** Full text in aria-label; Shake button for keyboard users; reduced motion keeps the text still.
- **Performance:** Two motion values per letter; animation only while falling.
- Respect `prefers-reduced-motion` (replace movement with opacity or an instant change).
- Animate only transform / opacity / filter / clip-path. No hard-coded theme colors — use CSS variables so it works in light and dark.

## Source — components/kinetik/text-gravity-hover.tsx
```tsx
"use client";
import { useEffect, useRef, useState } from "react";
import { animate, motion, useMotionValue } from "motion/react";
import { cn, useReducedMotion } from "@/lib/kinetik/core";

export interface TextGravityHoverProps {
  text: string;
  /** How far letters fall, in em. */
  drop?: number;
  /** ms before fallen letters float back. */
  restore?: number;
  className?: string;
}

/**
 * Letters that come unstuck: brush a letter and it drops off the line, tumbles and bounces on an
 * invisible floor with a little spin, then after a moment floats back into place on a spring.
 * A "Shake" button drops them all for keyboard users. Reduced motion leaves the text still.
 */
export function TextGravityHover({ text, drop = 1.6, restore = 1800, className }: TextGravityHoverProps) {
  const reduced = useReducedMotion();
  const [shake, setShake] = useState(0);
  return (
    <span className={cn("relative inline-flex flex-col items-center gap-4", className)}>
      <span aria-label={text} className="inline-block whitespace-nowrap">
        {[...text].map((ch, i) => (ch === " " ? <span key={i}>&nbsp;</span> : <Letter key={i} ch={ch} drop={drop} restore={restore} off={reduced} shake={shake} delay={i * 0.03} />))}
      </span>
      {!reduced && (
        <button type="button" onClick={() => setShake((s) => s + 1)} className="rounded-full border px-3 py-1 text-xs font-normal tracking-normal text-muted-foreground hover:text-foreground">
          Shake
        </button>
      )}
    </span>
  );
}

function Letter({ ch, drop, restore, off, shake, delay }: { ch: string; drop: number; restore: number; off: boolean; shake: number; delay: number }) {
  const y = useMotionValue(0), r = useMotionValue(0);
  const busy = useRef(false);
  const el = useRef<HTMLSpanElement>(null);
  const fall = async (d = 0) => {
    if (off || busy.current) return;
    busy.current = true;
    const spin = (Math.random() - 0.5) * 70;
    const em = el.current ? parseFloat(getComputedStyle(el.current).fontSize) : 16;
    const floor = drop * em;
    animate(r, spin, { duration: 0.9, delay: d, ease: "easeOut" });
    await animate(y, [0, floor, floor * 0.72, floor, floor * 0.92, floor], { duration: 1, delay: d, times: [0, 0.4, 0.58, 0.74, 0.86, 1], ease: ["easeIn", "easeOut", "easeIn", "easeOut", "easeIn"] });
    await new Promise((res) => setTimeout(res, restore));
    animate(r, 0, { type: "spring", stiffness: 120, damping: 12 });
    await animate(y, 0, { type: "spring", stiffness: 120, damping: 14 });
    busy.current = false;
  };
  useEffect(() => {
    if (shake) fall(delay);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shake]);
  return (
    <motion.span ref={el} aria-hidden className="inline-block will-change-transform" style={{ y, rotate: r }} onPointerEnter={() => fall()}>
      {ch}
    </motion.span>
  );
}
```

## Usage example
```tsx
"use client";
import { DemoCenter } from "@/components/kinetik/demo-helpers" /* or inline */;
import { TextGravityHover } from "@/components/kinetik/text-gravity-hover";

export default function Demo() {
  return (
    <DemoCenter className="flex-col gap-2 pb-24 text-center">
      <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Hover the letters</p>
      <TextGravityHover text="Loose Type" className="text-6xl font-black tracking-tight" />
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
