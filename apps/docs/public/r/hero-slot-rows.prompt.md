You are given a task to integrate a component from the **kinetik** motion library into this codebase.

# Hero — Slot Rows (`hero-slot-rows`)

Capability hero: pill-menu header, "AI that" in a ruled left column, a slot-reel of huge phrases that springs up one row at a time (current row in full ink), and a drifting "Trusted by" logo row.

## What it should do
Recreate a capability hero: square pixel logo, a dark centered pill (☰ Menu ● 35%) and 'Get started' pill; 'How It Works' label; a ruled split — left 26% column with 'AI that' (~5.6vw) and a small CTA; right a reel of huge phrases (~6.2vw) in 3 visible rows that springs up one row every 2.4s (first after 5s) with the top row in full ink, then mid-grey, then light grey; a 'Trusted By' row of grey logo tiles drifting with edge fades.

## Project requirements
- React 19 + TypeScript, Tailwind CSS v4, shadcn/ui-style CSS variables (`background`, `foreground`, `muted`, `muted-foreground`, `border`, `card`, `primary`, `ring`). If the project lacks shadcn, set it up first (`npx shadcn@latest init`).
- Animation engine: **motion**.
- Install dependencies: `npm i motion`
- Put the component at `components/kinetik/hero-slot-rows.tsx`.
- `cn` lives at `lib/kinetik/utils.ts` (source below).
- Shared hooks go at `lib/kinetik/core.ts` (source below).
- Motion tokens go at `lib/kinetik/tokens.ts` (source below). Use tokens instead of magic numbers.

## Non-negotiables
- **Accessibility:** h1 includes all phrases in an sr-only span; the reel is aria-hidden; reduced motion stops the reel.
- **Performance:** One spring-driven translateY on a short list.
- Respect `prefers-reduced-motion` (replace movement with opacity or an instant change).
- Animate only transform / opacity / filter / clip-path. No hard-coded theme colors — use CSS variables so it works in light and dark.

## Source — components/kinetik/hero-slot-rows.tsx
```tsx
"use client";
import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { cn, useReducedMotion } from "@/lib/kinetik/core";
import { spring } from "@/lib/kinetik/tokens";

const FONT = "https://fonts.googleapis.com/css2?family=Inter+Tight:wght@400;500&display=swap";
const css = `.k-hsl .logos{animation:k-hsl-m 30s linear infinite}@keyframes k-hsl-m{to{transform:translateX(-50%)}}@media (prefers-reduced-motion:reduce){.k-hsl .logos{animation:none}}[data-reduce-motion] .k-hsl .logos{animation:none}`;
const logos = ["⚡ hotspot", "● recharger", "VWX", "omnisend", "◆ klaviyo", "▲ northbeam"];

/** Capability hero: pill-menu header, "AI that" in a ruled left column, a slot-reel of huge phrases that springs up one row at a time (current row in full ink), and a drifting "Trusted by" logo row. */
export function HeroSlotRows({ lead = "AI that", phrases = ["Writes copy", "Makes videos", "Stays on-brand", "Create Images", "Ships campaigns", "Learns your voice"], className }: { lead?: string; phrases?: string[]; className?: string }) {
  const reduced = useReducedMotion();
  const [i, setI] = useState(1);
  useEffect(() => {
    if (reduced) return;
    let t: ReturnType<typeof setInterval>;
    const first = setTimeout(() => { setI((k) => (k + 1) % phrases.length); t = setInterval(() => setI((k) => (k + 1) % phrases.length), 2400); }, 5000);
    return () => { clearTimeout(first); clearInterval(t); };
  }, [reduced, phrases.length]);
  const rule = "border-[#e4e4e4]";
  return (
    <section className={cn("k-hsl flex flex-col overflow-hidden bg-white text-[#141414]", className)} style={{ fontFamily: '"Inter Tight",ui-sans-serif,sans-serif' }}>
      <link rel="stylesheet" href={FONT} precedence="kinetik-font" />
      <style href="k-hsl" precedence="kinetik">{css}</style>
      <header className="relative flex items-start justify-between px-[1.8%] pt-[1.3%]">
        <span aria-hidden className="grid grid-cols-3 gap-px">{[1, 1, 1, 1, 0, 0, 1, 1, 0].map((v, k) => <i key={k} className={cn("block size-3", v ? "bg-black" : "bg-transparent")} />)}</span>
        <span className="absolute left-1/2 flex -translate-x-1/2 items-center gap-6 rounded-full bg-[#111] py-1.5 pr-1.5 pl-4 text-[13px] text-white"><span className="flex items-center gap-2">☰ Menu</span><span aria-hidden>●</span><span className="rounded-full bg-white/20 px-2 py-0.5 text-[12px]">35%</span></span>
        <span className="flex items-center gap-3"><span aria-hidden className="grid size-6 place-items-center rounded-full border text-[10px]">◉</span><a href="#" className="rounded-full bg-black px-5 py-2.5 text-[13px] text-white">Get started</a></span>
      </header>
      <p className="ml-[28%] pt-3 pb-2 text-[13px]">How It Works</p>
      <div className={cn("grid border-y md:grid-cols-[26.3%_1fr]", rule)}>
        <div className={cn("flex flex-col justify-between border-r px-[7%] py-[8%]", rule)}>
          <h1 className="text-[clamp(2.6rem,5.6vw,5.4rem)] leading-[.95] tracking-[-.04em]">{lead}<span className="sr-only"> {phrases.join(", ")}</span></h1>
          <a href="#" className="mt-10 w-fit rounded-full bg-black px-4 py-2.5 text-[12px] text-white">Get started</a>
        </div>
        <div aria-hidden className="relative h-[clamp(14rem,36vw,34rem)] overflow-hidden">
          <motion.ul animate={{ y: `${-i * 33.33 + 5}%` }} transition={reduced ? { duration: 0 } : spring.smooth} className="absolute inset-x-0 top-0 h-full">
            {phrases.map((p, k) => (
              <li key={p} className={cn("flex h-[33.33%] items-center border-b px-[2%] text-[clamp(2.6rem,6.2vw,6rem)] tracking-[-.045em] transition-colors duration-500", rule, k === i ? "text-[#141414]" : k === i + 1 ? "text-[#6e6e6e]" : k === i + 2 ? "text-[#bdbdbd]" : "text-[#e2e2e2]")}>{p}</li>
            ))}
          </motion.ul>
        </div>
      </div>
      <div className="flex flex-1 items-start">
        <p className="w-[26.3%] shrink-0 px-[1.8%] pt-3 text-[12px]">Trusted By</p>
        <div className="flex-1 overflow-hidden pt-3 [mask-image:linear-gradient(90deg,transparent,#000_8%,#000_92%,transparent)]"><div aria-hidden className="logos flex w-max gap-3">{[...logos, ...logos].map((l, k) => <span key={k} className="grid h-[clamp(5rem,11vw,10.5rem)] w-[clamp(7rem,14.5vw,14rem)] place-items-center bg-[#f1f1f1] text-[13px] font-semibold text-zinc-600">{l}</span>)}</div></div>
      </div>
    </section>
  );
}
```

## Usage example
```tsx
"use client";
import { HeroSlotRows } from "@/components/kinetik/hero-slot-rows";
export default function Demo() {
  return <HeroSlotRows className="h-full" />;
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
