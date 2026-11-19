You are given a task to integrate a component from the **kinetik** motion library into this codebase.

# Shutter Transition (`transition-shutter`)

Page transition with venetian shutters: blades close top-to-bottom, the page swaps while covered (its name flashes), then blades open bottom-to-top with a stagger.

## What it should do
Build a shutter transition: on navigate, render N full-width blades that scaleY 0→1 from the top with stagger; when the last closes, swap the page and animate the blades scaleY 1→0 toward the bottom in reverse order; flash the target label on the closed shutter.

## Project requirements
- React 19 + TypeScript, Tailwind CSS v4, shadcn/ui-style CSS variables (`background`, `foreground`, `muted`, `muted-foreground`, `border`, `card`, `primary`, `ring`). If the project lacks shadcn, set it up first (`npx shadcn@latest init`).
- Animation engine: **motion**.
- Install dependencies: `npm i motion`
- Put the component at `components/kinetik/transition-shutter.tsx`.
- `cn` lives at `lib/kinetik/utils.ts` (source below).
- Shared hooks go at `lib/kinetik/core.ts` (source below).

## Non-negotiables
- **Accessibility:** Nav buttons have aria-current; content swap is instant for AT. Reduced motion: quick crossfade.
- **Performance:** N blades × scaleY; page swapped once under cover.
- Respect `prefers-reduced-motion` (replace movement with opacity or an instant change).
- Animate only transform / opacity / filter / clip-path. No hard-coded theme colors — use CSS variables so it works in light and dark.

## Source — components/kinetik/transition-shutter.tsx
```tsx
"use client";
import { useState, type ReactNode } from "react";
import { AnimatePresence, motion } from "motion/react";
import { cn, useReducedMotion } from "@/lib/kinetik/core";

export interface TransitionShutterProps {
  /** Pages to switch between; the key decides which is shown. */
  pages: { key: string; label: string; content: ReactNode }[];
  /** Number of shutter blades. */
  blades?: number;
  color?: string;
  className?: string;
}

/**
 * Page transition with venetian shutters: blades close top-to-bottom (scaleY from the top), the page
 * swaps while covered, then blades open bottom-to-top with a stagger, revealing the new page. The
 * route name flashes on the closed shutter. Reduced motion: a quick crossfade.
 */
export function TransitionShutter({ pages, blades = 7, color = "#0a0a0a", className }: TransitionShutterProps) {
  const reduced = useReducedMotion();
  const [current, setCurrent] = useState(pages[0].key);
  const [shown, setShown] = useState(pages[0].key);
  const [phase, setPhase] = useState<"idle" | "closing" | "opening">("idle");
  const busy = phase !== "idle";
  const ease = [0.76, 0, 0.24, 1] as const;

  const go = (key: string) => {
    if (busy || key === current) return;
    setCurrent(key);
    if (reduced) return setShown(key);
    setPhase("closing");
  };
  const page = pages.find((p) => p.key === shown)!;

  return (
    <div className={cn("relative flex h-full flex-col overflow-hidden", className)}>
      <nav aria-label="Pages" className="relative z-30 flex gap-1 border-b border-border bg-background/80 p-2 backdrop-blur">
        {pages.map((p) => (
          <button key={p.key} type="button" aria-current={p.key === current ? "page" : undefined} onClick={() => go(p.key)} className={cn("rounded-lg px-3 py-1.5 text-sm transition-colors", p.key === current ? "bg-foreground text-background" : "text-muted-foreground hover:text-foreground")}>
            {p.label}
          </button>
        ))}
      </nav>
      <div className="relative flex-1">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div key={shown} className="absolute inset-0 overflow-auto" initial={reduced ? { opacity: 0 } : false} animate={{ opacity: 1 }} exit={reduced ? { opacity: 0 } : undefined} transition={{ duration: 0.2 }}>
            {page.content}
          </motion.div>
        </AnimatePresence>
        {busy && (
          <div aria-hidden className="pointer-events-none absolute inset-0 z-20 flex flex-col">
            {Array.from({ length: blades }, (_, i) => (
              <motion.div
                key={i}
                className="flex-1"
                style={{ background: color, transformOrigin: phase === "closing" ? "top" : "bottom" }}
                initial={{ scaleY: phase === "closing" ? 0 : 1.02 }}
                animate={{ scaleY: phase === "closing" ? 1.02 : 0 }}
                transition={{ duration: 0.45, ease, delay: (phase === "closing" ? i : blades - 1 - i) * 0.045 }}
                onAnimationComplete={() => {
                  if (i !== (phase === "closing" ? blades - 1 : 0)) return;
                  if (phase === "closing") (setShown(current), setPhase("opening"));
                  else setPhase("idle");
                }}
              />
            ))}
            <motion.p
              className="absolute inset-0 grid place-items-center text-4xl font-semibold tracking-tight text-white"
              initial={{ opacity: 0 }}
              animate={{ opacity: phase === "closing" ? [0, 0, 1] : 0 }}
              transition={{ duration: phase === "closing" ? 0.7 : 0.15 }}
            >
              {pages.find((p) => p.key === current)?.label}
            </motion.p>
          </div>
        )}
      </div>
    </div>
  );
}
```

## Usage example
```tsx
"use client";
import { photos } from "@/components/kinetik/demo-helpers" /* or inline */;
import { TransitionShutter } from "@/components/kinetik/transition-shutter";

const page = (title: string, img: string, body: string) => (
  <div className="grid h-full grid-cols-2">
    <img src={img} alt="" className="h-full w-full object-cover" />
    <div className="flex flex-col justify-center gap-2 p-8">
      <h3 className="text-3xl font-semibold tracking-tight">{title}</h3>
      <p className="text-sm text-muted-foreground">{body}</p>
    </div>
  </div>
);

export default function Demo() {
  return (
    <TransitionShutter
      pages={[
        { key: "work", label: "Work", content: page("Selected work", photos[2], "Twelve projects, four continents.") },
        { key: "studio", label: "Studio", content: page("The studio", photos[0], "Eight people who sweat the details.") },
        { key: "contact", label: "Contact", content: page("Say hello", photos[6], "New projects from March.") },
      ]}
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
