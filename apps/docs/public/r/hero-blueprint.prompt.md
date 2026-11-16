You are given a task to integrate a component from the **kinetik** motion library into this codebase.

# Hero — Blueprint Grid (`hero-blueprint`)

Architectural/AI-tool hero on a ruled editorial grid: line-art tower drawn stroke by stroke, a red sun popping behind it and a mono ticker.

## What it should do
Build an architectural AI-tool hero on #f1efe8 with ruled 1px black/20 borders: top row = heavy uppercase H1 (2/3) + small description with orange mono 'Discover more →' (1/3); a mono ticker row of '◎' feature tags looping; bottom split = line-art tower SVG drawn with stroke-dashoffset (frame first, then floor lines staggered 80ms) with a red #ff4a1c sun that pops in with a back-out scale, and a black uppercase statement + bordered mono 'Learn more' button.

## Project requirements
- React 19 + TypeScript, Tailwind CSS v4, shadcn/ui-style CSS variables (`background`, `foreground`, `muted`, `muted-foreground`, `border`, `card`, `primary`, `ring`). If the project lacks shadcn, set it up first (`npx shadcn@latest init`).
- Animation engine: **css**.
- No runtime dependencies (CSS only).
- Put the component at `components/kinetik/hero-blueprint.tsx`.
- `cn` lives at `lib/kinetik/utils.ts` (source below).
- Shared hooks go at `lib/kinetik/core.ts` (source below).

## Non-negotiables
- **Accessibility:** Heading and statement are real text; the SVG drawing is aria-hidden; reduced motion shows the finished drawing with no ticker.
- **Performance:** SVG stroke-dashoffset draws (~15 paths) run once; one ticker loop.
- Respect `prefers-reduced-motion` (replace movement with opacity or an instant change).
- Animate only transform / opacity / filter / clip-path. No hard-coded theme colors — use CSS variables so it works in light and dark.

## Source — components/kinetik/hero-blueprint.tsx
```tsx
"use client";
import { cn } from "@/lib/kinetik/core";

const css = `
.k-hbp .draw{stroke-dasharray:var(--l,600);stroke-dashoffset:var(--l,600);animation:k-hbp-draw 2.4s cubic-bezier(.65,0,.35,1) forwards;animation-delay:var(--d,0s)}
@keyframes k-hbp-draw{to{stroke-dashoffset:0}}
.k-hbp .sun{transform-origin:center;transform-box:fill-box;animation:k-hbp-sun 1.4s cubic-bezier(.34,1.56,.64,1) .9s both}
@keyframes k-hbp-sun{from{transform:scale(0)}}
.k-hbp .tick{animation:k-hbp-tick 18s linear infinite}
@keyframes k-hbp-tick{to{transform:translateX(-50%)}}
.k-hbp .rise{animation:k-hbp-rise .9s cubic-bezier(.16,1,.3,1) both;animation-delay:var(--d,0s)}
@keyframes k-hbp-rise{from{opacity:0;transform:translateY(16px)}}
@media (prefers-reduced-motion:reduce){.k-hbp *{animation:none!important;stroke-dashoffset:0!important}}
[data-reduce-motion] .k-hbp *{animation:none!important;stroke-dashoffset:0!important}`;

const ticks = ["Less busywork", "Faster iterations", "Fewer mistakes", "Native in your tools", "Reviews every model"];

/** Architectural/AI-tool hero on a ruled editorial grid: line-art tower drawn stroke by stroke, a red sun popping behind it and a mono ticker. */
export function HeroBlueprint({ title = "An AI agent that works inside your design tools", statement = "The repetitive parts of modelling shouldn't eat your day.", className }: { title?: string; statement?: string; className?: string }) {
  const floors = Array.from({ length: 11 }, (_, i) => 70 + i * 18);
  return (
    <section className={cn("k-hbp relative overflow-hidden bg-[#f1efe8] font-sans text-[#141414]", className)}>
      <style href="k-hbp" precedence="kinetik">{css}</style>
      <div className="grid border-b border-black/20 md:grid-cols-[1.6fr_1fr]">
        <h1 className="rise p-5 text-3xl leading-[.95] font-black tracking-tight uppercase sm:text-4xl">{title}</h1>
        <div className="rise border-black/20 p-5 text-xs md:border-l" style={{ ["--d" as string]: ".15s" }}>
          <p>Reviews your model, flags issues and proposes fixes. On approval it edits automatically.</p>
          <a href="#" className="mt-3 inline-block font-mono text-[10px] tracking-widest text-[#ff4a1c] uppercase">Discover more →</a>
        </div>
      </div>
      <div className="overflow-hidden border-b border-black/20 py-1.5 font-mono text-[10px] tracking-widest uppercase">
        <div className="tick flex w-max gap-8 pr-8">{[...ticks, ...ticks].map((t, i) => <span key={i} aria-hidden={i >= ticks.length}>◎ {t}</span>)}</div>
      </div>
      <div className="grid md:grid-cols-[1fr_1fr]">
        <svg viewBox="0 0 320 280" aria-hidden className="h-64 w-full border-black/20 md:border-r">
          <circle className="sun" cx="190" cy="95" r="58" fill="#ff4a1c" />
          <g fill="none" stroke="#141414" strokeWidth="1.2">
            <path className="draw" style={{ ["--l" as string]: 900 }} d="M110 270 V60 L200 40 V270 M200 40 L235 62 V270 M110 60 L150 70 V270" />
            {floors.map((y, i) => <path key={y} className="draw" style={{ ["--l" as string]: 140, ["--d" as string]: `${0.4 + i * 0.08}s` }} d={`M110 ${y} L150 ${y + 8} L200 ${y - 12} L235 ${y + 6}`} />)}
            <path className="draw" style={{ ["--l" as string]: 700, ["--d" as string]: ".6s" }} d="M10 270 H310 M30 270 V215 H110 M235 230 H300 V270" />
          </g>
        </svg>
        <div className="flex flex-col justify-center gap-5 p-6">
          <p className="rise text-xl leading-tight font-black uppercase" style={{ ["--d" as string]: ".5s" }}>{statement}</p>
          <a href="#" className="rise w-fit border border-black/40 px-3 py-2 font-mono text-[10px] tracking-widest uppercase transition-colors hover:bg-black hover:text-white" style={{ ["--d" as string]: ".65s" }}>Learn more →</a>
        </div>
      </div>
    </section>
  );
}
```

## Usage example
```tsx
"use client";
import { HeroBlueprint } from "@/components/kinetik/hero-blueprint";
export default function Demo() {
  return <HeroBlueprint className="h-full" />;
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
