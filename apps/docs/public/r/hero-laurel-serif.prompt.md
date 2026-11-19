You are given a task to integrate a component from the **kinetik** motion library into this codebase.

# Hero — Laurel Serif (`hero-laurel-serif`)

Quiet agency hero: tiny letter-spaced wordmark, one serif line revealing per character, laurel-wrapped awards popping in, and a neon slab rising from the fold.

## What it should do
Recreate a quiet agency hero on #f6f6f4: letter-spaced wordmark and = menu; one EB Garamond line (~4.6vw) revealing per character (translateY .25em + blur 4px, 28ms stagger) at ~45% height; tiny '7x Agency of the Year' and two rows of awards wrapped in SVG laurels popping in; a neon green #00e83a top-rounded slab rising from the bottom edge (66% wide).

## Project requirements
- React 19 + TypeScript, Tailwind CSS v4, shadcn/ui-style CSS variables (`background`, `foreground`, `muted`, `muted-foreground`, `border`, `card`, `primary`, `ring`). If the project lacks shadcn, set it up first (`npx shadcn@latest init`).
- Animation engine: **css**.
- No runtime dependencies (CSS only).
- Put the component at `components/kinetik/hero-laurel-serif.tsx`.
- `cn` lives at `lib/kinetik/utils.ts` (source below).
- Shared hooks go at `lib/kinetik/core.ts` (source below).

## Non-negotiables
- **Accessibility:** h1 carries aria-label with letters aria-hidden; awards are a list; reduced motion shows everything at rest.
- **Performance:** Per-character CSS reveal; one slab transform.
- Respect `prefers-reduced-motion` (replace movement with opacity or an instant change).
- Animate only transform / opacity / filter / clip-path. No hard-coded theme colors — use CSS variables so it works in light and dark.

## Source — components/kinetik/hero-laurel-serif.tsx
```tsx
"use client";
import { cn } from "@/lib/kinetik/core";

const FONT = "https://fonts.googleapis.com/css2?family=EB+Garamond:wght@400;500&family=Inter:wght@400;600&display=swap";
const css = `
.k-hls{font-family:Inter,ui-sans-serif,system-ui,sans-serif}
.k-hls .ch{display:inline-block;white-space:pre;animation:k-hls-ch .8s cubic-bezier(.16,1,.3,1) both;animation-delay:calc(var(--i)*28ms)}
@keyframes k-hls-ch{from{opacity:0;transform:translateY(.25em);filter:blur(4px)}}
.k-hls .award{animation:k-hls-aw .6s ease-out both;animation-delay:calc(.8s + var(--i)*70ms)}
@keyframes k-hls-aw{from{opacity:0;transform:scale(.8)}}
.k-hls .slab{animation:k-hls-slab 1.2s cubic-bezier(.16,1,.3,1) 1.2s both}
@keyframes k-hls-slab{from{transform:translateY(100%)}}
@media (prefers-reduced-motion:reduce){.k-hls *{animation:none!important}}
[data-reduce-motion] .k-hls *{animation:none!important}`;

const Laurel = ({ flip }: { flip?: boolean }) => <svg aria-hidden viewBox="0 0 6 12" className={cn("inline h-[1.1em] w-[.6em] align-[-.2em]", flip && "-scale-x-100")}><path d="M5 1 C2 3 2 9 5 11" fill="none" stroke="currentColor" strokeWidth=".7" />{[2.5, 5, 7.5].map((y) => <ellipse key={y} cx="3" cy={y} rx="1.4" ry=".7" transform={`rotate(-30 3 ${y})`} fill="currentColor" />)}</svg>;

/** Quiet agency hero: tiny letter-spaced wordmark, one serif line revealing per character, laurel-wrapped awards popping in, and a neon slab rising from the fold. */
export function HeroLaurelSerif({ title = "Rewrite your worth.", awards = ["AdAge 2019", "AdAge 2020", "AdAge 2021", "D&AD 2021", "AdAge 2023", "AdAge 2024", "AdAge 2025"], className }: { title?: string; awards?: string[]; className?: string }) {
  return (
    <section className={cn("k-hls relative flex min-h-[460px] flex-col overflow-hidden bg-[#f6f6f4] text-[#1b1414]", className)}>
      <link rel="stylesheet" href={FONT} precedence="kinetik-font" />
      <style href="k-hls" precedence="kinetik">{css}</style>
      <nav className="flex items-center justify-between px-[8.8%] pt-[1.8%] text-[clamp(.7rem,1.05vw,1rem)] font-semibold tracking-[.12em]"><span>HOLLIS</span><span aria-hidden className="text-lg font-normal">=</span></nav>
      <div className="flex flex-1 flex-col items-center px-6 text-center">
        <h1 aria-label={title} className="mt-[20%] text-[clamp(2.2rem,4.6vw,4.3rem)] tracking-[-.01em]" style={{ fontFamily: '"EB Garamond",serif' }}>{[...title].map((c, i) => <span key={i} aria-hidden className="ch" style={{ ["--i" as string]: i }}>{c}</span>)}</h1>
        <p className="mt-[9%] text-[clamp(.45rem,.65vw,.65rem)] text-zinc-500">7x Agency of the Year</p>
        <ul className="mt-3 flex max-w-[30rem] flex-wrap justify-center gap-x-4 gap-y-2 text-[clamp(.45rem,.68vw,.68rem)] text-zinc-700">
          {awards.map((a, i) => <li key={a} className="award flex items-center gap-1.5" style={{ ["--i" as string]: i }}><Laurel />{a}<Laurel flip /></li>)}
        </ul>
      </div>
      <div aria-hidden className="slab mx-[17.2%] mt-[5%] h-[10%] min-h-12 rounded-t-lg bg-[#00e83a]" />
    </section>
  );
}
```

## Usage example
```tsx
"use client";
import { HeroLaurelSerif } from "@/components/kinetik/hero-laurel-serif";
export default function Demo() {
  return <HeroLaurelSerif className="h-full" />;
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
