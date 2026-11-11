You are given a task to integrate a component from the **kinetik** motion library into this codebase.

# Pixel Scroll Transition (`transition-pixel-scroll`)

A scroll-scrubbed pixel dissolve between two sections: squares fill in random order to cover the first, then clear in a new order to reveal the second.

## What it should do
Build a pixel scroll transition: a 300vh section with a sticky viewport stacking `from`, `to` and a grid of cells. Precompute two random rank arrays. On scroll compute progress p; for p<.45 a cell is on if rankIn < p/.45; after .55 a cell is on while rankOut ≥ (p−.55)/.45; swap which section is visible at .5. Reduced motion: crossfade.

## Project requirements
- React 19 + TypeScript, Tailwind CSS v4, shadcn/ui-style CSS variables (`background`, `foreground`, `muted`, `muted-foreground`, `border`, `card`, `primary`, `ring`). If the project lacks shadcn, set it up first (`npx shadcn@latest init`).
- Animation engine: **js**.
- No runtime dependencies (CSS only).
- Put the component at `components/kinetik/transition-pixel-scroll.tsx`.
- `cn` lives at `lib/kinetik/utils.ts` (source below).
- Shared hooks go at `lib/kinetik/core.ts` (source below).

## Non-negotiables
- **Accessibility:** Pixel grid is aria-hidden; both sections stay in the DOM. Reduced motion: a simple crossfade at the midpoint.
- **Performance:** Opacity toggles on a few hundred cells, only in a rAF-throttled scroll handler.
- Respect `prefers-reduced-motion` (replace movement with opacity or an instant change).
- Animate only transform / opacity / filter / clip-path. No hard-coded theme colors — use CSS variables so it works in light and dark.

## Source — components/kinetik/transition-pixel-scroll.tsx
```tsx
"use client";
import { useEffect, useMemo, useRef, type ReactNode, type RefObject } from "react";
import { cn, useReducedMotion } from "@/lib/kinetik/core";

export interface TransitionPixelScrollProps {
  /** Section shown before the transition. */
  from: ReactNode;
  /** Section revealed by the pixels. */
  to: ReactNode;
  /** Pixel grid columns (rows follow the aspect ratio). */
  columns?: number;
  /** Pixel colour. */
  color?: string;
  scroller?: RefObject<HTMLElement | null>;
  className?: string;
}

/**
 * Scroll-scrubbed pixel dissolve between two sections: as you scroll through the pinned area a grid of
 * squares fills in random order to cover the first section, then clears in a new random order to
 * reveal the second. Driven by scroll position only (no timers). Reduced motion: a simple crossfade.
 */
export function TransitionPixelScroll({ from, to, columns = 16, color = "#18181b", scroller, className }: TransitionPixelScrollProps) {
  const reduced = useReducedMotion();
  const section = useRef<HTMLElement>(null);
  const grid = useRef<HTMLDivElement>(null);
  const toLayer = useRef<HTMLDivElement>(null);
  const rows = Math.round(columns * 0.62);
  // two random orders: one for covering, one for uncovering
  const orders = useMemo(() => {
    const n = columns * rows;
    const shuffle = () => {
      const a = Array.from({ length: n }, (_, i) => i);
      for (let i = n - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
      }
      return a;
    };
    const rankIn = new Array(n), rankOut = new Array(n);
    shuffle().forEach((cell, r) => (rankIn[cell] = r / n));
    shuffle().forEach((cell, r) => (rankOut[cell] = r / n));
    return { rankIn, rankOut };
  }, [columns, rows]);

  useEffect(() => {
    const sec = section.current, g = grid.current, tl = toLayer.current;
    if (!sec || !g || !tl) return;
    const sc = scroller?.current ?? null;
    const cells = [...g.children] as HTMLElement[];
    let raf = 0;
    const update = () => {
      raf = 0;
      const vh = sc ? sc.clientHeight : window.innerHeight;
      const top = sec.getBoundingClientRect().top - (sc ? sc.getBoundingClientRect().top : 0);
      const p = Math.max(0, Math.min(1, -top / (sec.offsetHeight - vh))); // 0..1 through the section
      if (reduced) {
        tl.style.opacity = String(p > 0.5 ? 1 : 0);
        return;
      }
      const cover = Math.min(1, p / 0.45), uncover = Math.max(0, (p - 0.55) / 0.45);
      tl.style.opacity = p >= 0.5 ? "1" : "0";
      cells.forEach((c, i) => {
        const on = uncover > 0 ? orders.rankOut[i] >= uncover : orders.rankIn[i] < cover;
        c.style.opacity = on ? "1" : "0";
      });
    };
    const target: HTMLElement | Window = sc ?? window;
    const onScroll = () => (raf ||= requestAnimationFrame(update));
    update();
    target.addEventListener("scroll", onScroll, { passive: true });
    return () => { target.removeEventListener("scroll", onScroll); cancelAnimationFrame(raf); };
  }, [orders, reduced, scroller]);

  return (
    <section ref={section} className={cn("relative h-[300cqh]", className)}>
      <div className="sticky top-0 h-[100cqh] overflow-hidden">
        <div className="absolute inset-0">{from}</div>
        <div ref={toLayer} className="absolute inset-0 opacity-0" style={{ transition: reduced ? "opacity .4s" : undefined }}>{to}</div>
        <div ref={grid} aria-hidden className="pointer-events-none absolute inset-0 grid" style={{ gridTemplateColumns: `repeat(${columns}, 1fr)`, gridTemplateRows: `repeat(${rows}, 1fr)` }}>
          {Array.from({ length: columns * rows }, (_, i) => (
            <span key={i} className="opacity-0" style={{ background: color, marginRight: -1, marginBottom: -1 }} />
          ))}
        </div>
      </div>
    </section>
  );
}
```

## Usage example
```tsx
"use client";
import { DemoScroller, photos, useDemoScroller } from "@/components/kinetik/demo-helpers" /* or inline */;
import { TransitionPixelScroll } from "@/components/kinetik/transition-pixel-scroll";

function Inner() {
  const s = useDemoScroller() ?? undefined;
  return (
    <TransitionPixelScroll
      scroller={s}
      color="#0a0a0a"
      from={
        <div className="relative grid size-full place-items-center bg-[#f5f1ea] text-zinc-900">
          <h3 className="text-5xl font-black tracking-tighter">Chapter one</h3>
        </div>
      }
      to={
        <div className="relative grid size-full place-items-center text-white">
          <img src={photos[2]} alt="" className="absolute inset-0 size-full object-cover" />
          <h3 className="relative text-5xl font-black tracking-tighter">Chapter two</h3>
        </div>
      }
    />
  );
}

export default function Demo() {
  return (
    <DemoScroller thumbAt={0.3}>
      <Inner />
    </DemoScroller>
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
