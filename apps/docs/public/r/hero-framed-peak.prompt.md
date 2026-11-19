You are given a task to integrate a component from the **kinetik** motion library into this codebase.

# Hero — Framed Peak (`hero-framed-peak`)

Foundation/mission hero: lavender nav, a rounded alpine photo card with a hiker climbing and a white square frame drawing itself around the name, then the mission copy.

## What it should do
Recreate a foundation/mission hero on lavender-white: nav (purple wordmark, 4 links, purple 'Create a free account' pill, Sign in); a rounded-[22px] alpine card (blue sky gradient, snowy ridges drifting in parallax, a hiker walking up via animateMotion) with a 9px white square frame drawn by stroke-dashoffset around the 2-line extra-bold title; below, a purple/indigo two-tone line and a short body paragraph.

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

const FONT = "https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;800&display=swap";
const css = `
.k-hfp{font-family:Nunito,ui-sans-serif,system-ui,sans-serif}
.k-hfp .frame{stroke-dasharray:1400;stroke-dashoffset:1400;animation:k-hfp-draw 1.8s cubic-bezier(.65,0,.35,1) .2s forwards}
@keyframes k-hfp-draw{to{stroke-dashoffset:0}}
.k-hfp .title{animation:k-hfp-in 1s ease-out 1.1s both}
@keyframes k-hfp-in{from{opacity:0;transform:translateY(8px)}}
.k-hfp .far{animation:k-hfp-drift 18s ease-in-out infinite alternate}
.k-hfp .near{animation:k-hfp-drift 12s ease-in-out infinite alternate-reverse}
@keyframes k-hfp-drift{to{transform:translateX(-2%)}}
@media (prefers-reduced-motion:reduce){.k-hfp *{animation:none!important;stroke-dashoffset:0!important}}
[data-reduce-motion] .k-hfp *{animation:none!important;stroke-dashoffset:0!important}`;

/** Foundation/mission hero: lavender nav, a rounded alpine photo card with a hiker climbing and a white square frame drawing itself around the name, then the mission copy. */
export function HeroFramedPeak({ brand = "Prism", title = "Prism Foundation", className }: { brand?: string; title?: string; className?: string }) {
  const reduced = useReducedMotion();
  return (
    <section className={cn("k-hfp flex flex-col overflow-hidden bg-gradient-to-b from-[#f6f5ff] via-[#f8f7ff] to-white text-[#1b1340]", className)}>
      <link rel="stylesheet" href={FONT} precedence="kinetik-font" />
      <style href="k-hfp" precedence="kinetik">{css}</style>
      <nav className="flex items-center justify-between px-[6.3%] py-3 text-[12px] whitespace-nowrap">
        <span className="flex items-center gap-6"><b className="text-[19px] font-extrabold tracking-tight text-[#6d4aff]">{brand}</b><span className="hidden gap-6 font-semibold lg:flex"><a href="#">Products ⌄</a><a href="#">{brand} for business</a><a href="#">Who we are ⌄</a><a href="#">Resources & support ⌄</a></span></span>
        <span className="flex items-center gap-5 font-semibold"><a href="#" className="rounded-full bg-[#6d4aff] px-4 py-2 text-white">Create a free account</a><a href="#">Sign in</a></span>
      </nav>
      <div className="relative mx-[8.7%] mt-1 overflow-hidden rounded-[22px]">
        <svg viewBox="0 0 1200 560" aria-hidden className="block h-auto w-full">
          <defs><linearGradient id="k-hfp-sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#3f6db8" /><stop offset=".6" stopColor="#7aa0d8" /><stop offset="1" stopColor="#b9cde9" /></linearGradient><linearGradient id="k-hfp-snow" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#ffffff" /><stop offset="1" stopColor="#d6e2f2" /></linearGradient></defs>
          <rect width="1200" height="560" fill="url(#k-hfp-sky)" />
          <path className="far" d="M-20 430 L90 400 L180 425 L300 380 L380 410 L470 395 L560 420 L1220 430 V560 H-20Z" fill="#dfe8f5" />
          <path className="near" d="M-20 560 L150 500 L330 420 L470 330 L560 270 L640 300 L760 360 L900 420 L1060 470 L1220 500 V560Z" fill="url(#k-hfp-snow)" />
          <path className="near" d="M560 270 L600 330 L540 420 L470 330Z" fill="#c9d7ea" opacity=".7" />
          <path className="near" d="M640 300 L700 380 L880 520 L760 360Z" fill="#cbd8ea" opacity=".6" />
          <g transform={reduced ? "translate(612 352)" : undefined}>{!reduced && <animateMotion dur="16s" repeatCount="indefinite" path="M540 470 Q 590 400 612 352 T 625 300" />}<rect x="-4" y="-24" width="9" height="22" rx="3" fill="#20252e" /><circle cy="-28" r="4.5" fill="#20252e" /><path d="M-6 -2 L-8 8 M4 -2 L6 8" stroke="#20252e" strokeWidth="3" /></g>
          <rect className="frame" x="250" y="60" width="450" height="430" fill="none" stroke="#fff" strokeWidth="9" />
        </svg>
        <h1 className="title absolute top-[17%] left-[26%] text-[clamp(1.6rem,3.75vw,3.5rem)] leading-[1.02] font-extrabold tracking-[-.01em] text-white">{title.split(" ").map((w) => <span key={w} className="block">{w}</span>)}</h1>
      </div>
      <div className="mx-auto max-w-[46rem] flex-1 px-6 pt-[6%] pb-6">
        <h2 className="text-[clamp(1.1rem,1.75vw,1.6rem)] font-normal text-[#5b4fc4]">Building an Internet <b className="font-semibold text-[#1b1340]">where people come before profits</b></h2>
        <p className="mt-4 text-[13px] leading-relaxed text-[#3b3570]">{brand} was created to serve the world, and the non-profit {brand} Foundation ensures that this can never change. As {brand}'s primary shareholder, the foundation exercises its control to ensure that {brand} does not deviate from our mission to build a better internet that serves the interests of all of society.</p>
      </div>
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
