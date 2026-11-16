You are given a task to integrate a component from the **kinetik** motion library into this codebase.

# Hero — Framed Peak (`hero-framed-peak`)

Foundation/mission hero: a rounded alpine scene with parallax ridges, a tiny hiker climbing and a white frame that draws itself around the name.

## What it should do
Build a mission hero: inside a rounded-3xl blue sky card, two SVG mountain ridges drift in opposite directions (parallax), a tiny hiker walks up the main ridge via animateMotion, and a 6px white rectangle draws itself around the title (stroke-dashoffset 1400→0), after which the title fades in. Below the card, a two-tone purple line of copy.

## Project requirements
- React 19 + TypeScript, Tailwind CSS v4, shadcn/ui-style CSS variables (`background`, `foreground`, `muted`, `muted-foreground`, `border`, `card`, `primary`, `ring`). If the project lacks shadcn, set it up first (`npx shadcn@latest init`).
- Animation engine: **css**.
- No runtime dependencies (CSS only).
- Put the component at `components/kinetik/hero-framed-peak.tsx`.
- `cn` lives at `lib/kinetik/utils.ts` (source below).
- Shared hooks go at `lib/kinetik/core.ts` (source below).

## Non-negotiables
- **Accessibility:** Real h1 inside the scene; SVG is aria-hidden; reduced motion places the hiker statically and shows the frame drawn.
- **Performance:** Two transform loops, one stroke draw, one SMIL animateMotion.
- Respect `prefers-reduced-motion` (replace movement with opacity or an instant change).
- Animate only transform / opacity / filter / clip-path. No hard-coded theme colors — use CSS variables so it works in light and dark.

## Source — components/kinetik/hero-framed-peak.tsx
```tsx
"use client";
import { cn, useReducedMotion } from "@/lib/kinetik/core";

const css = `
.k-hfp .frame{stroke-dasharray:1400;stroke-dashoffset:1400;animation:k-hfp-draw 1.8s cubic-bezier(.65,0,.35,1) .2s forwards}
@keyframes k-hfp-draw{to{stroke-dashoffset:0}}
.k-hfp .title{animation:k-hfp-in 1s ease-out 1.1s both}
@keyframes k-hfp-in{from{opacity:0;transform:translateY(8px)}}
.k-hfp .far{animation:k-hfp-drift 18s ease-in-out infinite alternate}
.k-hfp .near{animation:k-hfp-drift 12s ease-in-out infinite alternate-reverse}
@keyframes k-hfp-drift{to{transform:translateX(-3%)}}
@media (prefers-reduced-motion:reduce){.k-hfp *{animation:none!important;stroke-dashoffset:0!important}}
[data-reduce-motion] .k-hfp *{animation:none!important;stroke-dashoffset:0!important}`;

/** Foundation/mission hero: a rounded alpine scene with parallax ridges, a tiny hiker climbing and a white frame that draws itself around the name. */
export function HeroFramedPeak({ title = "Open Foundation", line = "Building an internet where people come before profits", className }: { title?: string; line?: string; className?: string }) {
  const reduced = useReducedMotion();
  return (
    <section className={cn("k-hfp bg-[#f6f5ff] px-4 pt-6 pb-10", className)}>
      <style href="k-hfp" precedence="kinetik">{css}</style>
      <div className="relative mx-auto max-w-4xl overflow-hidden rounded-3xl bg-gradient-to-b from-[#3d6fd1] via-[#7ea3e6] to-[#cfe0f7]">
        <svg viewBox="0 0 600 300" aria-hidden className="block h-auto w-full">
          <path className="far" d="M-20 230 L60 170 L120 200 L210 120 L300 190 L380 140 L470 185 L560 130 L640 200 V300 H-20Z" fill="#dce7f7" />
          <path className="near" d="M-20 300 L120 230 L240 160 L330 112 L420 175 L520 220 L640 250 V300Z" fill="#fff" />
          <path className="near" d="M330 112 L360 150 L320 190 L290 160Z" fill="#e6eefb" />
          <g transform={reduced ? "translate(255 160)" : undefined}>{!reduced && <animateMotion dur="14s" repeatCount="indefinite" path="M180 210 Q 260 150 330 118" />}<rect x="-2" y="-9" width="4" height="9" rx="1.5" fill="#1f2937" /><circle cy="-11" r="2" fill="#1f2937" /></g>
          <rect className="frame" x="150" y="40" width="300" height="200" fill="none" stroke="#fff" strokeWidth="6" />
        </svg>
        <h1 className="title absolute top-[22%] left-1/2 w-[46%] -translate-x-1/2 text-[clamp(1.6rem,5vw,3rem)] leading-[1] font-semibold tracking-tight text-white drop-shadow">{title}</h1>
      </div>
      <p className="mx-auto mt-6 max-w-4xl px-2 text-lg text-[#3b2f8f]"><span className="text-[#6d5bd0]">{line.split(" ").slice(0, 4).join(" ")}</span> <b className="font-semibold">{line.split(" ").slice(4).join(" ")}</b></p>
    </section>
  );
}
```

## Usage example
```tsx
"use client";
import { HeroFramedPeak } from "@/components/kinetik/hero-framed-peak";
export default function Demo() {
  return <HeroFramedPeak className="h-full" />;
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
