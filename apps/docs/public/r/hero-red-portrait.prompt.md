You are given a task to integrate a component from the **kinetik** motion library into this codebase.

# Hero — Red Portrait (`hero-red-portrait`)

Digital-agency hero: a monochrome red portrait silhouette with projected blue light points drifting across it and a cyan serif wordmark wiping in.

## What it should do
Build an agency hero on saturated #e3231b: an abstract portrait built from dark radial-gradient ellipses (head, eyes, mouth) that slowly breathes, with 16 glowing blue (#3b5bff) light points drifting across it. Thin cyan (#7ad3e8) nav at top; bottom-left an outlined OPS/DES/DEV tag grid + serif wordmark, and a serif tagline that wipes in with clip-path, ending in a spinning ✳.

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

const css = `
.k-hrp .dot{animation:k-hrp-drift var(--s) ease-in-out infinite alternate;animation-delay:var(--d)}
@keyframes k-hrp-drift{to{transform:translate(var(--x),var(--y));opacity:.35}}
.k-hrp .face{animation:k-hrp-breathe 7s ease-in-out infinite alternate}
@keyframes k-hrp-breathe{to{transform:scale(1.04)}}
.k-hrp .star{animation:k-hrp-spin 10s linear infinite}
@keyframes k-hrp-spin{to{transform:rotate(360deg)}}
.k-hrp .in{animation:k-hrp-in 1.2s cubic-bezier(.16,1,.3,1) both;animation-delay:var(--d,0s)}
@keyframes k-hrp-in{from{opacity:0;clip-path:inset(0 100% 0 0)}to{clip-path:inset(0 0 0 0)}}
@media (prefers-reduced-motion:reduce){.k-hrp *{animation:none!important}}
[data-reduce-motion] .k-hrp *{animation:none!important}`;

const dots = Array.from({ length: 16 }, (_, i) => ({ l: 38 + ((i * 17) % 26), t: 6 + ((i * 23) % 40), x: `${((i % 5) - 2) * 6}px`, y: `${((i % 3) - 1) * 8}px`, s: `${3 + (i % 4)}s`, d: `${-(i % 5)}s` }));

/** Digital-agency hero: a monochrome red portrait silhouette with projected blue light points drifting across it and a cyan serif wordmark wiping in. */
export function HeroRedPortrait({ name = "Locomoto", tagline = "Digital-first Design Agency", tags = ["OPS", "DES", "DEV"], className }: { name?: string; tagline?: string; tags?: string[]; className?: string }) {
  return (
    <section className={cn("k-hrp relative isolate flex min-h-[460px] flex-col justify-between overflow-hidden bg-[#e3231b] p-6 text-[#7ad3e8]", className)}>
      <style href="k-hrp" precedence="kinetik">{css}</style>
      <div aria-hidden className="face absolute inset-0 -z-10">
        <div className="absolute top-[-20%] left-1/2 h-[140%] w-[46%] -translate-x-1/2 rounded-[50%] bg-[radial-gradient(ellipse_at_50%_40%,#c81a14_0,#7a0b08_55%,transparent_72%)]" />
        <div className="absolute top-[36%] left-[41%] h-[6%] w-[7%] rounded-[50%] bg-[#4a0505]/70 blur-[2px]" />
        <div className="absolute top-[36%] right-[41%] h-[6%] w-[7%] rounded-[50%] bg-[#4a0505]/70 blur-[2px]" />
        <div className="absolute top-[64%] left-1/2 h-[5%] w-[12%] -translate-x-1/2 rounded-[50%] bg-[#5c0806]/80 blur-[3px]" />
        {dots.map((d, i) => <span key={i} className="dot absolute size-1.5 rounded-full bg-[#3b5bff] shadow-[0_0_8px_2px_#3b5bffaa]" style={{ left: `${d.l}%`, top: `${d.t}%`, ["--x" as string]: d.x, ["--y" as string]: d.y, ["--s" as string]: d.s, ["--d" as string]: d.d }} />)}
      </div>
      <nav className="flex justify-between text-xs"><span>{name}®</span><span className="hidden sm:inline">Work, Agency, Careers, Store</span><a href="#">Let's talk</a></nav>
      <div>
        <div className="in flex items-end gap-3" style={{ ["--d" as string]: ".2s" }}>
          <span aria-hidden className="grid grid-cols-2 border border-current text-[9px] leading-none font-semibold">
            <span className="row-span-2 grid place-items-center border-r border-current px-1.5">{tags[0]}</span>
            {tags.slice(1).map((t) => <span key={t} className="border-b border-current px-1.5 py-1 last:border-b-0">{t}</span>)}
          </span>
          <span className="font-serif text-3xl leading-none">{name}®</span>
        </div>
        <h1 className="in mt-1 font-serif text-[clamp(1.8rem,5vw,3rem)] leading-none" style={{ ["--d" as string]: ".45s" }}>{tagline}<span aria-hidden className="star ml-2 inline-block">✳</span></h1>
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
