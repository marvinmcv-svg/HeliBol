You are given a task to integrate a component from the **kinetik** motion library into this codebase.

# Hero — Pixel Logos (`hero-pixel-logos`)

Enterprise AI hero: hopping pixel-art mascots, a word-by-word headline and a ruled grid of customer logo cells that drifts sideways.

## What it should do
Build an enterprise-AI hero on #fbfaf7: three 8×6 pixel-art sprites (SVG rects, shape-rendering crispEdges) hop in sequence; H1 words rise in with a 35ms stagger. Beneath, a ruled row of 160×96 logo cells (border-r) drifting −50% over 24s.

## Project requirements
- React 19 + TypeScript, Tailwind CSS v4, shadcn/ui-style CSS variables (`background`, `foreground`, `muted`, `muted-foreground`, `border`, `card`, `primary`, `ring`). If the project lacks shadcn, set it up first (`npx shadcn@latest init`).
- Animation engine: **css**.
- No runtime dependencies (CSS only).
- Put the component at `components/kinetik/hero-pixel-logos.tsx`.
- `cn` lives at `lib/kinetik/utils.ts` (source below).
- Shared hooks go at `lib/kinetik/core.ts` (source below).

## Non-negotiables
- **Accessibility:** Words are spans inside a real h1; sprites and duplicate cells aria-hidden; reduced motion stops hops, word rise and cell drift.
- **Performance:** Three tiny crisp-edged SVG sprites; one marquee.
- Respect `prefers-reduced-motion` (replace movement with opacity or an instant change).
- Animate only transform / opacity / filter / clip-path. No hard-coded theme colors — use CSS variables so it works in light and dark.

## Source — components/kinetik/hero-pixel-logos.tsx
```tsx
"use client";
import { cn } from "@/lib/kinetik/core";

const css = `
.k-hpl .px{animation:k-hpl-hop 2.4s cubic-bezier(.34,1.56,.64,1) infinite;animation-delay:var(--d)}
@keyframes k-hpl-hop{0%,60%,100%{transform:translateY(0)}30%{transform:translateY(-8px) rotate(-6deg)}}
.k-hpl .cells{animation:k-hpl-slide 24s linear infinite}
@keyframes k-hpl-slide{to{transform:translateX(-50%)}}
.k-hpl .w{display:inline-block;animation:k-hpl-word .7s cubic-bezier(.16,1,.3,1) both;animation-delay:calc(var(--i)*35ms)}
@keyframes k-hpl-word{from{opacity:0;transform:translateY(.4em)}}
@media (prefers-reduced-motion:reduce){.k-hpl *{animation:none!important}}
[data-reduce-motion] .k-hpl *{animation:none!important}`;

const sprites = [
  { c: ["#f97316", "#fbbf24"], m: ["01111110", "11111111", "11011011", "11111111", "11100111", "01111110"] },
  { c: ["#2563eb", "#93c5fd"], m: ["00100100", "01111110", "11011011", "11111111", "01011010", "01000010"] },
  { c: ["#0ea5e9", "#22c55e"], m: ["00111100", "01122110", "11211211", "11122111", "01121110", "00111100"] },
];

/** Enterprise AI hero: hopping pixel-art mascots, a word-by-word headline and a ruled grid of customer logo cells that drifts sideways. */
export function HeroPixelLogos({ title = "We help organizations build tailored AI systems to solve the world's hardest problems.", logos = ["HTX", "AXIOM", "orange/box", "IBEX", "ASMEL", "MINISTRY", "NOVA", "KESTREL"], className }: { title?: string; logos?: string[]; className?: string }) {
  return (
    <section className={cn("k-hpl overflow-hidden bg-[#fbfaf7] text-zinc-900", className)}>
      <style href="k-hpl" precedence="kinetik">{css}</style>
      <div className="border-b border-zinc-200 px-6 py-10 text-center">
        <div aria-hidden className="flex justify-center gap-3">
          {sprites.map((s, k) => (
            <svg key={k} viewBox="0 0 8 6" className="px h-6 w-8" style={{ ["--d" as string]: `${k * 0.2}s`, imageRendering: "pixelated" }} shapeRendering="crispEdges">
              {s.m.flatMap((row, y) => [...row].map((v, x) => (v === "0" ? null : <rect key={`${x}-${y}`} x={x} y={y} width="1" height="1" fill={s.c[v === "2" ? 1 : 0]} />)))}
            </svg>
          ))}
        </div>
        <h1 className="mx-auto mt-4 max-w-xl text-3xl leading-tight font-medium tracking-tight sm:text-4xl">
          {title.split(" ").map((w, i) => <span key={i} className="w" style={{ ["--i" as string]: i }}>{w}&nbsp;</span>)}
        </h1>
      </div>
      <div className="overflow-hidden border-b border-zinc-200">
        <ul className="cells flex w-max">
          {[...logos, ...logos].map((l, i) => <li key={i} aria-hidden={i >= logos.length} className="grid h-24 w-40 place-items-center border-r border-zinc-200 text-lg font-black tracking-tight text-zinc-800">{l}</li>)}
        </ul>
      </div>
    </section>
  );
}
```

## Usage example
```tsx
"use client";
import { HeroPixelLogos } from "@/components/kinetik/hero-pixel-logos";
export default function Demo() {
  return <HeroPixelLogos className="h-full" />;
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
