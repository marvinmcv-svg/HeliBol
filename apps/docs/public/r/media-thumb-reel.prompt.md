You are given a task to integrate a component from the **kinetik** motion library into this codebase.

# Thumbnail Reel (`media-thumb-reel`)

Hero image with a filmstrip of thumbnails: the active thumb widens into a pill with a filling progress bar while the hero slowly zooms; when it fills, the next slide cross-fades in. Hover pauses.

## What it should do
Cross-fade the hero with AnimatePresence and a long linear scale from 1.08 to 1; animate each thumb's flexGrow (4 when active); a scaleX progress bar over interval seconds; a timeout advances the index.

## Project requirements
- React 19 + TypeScript, Tailwind CSS v4, shadcn/ui-style CSS variables (`background`, `foreground`, `muted`, `muted-foreground`, `border`, `card`, `primary`, `ring`). If the project lacks shadcn, set it up first (`npx shadcn@latest init`).
- Animation engine: **motion**.
- Install dependencies: `npm i motion`
- Put the component at `components/kinetik/media-thumb-reel.tsx`.
- `cn` lives at `lib/kinetik/utils.ts` (source below).
- Shared hooks go at `lib/kinetik/core.ts` (source below).

## Non-negotiables
- **Accessibility:** Thumbnails are a tablist; title is aria-live; hover and focus pause autoplay. Reduced motion: no zoom, no autoplay.
- **Performance:** Flex-grow springs on 5 buttons; one image transform per slide.
- Respect `prefers-reduced-motion` (replace movement with opacity or an instant change).
- Animate only transform / opacity / filter / clip-path. No hard-coded theme colors — use CSS variables so it works in light and dark.

## Source — components/kinetik/media-thumb-reel.tsx
```tsx
"use client";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { cn, useReducedMotion } from "@/lib/kinetik/core";

export interface ReelItem { src: string; title: string; meta?: string; alt?: string }
export interface MediaThumbReelProps {
  items: ReelItem[];
  /** Seconds per slide when autoplaying. */
  interval?: number;
  className?: string;
}

/**
 * Hero image with a filmstrip of thumbnails. The active thumb widens into a pill with a progress bar
 * that fills while the hero slowly zooms (Ken Burns); when it fills, the next slide cross-fades in.
 * Hover pauses; clicking a thumb jumps. Reduced motion: no zoom, no autoplay.
 */
export function MediaThumbReel({ items, interval = 5, className }: MediaThumbReelProps) {
  const reduced = useReducedMotion();
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);
  const playing = !reduced && !paused;
  useEffect(() => {
    if (!playing) return;
    const t = setTimeout(() => setI((x) => (x + 1) % items.length), interval * 1000);
    return () => clearTimeout(t);
  }, [i, playing, interval, items.length]);
  const it = items[i]!;

  return (
    <div className={cn("relative overflow-hidden rounded-3xl bg-black text-white", className)} onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)} onFocus={() => setPaused(true)} onBlur={() => setPaused(false)}>
      <div className="relative aspect-[16/10]">
        <AnimatePresence initial={false}>
          <motion.img
            key={i}
            src={it.src}
            alt={it.alt ?? ""}
            className="absolute inset-0 h-full w-full object-cover"
            initial={{ opacity: 0, scale: reduced ? 1 : 1.08 }}
            animate={{ opacity: 1, scale: reduced ? 1 : 1.0, transition: { opacity: { duration: 0.8 }, scale: { duration: interval + 1, ease: "linear" } } }}
            exit={{ opacity: 0, transition: { duration: 0.8 } }}
          />
        </AnimatePresence>
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/10 to-transparent" />
        <div className="absolute bottom-24 left-6 right-6" aria-live="polite">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div key={i} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.4 }}>
              {it.meta && <p className="text-[11px] uppercase tracking-[0.25em] text-white/60">{it.meta}</p>}
              <h3 className="text-3xl font-semibold tracking-tight">{it.title}</h3>
            </motion.div>
          </AnimatePresence>
        </div>
        <div role="tablist" aria-label="Slides" className="absolute inset-x-6 bottom-5 flex h-14 gap-2">
          {items.map((t, n) => {
            const on = n === i;
            return (
              <motion.button
                key={t.src + n}
                role="tab"
                type="button"
                aria-selected={on}
                aria-label={t.title}
                onClick={() => setI(n)}
                className="relative h-full overflow-hidden rounded-xl ring-1 ring-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
                animate={{ flexGrow: on ? 4 : 1, opacity: on ? 1 : 0.6 }}
                style={{ flexBasis: 0 }}
                transition={{ type: "spring", stiffness: 260, damping: 30 }}
              >
                <img src={t.src} alt="" className="absolute inset-0 h-full w-full object-cover" />
                {on && (
                  <span className="absolute inset-x-2 bottom-1.5 h-1 overflow-hidden rounded-full bg-white/30">
                    <motion.span
                      key={`${i}-${playing}`}
                      className="block h-full origin-left bg-white"
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: playing ? 1 : 0 }}
                      transition={{ duration: playing ? interval : 0, ease: "linear" }}
                    />
                  </span>
                )}
              </motion.button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
```

## Usage example
```tsx
"use client";
import { DemoCenter, photos } from "@/components/kinetik/demo-helpers" /* or inline */;
import { MediaThumbReel } from "@/components/kinetik/media-thumb-reel";

const titles = ["Coral dunes", "Fjord light", "Night market", "Glass house", "Desert road"];

export default function Demo() {
  return (
    <DemoCenter>
      <MediaThumbReel className="w-full max-w-xl" items={titles.map((title, i) => ({ src: photos[i]!, title, meta: `Chapter ${i + 1}` }))} />
    </DemoCenter>
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
