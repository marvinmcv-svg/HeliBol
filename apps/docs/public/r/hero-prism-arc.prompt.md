You are given a task to integrate a component from the **kinetik** motion library into this codebase.

# Hero — Prism Arc (`hero-prism-arc`)

Creative-AI hero on soft grey: minimal nav, a light two-line headline, copy with bold keywords and a big pill CTA, above a half-dome window of rotating prismatic crystal light.

## What it should do
Recreate a creative-AI hero on #f0f0f0: nav (mark left; API, Pricing, Documentation, black 'Start Building' pill right); light 2-line H1 (~4.5vw), 3-line paragraph with bold keywords, big black pill CTA; a half-dome window (45% wide, rounded-t-full) filled with a rotating conic prism gradient and sliding overlay facets, rising on load; a 'Get Help' pill bottom-right.

## Project requirements
- React 19 + TypeScript, Tailwind CSS v4, shadcn/ui-style CSS variables (`background`, `foreground`, `muted`, `muted-foreground`, `border`, `card`, `primary`, `ring`). If the project lacks shadcn, set it up first (`npx shadcn@latest init`).
- Animation engine: **css**.
- No runtime dependencies (CSS only).
- Put the component at `components/kinetik/hero-prism-arc.tsx`.
- `cn` lives at `lib/kinetik/utils.ts` (source below).
- Shared hooks go at `lib/kinetik/core.ts` (source below).

## Non-negotiables
- **Accessibility:** Real h1 and CTA; dome aria-hidden; reduced motion freezes rotation and facets.
- **Performance:** Conic gradient animating an @property angle; four overlay facets.
- Respect `prefers-reduced-motion` (replace movement with opacity or an instant change).
- Animate only transform / opacity / filter / clip-path. No hard-coded theme colors — use CSS variables so it works in light and dark.

## Source — components/kinetik/hero-prism-arc.tsx
```tsx
"use client";
import { cn } from "@/lib/kinetik/core";

const FONT = "https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;700&display=swap";
const css = `
.k-hpa{font-family:Inter,ui-sans-serif,system-ui,sans-serif}
@property --pa{syntax:"<angle>";initial-value:0deg;inherits:false}
.k-hpa .prism{background:conic-gradient(from var(--pa) at 52% 60%,#fff3e0,#ffb066,#ff7a3d,#fde68a,#e0f2fe,#93c5fd,#c4b5fd,#fff,#f59e0b,#fff3e0);animation:k-hpa-rot 14s linear infinite}
@keyframes k-hpa-rot{to{--pa:360deg}}
.k-hpa .facet{animation:k-hpa-facet 5s ease-in-out infinite alternate;animation-delay:var(--d)}
@keyframes k-hpa-facet{to{transform:rotate(var(--r)) translateX(12px);opacity:.3}}
.k-hpa .in{animation:k-hpa-in 1s cubic-bezier(.16,1,.3,1) both;animation-delay:var(--d,0s)}
@keyframes k-hpa-in{from{opacity:0;transform:translateY(16px)}}
.k-hpa .rise{animation:k-hpa-rise 1.6s cubic-bezier(.16,1,.3,1) .3s both}
@keyframes k-hpa-rise{from{transform:translateY(30%)}}
@media (prefers-reduced-motion:reduce){.k-hpa *{animation:none!important}}
[data-reduce-motion] .k-hpa *{animation:none!important}`;

/** Creative-AI hero on soft grey: minimal nav, a light two-line headline, copy with bold keywords and a big pill CTA, above a half-dome window of rotating prismatic crystal light. */
export function HeroPrismArc({ title = "Creative Intelligence platform for magical AI products", cta = "Start Building", className }: { title?: string; cta?: string; className?: string }) {
  return (
    <section className={cn("k-hpa relative flex flex-col overflow-hidden bg-[#f0f0f0] text-center text-[#1a1a1a]", className)}>
      <style href="k-hpa" precedence="kinetik">{css}</style>
      <link rel="stylesheet" href={FONT} precedence="kinetik-font" />
      <nav className="flex items-center justify-between px-[2%] py-4 text-[13px]"><span aria-hidden className="text-xl">◣</span><span className="flex items-center gap-7"><a href="#" className="font-medium">API</a><a href="#" className="text-zinc-600">Pricing</a><a href="#" className="text-zinc-600">Documentation</a><a href="#" className="rounded-full bg-[#1a1a1a] px-4 py-2 font-medium text-white">Start Building</a></span></nav>
      <h1 className="in mx-auto mt-[2.4%] max-w-[22ch] text-[clamp(2.2rem,4.5vw,4.2rem)] leading-[1.08] font-light tracking-[-.035em]">{title}</h1>
      <p className="in mx-auto mt-[1.8%] max-w-[30rem] text-[clamp(.9rem,1.45vw,1.35rem)] leading-snug" style={{ ["--d" as string]: ".1s" }}>Build and scale creative products with the world's most popular and intuitive <b>Video</b> and <b>Image</b> generation models with Lumen API</p>
      <a href="#" className="in mx-auto mt-[3%] rounded-full bg-[#1a1a1a] px-6 py-3 text-[clamp(1.1rem,1.8vw,1.7rem)] text-white transition-transform hover:scale-105" style={{ ["--d" as string]: ".2s" }}>{cta}</a>
      <div aria-hidden className="rise relative mx-auto mt-[4%] aspect-[2/1] w-[45%] min-w-64 overflow-hidden rounded-t-full">
        <div className="prism absolute inset-0 blur-[1px]" />
        {[["-20deg", "0s", "14%", "#ffffffaa"], ["35deg", "-1.5s", "44%", "#ffffff88"], ["-55deg", "-3s", "62%", "#fde68a99"], ["70deg", "-2s", "30%", "#bfdbfe99"], ["10deg", "-4s", "75%", "#ffffff77"]].map(([r, d, l, c], i) => (
          <span key={i} className="facet absolute bottom-0 h-[120%] w-[18%] mix-blend-overlay" style={{ left: l, transform: `rotate(${r})`, background: `linear-gradient(0deg,${c},transparent)`, ["--r" as string]: r, ["--d" as string]: d }} />
        ))}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_70%,transparent_30%,#0003_100%)]" />
        <div className="absolute bottom-0 left-[8%] h-[45%] w-[22%] rounded-[40%] bg-gradient-to-r from-[#d77a4a] to-[#f0a070] opacity-80 blur-sm" />
      </div>
      <a href="#" className="absolute right-[2%] bottom-[2.5%] rounded-full border border-zinc-800 bg-white px-3 py-1.5 text-[11px] font-medium">Get Help</a>
    </section>
  );
}
```

## Usage example
```tsx
"use client";
import { HeroPrismArc } from "@/components/kinetik/hero-prism-arc";
export default function Demo() {
  return <HeroPrismArc className="h-full" />;
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
