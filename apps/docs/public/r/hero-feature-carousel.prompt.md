You are given a task to integrate a component from the **kinetik** motion library into this codebase.

# Hero — Feature Carousel (`hero-feature-carousel`)

Feature-led video-AI hero: announcement strip and nav, a condensed uppercase headline with gradient pill and big round arrows that drive a spring-physics card slider (auto-advances), and an enterprise banner pill.

## What it should do
Recreate a video-AI hero on #ececec: lavender survey strip, white nav (bold wordmark, 5 dropdowns, Talk to Sales, grey Login, black Sign Up); left: Anton 2-line uppercase H1, mint→lime gradient pill, big round ← → buttons; right: a spring-physics track of feature cards (58% wide; tinted illustration panel e.g. two faces + scissors bubble; tag + title) that auto-advances every 5s and pauses on hover; bottom: a white pill banner with a green CTA.

## Project requirements
- React 19 + TypeScript, Tailwind CSS v4, shadcn/ui-style CSS variables (`background`, `foreground`, `muted`, `muted-foreground`, `border`, `card`, `primary`, `ring`). If the project lacks shadcn, set it up first (`npx shadcn@latest init`).
- Animation engine: **motion**.
- Install dependencies: `npm i motion`
- Put the component at `components/kinetik/hero-feature-carousel.tsx`.
- `cn` lives at `lib/kinetik/utils.ts` (source below).
- Shared hooks go at `lib/kinetik/core.ts` (source below).
- Motion tokens go at `lib/kinetik/tokens.ts` (source below). Use tokens instead of magic numbers.

## Non-negotiables
- **Accessibility:** Arrow buttons are labelled; off-screen cards are aria-hidden; hover pauses auto-advance; reduced motion disables autoplay and snaps.
- **Performance:** One spring translateX on the track; interval paused on hover.
- Respect `prefers-reduced-motion` (replace movement with opacity or an instant change).
- Animate only transform / opacity / filter / clip-path. No hard-coded theme colors — use CSS variables so it works in light and dark.

## Source — components/kinetik/hero-feature-carousel.tsx
```tsx
"use client";
import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { cn, useReducedMotion } from "@/lib/kinetik/core";
import { spring } from "@/lib/kinetik/tokens";

const FONT = "https://fonts.googleapis.com/css2?family=Anton&family=Inter:wght@400;500;600&display=swap";
type Feature = { tag: string; title: string; tone: string; art: "cut" | "voice" | "subs" | "eyes" };
const defaults: Feature[] = [
  { tag: "Magic cut", title: "Replace hours of editing with a single click", tone: "#e6fbc9", art: "cut" },
  { tag: "Text to speech", title: "Convert written content into spoken audio with our text to speech tool.", tone: "#ececec", art: "voice" },
  { tag: "Auto subtitles", title: "Accurate captions in 100+ languages", tone: "#fff1c7", art: "subs" },
  { tag: "Eye contact", title: "Look into the lens, even when you read", tone: "#d9f3ff", art: "eyes" },
];
const Face = ({ tint }: { tint: string }) => <span className="relative block h-full flex-1 overflow-hidden rounded-xl" style={{ background: `linear-gradient(180deg,${tint},#e9d8c8)` }}><span className="absolute top-[16%] left-1/2 h-[46%] w-[46%] -translate-x-1/2 rounded-[45%] bg-[#f2d2bd]" /><span className="absolute top-[8%] left-1/2 h-[30%] w-[60%] -translate-x-1/2 rounded-t-full bg-[#e9c98f]" /><span className="absolute bottom-0 left-1/2 h-[34%] w-[80%] -translate-x-1/2 rounded-t-[40%] bg-[#4b4b4b]" /></span>;

/** Feature-led video-AI hero: announcement strip and nav, a condensed uppercase headline with gradient pill and big round arrows that drive a spring-physics card slider (auto-advances), and an enterprise banner pill. */
export function HeroFeatureCarousel({ title = "Streamline video with AI editing", features = defaults, className }: { title?: string; features?: Feature[]; className?: string }) {
  const reduced = useReducedMotion();
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);
  const go = (d: number) => setI((k) => (k + d + features.length) % features.length);
  useEffect(() => {
    if (reduced || paused) return;
    const t = setInterval(() => setI((k) => (k + 1) % features.length), 5000);
    return () => clearInterval(t);
  }, [reduced, paused, features.length]);
  return (
    <section className={cn("flex flex-col overflow-hidden bg-[#ececec] text-[#111]", className)} style={{ fontFamily: "Inter,ui-sans-serif,sans-serif" }} onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
      <link rel="stylesheet" href={FONT} precedence="kinetik-font" />
      <p className="bg-[#e2dcff] py-1.5 text-center text-[11px] text-[#4b3fa8]">Ever completed corporate training and thought it could be better? Share your thoughts <a href="#" className="ml-1 rounded-full bg-[#6d5dfc] px-2 py-0.5 text-white">Take survey</a></p>
      <nav className="flex items-center justify-between bg-white px-[1.6%] py-3 text-[12px] font-medium"><span className="flex items-center gap-7"><b className="text-[21px] font-black tracking-tight">VEDO.IO</b><span className="hidden gap-6 lg:flex"><a href="#">Products ⌄</a><a href="#">Use Cases ⌄</a><a href="#">Resources ⌄</a><a href="#">For Business ⌄</a><a href="#">Pricing</a></span></span><span className="flex items-center gap-3"><a href="#">Talk to Sales</a><a href="#" className="rounded-md bg-[#ececec] px-3 py-2">Login</a><a href="#" className="rounded-md bg-black px-3 py-2 text-white">Sign Up</a></span></nav>
      <div className="grid flex-1 grid-cols-[38%_1fr] pt-[3.5%] pl-[4%]">
        <div className="flex flex-col justify-between pb-[2%]">
          <div>
            <h1 className="text-[clamp(2.4rem,4.7vw,4.5rem)] leading-[.95] tracking-[-.005em] uppercase" style={{ fontFamily: "Anton,Impact,sans-serif" }}>{title.split(" ").reduce<string[]>((a, w, k) => { if (k < 2) a[0] = `${a[0] ?? ""} ${w}`; else a[1] = `${a[1] ?? ""} ${w}`; return a; }, []).map((l) => <span key={l} className="block">{l.trim()}</span>)}</h1>
            <a href="#" className="mt-[7%] inline-block rounded-full bg-gradient-to-r from-[#7ff2b3] to-[#c3f56f] px-4 py-2.5 text-[12px] font-medium">Explore all AI features</a>
          </div>
          <div className="flex gap-3">
            <button type="button" aria-label="Previous feature" onClick={() => go(-1)} className="grid size-[clamp(3rem,5vw,4.6rem)] place-items-center rounded-full bg-[#f5f5f5] text-2xl text-zinc-400 transition-transform hover:-translate-x-0.5 active:scale-95">←</button>
            <button type="button" aria-label="Next feature" onClick={() => go(1)} className="grid size-[clamp(3rem,5vw,4.6rem)] place-items-center rounded-full bg-white text-2xl transition-transform hover:translate-x-0.5 active:scale-95">→</button>
          </div>
        </div>
        <div className="overflow-hidden" aria-roledescription="carousel">
          <motion.ul animate={{ x: `calc(${-i} * (58% + 14px))` }} transition={reduced ? { duration: 0 } : spring.smooth} className="flex h-full gap-[14px] pb-[2%]">
            {features.map((f, k) => (
              <li key={f.tag} aria-hidden={k !== i} className="flex w-[58%] shrink-0 flex-col overflow-hidden rounded-2xl bg-white">
                <div className="grid h-[57%] place-items-center p-[4%]" style={{ background: f.tone }}>
                  {f.art === "cut" ? <span className="relative flex h-[85%] w-full gap-[18%] rounded-2xl bg-[#3a3a3a] p-[4%]"><Face tint="#f4e9dc" /><Face tint="#efe2d4" /><span className="absolute top-1/2 left-1/2 grid aspect-square w-[24%] -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-[#7ff2b3] text-3xl">✂</span></span>
                    : f.art === "voice" ? <span className="w-[80%] rounded-xl bg-white/70 p-4 text-left text-lg text-zinc-500">Today I'd like to share our annual report …<span className="mt-6 block text-xs">▶</span></span>
                    : <span className="grid size-24 place-items-center rounded-2xl bg-[#222] text-3xl text-white">{f.art === "subs" ? "Aa" : "◉"}</span>}
                </div>
                <div className="flex flex-1 flex-col justify-end p-[5%]"><p className="text-[10px] font-bold tracking-widest uppercase">{f.tag}</p><p className="mt-3 text-[clamp(1rem,1.6vw,1.55rem)] leading-tight">{f.title}</p></div>
              </li>
            ))}
          </motion.ul>
        </div>
      </div>
      <div className="mx-auto mb-[1.5%] flex w-[73%] items-center justify-between rounded-full bg-white py-2 pr-2 pl-6 text-[clamp(.8rem,1.15vw,1.1rem)] font-medium">Create professional videos 8X faster with our Enterprise plan<a href="#" className="rounded-full bg-[#9ef0a8] px-4 py-2 text-[12px]">Talk to Sales</a></div>
    </section>
  );
}
```

## Usage example
```tsx
"use client";
import { HeroFeatureCarousel } from "@/components/kinetik/hero-feature-carousel";
export default function Demo() {
  return <HeroFeatureCarousel className="h-full" />;
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
