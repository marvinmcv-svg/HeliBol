You are given a task to integrate a component from the **kinetik** motion library into this codebase.

# Hero — Paper Sketch (`hero-paper-sketch`)

Device hero in a rounded cinematic frame: a large tilted paper-like tablet sketches an engraving stroke by stroke beside a hand, under a frosted nav pill, with serif copy and three features along the bottom.

## What it should do
Recreate a device hero inside a rounded warm-dark cinematic frame: logo badge top-left, frosted nav pill with orange 'ORDER NOW' top-right; a large tilted orange-bezel paper tablet whose screen draws an engraving (contour paths + horizon lines via stroke-dashoffset) and gently sways; bottom gradient with a 2-line Instrument Serif H1 (italic 'paper-like') and three icon features.

## Project requirements
- React 19 + TypeScript, Tailwind CSS v4, shadcn/ui-style CSS variables (`background`, `foreground`, `muted`, `muted-foreground`, `border`, `card`, `primary`, `ring`). If the project lacks shadcn, set it up first (`npx shadcn@latest init`).
- Animation engine: **css**.
- No runtime dependencies (CSS only).
- Put the component at `components/kinetik/hero-paper-sketch.tsx`.
- `cn` lives at `lib/kinetik/utils.ts` (source below).
- Shared hooks go at `lib/kinetik/core.ts` (source below).

## Non-negotiables
- **Accessibility:** Real h1 and feature copy; tablet aria-hidden; reduced motion shows the finished sketch.
- **Performance:** ~14 stroke draws once; one slow tilt loop.
- Respect `prefers-reduced-motion` (replace movement with opacity or an instant change).
- Animate only transform / opacity / filter / clip-path. No hard-coded theme colors — use CSS variables so it works in light and dark.

## Source — components/kinetik/hero-paper-sketch.tsx
```tsx
"use client";
import { cn } from "@/lib/kinetik/core";

const FONT = "https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Inter:wght@400;600&display=swap";
const css = `
.k-hps{font-family:Inter,ui-sans-serif,system-ui,sans-serif}
.k-hps .s{stroke-dasharray:var(--l);stroke-dashoffset:var(--l);animation:k-hps-draw var(--t) ease-in-out forwards;animation-delay:var(--d)}
@keyframes k-hps-draw{to{stroke-dashoffset:0}}
.k-hps .tab{animation:k-hps-tilt 9s ease-in-out infinite alternate}
@keyframes k-hps-tilt{from{transform:rotate(-9deg)}to{transform:rotate(-6deg) translateY(-6px)}}
.k-hps .in{animation:k-hps-in 1s cubic-bezier(.16,1,.3,1) both;animation-delay:var(--d,0s)}
@keyframes k-hps-in{from{opacity:0;transform:translateY(14px)}}
@media (prefers-reduced-motion:reduce){.k-hps *{animation:none!important;stroke-dashoffset:0!important}}
[data-reduce-motion] .k-hps *{animation:none!important;stroke-dashoffset:0!important}`;

const features = [["▣", "Smooth interactions", "Scroll, zoom, turn pages— even watch video— without any lag"], ["☺", "A calm experience", "Stay connected with yourself and what's around you"], ["♡", "For your health", "Say goodbye to eye-strain —designed for full sunlight and nighttime"]];

/** Device hero in a rounded cinematic frame: a large tilted paper-like tablet sketches an engraving stroke by stroke beside a hand, under a frosted nav pill, with serif copy and three features along the bottom. */
export function HeroPaperSketch({ title = "The world's first full-speed", italic = "paper-like", tail = "display", className }: { title?: string; italic?: string; tail?: string; className?: string }) {
  const contours = Array.from({ length: 14 }, (_, i) => `M${80 + i * 3} ${60 + i * 9} C ${110 + i * 4} ${20 + i * 7}, ${190 - i * 3} ${30 + i * 8}, ${205 - i * 3} ${90 + i * 7} S ${150} ${215 - i * 5}, ${95 + i * 4} ${165 - i * 3} Z`);
  return (
    <section className={cn("k-hps flex bg-[#efebe4] p-[1.4%]", className)}>
      <link rel="stylesheet" href={FONT} precedence="kinetik-font" />
      <style href="k-hps" precedence="kinetik">{css}</style>
      <div className="relative min-h-[440px] flex-1 overflow-hidden rounded-2xl bg-[radial-gradient(ellipse_at_35%_35%,#4a4038,#2a2420_55%,#1d1916)] text-white">
        <div aria-hidden className="absolute inset-0 bg-[radial-gradient(ellipse_at_10%_75%,#7a3a3a55,transparent_40%),radial-gradient(ellipse_at_80%_55%,#6b6b6b33,transparent_35%)]" />
        <span aria-hidden className="absolute top-4 left-4 grid size-8 place-items-center rounded-lg bg-white/85 text-zinc-800">◑</span>
        <nav className="absolute top-3 right-3 z-10 flex items-center gap-5 rounded-xl bg-white/70 py-1 pr-1 pl-4 text-[12px] text-zinc-700 backdrop-blur"><span>Home</span><span>Product</span><span>FAQ</span><a href="#" className="rounded-lg bg-[#ff8a1f] px-4 py-2.5 text-[11px] font-semibold text-[#2a1404]">ORDER NOW</a></nav>
        <div aria-hidden className="tab absolute top-[6%] left-[16%] w-[42%] rounded-[34px] bg-gradient-to-br from-[#f08a3a] to-[#c95a1c] p-[2%] shadow-2xl">
          <div className="rounded-[22px] bg-[#e8e3d4] p-[3%] shadow-inner">
            <svg viewBox="0 0 280 260" className="block w-full">
              <g fill="none" stroke="#33332f" strokeWidth=".7">{contours.map((d, i) => <path key={i} className="s" d={d} style={{ ["--l" as string]: 620, ["--t" as string]: "2.6s", ["--d" as string]: `${0.3 + i * 0.14}s` }} />)}</g>
              <g stroke="#33332f" strokeWidth=".5" fill="none">{Array.from({ length: 6 }, (_, i) => <path key={i} className="s" d={`M10 ${150 + i * 6} Q 140 ${120 + i * 10} 270 ${150 + i * 6}`} style={{ ["--l" as string]: 300, ["--t" as string]: "1.4s", ["--d" as string]: `${1.6 + i * 0.1}s` }} />)}{Array.from({ length: 6 }, (_, i) => <path key={`v${i}`} className="s" d={`M${125 + i * 6} 225 V 258`} style={{ ["--l" as string]: 40, ["--t" as string]: ".4s", ["--d" as string]: `${2.4 + i * 0.08}s` }} />)}</g>
            </svg>
          </div>
        </div>
        <div className="absolute inset-x-0 bottom-0 grid grid-cols-[2.3fr_1fr_1fr_1fr] items-end gap-[2%] bg-gradient-to-t from-black/55 to-transparent px-[3.5%] pt-24 pb-[3%]">
          <h1 className="in text-[clamp(1.8rem,4.2vw,3.9rem)] leading-[1] tracking-[-.04em]" style={{ fontFamily: '"Instrument Serif",serif' }}>{title} <em>{italic}</em> {tail}</h1>
          {features.map(([icon, h, p], i) => <div key={h} className="in text-[clamp(.6rem,.95vw,.9rem)]" style={{ ["--d" as string]: `${0.2 + i * 0.1}s` }}><span aria-hidden className="text-xl">{icon}</span><p className="mt-2 text-[1.15em] font-semibold">{h}</p><p className="mt-1 text-white/70">{p}</p></div>)}
        </div>
      </div>
    </section>
  );
}
```

## Usage example
```tsx
"use client";
import { HeroPaperSketch } from "@/components/kinetik/hero-paper-sketch";
export default function Demo() {
  return <HeroPaperSketch className="h-full" />;
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
