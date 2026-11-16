You are given a task to integrate a component from the **kinetik** motion library into this codebase.

# Hero — Launch Timeline (`hero-launch-timeline`)

Release-notes hero: a storefront preview whose banner swaps as a vertical schedule timeline ticks through each planned launch.

## What it should do
Build a release-notes hero on #ddd9cf: left vertical index of sections with roman numerals (current one underlined), bold H1 + serif subtitle, a storefront preview card with a 'Scheduled' chip whose banner crossfades (scale 1.04→1) every 2.6s, and a vertical timeline of date chips where the active node fills and its chip goes full opacity.

## Project requirements
- React 19 + TypeScript, Tailwind CSS v4, shadcn/ui-style CSS variables (`background`, `foreground`, `muted`, `muted-foreground`, `border`, `card`, `primary`, `ring`). If the project lacks shadcn, set it up first (`npx shadcn@latest init`).
- Animation engine: **motion**.
- Install dependencies: `npm i motion`
- Put the component at `components/kinetik/hero-launch-timeline.tsx`.
- `cn` lives at `lib/kinetik/utils.ts` (source below).
- Shared hooks go at `lib/kinetik/core.ts` (source below).

## Non-negotiables
- **Accessibility:** Schedule is an ordered list; banner text is real; reduced motion stops the auto-advance.
- **Performance:** One interval; AnimatePresence crossfade of a single banner.
- Respect `prefers-reduced-motion` (replace movement with opacity or an instant change).
- Animate only transform / opacity / filter / clip-path. No hard-coded theme colors — use CSS variables so it works in light and dark.

## Source — components/kinetik/hero-launch-timeline.tsx
```tsx
"use client";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { cn, useReducedMotion } from "@/lib/kinetik/core";

type Slot = { date: string; banner: string; tone: string };
const defaults: Slot[] = [
  { date: "January 1, 2026 at 12:00am", banner: "Drop in on our biggest sale", tone: "from-[#1e293b] to-[#334155]" },
  { date: "January 5, 2026 at 12:00am", banner: "New season. New colours.", tone: "from-[#7c2d12] to-[#c2410c]" },
  { date: "January 9, 2026 at 9:00am", banner: "Members get early access", tone: "from-[#14532d] to-[#15803d]" },
];
const index = ["Assistant", "Agentic", "Online", "Retail", "Marketing", "Checkout", "Operations"];

/** Release-notes hero: a storefront preview whose banner swaps as a vertical schedule timeline ticks through each planned launch. */
export function HeroLaunchTimeline({ title = "Test and time your launches with Rollouts", subtitle = "Schedule theme changes and A/B test them, built right into the admin.", slots = defaults, className }: { title?: string; subtitle?: string; slots?: Slot[]; className?: string }) {
  const reduced = useReducedMotion();
  const [i, setI] = useState(0);
  useEffect(() => {
    if (reduced) return;
    const t = setInterval(() => setI((n) => (n + 1) % slots.length), 2600);
    return () => clearInterval(t);
  }, [reduced, slots.length]);
  return (
    <section className={cn("grid grid-cols-[110px_1fr] gap-4 overflow-hidden bg-[#ddd9cf] p-5 text-[#191919]", className)}>
      <ol className="flex flex-col justify-end text-sm leading-[1.05] font-bold tracking-tight text-zinc-500">
        {index.map((x, k) => <li key={x} className={cn("flex justify-between", k === 2 && "border-b border-black text-black")}><span>{x}</span><span className="font-serif text-[9px] font-normal">{["I", "II", "III", "IV", "V", "VI", "VII"][k]}</span></li>)}
      </ol>
      <div>
        <h1 className="text-3xl leading-tight font-bold tracking-tight">{title}</h1>
        <p className="mt-1 max-w-md font-serif text-[15px] leading-snug">{subtitle}</p>
        <div className="mt-5 flex gap-6">
          <div className="relative flex-1 overflow-hidden rounded-lg bg-white shadow-xl">
            <span className="absolute top-2 left-2 z-10 rounded-md bg-white px-2 py-1 text-[10px] shadow">Rollouts / {slots[i].date.split(" at")[0]} <b className="ml-1 rounded bg-amber-100 px-1 text-amber-700">Scheduled</b></span>
            <AnimatePresence mode="popLayout" initial={false}>
              <motion.div key={i} initial={{ opacity: 0, scale: 1.04 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.6 }} className={cn("grid h-44 place-items-center bg-gradient-to-br text-center text-white", slots[i].tone)}>
                <p className="px-6 text-xl font-semibold tracking-tight uppercase">{slots[i].banner}<span className="mt-2 block text-[10px] font-normal tracking-widest">SHOP NOW</span></p>
              </motion.div>
            </AnimatePresence>
            <div className="flex justify-around py-3">{[0, 1, 2, 3].map((k) => <span key={k} className="size-8 rounded-full bg-zinc-200" />)}</div>
          </div>
          <ol className="relative flex w-44 flex-col justify-around border-l border-zinc-700 pl-3" aria-label="Schedule">
            {slots.map((s, k) => (
              <li key={s.date} className="relative">
                <span className={cn("absolute top-1/2 -left-[17px] size-2.5 -translate-y-1/2 rounded-full border border-zinc-700 transition-colors", k === i ? "bg-zinc-900" : "bg-[#ddd9cf]")} />
                <span className={cn("block rounded-md bg-white px-2 py-1.5 text-[10px] shadow transition-all duration-500", k === i ? "opacity-100" : "opacity-40")}>{s.date} EST</span>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
```

## Usage example
```tsx
"use client";
import { HeroLaunchTimeline } from "@/components/kinetik/hero-launch-timeline";
export default function Demo() {
  return <HeroLaunchTimeline className="h-full" />;
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
