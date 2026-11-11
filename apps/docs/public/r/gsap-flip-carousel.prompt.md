You are given a task to integrate a component from the **kinetik** motion library into this codebase.

# Flip Carousel (`gsap-flip-carousel`)

A carousel where DOM order is the truth: next/prev rotates the array and GSAP Flip animates every card from its old box to its new one — the centre slot is bigger, so cards grow as they pass through.

## What it should do
Build a Flip carousel: state is an order array; on next/prev call Flip.getState(track.children) then rotate the array; in a useGSAP layout effect keyed on order run Flip.from(state, { duration .7, ease power3.inOut, nested: true }). Size classes come from distance to the centre slot (big centre, smaller neighbours, faded ends).

## Project requirements
- React 19 + TypeScript, Tailwind CSS v4, shadcn/ui-style CSS variables (`background`, `foreground`, `muted`, `muted-foreground`, `border`, `card`, `primary`, `ring`). If the project lacks shadcn, set it up first (`npx shadcn@latest init`).
- Animation engine: **gsap**.
- Install dependencies: `npm i gsap @gsap/react lucide-react`
- Put the component at `components/kinetik/gsap-flip-carousel.tsx`.
- `cn` lives at `lib/kinetik/utils.ts` (source below).
- Shared hooks go at `lib/kinetik/core.ts` (source below).

## Non-negotiables
- **Accessibility:** Arrow keys on the focused region, labelled buttons, aria-live title; non-centre cards aria-hidden. Reduced motion: instant re-order.
- **Performance:** Flip.getState before the React update, Flip.from in a layout effect after — no manual measuring.
- Respect `prefers-reduced-motion` (replace movement with opacity or an instant change).
- Animate only transform / opacity / filter / clip-path. No hard-coded theme colors — use CSS variables so it works in light and dark.

## Source — components/kinetik/gsap-flip-carousel.tsx
```tsx
"use client";
import { useRef, useState } from "react";
import gsap from "gsap";
import { Flip } from "gsap/Flip";
import { useGSAP } from "@gsap/react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { cn, useReducedMotion } from "@/lib/kinetik/core";

gsap.registerPlugin(Flip, useGSAP);

export interface GsapFlipCarouselProps {
  items: { image: string; title: string }[];
  className?: string;
}

/**
 * A carousel where the DOM order is the truth: "next" moves the first card to the end, and GSAP Flip
 * animates every card from its old box to its new one — the centre slot is simply bigger, so cards
 * grow and shrink as they pass through it.
 */
export function GsapFlipCarousel({ items, className }: GsapFlipCarouselProps) {
  const reduced = useReducedMotion();
  const track = useRef<HTMLDivElement>(null);
  const [order, setOrder] = useState(() => items.map((_, i) => i));
  const pending = useRef<Flip.FlipState | null>(null);
  const busy = useRef(false);

  const shift = (d: 1 | -1) => {
    if (busy.current || !track.current) return;
    if (!reduced) pending.current = Flip.getState(track.current.children, { props: "opacity" });
    setOrder((o) => (d > 0 ? [...o.slice(1), o[0]] : [o[o.length - 1], ...o.slice(0, -1)]));
  };

  // After React re-orders the DOM, play the Flip from the recorded state.
  useGSAP(
    () => {
      const state = pending.current;
      if (!state) return;
      pending.current = null;
      busy.current = true;
      Flip.from(state, { duration: 0.7, ease: "power3.inOut", absolute: false, nested: true, onComplete: () => void (busy.current = false) });
    },
    { dependencies: [order], scope: track },
  );

  const center = Math.floor(items.length / 2);
  return (
    <div
      className={cn("flex h-full flex-col items-center justify-center gap-5 overflow-hidden", className)}
      role="region"
      aria-roledescription="carousel"
      aria-label="Featured"
      tabIndex={0}
      onKeyDown={(e) => (e.key === "ArrowRight" ? shift(1) : e.key === "ArrowLeft" ? shift(-1) : null)}
    >
      <div ref={track} className="flex items-center gap-3">
        {order.map((idx, pos) => {
          const it = items[idx];
          const isCenter = pos === center;
          const dist = Math.abs(pos - center);
          return (
            <figure
              key={idx}
              aria-hidden={!isCenter}
              className={cn("relative shrink-0 overflow-hidden rounded-2xl bg-muted shadow-lg", isCenter ? "h-64 w-48" : dist === 1 ? "h-44 w-28" : "h-32 w-16")}
              style={{ opacity: dist > 2 ? 0 : 1 - dist * 0.2 }}
            >
              <img src={it.image} alt="" className="size-full object-cover" draggable={false} />
              {isCenter && <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 p-3 text-sm font-medium text-white">{it.title}</figcaption>}
            </figure>
          );
        })}
      </div>
      <div className="flex gap-2">
        <button type="button" aria-label="Previous" onClick={() => shift(-1)} className="grid size-10 place-items-center rounded-full border border-border hover:bg-muted"><ArrowLeft className="size-4" /></button>
        <button type="button" aria-label="Next" onClick={() => shift(1)} className="grid size-10 place-items-center rounded-full border border-border hover:bg-muted"><ArrowRight className="size-4" /></button>
      </div>
      <p className="sr-only" aria-live="polite">{items[order[center]].title}</p>
    </div>
  );
}
```

## Usage example
```tsx
"use client";
import { photoAlt, photos } from "@/components/kinetik/demo-helpers" /* or inline */;
import { GsapFlipCarousel } from "@/components/kinetik/gsap-flip-carousel";

const items = photos.slice(0, 7).map((image, i) => ({ image, title: photoAlt[i] }));

export default function Demo() {
  return <GsapFlipCarousel items={items} />;
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
