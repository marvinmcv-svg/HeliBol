You are given a task to integrate a component from the **kinetik** motion library into this codebase.

# Hero — Wordmark + Dashboard (`hero-wordmark-dashboard`)

Product-launch hero: a giant condensed wordmark drops in letter by letter, then a violet stage rises with a live admin dashboard whose chart draws itself.

## What it should do
Build a product-launch hero on #120b24: a giant condensed wordmark (font-black, scaleX .82, ~13vw) whose letters drop in from −60% with scaleY 1.4 and a back-out ease, staggered 60ms. Then a violet gradient stage rises 60px with a tagline, small subtitle and a white admin dashboard card (4 KPI tiles + an SVG line chart drawn with stroke-dashoffset) and a pulsing play button.

## Project requirements
- React 19 + TypeScript, Tailwind CSS v4, shadcn/ui-style CSS variables (`background`, `foreground`, `muted`, `muted-foreground`, `border`, `card`, `primary`, `ring`). If the project lacks shadcn, set it up first (`npx shadcn@latest init`).
- Animation engine: **css**.
- No runtime dependencies (CSS only).
- Put the component at `components/kinetik/hero-wordmark-dashboard.tsx`.
- `cn` lives at `lib/kinetik/utils.ts` (source below).
- Shared hooks go at `lib/kinetik/core.ts` (source below).

## Non-negotiables
- **Accessibility:** h1 has aria-label with the full word, letters aria-hidden; mock dashboard is aria-hidden; reduced motion shows the final state.
- **Performance:** Per-letter CSS transforms and one SVG line draw.
- Respect `prefers-reduced-motion` (replace movement with opacity or an instant change).
- Animate only transform / opacity / filter / clip-path. No hard-coded theme colors — use CSS variables so it works in light and dark.

## Source — components/kinetik/hero-wordmark-dashboard.tsx
```tsx
"use client";
import { cn } from "@/lib/kinetik/core";

const css = `
.k-hwd .ch{display:inline-block;animation:k-hwd-drop .9s cubic-bezier(.34,1.56,.64,1) both;animation-delay:calc(var(--i)*60ms)}
@keyframes k-hwd-drop{from{opacity:0;transform:translateY(-60%) scaleY(1.4)}}
.k-hwd .panel{animation:k-hwd-panel 1.1s cubic-bezier(.16,1,.3,1) .5s both}
@keyframes k-hwd-panel{from{opacity:0;transform:translateY(60px)}}
.k-hwd .line{stroke-dasharray:600;stroke-dashoffset:600;animation:k-hwd-line 2.2s ease-out 1.2s forwards}
@keyframes k-hwd-line{to{stroke-dashoffset:0}}
.k-hwd .play{animation:k-hwd-ping 2.4s ease-out infinite 2s}
@keyframes k-hwd-ping{0%{box-shadow:0 0 0 0 #fff8}100%{box-shadow:0 0 0 18px #fff0}}
@media (prefers-reduced-motion:reduce){.k-hwd *{animation:none!important;stroke-dashoffset:0!important}}
[data-reduce-motion] .k-hwd *{animation:none!important;stroke-dashoffset:0!important}`;

/** Product-launch hero: a giant condensed wordmark drops in letter by letter, then a violet stage rises with a live admin dashboard whose chart draws itself. */
export function HeroWordmarkDashboard({ word = "COPILOT", tagline = "A smarter, more powerful copilot", className }: { word?: string; tagline?: string; className?: string }) {
  return (
    <section className={cn("k-hwd overflow-hidden bg-[#120b24] pt-10 text-white", className)}>
      <style href="k-hwd" precedence="kinetik">{css}</style>
      <h1 aria-label={word} className="text-center text-[clamp(3rem,13vw,7.5rem)] leading-none font-black tracking-[-.06em] [transform:scaleX(.82)]">
        {[...word].map((c, i) => <span key={i} aria-hidden className="ch" style={{ ["--i" as string]: i }}>{c}</span>)}
      </h1>
      <div className="panel mx-3 mt-6 rounded-t-2xl bg-gradient-to-b from-[#9b6bff] to-[#6d3cf0] px-6 pt-8 text-center">
        <p className="text-2xl font-semibold tracking-tight">{tagline}</p>
        <p className="mx-auto mt-1 max-w-sm text-xs text-white/75">Multi-step reasoning that digs deeper and suggests strategies from your store's own data.</p>
        <div aria-hidden className="relative mx-auto mt-6 max-w-2xl overflow-hidden rounded-t-xl bg-white p-4 text-left text-zinc-800 shadow-2xl">
          <div className="flex gap-3 text-[10px]">
            {[["Sessions", "195,567"], ["Total sales", "$189,657"], ["Orders", "2,978"], ["Conversion", "3.65%"]].map(([k, v]) => <div key={k} className="flex-1 rounded-md border border-zinc-200 p-2"><p className="text-zinc-500">{k}</p><p className="text-sm font-semibold">{v}</p></div>)}
          </div>
          <svg viewBox="0 0 400 90" className="mt-3 h-24 w-full"><path className="line" d="M0 60 C30 20 50 70 80 45 S130 15 160 50 S210 80 240 40 S300 10 330 55 S380 30 400 35" fill="none" stroke="#38bdf8" strokeWidth="2.5" /></svg>
          <span className="play absolute top-1/2 left-1/2 grid size-11 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-zinc-700/80 text-white">▶</span>
        </div>
      </div>
    </section>
  );
}
```

## Usage example
```tsx
"use client";
import { HeroWordmarkDashboard } from "@/components/kinetik/hero-wordmark-dashboard";
export default function Demo() {
  return <HeroWordmarkDashboard className="h-full" />;
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
