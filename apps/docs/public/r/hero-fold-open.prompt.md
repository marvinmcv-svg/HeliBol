You are given a task to integrate a component from the **kinetik** motion library into this codebase.

# Hero — Fold Open (`hero-fold-open`)

Foldable-device launch hero on soft grey: centered title, two lines of copy, pre-order note and pill CTAs, then the device unfolds on its hinge in 3D between two hands, revealing a photo memory and a widget/app grid.

## What it should do
Recreate a foldable-phone launch hero on #f5f5f7: centered semibold H1, 2-line grey subtitle, small pre-order note, black + outlined pill CTAs; then the device held between two hands: the left panel (photo memory) unfolds from rotateY 115° to a slight V, revealing the right panel's weather widget and app grid.

## Project requirements
- React 19 + TypeScript, Tailwind CSS v4, shadcn/ui-style CSS variables (`background`, `foreground`, `muted`, `muted-foreground`, `border`, `card`, `primary`, `ring`). If the project lacks shadcn, set it up first (`npx shadcn@latest init`).
- Animation engine: **motion**.
- Install dependencies: `npm i motion`
- Put the component at `components/kinetik/hero-fold-open.tsx`.
- `cn` lives at `lib/kinetik/utils.ts` (source below).
- Shared hooks go at `lib/kinetik/core.ts` (source below).
- Motion tokens go at `lib/kinetik/tokens.ts` (source below). Use tokens instead of magic numbers.

## Non-negotiables
- **Accessibility:** Real h1 and links; device is aria-hidden; reduced motion renders it already open.
- **Performance:** One rotateY transform with preserve-3d.
- Respect `prefers-reduced-motion` (replace movement with opacity or an instant change).
- Animate only transform / opacity / filter / clip-path. No hard-coded theme colors — use CSS variables so it works in light and dark.

## Source — components/kinetik/hero-fold-open.tsx
```tsx
"use client";
import { motion } from "motion/react";
import { cn, useReducedMotion } from "@/lib/kinetik/core";
import { easeBezier } from "@/lib/kinetik/tokens";

const apps = ["#30d158", "#ffffff", "#ff9f0a", "#1c1c1e", "#0a84ff", "#ffd60a", "#ffffff", "#30d158", "#1c1c1e", "#ff375f", "#0a84ff", "#ff453a", "#ff375f", "#ff9f0a", "#8e8e93", "#64d2ff"];

/** Foldable-device launch hero on soft grey: centered title, two lines of copy, pre-order note and pill CTAs, then the device unfolds on its hinge in 3D between two hands, revealing a photo memory and a widget/app grid. */
export function HeroFoldOpen({ title = "Phone Duo", subtitle = "The largest phone display ever. Foldable, posable, standable. Featuring unique experiences for ultimate versatility.", className }: { title?: string; subtitle?: string; className?: string }) {
  const reduced = useReducedMotion();
  const enter = (d: number) => (reduced ? {} : { initial: { opacity: 0, y: 14 }, animate: { opacity: 1, y: 0 }, transition: { delay: d, duration: 0.7, ease: easeBezier.expoOut } });
  return (
    <section className={cn("flex flex-col overflow-hidden bg-[#f5f5f7] pt-[3%] text-center text-[#1d1d1f]", className)}>
      <motion.h1 {...enter(0)} className="text-[clamp(2.4rem,4.2vw,4rem)] font-semibold tracking-[-.02em]">{title}</motion.h1>
      <motion.p {...enter(0.08)} className="mx-auto mt-2 max-w-[44rem] text-[clamp(.9rem,1.45vw,1.35rem)] leading-tight font-medium text-[#424245]">{subtitle}</motion.p>
      <motion.p {...enter(0.12)} className="mt-3 text-[clamp(.6rem,.85vw,.8rem)] text-[#6e6e73]">Pre-order starting at 5:00 a.m. PT on 10.16<br />Available starting 10.23</motion.p>
      <motion.div {...enter(0.16)} className="mt-3 flex justify-center gap-3 text-[13px]">
        <a href="#" className="rounded-full bg-[#1d1d1f] px-4 py-2 text-white">Learn more</a>
        <a href="#" className="rounded-full border border-[#1d1d1f] px-4 py-2">View pricing</a>
      </motion.div>
      <div aria-hidden className="relative mx-auto mt-[3%] aspect-[1.27] w-[42%] min-w-72 flex-none">
        {[false, true].map((r) => (
          <svg key={String(r)} viewBox="0 0 200 320" className={cn("absolute bottom-[-14%] z-0 h-[82%]", r ? "right-[-15%] -scale-x-100" : "left-[-15%]")}>
            <defs><linearGradient id={`k-hfo-skin${r}`} x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#f0cdb5" /><stop offset="1" stopColor="#c08a6c" /></linearGradient></defs>
            <path d="M30 320 C 20 250, 40 190, 80 150 C 100 130, 120 120, 140 118 C 150 118, 154 130, 146 140 L 120 170 C 150 160, 175 158, 182 170 C 188 182, 176 190, 160 196 L 120 210 C 110 250, 100 290, 104 320Z" fill={`url(#k-hfo-skin${r})`} />
          </svg>
        ))}
        <div className="absolute inset-x-[3%] top-0 bottom-[8%] z-10 flex [perspective:1400px]">
          <motion.div initial={reduced ? false : { rotateY: 115 }} animate={{ rotateY: 12 }} transition={{ delay: 0.5, duration: 1.6, ease: easeBezier.expoOut }} style={{ transformOrigin: "right center", transformStyle: "preserve-3d" }} className="h-full flex-1 rounded-l-[28px] border-[6px] border-r-0 border-[#2b2b2d] bg-[#d9d2c7] p-[5%]">
            <div className="flex h-full flex-col justify-end rounded-2xl bg-[radial-gradient(circle_at_50%_30%,#f2b8a6,#9b7a66_60%,#5b4a3f)] p-2 text-left text-[10px] font-semibold text-white">On This Day<span className="font-normal opacity-80">April 1, 2025</span></div>
          </motion.div>
          <motion.div initial={reduced ? false : { rotateY: 0 }} animate={{ rotateY: -12 }} transition={{ delay: 0.5, duration: 1.6, ease: easeBezier.expoOut }} style={{ transformOrigin: "left center" }} className="grid h-full flex-1 grid-cols-4 content-start gap-[6%] rounded-r-[28px] border-[6px] border-l-[3px] border-[#2b2b2d] border-l-[#555] bg-gradient-to-b from-[#c9d6e6] via-[#d8d3cc] to-[#c4b8aa] p-[6%]">
            <div className="col-span-2 aspect-square rounded-xl bg-[#4a78c2]/80 p-1 text-left text-[8px] text-white">San Francisco<br /><b className="text-base">54°</b></div><div className="col-span-2 aspect-square rounded-xl bg-white/70" />
            {apps.map((c, i) => <span key={i} className="aspect-square rounded-[22%]" style={{ background: c }} />)}
          </motion.div>
        </div>
        {[false, true].map((r) => <span key={String(r)} className={cn("absolute bottom-[20%] z-20 h-[9%] w-[13%] rounded-full bg-gradient-to-r from-[#e8c0a6] to-[#d6a387]", r ? "right-[-4%] rotate-[28deg]" : "left-[-4%] -rotate-[28deg]")} />)}
      </div>
    </section>
  );
}
```

## Usage example
```tsx
"use client";
import { HeroFoldOpen } from "@/components/kinetik/hero-fold-open";
export default function Demo() {
  return <HeroFoldOpen className="h-full" />;
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

## lib/kinetik/tokens.ts
```ts
/**
 * kinetik motion tokens — the single motion language shared by web (CSS / Motion / GSAP)
 * and native (Reanimated). Import tokens, never inline magic numbers.
 */

/** Durations in milliseconds. */
export const duration = {
  instant: 0,
  micro: 100,
  fast: 150,
  base: 220,
  moderate: 320,
  slow: 480,
  slower: 700,
  cinematic: 1200,
} as const;
export type DurationToken = keyof typeof duration;

/** Durations in seconds (Motion / GSAP use seconds). */
export const durationS = Object.fromEntries(
  Object.entries(duration).map(([k, v]) => [k, v / 1000]),
) as { [K in DurationToken]: number };

type Bezier = readonly [number, number, number, number];

/** Cubic-bezier control points (Motion accepts these arrays directly). */
export const easeBezier = {
  standard: [0.2, 0, 0, 1],
  enter: [0, 0, 0.2, 1],
  exit: [0.4, 0, 1, 1],
  emphasized: [0.2, 0, 0, 1],
  expoOut: [0.16, 1, 0.3, 1],
  backOut: [0.34, 1.56, 0.64, 1],
} as const satisfies Record<string, Bezier>;
export type EaseToken = keyof typeof easeBezier | "springCss" | "linear";

/** Spring-like easing in pure CSS via linear() (stiffness≈260, damping≈30). */
export const springCss =
  "linear(0, 0.009, 0.035 2.1%, 0.141 4.4%, 0.281 6.7%, 0.723 12.9%, 0.938 16.7%, 1.017 19.4%, 1.067, 1.099 24.3%, 1.108 26%, 1.100, 1.078 30.1%, 1.002 35.7%, 0.981 38.5%, 0.968 41.5%, 0.965 44.7%, 0.976 51.4%, 1.001 60%, 1.008 66.7%, 1.002 81%, 1)";

/** CSS easing strings. */
export const ease: Record<EaseToken, string> = {
  ...(Object.fromEntries(
    Object.entries(easeBezier).map(([k, v]) => [k, `cubic-bezier(${v.join(", ")})`]),
  ) as Record<keyof typeof easeBezier, string>),
  springCss,
  linear: "linear",
};

/** Matching GSAP ease names. */
export const gsapEase: Record<EaseToken, string> = {
  standard: "power3.out",
  enter: "power2.out",
  exit: "power2.in",
  emphasized: "power4.out",
  expoOut: "expo.out",
  backOut: "back.out(1.7)",
  springCss: "elastic.out(1, 0.6)",
  linear: "none",
};

/** Matching Anime.js v4 ease names. */
export const animeEase: Record<EaseToken, string> = {
  standard: "outCubic",
  enter: "outQuad",
  exit: "inQuad",
  emphasized: "outQuart",
  expoOut: "outExpo",
  backOut: "outBack(1.7)",
  springCss: "outElastic(1, .6)",
  linear: "linear",
};

export type SpringToken = "snappy" | "smooth" | "gentle" | "bouncy" | "heavy";

/** Spring presets — numbers are identical for Motion and Reanimated. */
export const springConfig: Record<SpringToken, { stiffness: number; damping: number; mass: number }> = {
  snappy: { stiffness: 500, damping: 35, mass: 1 },
  smooth: { stiffness: 260, damping: 30, mass: 1 },
  gentle: { stiffness: 120, damping: 20, mass: 1 },
  bouncy: { stiffness: 400, damping: 15, mass: 1 },
  heavy: { stiffness: 200, damping: 40, mass: 1.5 },
};

/** Ready-to-spread Motion transitions: `transition={spring.smooth}`. */
export const spring = Object.fromEntries(
  Object.entries(springConfig).map(([k, v]) => [k, { type: "spring" as const, ...v }]),
) as Record<SpringToken, { type: "spring"; stiffness: number; damping: number; mass: number }>;

/** Motion's perceptual equivalents ({ visualDuration, bounce }). */
export const springVisual: Record<SpringToken, { type: "spring"; visualDuration: number; bounce: number }> = {
  snappy: { type: "spring", visualDuration: 0.18, bounce: 0.05 },
  smooth: { type: "spring", visualDuration: 0.3, bounce: 0.1 },
  gentle: { type: "spring", visualDuration: 0.45, bounce: 0.15 },
  bouncy: { type: "spring", visualDuration: 0.3, bounce: 0.45 },
  heavy: { type: "spring", visualDuration: 0.5, bounce: 0 },
};

/** Reanimated `withSpring` configs (same physics). */
export const reanimatedSpring = springConfig;

export const distance = { xs: 4, sm: 8, md: 16, lg: 32, xl: 64 } as const;
export const stagger = { tight: 0.02, base: 0.05, loose: 0.1 } as const;
export const blur = { in: 8 } as const;
export const press = { scale: 0.97, hoverLift: -2 } as const;

/** CSS custom properties, e.g. for `:root`. */
export function toCssVars(): Record<string, string> {
  const vars: Record<string, string> = {};
  for (const [k, v] of Object.entries(duration)) vars[`--k-duration-${k}`] = `${v}ms`;
  for (const [k, v] of Object.entries(ease)) vars[`--k-ease-${k}`] = v;
  for (const [k, v] of Object.entries(distance)) vars[`--k-distance-${k}`] = `${v}px`;
  for (const [k, v] of Object.entries(stagger)) vars[`--k-stagger-${k}`] = `${v}s`;
  return vars;
}

export const tokens = { duration, durationS, ease, easeBezier, gsapEase, animeEase, spring, springConfig, springVisual, distance, stagger, blur, press };
export default tokens;
```

## Steps
1. Install the dependencies above.
2. Create the files exactly as given, fixing import aliases if the project doesn't use `@/`.
3. Drop the usage example into a page and adapt copy/colors to the project's design system.
4. Verify: toggle "Reduce motion" in OS settings — the component must still be fully usable.
