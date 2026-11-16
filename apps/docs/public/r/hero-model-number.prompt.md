You are given a task to integrate a component from the **kinetik** motion library into this codebase.

# Hero — Model Number (`hero-model-number`)

Product-glamour hero: a moody close-up of a machined frame with a pulsing red lamp, a huge model number sliding in and a looping promo strip.

## What it should do
Build a product-glamour hero: neon-yellow promo strip with a looping mono message; a dark radial studio scene with thick gradient-stroked SVG frame tubes and a red tail-lamp that pulses with a drop-shadow glow; the scene settles from scale 1.15/−3°. A huge light-weight model number slides in bottom-left; blurb + bordered ↗ 'Explore' right; 'Reserve now' bottom-right.

## Project requirements
- React 19 + TypeScript, Tailwind CSS v4, shadcn/ui-style CSS variables (`background`, `foreground`, `muted`, `muted-foreground`, `border`, `card`, `primary`, `ring`). If the project lacks shadcn, set it up first (`npx shadcn@latest init`).
- Animation engine: **css**.
- No runtime dependencies (CSS only).
- Put the component at `components/kinetik/hero-model-number.tsx`.
- `cn` lives at `lib/kinetik/utils.ts` (source below).
- Shared hooks go at `lib/kinetik/core.ts` (source below).

## Non-negotiables
- **Accessibility:** Real h1 (model number); promo copy is readable once (duplicates aria-hidden); reduced motion freezes lamp and strip.
- **Performance:** One SVG scene, a drop-shadow pulse and a marquee.
- Respect `prefers-reduced-motion` (replace movement with opacity or an instant change).
- Animate only transform / opacity / filter / clip-path. No hard-coded theme colors — use CSS variables so it works in light and dark.

## Source — components/kinetik/hero-model-number.tsx
```tsx
"use client";
import { cn } from "@/lib/kinetik/core";

const css = `
.k-hmn .promo{animation:k-hmn-promo 20s linear infinite}
@keyframes k-hmn-promo{to{transform:translateX(-50%)}}
.k-hmn .lamp{animation:k-hmn-lamp 2.8s ease-in-out infinite}
@keyframes k-hmn-lamp{50%{filter:drop-shadow(0 0 22px #ff2b2b) brightness(1.3)}}
.k-hmn .num{animation:k-hmn-num 1.4s cubic-bezier(.16,1,.3,1) .2s both}
@keyframes k-hmn-num{from{opacity:0;transform:translateX(-12%);letter-spacing:.15em}}
.k-hmn .frame{animation:k-hmn-frame 2s cubic-bezier(.16,1,.3,1) both}
@keyframes k-hmn-frame{from{opacity:0;transform:scale(1.15) rotate(-3deg)}}
@media (prefers-reduced-motion:reduce){.k-hmn *{animation:none!important}}
[data-reduce-motion] .k-hmn *{animation:none!important}`;

/** Product-glamour hero: a moody close-up of a machined frame with a pulsing red lamp, a huge model number sliding in and a looping promo strip. */
export function HeroModelNumber({ model = "S6", promo = "Reserve by July 31 · Get 1 year of theft protection free · Use code RIDESECURE", blurb = "The wait's over. Introducing our ultimate e-bike.", className }: { model?: string; promo?: string; blurb?: string; className?: string }) {
  return (
    <section className={cn("k-hmn flex flex-col overflow-hidden bg-[#e9ff3b]", className)}>
      <style href="k-hmn" precedence="kinetik">{css}</style>
      <div className="overflow-hidden py-1.5 font-mono text-[10px] tracking-wider text-black uppercase"><div className="promo flex w-max gap-16 pr-16">{Array.from({ length: 4 }, (_, i) => <span key={i} aria-hidden={i > 0}>{promo}</span>)}</div></div>
      <div className="relative min-h-[420px] flex-1 overflow-hidden bg-[radial-gradient(ellipse_at_70%_30%,#4a4a4f,#121214_65%)] text-white">
        <svg aria-hidden viewBox="0 0 600 400" className="frame absolute inset-0 size-full" preserveAspectRatio="xMidYMid slice">
          <defs><linearGradient id="k-hmn-g" x1="0" x2="1"><stop offset="0" stopColor="#1c1c1f" /><stop offset=".5" stopColor="#5c5c63" /><stop offset="1" stopColor="#202024" /></linearGradient></defs>
          <circle cx="40" cy="300" r="230" fill="none" stroke="#0d0d0f" strokeWidth="26" />
          <path d="M220 60 C 260 160 300 260 330 420" stroke="url(#k-hmn-g)" strokeWidth="46" fill="none" strokeLinecap="round" />
          <path d="M260 210 C 360 200 470 190 620 160" stroke="url(#k-hmn-g)" strokeWidth="30" fill="none" />
          <ellipse cx="225" cy="55" rx="70" ry="34" fill="#18181b" />
          <path className="lamp" d="M262 128 c 18 -8 34 4 30 20 c -4 14 -24 18 -36 8 c -8 -8 -4 -22 6 -28z" fill="#ff2b2b" />
        </svg>
        <h1 className="num absolute bottom-6 left-8 text-[clamp(5rem,18vw,10rem)] leading-none font-light tracking-tight">{model}</h1>
        <div className="absolute top-1/2 right-8 max-w-44 text-xs">
          <p>{blurb}</p>
          <a href="#" className="mt-3 inline-flex items-center gap-2 transition-transform hover:translate-x-1"><span className="grid size-5 place-items-center border border-white/70">↗</span>Explore</a>
        </div>
        <p className="absolute right-8 bottom-6 text-xs">Reserve now for €150 ·</p>
      </div>
    </section>
  );
}
```

## Usage example
```tsx
"use client";
import { HeroModelNumber } from "@/components/kinetik/hero-model-number";
export default function Demo() {
  return <HeroModelNumber className="h-full" />;
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
