You are given a task to integrate a component from the **kinetik** motion library into this codebase.

# Flip Clock Countdown (`widget-flip-countdown`)

Split-flap countdown: each digit is a physical flap — the top leaf falls away and the bottom leaf swings down with the new number, with a hinge line and depth. Days, hours, minutes, seconds.

## What it should do
Build a flip countdown: each digit card shows a static top half (new value) and bottom half (old value); on change, mount two leaves: the old top half rotating 0→−90° about its bottom edge, then the new bottom half rotating 90°→0 about its top edge (perspective on the card). Halves are clipped copies of the full digit.

## Project requirements
- React 19 + TypeScript, Tailwind CSS v4, shadcn/ui-style CSS variables (`background`, `foreground`, `muted`, `muted-foreground`, `border`, `card`, `primary`, `ring`). If the project lacks shadcn, set it up first (`npx shadcn@latest init`).
- Animation engine: **css**.
- No runtime dependencies (CSS only).
- Put the component at `components/kinetik/widget-flip-countdown.tsx`.
- `cn` lives at `lib/kinetik/utils.ts` (source below).
- Shared hooks go at `lib/kinetik/core.ts` (source below).

## Non-negotiables
- **Accessibility:** role=timer with an sr-only summary of time left; digits aria-hidden. Reduced motion: digits change without flipping.
- **Performance:** CSS keyframes per changed digit only; one 1 s interval.
- Respect `prefers-reduced-motion` (replace movement with opacity or an instant change).
- Animate only transform / opacity / filter / clip-path. No hard-coded theme colors — use CSS variables so it works in light and dark.

## Source — components/kinetik/widget-flip-countdown.tsx
```tsx
"use client";
import { useEffect, useState } from "react";
import { cn, useReducedMotion } from "@/lib/kinetik/core";

export interface WidgetFlipCountdownProps {
  /** Target date/time. */
  to: Date;
  title?: string;
  className?: string;
}

const css = `
.kn-flip { perspective: 400px; }
@keyframes kn-flip-top { from { transform: rotateX(0deg); } to { transform: rotateX(-90deg); } }
@keyframes kn-flip-bottom { from { transform: rotateX(90deg); } to { transform: rotateX(0deg); } }
.kn-flip-top { transform-origin: bottom; animation: kn-flip-top .3s ease-in forwards; }
.kn-flip-bottom { transform-origin: top; animation: kn-flip-bottom .3s ease-out .3s both; }
@media (prefers-reduced-motion: reduce) { .kn-flip-top, .kn-flip-bottom { animation: none; display: none; } }
[data-reduce-motion] .kn-flip-top, [data-reduce-motion] .kn-flip-bottom { animation: none; display: none; }
`;

function Half({ value, part, className }: { value: string; part: "top" | "bottom"; className?: string }) {
  return (
    <span className={cn("absolute inset-x-0 overflow-hidden bg-zinc-800", part === "top" ? "top-0 h-1/2 rounded-t-lg" : "bottom-0 h-1/2 rounded-b-lg", className)}>
      <span className={cn("absolute inset-x-0 flex h-[200%] items-center justify-center", part === "top" ? "top-0" : "bottom-0")}>{value}</span>
    </span>
  );
}

/** One split-flap card: static halves show the new/old values, two animated leaves flip between them. */
function FlipCard({ value }: { value: string }) {
  const [prev, setPrev] = useState(value);
  const [cur, setCur] = useState(value);
  const [k, setK] = useState(0);
  useEffect(() => {
    if (value === cur) return;
    setPrev(cur);
    setCur(value);
    setK((x) => x + 1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);
  return (
    <span className="kn-flip relative block h-14 w-10 font-mono text-4xl font-bold tabular-nums text-white sm:h-24 sm:w-16 sm:text-6xl">
      <Half value={cur} part="top" />
      <Half value={prev} part="bottom" />
      {k > 0 && (
        <span key={k}>
          <Half value={prev} part="top" className="kn-flip-top z-10" />
          <Half value={cur} part="bottom" className="kn-flip-bottom z-10" />
        </span>
      )}
      <span aria-hidden className="absolute inset-x-0 top-1/2 z-20 h-px bg-black/70" />
    </span>
  );
}

/**
 * Split-flap countdown: each digit is a physical flap — the top leaf falls away and the bottom leaf
 * swings down with the new number, with a hinge line and depth shading. Days, hours, minutes,
 * seconds; an sr-only line gives the time left in words once a minute.
 */
export function WidgetFlipCountdown({ to, title = "Launch in", className }: WidgetFlipCountdownProps) {
  const reduced = useReducedMotion();
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);
  const diff = Math.max(0, to.getTime() - now);
  const parts = [
    ["Days", Math.floor(diff / 864e5)],
    ["Hours", Math.floor(diff / 36e5) % 24],
    ["Minutes", Math.floor(diff / 6e4) % 60],
    ["Seconds", Math.floor(diff / 1e3) % 60],
  ] as const;
  return (
    <div className={cn("rounded-3xl bg-zinc-950 p-6 text-white shadow-2xl", className)} role="timer" aria-label={title}>
      <style href="kn-widget-flip-countdown" precedence="kinetik">{css}</style>
      <p className="text-xs uppercase tracking-[0.3em] text-white/50">{title}</p>
      <div className="mt-4 flex items-start gap-2 sm:gap-4">
        {parts.map(([label, n], i) => {
          const s = String(n).padStart(2, "0");
          return (
            <div key={label} className="flex items-start gap-2 sm:gap-4">
              <div className="text-center">
                <div className="flex gap-1" aria-hidden>
                  <FlipCard value={s[0]} />
                  <FlipCard value={s[1]} />
                </div>
                <p className="mt-2 text-[10px] uppercase tracking-widest text-white/45">{label}</p>
              </div>
              {i < 3 && <span aria-hidden className="mt-6 text-3xl font-bold text-white/30 sm:mt-8">:</span>}
            </div>
          );
        })}
      </div>
      <p className="sr-only" aria-live={reduced ? "off" : "polite"}>
        {parts[0][1]} days, {parts[1][1]} hours, {parts[2][1]} minutes left
      </p>
    </div>
  );
}
```

## Usage example
```tsx
"use client";
import { useState } from "react";
import { DemoCenter } from "@/components/kinetik/demo-helpers" /* or inline */;
import { WidgetFlipCountdown } from "@/components/kinetik/widget-flip-countdown";

export default function Demo() {
  const [to] = useState(() => new Date(Date.now() + ((3 * 24 + 7) * 3600 + 42 * 60 + 9) * 1000));
  return (
    <DemoCenter>
      <WidgetFlipCountdown to={to} title="Kinetik 3.0 launches in" />
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
