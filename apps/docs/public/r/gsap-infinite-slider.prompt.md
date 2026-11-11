You are given a task to integrate a component from the **kinetik** motion library into this codebase.

# Infinite Drag Slider (`gsap-infinite-slider`)

Seamless infinite slider — drag or flick it with momentum, snap to cards, use arrows or keys; cards scale and fade by their distance from centre. No cloned slides.

## What it should do
Make an infinite slider: keep one offset; for card i, x = wrap(−total/2, total/2)(i·step + offset); place at center + x with scale 1 − d·.18 and opacity 1 − d·.55 where d = min(1, |x|/(2.2·step)). Draggable.create(proxy, { type: 'x', trigger: root, inertia: true, snap: v => round(v/step)·step, onDrag/onThrowUpdate: offset = proxy.x → layout }). Arrows tween offset by ±step.

## Project requirements
- React 19 + TypeScript, Tailwind CSS v4, shadcn/ui-style CSS variables (`background`, `foreground`, `muted`, `muted-foreground`, `border`, `card`, `primary`, `ring`). If the project lacks shadcn, set it up first (`npx shadcn@latest init`).
- Animation engine: **gsap**.
- Install dependencies: `npm i gsap @gsap/react lucide-react`
- Put the component at `components/kinetik/gsap-infinite-slider.tsx`.
- `cn` lives at `lib/kinetik/utils.ts` (source below).
- Shared hooks go at `lib/kinetik/core.ts` (source below).

## Non-negotiables
- **Accessibility:** Focusable carousel region with arrow-key support, labelled prev/next buttons and an index readout; off-centre cards aria-hidden. Reduced motion disables inertia and autoplay.
- **Performance:** Every card's x = gsap.utils.wrap of one shared offset; Draggable on an invisible proxy.
- Respect `prefers-reduced-motion` (replace movement with opacity or an instant change).
- Animate only transform / opacity / filter / clip-path. No hard-coded theme colors — use CSS variables so it works in light and dark.

## Source — components/kinetik/gsap-infinite-slider.tsx
```tsx
"use client";
import { useRef, useState, type ReactNode } from "react";
import gsap from "gsap";
import { Draggable } from "gsap/Draggable";
import { InertiaPlugin } from "gsap/InertiaPlugin";
import { useGSAP } from "@gsap/react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn, useReducedMotion } from "@/lib/kinetik/core";

gsap.registerPlugin(Draggable, InertiaPlugin, useGSAP);

export interface GsapInfiniteSliderProps {
  slides: ReactNode[];
  /** Card width in px. */
  itemWidth?: number;
  gap?: number;
  /** Seconds between auto-advances (0 = off). */
  autoplay?: number;
  className?: string;
}

/**
 * Seamless infinite slider. Every card's x is a wrap() of one shared offset, so there is no
 * cloning and no jump at the seams. Drag/flick it (Draggable + Inertia on a proxy, snapping to
 * whole cards), use the arrows or keys; cards scale/fade with their distance from center.
 */
export function GsapInfiniteSlider({ slides, itemWidth = 240, gap = 20, autoplay = 0, className }: GsapInfiniteSliderProps) {
  const root = useRef<HTMLDivElement>(null);
  const offset = useRef({ x: 0 });
  const [active, setActive] = useState(0);
  const reduced = useReducedMotion();
  const step = itemWidth + gap;
  const total = step * slides.length;

  const layout = () => {
    const el = root.current;
    if (!el) return;
    const cards = el.querySelectorAll<HTMLElement>("[data-card]");
    const center = el.clientWidth / 2 - itemWidth / 2;
    // each card's distance from center, wrapped into [-total/2, total/2) → seamless loop
    const wrap = gsap.utils.wrap(-total / 2, total / 2);
    cards.forEach((card, i) => {
      const x = wrap(i * step + offset.current.x);
      const dist = Math.min(1, Math.abs(x) / (step * 2.2));
      gsap.set(card, { x: center + x, scale: 1 - dist * 0.18, opacity: 1 - dist * 0.55, zIndex: Math.round(10 - dist * 10) });
    });
    const idx = Math.round(-offset.current.x / step);
    setActive(((idx % slides.length) + slides.length) % slides.length);
  };

  const { contextSafe } = useGSAP(
    () => {
      layout();
      const proxy = document.createElement("div");
      const d = Draggable.create(proxy, {
        type: "x",
        trigger: root.current,
        inertia: !reduced,
        onPress() {
          gsap.killTweensOf(offset.current);
          gsap.set(proxy, { x: offset.current.x });
        },
        onDrag() {
          offset.current.x = gsap.getProperty(proxy, "x") as number;
          layout();
        },
        onThrowUpdate() {
          offset.current.x = gsap.getProperty(proxy, "x") as number;
          layout();
        },
        snap: { x: (v: number) => Math.round(v / step) * step },
        onRelease() {
          if (reduced || !this.tween) to(Math.round(offset.current.x / step) * step);
        },
      })[0];
      const ro = new ResizeObserver(layout);
      ro.observe(root.current!);
      let timer: ReturnType<typeof setInterval> | undefined;
      if (autoplay > 0 && !reduced) timer = setInterval(() => !d.isPressed && to(Math.round(offset.current.x / step) * step - step), autoplay * 1000);
      return () => {
        ro.disconnect();
        clearInterval(timer);
        d.kill();
      };
    },
    { scope: root, dependencies: [slides.length, step, reduced, autoplay] },
  );

  const to = contextSafe((x: number) => {
    gsap.to(offset.current, { x, duration: reduced ? 0 : 0.8, ease: "power3.out", overwrite: true, onUpdate: layout });
  });
  const nav = (dir: 1 | -1) => to(Math.round(offset.current.x / step) * step - dir * step);

  return (
    <div
      ref={root}
      tabIndex={0}
      role="region"
      aria-roledescription="carousel"
      aria-label="Slider — drag, use arrows or arrow keys"
      onKeyDown={(e) => {
        if (e.key === "ArrowRight") nav(1);
        if (e.key === "ArrowLeft") nav(-1);
      }}
      className={cn("relative h-full w-full cursor-grab touch-pan-y select-none overflow-hidden outline-none active:cursor-grabbing", className)}
    >
      {slides.map((s, i) => (
        <div key={i} data-card aria-hidden={active !== i} className="absolute left-0 top-1/2 -translate-y-1/2" style={{ width: itemWidth }}>
          {s}
        </div>
      ))}
      <div className="absolute inset-x-0 bottom-3 z-20 flex items-center justify-center gap-3">
        <button onClick={() => nav(-1)} aria-label="Previous" className="grid size-9 place-items-center rounded-full border border-border bg-background/80 backdrop-blur hover:bg-accent"><ChevronLeft className="size-4" /></button>
        <span className="min-w-12 text-center font-mono text-xs text-muted-foreground">{active + 1} / {slides.length}</span>
        <button onClick={() => nav(1)} aria-label="Next" className="grid size-9 place-items-center rounded-full border border-border bg-background/80 backdrop-blur hover:bg-accent"><ChevronRight className="size-4" /></button>
      </div>
    </div>
  );
}
```

## Usage example
```tsx
"use client";
import { photoAlt, photos } from "@/components/kinetik/demo-helpers" /* or inline */;
import { GsapInfiniteSlider } from "@/components/kinetik/gsap-infinite-slider";

export default function Demo() {
  return (
    <GsapInfiniteSlider
      itemWidth={220}
      autoplay={3}
      slides={photos.map((p, i) => (
        <figure key={p} className="overflow-hidden rounded-2xl border border-border bg-card shadow-xl">
          <img src={p} alt={photoAlt[i]} draggable={false} className="aspect-[4/5] w-full object-cover" />
          <figcaption className="flex justify-between px-3 py-2 text-xs">
            <span>{photoAlt[i]}</span>
            <span className="text-muted-foreground">0{i + 1}</span>
          </figcaption>
        </figure>
      ))}
    />
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
