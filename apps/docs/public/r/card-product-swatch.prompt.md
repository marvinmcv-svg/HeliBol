You are given a task to integrate a component from the **kinetik** motion library into this codebase.

# Card — Product Swatches (`card-product-swatch`)

Product card that changes with the colourway: picking a swatch floods the backdrop with the new colour, the product swings out and the next swings in from that side, name and price roll, and the selection ring glides. Add to bag morphs into a check.

## What it should do
Track [index, direction]; animate the backdrop colour; AnimatePresence with custom direction slides/rotates the image; roll name and price; a shared layoutId ring on the active swatch; morph the CTA into a success state.

## Project requirements
- React 19 + TypeScript, Tailwind CSS v4, shadcn/ui-style CSS variables (`background`, `foreground`, `muted`, `muted-foreground`, `border`, `card`, `primary`, `ring`). If the project lacks shadcn, set it up first (`npx shadcn@latest init`).
- Animation engine: **motion**.
- Install dependencies: `npm i motion lucide-react`
- Put the component at `components/kinetik/card-product-swatch.tsx`.
- `cn` lives at `lib/kinetik/utils.ts` (source below).
- Shared hooks go at `lib/kinetik/core.ts` (source below).

## Non-negotiables
- **Accessibility:** Swatches are a radiogroup with names; the button announces the added state. Reduced motion cross-fades.
- **Performance:** AnimatePresence popLayout for the image and rolling text; one layoutId ring.
- Respect `prefers-reduced-motion` (replace movement with opacity or an instant change).
- Animate only transform / opacity / filter / clip-path. No hard-coded theme colors — use CSS variables so it works in light and dark.

## Source — components/kinetik/card-product-swatch.tsx
```tsx
"use client";
import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Check, ShoppingBag } from "lucide-react";
import { cn, useReducedMotion } from "@/lib/kinetik/core";

export interface ProductVariant { name: string; color: string; image: string; price: number }
export interface CardProductSwatchProps {
  title: string;
  subtitle?: string;
  variants: ProductVariant[];
  currency?: string;
  className?: string;
}

/**
 * Product card that changes with the colourway: picking a swatch floods the backdrop with the new
 * colour from the swatch's side, the product slides out and the next one swings in, the name and
 * price roll, and the selection ring glides between swatches. "Add to bag" morphs into a check.
 */
export function CardProductSwatch({ title, subtitle, variants, currency = "$", className }: CardProductSwatchProps) {
  const reduced = useReducedMotion();
  const [[i, dir], setSel] = useState<[number, number]>([0, 0]);
  const [added, setAdded] = useState(false);
  const v = variants[i]!;
  const pick = (n: number) => n !== i && (setSel([n, n > i ? 1 : -1]), setAdded(false));
  const spring = reduced ? { duration: 0 } : { type: "spring" as const, stiffness: 260, damping: 26 };

  return (
    <div className={cn("relative w-80 overflow-hidden rounded-[28px] border bg-card shadow-xl", className)}>
      <div className="relative h-60 overflow-hidden">
        <motion.div className="absolute inset-0" animate={{ backgroundColor: v.color }} transition={{ duration: reduced ? 0 : 0.5 }} />
        <motion.div aria-hidden className="absolute -right-10 -top-10 size-48 rounded-full bg-white/25 blur-2xl" animate={{ x: dir * -10 }} />
        <AnimatePresence initial={false} custom={dir} mode="popLayout">
          <motion.img
            key={v.image + i}
            src={v.image}
            alt={`${title} in ${v.name}`}
            custom={dir}
            variants={{
              enter: (d: number) => ({ x: reduced ? 0 : d * 220, rotate: reduced ? 0 : d * 18, opacity: 0 }),
              center: { x: 0, rotate: -6, opacity: 1 },
              exit: (d: number) => ({ x: reduced ? 0 : d * -220, rotate: reduced ? 0 : d * -18, opacity: 0 }),
            }}
            initial="enter"
            animate="center"
            exit="exit"
            transition={spring}
            className="absolute left-1/2 top-1/2 -ml-24 -mt-[76px] h-[152px] w-48 rounded-2xl object-cover shadow-[0_30px_40px_-15px_rgb(0_0_0/.5)]"
          />
        </AnimatePresence>
      </div>
      <div className="space-y-4 p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="text-lg font-semibold leading-tight">{title}</h3>
            <div className="relative h-5 overflow-hidden text-sm text-muted-foreground">
              <AnimatePresence initial={false} mode="popLayout">
                <motion.p key={v.name} initial={{ y: reduced ? 0 : 20 * (dir || 1), opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: reduced ? 0 : -20 * (dir || 1), opacity: 0 }} transition={spring}>{subtitle ? `${subtitle} · ` : ""}{v.name}</motion.p>
              </AnimatePresence>
            </div>
          </div>
          <div className="relative h-7 overflow-hidden font-mono text-xl font-semibold tabular-nums">
            <AnimatePresence initial={false} mode="popLayout">
              <motion.span key={v.price} className="block" initial={{ y: reduced ? 0 : 28, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: reduced ? 0 : -28, opacity: 0 }} transition={spring}>{currency}{v.price}</motion.span>
            </AnimatePresence>
          </div>
        </div>
        <div role="radiogroup" aria-label="Colour" className="flex gap-2.5">
          {variants.map((x, n) => (
            <button key={x.name} type="button" role="radio" aria-checked={n === i} aria-label={x.name} onClick={() => pick(n)} className="relative grid size-8 place-items-center rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
              {n === i && <motion.span layoutId={`kn-swatch-${title}`} className="absolute inset-0 rounded-full ring-2 ring-foreground" transition={spring} />}
              <span className="size-6 rounded-full ring-1 ring-black/10" style={{ background: x.color }} />
            </button>
          ))}
        </div>
        <motion.button
          type="button"
          layout
          onClick={() => setAdded(true)}
          className={cn("flex h-11 w-full items-center justify-center gap-2 rounded-full text-sm font-medium text-white", added ? "bg-emerald-500" : "bg-foreground text-background")}
          transition={spring}
          aria-live="polite"
        >
          <AnimatePresence mode="wait" initial={false}>
            {added ? (
              <motion.span key="ok" className="flex items-center gap-2" initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ opacity: 0 }}><Check className="size-4" /> Added to bag</motion.span>
            ) : (
              <motion.span key="add" className="flex items-center gap-2" initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -10, opacity: 0 }}><ShoppingBag className="size-4" /> Add to bag</motion.span>
            )}
          </AnimatePresence>
        </motion.button>
      </div>
    </div>
  );
}
```

## Usage example
```tsx
"use client";
import { DemoCenter, photos } from "@/components/kinetik/demo-helpers" /* or inline */;
import { CardProductSwatch } from "@/components/kinetik/card-product-swatch";

export default function Demo() {
  return (
    <DemoCenter>
      <CardProductSwatch
        title="Horizon Print"
        subtitle="Archival giclée"
        variants={[
          { name: "Coral", color: "#fdba74", image: photos[0]!, price: 120 },
          { name: "Fjord", color: "#93c5fd", image: photos[1]!, price: 140 },
          { name: "Dusk", color: "#c4b5fd", image: photos[2]!, price: 135 },
          { name: "Moss", color: "#86efac", image: photos[3]!, price: 150 },
        ]}
      />
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
