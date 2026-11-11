You are given a task to integrate a component from the **kinetik** motion library into this codebase.

# Depth Fade Carousel (`carousel-depth-fade`)

A native scroll-snap carousel where each card's scale, tilt, blur and opacity depend on its distance from the centre — cards recede into depth as they slide away.

## What it should do
Build a depth-fade carousel: a horizontal overflow container with scroll-snap center and side padding so the first/last card can centre. On scroll (rAF-throttled) compute each card's distance d from the viewport centre in card widths (clamped ±1.5) and set transform perspective(900px) rotateY(−18d°) scale(1−.16|d|), filter blur(3|d|px) saturate, opacity 1−.4|d|, z-index. Reduced motion: opacity only.

## Project requirements
- React 19 + TypeScript, Tailwind CSS v4, shadcn/ui-style CSS variables (`background`, `foreground`, `muted`, `muted-foreground`, `border`, `card`, `primary`, `ring`). If the project lacks shadcn, set it up first (`npx shadcn@latest init`).
- Animation engine: **js**.
- No runtime dependencies (CSS only).
- Put the component at `components/kinetik/carousel-depth-fade.tsx`.
- `cn` lives at `lib/kinetik/utils.ts` (source below).
- Shared hooks go at `lib/kinetik/core.ts` (source below).

## Non-negotiables
- **Accessibility:** Native scrolling (swipe, trackpad, keyboard when focused); cards labelled “n of total”. Reduced motion: opacity only.
- **Performance:** rAF-throttled scroll handler writing transform/filter/opacity; zero layout reads per card except offsetLeft.
- Respect `prefers-reduced-motion` (replace movement with opacity or an instant change).
- Animate only transform / opacity / filter / clip-path. No hard-coded theme colors — use CSS variables so it works in light and dark.

## Source — components/kinetik/carousel-depth-fade.tsx
```tsx
"use client";
import { useEffect, useRef } from "react";
import { cn, useReducedMotion } from "@/lib/kinetik/core";

export interface CarouselDepthFadeProps {
  items: { image: string; title: string; caption?: string }[];
  className?: string;
}

/**
 * A native scroll-snap carousel where each card's scale, blur, tilt and opacity are driven by its
 * distance from the centre — cards recede into depth as they slide away. Scroll, swipe or use keys.
 */
export function CarouselDepthFade({ items, className }: CarouselDepthFadeProps) {
  const reduced = useReducedMotion();
  const track = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = track.current;
    if (!el) return;
    const cards = [...el.querySelectorAll<HTMLElement>("[data-card]")];
    let raf = 0;
    const update = () => {
      raf = 0;
      const mid = el.scrollLeft + el.clientWidth / 2;
      for (const c of cards) {
        const center = c.offsetLeft + c.offsetWidth / 2;
        const d = Math.max(-1.5, Math.min(1.5, (center - mid) / c.offsetWidth)); // −1.5..1.5 card widths
        const a = Math.abs(d);
        if (reduced) {
          c.style.opacity = String(1 - Math.min(0.5, a * 0.35));
          continue;
        }
        c.style.transform = `perspective(900px) rotateY(${-d * 18}deg) scale(${1 - a * 0.16})`;
        c.style.filter = `blur(${a * 3}px) saturate(${1 - a * 0.4})`;
        c.style.opacity = String(1 - a * 0.4);
        c.style.zIndex = String(10 - Math.round(a * 4));
      }
    };
    const onScroll = () => (raf ||= requestAnimationFrame(update));
    update();
    el.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => { el.removeEventListener("scroll", onScroll); window.removeEventListener("resize", onScroll); cancelAnimationFrame(raf); };
  }, [reduced, items.length]);

  return (
    <div
      ref={track}
      tabIndex={0}
      role="region"
      aria-roledescription="carousel"
      aria-label="Featured"
      className={cn("flex h-full snap-x snap-mandatory items-center gap-4 overflow-x-auto px-[calc(50%-110px)] outline-none [scrollbar-width:none] focus-visible:ring-2 focus-visible:ring-ring [&::-webkit-scrollbar]:hidden", className)}
    >
      {items.map((it, i) => (
        <figure key={i} data-card aria-label={`${i + 1} of ${items.length}: ${it.title}`} className="relative h-[290px] w-[220px] shrink-0 snap-center overflow-hidden rounded-3xl bg-muted shadow-2xl will-change-transform">
          <img src={it.image} alt="" draggable={false} className="size-full object-cover" />
          <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-4 text-white">
            <p className="text-sm font-semibold">{it.title}</p>
            {it.caption && <p className="text-xs text-white/70">{it.caption}</p>}
          </figcaption>
        </figure>
      ))}
    </div>
  );
}
```

## Usage example
```tsx
"use client";
import { photoAlt, photos } from "@/components/kinetik/demo-helpers" /* or inline */;
import { CarouselDepthFade } from "@/components/kinetik/carousel-depth-fade";

const items = photos.map((image, i) => ({ image, title: photoAlt[i], caption: `Collection · ${2019 + i}` }));

export default function Demo() {
  return <CarouselDepthFade items={items} />;
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
