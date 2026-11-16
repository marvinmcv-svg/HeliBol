You are given a task to integrate a component from the **kinetik** motion library into this codebase.

# Hero — Sunset Stripes (`hero-sunset-stripes`)

Closing-statement hero on cream: bordered-pill nav, a careers banner card, a plain centered statement with underlined text links, and a pixel cat on stacked sunset stripes that sweep in from alternating sides.

## What it should do
Recreate a closing-statement hero on cream #fff8e8: pixel logo + links + two beige pill links with orange ›; a wide careers banner photo card ('secure, private AI.', 'View open roles ›') slowly panning; a centered statement (~3.9vw), two underlined links with orange ›; a pixel lying-cat sprite bobbing; six stacked sunset stripes (cream → yellow → amber → orange → red-orange → red) sweeping in from alternating sides, staggered 90ms.

## Project requirements
- React 19 + TypeScript, Tailwind CSS v4, shadcn/ui-style CSS variables (`background`, `foreground`, `muted`, `muted-foreground`, `border`, `card`, `primary`, `ring`). If the project lacks shadcn, set it up first (`npx shadcn@latest init`).
- Animation engine: **css**.
- No runtime dependencies (CSS only).
- Put the component at `components/kinetik/hero-sunset-stripes.tsx`.
- `cn` lives at `lib/kinetik/utils.ts` (source below).
- Shared hooks go at `lib/kinetik/core.ts` (source below).

## Non-negotiables
- **Accessibility:** Real h1 and links; stripes and cat aria-hidden; reduced motion stops the sweep and walk.
- **Performance:** Six stripe transforms once; one tiny sprite loop.
- Respect `prefers-reduced-motion` (replace movement with opacity or an instant change).
- Animate only transform / opacity / filter / clip-path. No hard-coded theme colors — use CSS variables so it works in light and dark.

## Source — components/kinetik/hero-sunset-stripes.tsx
```tsx
"use client";
import { cn } from "@/lib/kinetik/core";

const FONT = "https://fonts.googleapis.com/css2?family=Inter:wght@400;500&display=swap";
const css = `
.k-hsu{font-family:Inter,ui-sans-serif,system-ui,sans-serif}
.k-hsu .stripe{animation:k-hsu-slide 1.1s cubic-bezier(.16,1,.3,1) both;animation-delay:calc(.2s + var(--i)*90ms)}
@keyframes k-hsu-slide{from{transform:translateX(var(--from))}}
.k-hsu .cat{animation:k-hsu-cat 1.2s steps(2) infinite}
@keyframes k-hsu-cat{50%{transform:translateY(-4px)}}
.k-hsu .lnk span{transition:transform .3s cubic-bezier(.34,1.56,.64,1)}
.k-hsu .lnk:hover span{transform:translateX(4px)}
.k-hsu .pan{animation:k-hsu-pan 14s ease-in-out infinite alternate}
@keyframes k-hsu-pan{to{background-position:100% 50%}}
@media (prefers-reduced-motion:reduce){.k-hsu *{animation:none!important}}
[data-reduce-motion] .k-hsu *{animation:none!important}`;

const stripes = ["#fbe8b8", "#ffd800", "#ffaf00", "#ff8205", "#fa500f", "#e10500"];
const cat = ["0000000001001", "0000000001111", "1000000011111", "1000000011011", "1100111111111", "0111111111110", "0111111111110", "0110000000110"];

/** Closing-statement hero on cream: bordered-pill nav, a careers banner card, a plain centered statement with underlined text links, and a pixel cat on stacked sunset stripes that sweep in from alternating sides. */
export function HeroSunsetStripes({ title = "The next chapter of AI is yours.", links = ["Start building with Mistro AI", "Talk to an expert"], className }: { title?: string; links?: string[]; className?: string }) {
  return (
    <section className={cn("k-hsu flex flex-col overflow-hidden bg-[#fff8e8] text-[#1e1e1e]", className)}>
      <link rel="stylesheet" href={FONT} precedence="kinetik-font" />
      <style href="k-hsu" precedence="kinetik">{css}</style>
      <nav className="flex items-center justify-between px-[8.7%] py-4 text-[12px]"><svg aria-hidden viewBox="0 0 7 5" className="w-7" shapeRendering="crispEdges">{["1000001", "1101011", "1111111", "1010101", "1000001"].flatMap((r, y) => [...r].map((v, x) => v === "1" && <rect key={`${x}${y}`} x={x} y={y} width="1" height="1" fill={stripes[y + 1]} />))}</svg><span className="flex items-center gap-7"><a href="#">Products</a><a href="#">Solutions</a><a href="#">Research</a><a href="#">Resources</a><a href="#">Company</a><a href="#" className="bg-[#f5ead2] px-2.5 py-1">Try the API <span className="text-[#fa500f]">›</span></a><a href="#" className="bg-[#f5ead2] px-2.5 py-1">Talk to sales <span className="text-[#fa500f]">›</span></a></span></nav>
      <div className="pan relative mx-[8.7%] flex h-[20%] min-h-24 items-end justify-between overflow-hidden px-[3%] pb-[2%] text-white" style={{ background: "linear-gradient(100deg,#3a2414,#8a5a2c 40%,#c98a3c 60%,#4a2c16)", backgroundSize: "160% 100%" }}>
        <div><p className="-mt-2 text-[clamp(1.2rem,2.6vw,2.4rem)] leading-none tracking-tight">secure, private AI.</p><p className="mt-3 max-w-xs text-[11px]">Now seeking: Insatiably curious AI enthusiasts with an entrepreneurial spirit.</p></div>
        <a href="#" className="border-b border-white/70 pb-1 text-[11px]">View open roles <span className="text-[#ffaf00]">›</span></a>
      </div>
      <div className="flex flex-1 flex-col items-center justify-end pt-[5%]">
        <h1 className="px-6 text-center text-[clamp(2rem,3.9vw,3.7rem)] tracking-[-.02em]">{title}</h1>
        <div className="mt-[2.5%] flex gap-5 text-[13px]">{links.map((l) => <a key={l} href="#" className="lnk border-b border-current pb-1.5">{l} <span className="ml-2 inline-block text-[#fa500f]">›</span></a>)}</div>
        <svg aria-hidden viewBox="0 0 13 8" className="cat mt-[3.5%] block h-[clamp(2rem,4.6vw,4.4rem)]" shapeRendering="crispEdges">{cat.flatMap((r, y) => [...r].map((v, x) => (v === "1" ? <rect key={`${x}${y}`} x={x} y={y} width="1" height="1" fill="#111" /> : null)))}<rect x="9" y="3" width="1" height="1" fill="#fff8e8" /><rect x="11" y="3" width="1" height="1" fill="#fff8e8" /><rect x="3" y="5" width="7" height="1" fill="#fff8e8" /></svg>
      </div>
      <div aria-hidden>{stripes.map((c, i) => <div key={c} className="stripe h-[clamp(1.2rem,3.3vw,3rem)]" style={{ background: c, ["--i" as string]: i, ["--from" as string]: i % 2 ? "100%" : "-100%" }} />)}</div>
    </section>
  );
}
```

## Usage example
```tsx
"use client";
import { HeroSunsetStripes } from "@/components/kinetik/hero-sunset-stripes";
export default function Demo() {
  return <HeroSunsetStripes className="h-full" />;
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
