You are given a task to integrate a component from the **kinetik** motion library into this codebase.

# Handwritten Signature (`svg-signature`)

A signature that writes itself: each stroke draws at a speed proportional to its length, with pen-lift pauses between strokes and a slight ink swell at the end. Starts when visible.

## What it should do
Build a self-writing signature: measure each path's getTotalLength, set strokeDasharray/offset to that length, and when in view transition dashoffset to 0 with duration = length/speed and a delay = cumulative previous durations + 0.12 s pen lift; finish with a tiny stroke-width swell.

## Project requirements
- React 19 + TypeScript, Tailwind CSS v4, shadcn/ui-style CSS variables (`background`, `foreground`, `muted`, `muted-foreground`, `border`, `card`, `primary`, `ring`). If the project lacks shadcn, set it up first (`npx shadcn@latest init`).
- Animation engine: **svg**.
- No runtime dependencies (CSS only).
- Put the component at `components/kinetik/svg-signature.tsx`.
- `cn` lives at `lib/kinetik/utils.ts` (source below).
- Shared hooks go at `lib/kinetik/core.ts` (source below).

## Non-negotiables
- **Accessibility:** role=img with a descriptive label. Reduced motion: shown fully drawn.
- **Performance:** CSS dash-offset transitions only; lengths measured once.
- Respect `prefers-reduced-motion` (replace movement with opacity or an instant change).
- Animate only transform / opacity / filter / clip-path. No hard-coded theme colors — use CSS variables so it works in light and dark.

## Source — components/kinetik/svg-signature.tsx
```tsx
"use client";
import { useEffect, useRef, useState } from "react";
import { cn, useInView, useReducedMotion } from "@/lib/kinetik/core";

export interface SvgSignatureProps {
  /** One or more stroke paths, drawn in order (like separate pen strokes). */
  paths?: string[];
  viewBox?: string;
  /** Average pen speed in viewBox units per second. */
  speed?: number;
  strokeWidth?: number;
  label?: string;
  className?: string;
}

// An original flowing signature ("Kinetik") drawn as three strokes plus an underline flourish.
const DEFAULT_PATHS = [
  "M20 92 C 22 70, 28 40, 34 26 M34 26 C 30 52, 28 72, 30 96 M30 66 C 44 56, 58 44, 62 34 M38 64 C 50 72, 60 86, 72 94",
  "M80 78 C 82 70, 84 66, 86 64 M90 50 L 91 49 M98 92 C 100 76, 104 66, 112 66 C 120 66, 118 82, 120 92 C 124 80, 130 70, 140 70 C 150 70, 146 86, 152 90 C 160 92, 168 84, 172 72 C 176 60, 162 60, 160 72 C 158 84, 172 94, 186 86 C 194 80, 198 66, 200 44 C 201 70, 202 84, 206 92 M192 64 L 214 62",
  "M222 78 C 224 70, 226 66, 228 64 M232 50 L 233 49 M240 30 C 240 56, 240 76, 242 96 M242 76 C 252 66, 262 60, 268 54 M246 74 C 256 80, 266 90, 280 94",
  "M18 112 C 90 102, 190 100, 300 106 C 260 110, 236 114, 220 120",
];

/**
 * A handwritten signature that writes itself: each stroke is drawn with a dash offset at a speed
 * proportional to its length (so long strokes take longer, like a real pen), with tiny pen-lift
 * pauses between strokes and a slight ink-swell at the end. Starts when visible.
 */
export function SvgSignature({ paths = DEFAULT_PATHS, viewBox = "0 0 320 130", speed = 420, strokeWidth = 3.2, label = "Signature", className }: SvgSignatureProps) {
  const reduced = useReducedMotion();
  const svg = useRef<SVGSVGElement>(null);
  const inView = useInView(svg, { amount: 0.5 });
  const [lens, setLens] = useState<number[]>([]);

  useEffect(() => {
    const els = svg.current?.querySelectorAll("path");
    if (els) setLens([...els].map((p) => (typeof p.getTotalLength === "function" ? p.getTotalLength() : 1000)));
  }, [paths]);

  let t = 0;
  const timings = lens.map((l) => {
    const dur = l / speed;
    const start = t;
    t += dur + 0.12; // pen lift
    return { dur, start };
  });

  return (
    <svg ref={svg} viewBox={viewBox} role="img" aria-label={label} className={cn("h-auto w-full overflow-visible text-foreground", className)} fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
      {paths.map((d, i) => {
        const len = lens[i] ?? 1000;
        const tm = timings[i];
        const go = (inView || reduced) && tm;
        return (
          <path
            key={i}
            d={d}
            strokeDasharray={len}
            strokeDashoffset={go ? 0 : len}
            style={{
              transition: reduced || !tm ? "none" : `stroke-dashoffset ${tm.dur}s cubic-bezier(.45,.05,.55,.95) ${tm.start}s, stroke-width .4s ease ${tm.start + tm.dur}s`,
              strokeWidth: go ? strokeWidth * 1.04 : strokeWidth,
            }}
          />
        );
      })}
    </svg>
  );
}
```

## Usage example
```tsx
"use client";
import { useState } from "react";
import { SvgSignature } from "@/components/kinetik/svg-signature";

export default function Demo() {
  const [k, setK] = useState(0);
  return (
    <div className="flex h-full flex-col items-center justify-center gap-5 bg-[#fbf8f1] p-8 text-zinc-900">
      <div className="w-full max-w-sm rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
        <p className="text-xs uppercase tracking-[0.25em] text-zinc-400">Approved by</p>
        <SvgSignature key={k} className="mt-3 text-indigo-900" label="Signature of the studio director" />
        <div className="mt-2 flex justify-between border-t border-zinc-200 pt-2 text-xs text-zinc-500"><span>Studio Director</span><span>19 Nov 2026</span></div>
      </div>
      <button onClick={() => setK((x) => x + 1)} className="text-xs text-zinc-500 underline underline-offset-4">Sign again</button>
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
