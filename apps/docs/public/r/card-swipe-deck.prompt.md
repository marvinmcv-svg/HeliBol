You are given a task to integrate a component from the **kinetik** motion library into this codebase.

# Swipe Deck (`card-swipe-deck`)

Tinder-style deck: drag to swipe with rotation and LIKE/NOPE stamps; buttons and arrow keys do the same.

## What it should do
Build a swipe deck: top card `drag="x"` with rotate = x mapped [−200,200]→[−18,18]°, LIKE/NOPE stamps fading in from x; release past 110px or 600px/s exits it off-screen with rotation; the next two cards sit scaled .95/.9 and offset 12/24px and animate up. Add Like/Nope buttons and arrow keys.

## Project requirements
- React 19 + TypeScript, Tailwind CSS v4, shadcn/ui-style CSS variables (`background`, `foreground`, `muted`, `muted-foreground`, `border`, `card`, `primary`, `ring`). If the project lacks shadcn, set it up first (`npx shadcn@latest init`).
- Animation engine: **motion**.
- Install dependencies: `npm i motion lucide-react`
- Put the component at `components/kinetik/card-swipe-deck.tsx`.
- `cn` lives at `lib/kinetik/utils.ts` (source below).
- Shared hooks go at `lib/kinetik/core.ts` (source below).

## Non-negotiables
- **Accessibility:** Like/Nope buttons and ←/→ keys make the drag optional; deck changes are announced (aria-live).
- **Performance:** Only the top card is draggable; two cards preview underneath.
- Respect `prefers-reduced-motion` (replace movement with opacity or an instant change).
- Animate only transform / opacity / filter / clip-path. No hard-coded theme colors — use CSS variables so it works in light and dark.

## Source — components/kinetik/card-swipe-deck.tsx
```tsx
"use client";
import { useState, type ReactNode } from "react";
import { AnimatePresence, motion, useMotionValue, useTransform, type PanInfo } from "motion/react";
import { Heart, X } from "lucide-react";
import { cn } from "@/lib/kinetik/core";

export interface SwipeCard {
  id: string;
  content: ReactNode;
}

function TopCard({ card, onSwipe }: { card: SwipeCard; onSwipe: (dir: 1 | -1) => void }) {
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-18, 18]);
  const like = useTransform(x, [20, 120], [0, 1]);
  const nope = useTransform(x, [-120, -20], [1, 0]);
  const end = (_: unknown, i: PanInfo) => {
    if (Math.abs(i.offset.x) > 110 || Math.abs(i.velocity.x) > 600) onSwipe(i.offset.x > 0 ? 1 : -1);
  };
  return (
    <motion.div
      className="absolute inset-0 cursor-grab touch-none active:cursor-grabbing"
      style={{ x, rotate }}
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.9}
      onDragEnd={end}
      exit={{ x: x.get() >= 0 ? 400 : -400, opacity: 0, rotate: x.get() >= 0 ? 25 : -25, transition: { duration: 0.35 } }}
    >
      {card.content}
      <motion.span style={{ opacity: like }} className="absolute top-5 left-5 rotate-[-14deg] rounded-lg border-4 border-emerald-400 px-2 text-2xl font-black text-emerald-400">LIKE</motion.span>
      <motion.span style={{ opacity: nope }} className="absolute top-5 right-5 rotate-[14deg] rounded-lg border-4 border-rose-500 px-2 text-2xl font-black text-rose-500">NOPE</motion.span>
    </motion.div>
  );
}

/** Tinder-style deck: drag to swipe with rotation and LIKE/NOPE stamps, or use the buttons/arrow keys. */
export function CardSwipeDeck({ cards, onSwipe, className }: { cards: SwipeCard[]; onSwipe?: (id: string, dir: 1 | -1) => void; className?: string }) {
  const [stack, setStack] = useState(cards);
  const [, setLast] = useState<1 | -1>(1);
  const swipe = (dir: 1 | -1) => {
    const top = stack[0];
    if (!top) return;
    setLast(dir);
    onSwipe?.(top.id, dir);
    setStack((s) => s.slice(1));
  };
  return (
    <div className={cn("flex flex-col items-center gap-5", className)} onKeyDown={(e) => (e.key === "ArrowRight" ? swipe(1) : e.key === "ArrowLeft" ? swipe(-1) : null)}>
      <div className="relative h-80 w-60" aria-live="polite">
        {stack.slice(1, 3).map((c, i) => (
          <motion.div key={c.id} className="absolute inset-0" initial={false} animate={{ scale: 1 - (i + 1) * 0.05, y: (i + 1) * 12, opacity: 1 - (i + 1) * 0.25 }} style={{ zIndex: 2 - i }}>
            {c.content}
          </motion.div>
        )).reverse()}
        <AnimatePresence>{stack[0] && <TopCard key={stack[0].id} card={stack[0]} onSwipe={swipe} />}</AnimatePresence>
        {!stack.length && (
          <button onClick={() => setStack(cards)} className="absolute inset-0 grid place-items-center rounded-3xl border-2 border-dashed border-border text-sm text-muted-foreground">
            That&apos;s everyone — restart
          </button>
        )}
      </div>
      <div className="flex gap-4">
        <button onClick={() => swipe(-1)} aria-label="Nope" className="grid size-14 place-items-center rounded-full border border-border bg-card text-rose-500 shadow-sm transition-transform active:scale-90"><X className="size-6" /></button>
        <button onClick={() => swipe(1)} aria-label="Like" className="grid size-14 place-items-center rounded-full border border-border bg-card text-emerald-500 shadow-sm transition-transform active:scale-90"><Heart className="size-6" /></button>
      </div>
    </div>
  );
}
```

## Usage example
```tsx
"use client";
import { photoAlt, photos } from "@/components/kinetik/demo-helpers" /* or inline */;
import { CardSwipeDeck } from "@/components/kinetik/card-swipe-deck";
export default function Demo() {
  const cards = photos.slice(0, 6).map((p, i) => ({
    id: String(i),
    content: (
      <div className="relative h-full overflow-hidden rounded-3xl shadow-xl">
        <img src={p} alt="" draggable={false} className="h-full w-full object-cover" />
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 p-4 text-white"><p className="font-semibold">{photoAlt[i]}</p><p className="text-xs opacity-75">2 km away</p></div>
      </div>
    ),
  }));
  return <div className="flex h-full w-full items-center justify-center p-6"><CardSwipeDeck cards={cards} /></div>;
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
