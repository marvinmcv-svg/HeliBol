You are given a task to integrate a component from the **kinetik** motion library into this codebase.

# Scrubbed Bento Gallery (`gsap-bento-scrub`)

A full-bleed hero image shrinks into the centre of a bento grid as you scroll while the other tiles fade in — a Flip layout change scrubbed by ScrollTrigger.

## What it should do
Build a scroll bento: 260vh section with a sticky 100vh stage holding a 4×3 grid (areas 'a hero hero b' / 'c hero hero d' / 'e f f d'). Flip.getState(cells, {props:'borderRadius'}) in the grid layout, then make the hero absolute inset-0 radius 0 (start layout) and tl = Flip.to(state, { ease: none, absolute, scale, simple }); add a staggered autoAlpha 0→1 for other tiles at .35; attach tl to a ScrollTrigger (top top → bottom bottom, scrub .6).

## Project requirements
- React 19 + TypeScript, Tailwind CSS v4, shadcn/ui-style CSS variables (`background`, `foreground`, `muted`, `muted-foreground`, `border`, `card`, `primary`, `ring`). If the project lacks shadcn, set it up first (`npx shadcn@latest init`).
- Animation engine: **gsap**.
- Install dependencies: `npm i gsap @gsap/react`
- Put the component at `components/kinetik/gsap-bento-scrub.tsx`.
- `cn` lives at `lib/kinetik/utils.ts` (source below).
- Shared hooks go at `lib/kinetik/core.ts` (source below).

## Non-negotiables
- **Accessibility:** Images are decorative; reduced motion shows the final grid with no pinning.
- **Performance:** One Flip timeline (absolute, scale) driven by a scrubbed ScrollTrigger; sticky pin.
- Respect `prefers-reduced-motion` (replace movement with opacity or an instant change).
- Animate only transform / opacity / filter / clip-path. No hard-coded theme colors — use CSS variables so it works in light and dark.

## Source — components/kinetik/gsap-bento-scrub.tsx
```tsx
"use client";
import { useRef, type RefObject } from "react";
import gsap from "gsap";
import { Flip } from "gsap/Flip";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { cn, useReducedMotion } from "@/lib/kinetik/core";

gsap.registerPlugin(Flip, ScrollTrigger, useGSAP);

export interface GsapBentoScrubProps {
  /** 7 images: index 0 is the hero that starts full-bleed. */
  images: string[];
  scroller?: RefObject<HTMLElement | null>;
  title?: string;
  className?: string;
}

const AREAS = ["hero", "a", "b", "c", "d", "e", "f"];

/**
 * A full-bleed hero image settles into the middle of a bento grid as you scroll. Flip records
 * the "final" grid state, then a scrubbed Flip.from (tied to a pinned ScrollTrigger) plays the
 * layout change backwards and forwards with the scrollbar.
 */
export function GsapBentoScrub({ images, scroller, title = "Every frame, in its place.", className }: GsapBentoScrubProps) {
  const section = useRef<HTMLElement>(null);
  const grid = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  useGSAP(
    () => {
      const g = grid.current!;
      const hero = g.querySelector<HTMLElement>("[data-area='hero']")!;
      if (reduced) return;
      // final layout = the grid; start layout = hero covering the whole sticky stage
      const state = Flip.getState(g.querySelectorAll("[data-cell]"), { props: "borderRadius" });
      Object.assign(hero.style, { position: "absolute", inset: "0", zIndex: "10", borderRadius: "0px" });
      const tl = Flip.to(state, { ease: "none", absolute: true, scale: true, simple: true, props: "borderRadius" });
      const items = g.querySelectorAll("[data-cell]:not([data-area='hero'])");
      tl.fromTo(items, { autoAlpha: 0 }, { autoAlpha: 1, stagger: 0.05, duration: 0.3 }, 0.35);
      ScrollTrigger.create({
        trigger: section.current,
        scroller: scroller?.current ?? undefined,
        start: "top top",
        end: "bottom bottom",
        scrub: 0.6,
        animation: tl,
        invalidateOnRefresh: true,
      });
    },
    { scope: section, dependencies: [reduced] },
  );

  return (
    <section ref={section} className={cn("relative", className)} style={{ height: reduced ? undefined : "260cqh" }}>
      <div className="sticky top-0 flex h-[100cqh] flex-col gap-3 overflow-hidden p-3">
        <p className="text-center text-sm font-medium tracking-tight text-muted-foreground">{title}</p>
        <div ref={grid} className="grid min-h-0 flex-1 grid-cols-4 grid-rows-3 gap-2 [grid-template-areas:'a_hero_hero_b'_'c_hero_hero_d'_'e_f_f_d']">
          {AREAS.map((a, i) => (
            <div key={a} data-cell data-area={a} className="overflow-hidden rounded-xl bg-muted" style={{ gridArea: a }}>
              {images[i] && <img src={images[i]} alt="" className="h-full w-full object-cover" />}
            </div>
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
import { GsapBentoScrub } from "@/components/kinetik/gsap-bento-scrub";

function Inner() {
  const s = useDemoScroller() ?? undefined;
  return (
    <>
      <GsapBentoScrub scroller={s} images={[photos[5], photos[0], photos[1], photos[2], photos[3], photos[4], photos[6]]} />
      <div className="grid h-[50cqh] place-items-center text-sm text-muted-foreground">Scroll back up to rewind.</div>
    </>
  );
}

export default function Demo() {
  return (
    <DemoScroller>
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
