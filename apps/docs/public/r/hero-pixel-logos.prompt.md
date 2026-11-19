You are given a task to integrate a component from the **kinetik** motion library into this codebase.

# Hero — Pixel Logos (`hero-pixel-logos`)

Enterprise-AI hero in a ruled grid: bordered cell nav, hopping pixel-art mascots, a word-by-word headline, a drifting row of tall logo cells and a strip of customer stories.

## What it should do
Recreate an enterprise-AI hero in a ruled cream grid: cell nav (pixel logo cell, 7 links separated by rules, 'Start building ⌄', black 'Contact sales ›'); three hopping pixel-art sprites above a 3-line H1 (~3.9vw, medium, words rising staggered 35ms); a row of tall bordered logo cells drifting sideways; then a strip of customer-story cards (two small side cards + a wide centre image card with a mono tag).

## Project requirements
- React 19 + TypeScript, Tailwind CSS v4, shadcn/ui-style CSS variables (`background`, `foreground`, `muted`, `muted-foreground`, `border`, `card`, `primary`, `ring`). If the project lacks shadcn, set it up first (`npx shadcn@latest init`).
- Animation engine: **css**.
- No runtime dependencies (CSS only).
- Put the component at `components/kinetik/hero-pixel-logos.tsx`.
- `cn` lives at `lib/kinetik/utils.ts` (source below).
- Shared hooks go at `lib/kinetik/core.ts` (source below).

## Non-negotiables
- **Accessibility:** Words are spans inside a real h1; sprites and duplicate cells aria-hidden; reduced motion stops hops, word rise and cell drift.
- **Performance:** Three tiny crisp-edged SVG sprites; one marquee.
- Respect `prefers-reduced-motion` (replace movement with opacity or an instant change).
- Animate only transform / opacity / filter / clip-path. No hard-coded theme colors — use CSS variables so it works in light and dark.

## Source — components/kinetik/hero-pixel-logos.tsx
```tsx
"use client";
import { cn } from "@/lib/kinetik/core";

const css = `
.k-hpl .px{animation:k-hpl-hop 2.4s cubic-bezier(.34,1.56,.64,1) infinite;animation-delay:var(--d)}
@keyframes k-hpl-hop{0%,60%,100%{transform:translateY(0)}30%{transform:translateY(-6px) rotate(-6deg)}}
.k-hpl .cells{animation:k-hpl-slide 36s linear infinite}
@keyframes k-hpl-slide{to{transform:translateX(-50%)}}
.k-hpl .w{display:inline-block;animation:k-hpl-word .7s cubic-bezier(.16,1,.3,1) both;animation-delay:calc(var(--i)*35ms)}
@keyframes k-hpl-word{from{opacity:0;transform:translateY(.4em)}}
.k-hpl .story{animation:k-hpl-story 1.2s cubic-bezier(.16,1,.3,1) .6s both}
@keyframes k-hpl-story{from{opacity:0;transform:translateY(40px)}}
@media (prefers-reduced-motion:reduce){.k-hpl *{animation:none!important}}
[data-reduce-motion] .k-hpl *{animation:none!important}`;

const sprites = [
  { c: ["#f97316", "#7c2d12", "#fbbf24"], m: ["00000000", "01111110", "12222221", "12122121", "12211221", "12222221", "01111110"] },
  { c: ["#1d4ed8", "#0b1a4a", "#93c5fd"], m: ["00011000", "01111110", "12211221", "11111111", "13333331", "11111111", "01100110"] },
  { c: ["#0ea5e9", "#1e3a8a", "#22c55e"], m: ["00111100", "01133310", "11333111", "13311331", "11113311", "01111110", "00111100"] },
];
const logos = ["✕ HTX", "AXA·", "orange■", "I B M", "ASML", "MINISTÈRE", "NOVA", "KESTREL"];
const nav = ["Products", "Solutions", "Models", "Developers", "Blog", "Customers", "Company"];

/** Enterprise-AI hero in a ruled grid: bordered cell nav, hopping pixel-art mascots, a word-by-word headline, a drifting row of tall logo cells and a strip of customer stories. */
export function HeroPixelLogos({ title = "We help organizations build tailored AI systems to solve the world's hardest problems.", className }: { title?: string; className?: string }) {
  const rule = "border-[#e7e5df]";
  return (
    <section className={cn("k-hpl flex flex-col overflow-hidden bg-[#fbfaf7] text-[#111]", className)}>
      <style href="k-hpl" precedence="kinetik">{css}</style>
      <nav className={cn("flex border-b text-[13px] whitespace-nowrap", rule)}>
        <span aria-hidden className={cn("grid w-11 place-items-center border-r", rule)}><svg viewBox="0 0 7 5" className="w-6" shapeRendering="crispEdges">{["1000001", "1101011", "1111111", "1010101", "1000001"].flatMap((r, y) => [...r].map((v, x) => v === "1" && <rect key={`${x}${y}`} x={x} y={y} width="1" height="1" fill={["#ffd800", "#ffaf00", "#ff8205", "#fa500f", "#e10500"][y]} />))}</svg></span>
        {nav.map((n, k) => <a key={n} href="#" className={cn("border-r px-3.5 py-2.5", k > 2 && "hidden lg:block", rule)}>{n}</a>)}
        <span className="ml-auto flex"><a href="#" className={cn("border-l px-4 py-2.5", rule)}>Start building ⌄</a><a href="#" className="bg-black px-5 py-2.5 text-white">Contact sales ›</a></span>
      </nav>
      <div className={cn("mx-[0.4%] border-x border-b px-6 pt-2 pb-[6%] text-center", rule)}>
        <div aria-hidden className="flex justify-center gap-4">
          {sprites.map((s, k) => (
            <svg key={k} viewBox="0 0 8 7" className="px h-9 w-10" style={{ ["--d" as string]: `${k * 0.2}s` }} shapeRendering="crispEdges">
              {s.m.flatMap((row, y) => [...row].map((v, x) => (v === "0" ? null : <rect key={`${x}-${y}`} x={x} y={y} width="1" height="1" fill={s.c[+v - 1]} />)))}
            </svg>
          ))}
        </div>
        <h1 className="mx-auto mt-1 max-w-[21ch] text-[clamp(2rem,3.9vw,3.6rem)] leading-[1.12] font-medium tracking-[-.03em]">
          {title.split(" ").map((w, i) => <span key={i} className="w" style={{ ["--i" as string]: i }}>{w}&nbsp;</span>)}
        </h1>
      </div>
      <div className={cn("overflow-hidden border-b", rule)}>
        <ul className="cells flex w-max">
          {[...logos, ...logos].map((l, i) => <li key={i} aria-hidden={i >= logos.length} className={cn("grid h-[clamp(7rem,17vw,15rem)] w-[clamp(9rem,17.9vw,16.5rem)] place-items-center border-r text-[clamp(1rem,2vw,1.9rem)] font-black tracking-tight", rule)}>{l}</li>)}
        </ul>
      </div>
      <div aria-hidden className={cn("story grid flex-1 grid-cols-[12.5%_1fr_12.5%] gap-2 pt-[6%] text-[11px] font-medium", rule)}>
        <div className="flex flex-col justify-end gap-1 pl-4"><span>Stellar accelerates…</span><span className="h-16 rounded bg-gradient-to-br from-[#3a2c22] via-[#c2410c] to-[#1c1917]" /></div>
        <div className="relative rounded-t-lg bg-gradient-to-r from-[#1f2a37] via-[#7c3a12] to-[#3a3f47]"><span className="absolute top-4 left-4 text-base font-bold text-white">⟷ HALDEN</span><span className="absolute bottom-3 left-4 rounded bg-black/40 px-1.5 font-mono text-[9px] text-white">FINANCIAL SERVICES</span></div>
        <div className="flex flex-col justify-end gap-1 pr-4"><span>Axiom accelerates…</span><span className="h-16 rounded bg-[radial-gradient(circle,#f97316,#7c2d12_60%,#111)]" /></div>
      </div>
    </section>
  );
}
```

## Usage example
```tsx
"use client";
import { HeroPixelLogos } from "@/components/kinetik/hero-pixel-logos";
export default function Demo() {
  return <HeroPixelLogos className="h-full" />;
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
