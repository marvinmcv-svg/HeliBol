You are given a task to integrate a component from the **kinetik** motion library into this codebase.

# Hero — Dusk Skyline (`hero-dusk-skyline`)

Corporate hero: thin oversized type over a dusk city skyline that slowly pans while lit windows flicker on and off.

## What it should do
Build a corporate hero: dusk sky gradient (slate → peach → dark) that slowly hue-shifts, a procedural SVG skyline (20 towers) panning −4% over 30s with lit windows twinkling on stepped 3–7s loops, a 25% black scrim, and a light-weight 6xl H1 that resolves from blur + wide letter-spacing, followed by a short paragraph.

## Project requirements
- React 19 + TypeScript, Tailwind CSS v4, shadcn/ui-style CSS variables (`background`, `foreground`, `muted`, `muted-foreground`, `border`, `card`, `primary`, `ring`). If the project lacks shadcn, set it up first (`npx shadcn@latest init`).
- Animation engine: **css**.
- No runtime dependencies (CSS only).
- Put the component at `components/kinetik/hero-dusk-skyline.tsx`.
- `cn` lives at `lib/kinetik/utils.ts` (source below).
- Shared hooks go at `lib/kinetik/core.ts` (source below).

## Non-negotiables
- **Accessibility:** Real h1 + paragraph; skyline SVG is aria-hidden; reduced motion stops the pan, sky shift and twinkle.
- **Performance:** SVG rects with opacity step animations; one slow transform pan.
- Respect `prefers-reduced-motion` (replace movement with opacity or an instant change).
- Animate only transform / opacity / filter / clip-path. No hard-coded theme colors — use CSS variables so it works in light and dark.

## Source — components/kinetik/hero-dusk-skyline.tsx
```tsx
"use client";
import { cn } from "@/lib/kinetik/core";

const css = `
.k-hds .sky{background:linear-gradient(180deg,#3b4a6b 0%,#a77c6a 55%,#e8b48a 75%,#3a2f2c 100%);animation:k-hds-sky 16s ease-in-out infinite alternate}
@keyframes k-hds-sky{to{filter:hue-rotate(-12deg) brightness(.85)}}
.k-hds .city{animation:k-hds-pan 30s ease-in-out infinite alternate}
@keyframes k-hds-pan{to{transform:translateX(-4%)}}
.k-hds .win{animation:k-hds-twinkle var(--s) steps(2) infinite;animation-delay:var(--d)}
@keyframes k-hds-twinkle{50%{opacity:.15}}
.k-hds .in{animation:k-hds-in 1.4s cubic-bezier(.16,1,.3,1) both;animation-delay:var(--d,0s)}
@keyframes k-hds-in{from{opacity:0;letter-spacing:.08em;filter:blur(10px)}}
@media (prefers-reduced-motion:reduce){.k-hds *{animation:none!important}}
[data-reduce-motion] .k-hds *{animation:none!important}`;

const towers = [[0, 60], [30, 110], [62, 80], [90, 150], [118, 95], [150, 190], [176, 120], [208, 70], [236, 160], [262, 105], [296, 220], [322, 140], [356, 85], [384, 175], [414, 115], [446, 75], [476, 135], [508, 95], [540, 165], [570, 80]] as const;

/** Corporate hero: thin oversized type over a dusk city skyline that slowly pans while lit windows flicker on and off. */
export function HeroDuskSkyline({ title = "The world's identity company", subtitle = "We free everyone to safely use any technology — with seamless, secure access, authentication and authorization.", className }: { title?: string; subtitle?: string; className?: string }) {
  return (
    <section className={cn("k-hds relative isolate flex flex-col items-center justify-start overflow-hidden px-6 pt-14 pb-40 text-center text-white", className)}>
      <style href="k-hds" precedence="kinetik">{css}</style>
      <div aria-hidden className="sky absolute inset-0 -z-20" />
      <svg aria-hidden viewBox="0 0 600 260" preserveAspectRatio="xMidYMax slice" className="city absolute inset-x-0 bottom-0 -z-10 h-[75%] w-[110%]">
        {towers.map(([x, h], i) => (
          <g key={i}>
            <rect x={x} y={260 - h} width="28" height={h} fill={i % 2 ? "#1f1b24" : "#2a2530"} />
            {Array.from({ length: Math.floor(h / 22) }, (_, r) => <rect key={r} className="win" x={x + 6 + (r % 2) * 10} y={260 - h + 10 + r * 20} width="5" height="7" fill="#ffd8a0" opacity=".8" style={{ ["--s" as string]: `${3 + ((i + r) % 5)}s`, ["--d" as string]: `${-((i * r) % 7)}s` }} />)}
          </g>
        ))}
      </svg>
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_50%_45%,#0009,transparent_70%)]" aria-hidden />
      <h1 className="in max-w-3xl text-5xl leading-[1.05] font-light tracking-tight sm:text-6xl">{title}</h1>
      <p className="in mt-6 max-w-xl text-sm text-white/90 [text-shadow:0_1px_8px_#000a]" style={{ ["--d" as string]: ".3s" }}>{subtitle}</p>
    </section>
  );
}
```

## Usage example
```tsx
"use client";
import { HeroDuskSkyline } from "@/components/kinetik/hero-dusk-skyline";
export default function Demo() {
  return <HeroDuskSkyline className="h-full" />;
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
