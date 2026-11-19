You are given a task to integrate a component from the **kinetik** motion library into this codebase.

# Ink Bleed Headline (`text-ink-bleed`)

A headline that bleeds onto the page like ink on wet paper: SVG turbulence displacement and blur decay to zero while words fade up in sequence, leaving perfectly crisp type.

## What it should do
Build an ink-bleed headline: an SVG filter (feTurbulence fractalNoise → feDisplacementMap → feGaussianBlur) applied to the text; on entering view animate a 0→1 progress with Motion's animate(), setting displacement scale (60→0) and blur (6→0) imperatively, while each word fades and rises with a per-word offset. Remove the filter at 1. Replays on re-entry.

## Project requirements
- React 19 + TypeScript, Tailwind CSS v4, shadcn/ui-style CSS variables (`background`, `foreground`, `muted`, `muted-foreground`, `border`, `card`, `primary`, `ring`). If the project lacks shadcn, set it up first (`npx shadcn@latest init`).
- Animation engine: **motion**.
- Install dependencies: `npm i motion`
- Put the component at `components/kinetik/text-ink-bleed.tsx`.
- `cn` lives at `lib/kinetik/utils.ts` (source below).
- Shared hooks go at `lib/kinetik/core.ts` (source below).

## Non-negotiables
- **Accessibility:** The heading keeps its full text as aria-label; animated words are aria-hidden. Reduced motion: crisp text, no filter.
- **Performance:** Filter attributes updated for ~2 s only; filter removed once settled.
- Respect `prefers-reduced-motion` (replace movement with opacity or an instant change).
- Animate only transform / opacity / filter / clip-path. No hard-coded theme colors — use CSS variables so it works in light and dark.

## Source — components/kinetik/text-ink-bleed.tsx
```tsx
"use client";
import { useEffect, useId, useRef, useState } from "react";
import { animate } from "motion/react";
import { cn, useInView, useReducedMotion } from "@/lib/kinetik/core";

export interface TextInkBleedProps {
  text: string;
  as?: "h1" | "h2" | "h3" | "p";
  /** Seconds for the ink to settle. */
  duration?: number;
  className?: string;
}

/**
 * Headline that bleeds onto the page like ink on wet paper: an SVG turbulence displacement plus
 * blur both decay to zero while letters fade up word by word, leaving perfectly crisp type.
 * Replays when it re-enters the viewport.
 */
export function TextInkBleed({ text, as: Tag = "h2", duration = 1.8, className }: TextInkBleedProps) {
  const reduced = useReducedMotion();
  const id = `ink-${useId().replace(/:/g, "")}`;
  const ref = useRef<HTMLElement>(null);
  const disp = useRef<SVGFEDisplacementMapElement>(null);
  const blur = useRef<SVGFEGaussianBlurElement>(null);
  const inView = useInView(ref, { once: false, amount: 0.4 });
  const [p, setP] = useState(reduced ? 1 : 0);

  useEffect(() => {
    if (reduced) return setP(1);
    if (!inView) return setP(0);
    const ctl = animate(0, 1, {
      duration,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => {
        setP(v);
        disp.current?.setAttribute("scale", String((1 - v) * 60));
        blur.current?.setAttribute("stdDeviation", String((1 - v) * 6));
      },
    });
    return () => ctl.stop();
  }, [inView, reduced, duration]);

  const words = text.split(" ");
  return (
    <Tag ref={ref as never} className={cn("relative", className)} aria-label={text}>
      <svg aria-hidden className="absolute size-0">
        <filter id={id} x="-20%" y="-40%" width="140%" height="180%">
          <feTurbulence type="fractalNoise" baseFrequency="0.035" numOctaves="3" seed="4" result="noise" />
          <feDisplacementMap ref={disp} in="SourceGraphic" in2="noise" scale="60" xChannelSelector="R" yChannelSelector="G" result="d" />
          <feGaussianBlur ref={blur} in="d" stdDeviation="6" />
        </filter>
      </svg>
      <span aria-hidden style={{ filter: p < 0.999 ? `url(#${id})` : undefined }} className="inline">
        {words.map((w, i) => {
          const local = Math.min(1, Math.max(0, p * 1.6 - (i / words.length) * 0.6));
          return (
            <span key={i} className="inline-block whitespace-pre" style={{ opacity: local, transform: `translateY(${(1 - local) * 0.25}em)` }}>
              {w}
              {i < words.length - 1 ? " " : ""}
            </span>
          );
        })}
      </span>
    </Tag>
  );
}
```

## Usage example
```tsx
"use client";
import { useState } from "react";
import { TextInkBleed } from "@/components/kinetik/text-ink-bleed";

export default function Demo() {
  const [k, setK] = useState(0);
  return (
    <div className="flex h-full flex-col items-center justify-center gap-6 bg-[#f4efe6] p-8 text-center text-zinc-900">
      <p className="text-[10px] uppercase tracking-[0.35em] text-zinc-500">Issue 07 — Autumn</p>
      <TextInkBleed key={k} as="h2" text="Words that settle like ink." className="max-w-xl font-serif text-5xl leading-[1.05] tracking-tight sm:text-6xl" />
      <button onClick={() => setK((x) => x + 1)} className="text-xs text-zinc-500 underline underline-offset-4">Replay</button>
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
