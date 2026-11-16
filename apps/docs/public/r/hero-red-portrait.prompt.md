You are given a task to integrate a component from the **kinetik** motion library into this codebase.

# Hero — Red Portrait (`hero-red-portrait`)

Digital-agency hero: a red-monochrome portrait (photo slot or CSS stand-in) with projected blue light points, a thin nav and a cyan condensed-serif wordmark + tagline wiping in at bottom left.

## What it should do
Recreate a digital-agency hero on saturated #f0241b: a red-monochrome portrait (photo slot with multiply, or soft SVG head/shoulders) with projected blue glowing light points drifting across the forehead; thin nav (cyan name, small mark, white centre links, cyan 'Let's talk'); bottom-left an outlined OPS/DES/DEV tag grid + condensed Instrument Serif wordmark and a big condensed serif tagline with a spinning ✳ and 'loco' superscript, both wiping in with clip-path.

## Project requirements
- React 19 + TypeScript, Tailwind CSS v4, shadcn/ui-style CSS variables (`background`, `foreground`, `muted`, `muted-foreground`, `border`, `card`, `primary`, `ring`). If the project lacks shadcn, set it up first (`npx shadcn@latest init`).
- Animation engine: **css**.
- No runtime dependencies (CSS only).
- Put the component at `components/kinetik/hero-red-portrait.tsx`.
- `cn` lives at `lib/kinetik/utils.ts` (source below).
- Shared hooks go at `lib/kinetik/core.ts` (source below).

## Non-negotiables
- **Accessibility:** Real h1 tagline; the face is decorative CSS and aria-hidden; reduced motion stops drift, breathing and the spinning asterisk.
- **Performance:** CSS radial shapes + 16 glowing dots with transform loops.
- Respect `prefers-reduced-motion` (replace movement with opacity or an instant change).
- Animate only transform / opacity / filter / clip-path. No hard-coded theme colors — use CSS variables so it works in light and dark.

## Source — components/kinetik/hero-red-portrait.tsx
```tsx
"use client";
import { cn } from "@/lib/kinetik/core";

const FONT = "https://fonts.googleapis.com/css2?family=Instrument+Serif&family=Inter:wght@400&display=swap";
const css = `
.k-hrp{font-family:Inter,ui-sans-serif,system-ui,sans-serif}
.k-hrp .serif{font-family:"Instrument Serif",ui-serif,Georgia,serif}
.k-hrp .dot{animation:k-hrp-drift var(--s) ease-in-out infinite alternate;animation-delay:var(--d)}
@keyframes k-hrp-drift{to{transform:translate(var(--x),var(--y));opacity:.3}}
.k-hrp .face{animation:k-hrp-breathe 8s ease-in-out infinite alternate}
@keyframes k-hrp-breathe{to{transform:scale(1.035)}}
.k-hrp .star{display:inline-block;animation:k-hrp-spin 10s linear infinite}
@keyframes k-hrp-spin{to{transform:rotate(360deg)}}
.k-hrp .in{animation:k-hrp-in 1.3s cubic-bezier(.16,1,.3,1) both;animation-delay:var(--d,0s)}
@keyframes k-hrp-in{from{clip-path:inset(0 100% 0 0)}to{clip-path:inset(0 0 0 0)}}
@media (prefers-reduced-motion:reduce){.k-hrp *{animation:none!important}}
[data-reduce-motion] .k-hrp *{animation:none!important}`;

const dots = [[38, 4], [42, 3], [44, 7], [47, 10], [52, 9], [55, 11], [57, 8], [50, 14], [48, 18], [46, 21], [45, 24], [53, 13], [56, 12], [59, 10]].map(([l, t], i) => ({ l, t, x: `${((i % 5) - 2) * 5}px`, y: `${((i % 3) - 1) * 6}px`, s: `${3 + (i % 4)}s`, d: `${-(i % 5)}s` }));

/** Digital-agency hero: a red-monochrome portrait (photo slot or CSS stand-in) with projected blue light points, a thin nav and a cyan condensed-serif wordmark + tagline wiping in at bottom left. */
export function HeroRedPortrait({ name = "Locomoto", tagline = "Digital-first Design Agency", tags = ["OPS", "DES", "DEV"], image, className }: { name?: string; tagline?: string; tags?: string[]; image?: string; className?: string }) {
  return (
    <section className={cn("k-hrp relative isolate flex min-h-[460px] flex-col justify-between overflow-hidden bg-[#f0241b] px-[2.6%] pt-4 pb-[1.5%] text-[#78c7dd]", className)}>
      <link rel="stylesheet" href={FONT} precedence="kinetik-font" />
      <style href="k-hrp" precedence="kinetik">{css}</style>
      <div aria-hidden className="face absolute inset-0 -z-10">
        {image ? <div className="absolute inset-0 bg-cover bg-center mix-blend-multiply grayscale" style={{ backgroundImage: `url(${image})` }} /> : (
          <svg viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice" className="absolute inset-0 size-full">
            <defs>
              <radialGradient id="k-hrp-skin" cx="50%" cy="42%" r="55%"><stop offset="0" stopColor="#c3150e" /><stop offset=".55" stopColor="#8e0b07" /><stop offset="1" stopColor="#3b0302" /></radialGradient>
              <radialGradient id="k-hrp-hair" cx="50%" cy="35%" r="60%"><stop offset=".5" stopColor="#5a0503" /><stop offset="1" stopColor="#2a0201" stopOpacity="0" /></radialGradient>
              <filter id="k-hrp-soft"><feGaussianBlur stdDeviation="14" /></filter>
            </defs>
            <ellipse cx="720" cy="380" rx="360" ry="560" fill="url(#k-hrp-hair)" filter="url(#k-hrp-soft)" />
            <path d="M470 960 C 500 760, 560 700, 620 670 L 820 670 C 880 700, 940 760, 970 960Z" fill="#6d0805" filter="url(#k-hrp-soft)" />
            <ellipse cx="720" cy="380" rx="215" ry="300" fill="url(#k-hrp-skin)" filter="url(#k-hrp-soft)" />
            <g fill="#3a0302" opacity=".55" filter="url(#k-hrp-soft)">
              <ellipse cx="640" cy="350" rx="48" ry="20" /><ellipse cx="800" cy="350" rx="48" ry="20" />
              <path d="M705 370 L 690 470 Q 720 490 750 470 L 735 370Z" opacity=".5" />
              <ellipse cx="720" cy="560" rx="55" ry="18" />
            </g>
          </svg>
        )}
        {dots.map((d, i) => <span key={i} className="dot absolute size-[5px] rounded-full bg-[#4b6bff] shadow-[0_0_10px_3px_#3d5cffcc]" style={{ left: `${d.l}%`, top: `${d.t}%`, ["--x" as string]: d.x, ["--y" as string]: d.y, ["--s" as string]: d.s, ["--d" as string]: d.d }} />)}
      </div>
      <nav className="flex items-center justify-between text-[clamp(.8rem,1.15vw,1.1rem)]"><span className="flex items-center gap-[10vw]"><span>{name}®</span><span aria-hidden className="text-white/80">⁂</span></span><span className="text-white">Work, Agency, Careers, Store</span><a href="#">Let's talk</a></nav>
      <div className="serif">
        <div className="in flex items-end gap-2" style={{ ["--d" as string]: ".2s" }}>
          <span aria-hidden className="grid grid-cols-2 border border-current font-sans text-[clamp(.55rem,.85vw,.8rem)] leading-none">
            <span className="row-span-2 grid place-items-center border-r border-current px-1.5">{tags[0]}</span>
            {tags.slice(1).map((t) => <span key={t} className="border-b border-current px-1.5 py-0.5 last:border-b-0">{t}</span>)}
          </span>
          <span className="text-[clamp(2.2rem,5vw,4.8rem)] leading-[.8] tracking-[-.02em] [transform:scaleX(.86)] origin-left">{name}<sup className="text-[.4em]">®</sup></span>
        </div>
        <h1 className="in text-[clamp(2.4rem,5.4vw,5.1rem)] leading-[1] tracking-[-.025em] [transform:scaleX(.86)] origin-left" style={{ ["--d" as string]: ".45s" }}>{tagline}<span aria-hidden className="star ml-1">✳</span><sup aria-hidden className="ml-1 text-[.45em] underline">loco</sup></h1>
      </div>
    </section>
  );
}
```

## Usage example
```tsx
"use client";
import { HeroRedPortrait } from "@/components/kinetik/hero-red-portrait";
export default function Demo() {
  return <HeroRedPortrait className="h-full" />;
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
