You are given a task to integrate a block from the **kinetik** motion library into this codebase.

# Hero — Liquid Glass (`hero-liquid-glass`)

Agency hero with a slow Ken Burns photo behind frosted, refracting glass UI — backdrop blur plus an SVG displacement map and a specular rim on the nav and buttons — and a blur-rise headline.

## What it should do
Build a liquid-glass agency hero: full-bleed photo with a 30 s Ken Burns loop and a top/bottom dark gradient. Glass surfaces = backdrop-filter: blur(10px) url(#displace) where #displace is an SVG feTurbulence → feDisplacementMap(scale 38) filter, plus a white/10 fill and inset highlights for a specular rim. A glass pill navbar at top, a huge headline whose words rise with blur (stagger 80 ms), and two glass pill CTAs.

## Project requirements
- React 19 + TypeScript, Tailwind CSS v4, shadcn/ui-style CSS variables (`background`, `foreground`, `muted`, `muted-foreground`, `border`, `card`, `primary`, `ring`). If the project lacks shadcn, set it up first (`npx shadcn@latest init`).
- Animation engine: **motion**.
- Install dependencies: `npm i motion lucide-react`
- Put the component at `components/kinetik/hero-liquid-glass.tsx`.
- `cn` lives at `lib/kinetik/utils.ts` (source below).
- Shared hooks go at `lib/kinetik/core.ts` (source below).

## Non-negotiables
- **Accessibility:** Glass is decorative styling on real links and buttons; contrast holds over the darkened photo. Reduced motion: no Ken Burns, headline fades in.
- **Performance:** backdrop-filter on three small elements; one looping transform on the photo. The url() displacement in backdrop-filter is Chromium-only and degrades to blur elsewhere.
- Respect `prefers-reduced-motion` (replace movement with opacity or an instant change).
- Animate only transform / opacity / filter / clip-path. No hard-coded theme colors — use CSS variables so it works in light and dark.

## Source — components/kinetik/hero-liquid-glass.tsx
```tsx
"use client";
import { useId, type ReactNode } from "react";
import { motion } from "motion/react";
import { ArrowUpRight, Play } from "lucide-react";
import { useReducedMotion } from "@/lib/kinetik/core";

/**
 * "Liquid glass" agency hero: a slow Ken Burns photo behind frosted, refracting glass UI. The glass
 * is backdrop-filter blur + an SVG feDisplacementMap that bends what's behind the edges, plus a
 * specular rim. Headline words rise in with blur.
 */
function Glass({ children, className = "", filterId }: { children: ReactNode; className?: string; filterId: string }) {
  return (
    <div className={`relative isolate overflow-hidden ${className}`}>
      {/* refraction layer: the backdrop seen through a displacement filter */}
      <span aria-hidden className="absolute inset-0 -z-10 rounded-[inherit] backdrop-blur-md" style={{ backdropFilter: `blur(10px) url(#${filterId})`, WebkitBackdropFilter: "blur(10px)" }} />
      <span aria-hidden className="absolute inset-0 -z-10 rounded-[inherit] bg-white/10 shadow-[inset_0_1px_0_rgb(255_255_255/.55),inset_0_-1px_0_rgb(255_255_255/.12),inset_0_0_24px_rgb(255_255_255/.12),0_10px_40px_-10px_rgb(0_0_0/.45)]" />
      {children}
    </div>
  );
}

export function HeroLiquidGlass() {
  const reduced = useReducedMotion();
  const fid = `lg-${useId().replace(/:/g, "")}`;
  const words = "We design brands that feel alive.".split(" ");
  return (
    <section className="relative h-full min-h-[560px] overflow-hidden rounded-[2rem] text-white">
      <svg aria-hidden className="absolute size-0">
        <filter id={fid} x="0" y="0" width="100%" height="100%">
          <feTurbulence type="fractalNoise" baseFrequency="0.008 0.012" numOctaves="2" seed="7" result="n" />
          <feDisplacementMap in="SourceGraphic" in2="n" scale="38" xChannelSelector="R" yChannelSelector="G" />
        </filter>
      </svg>
      <motion.img
        src="/demo/photo-6.jpg"
        alt=""
        className="absolute inset-0 size-full object-cover"
        initial={{ scale: 1.15 }}
        animate={reduced ? { scale: 1.05 } : { scale: [1.15, 1.02, 1.15], x: ["0%", "-2%", "0%"] }}
        transition={reduced ? { duration: 0 } : { duration: 30, repeat: Infinity, ease: "easeInOut" }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/60" />

      <div className="relative flex h-full flex-col p-5 sm:p-8">
        <Glass filterId={fid} className="mx-auto flex w-full max-w-3xl items-center justify-between rounded-full py-2 pl-5 pr-2">
          <span className="text-sm font-semibold tracking-tight">Orvo®</span>
          <nav aria-label="Main" className="hidden gap-6 text-sm text-white/80 sm:flex">
            {["Work", "Studio", "Services", "Journal"].map((l) => <a key={l} href={`#${l.toLowerCase()}`} className="hover:text-white">{l}</a>)}
          </nav>
          <a href="#contact" className="rounded-full bg-white px-4 py-1.5 text-sm font-medium text-black">Let&apos;s talk</a>
        </Glass>

        <div className="mt-auto max-w-3xl pb-4">
          <h1 className="text-[clamp(2.4rem,7vw,5rem)] font-semibold leading-[0.95] tracking-tight">
            {words.map((w, i) => (
              <motion.span
                key={i}
                className="mr-[0.25em] inline-block"
                initial={reduced ? { opacity: 0 } : { opacity: 0, y: 40, filter: "blur(12px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                transition={{ duration: reduced ? 0.2 : 0.9, delay: reduced ? 0 : 0.2 + i * 0.08, ease: [0.22, 1, 0.36, 1] }}
              >
                {w}
              </motion.span>
            ))}
          </h1>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: reduced ? 0 : 0.9 }} className="mt-6 flex flex-wrap items-center gap-3">
            <Glass filterId={fid} className="rounded-full">
              <a href="#work" className="flex items-center gap-2 px-5 py-3 text-sm font-medium">View our work <ArrowUpRight className="size-4" /></a>
            </Glass>
            <Glass filterId={fid} className="rounded-full">
              <button type="button" className="flex items-center gap-2 px-5 py-3 text-sm"><Play className="size-4 fill-current" /> Showreel 2026</button>
            </Glass>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
```

## Usage example
```tsx
"use client";
import { HeroLiquidGlass } from "@/components/kinetik/hero-liquid-glass";
export default function Demo() {
  return <div className="h-full p-3"><HeroLiquidGlass /></div>;
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
