You are given a task to integrate a component from the **kinetik** motion library into this codebase.

# Hero — Converging Strings (`hero-converging-strings`)

Branding-agency hero: a grayscale studio where dozens of taut strings fan down from the ceiling onto the team (photo slot or silhouettes), under a huge indented statement.

## What it should do
Recreate a branding-agency hero: grayscale studio wall; city labels in the corners; a huge 3-line statement (~5.5vw, tracking −.055em) with the first line indented 24.5% and a wiggling ✺ after 'magic'; dozens of thin strings fanning from the ceiling to the heads of a team (photo slot or silhouettes) drawn in with stroke-dashoffset and swaying with skewX ±1.5°.

## Project requirements
- React 19 + TypeScript, Tailwind CSS v4, shadcn/ui-style CSS variables (`background`, `foreground`, `muted`, `muted-foreground`, `border`, `card`, `primary`, `ring`). If the project lacks shadcn, set it up first (`npx shadcn@latest init`).
- Animation engine: **css**.
- No runtime dependencies (CSS only).
- Put the component at `components/kinetik/hero-converging-strings.tsx`.
- `cn` lives at `lib/kinetik/utils.ts` (source below).
- Shared hooks go at `lib/kinetik/core.ts` (source below).

## Non-negotiables
- **Accessibility:** Real h1 paragraph; SVG and silhouettes aria-hidden; reduced motion shows drawn, still strings.
- **Performance:** ~22 SVG quadratic paths drawn once; two group skew loops.
- Respect `prefers-reduced-motion` (replace movement with opacity or an instant change).
- Animate only transform / opacity / filter / clip-path. No hard-coded theme colors — use CSS variables so it works in light and dark.

## Source — components/kinetik/hero-converging-strings.tsx
```tsx
"use client";
import { cn } from "@/lib/kinetik/core";

const css = `
.k-hcs .strings{transform-origin:50% 100%;animation:k-hcs-sway 7s ease-in-out infinite alternate}
.k-hcs .strings.b{animation-duration:9s;animation-direction:alternate-reverse}
@keyframes k-hcs-sway{from{transform:skewX(-1.5deg)}to{transform:skewX(1.5deg)}}
.k-hcs .s{stroke-dasharray:900;stroke-dashoffset:900;animation:k-hcs-draw 1.8s cubic-bezier(.65,0,.35,1) forwards;animation-delay:calc(var(--i)*25ms)}
@keyframes k-hcs-draw{to{stroke-dashoffset:0}}
.k-hcs .in{animation:k-hcs-in 1s cubic-bezier(.16,1,.3,1) both;animation-delay:var(--d,0s)}
@keyframes k-hcs-in{from{opacity:0;transform:translateY(20px)}}
.k-hcs .magic{display:inline-block;animation:k-hcs-wiggle 2.5s ease-in-out infinite}
@keyframes k-hcs-wiggle{50%{transform:rotate(14deg) scale(1.1)}}
@media (prefers-reduced-motion:reduce){.k-hcs *{animation:none!important;stroke-dashoffset:0!important}}
[data-reduce-motion] .k-hcs *{animation:none!important;stroke-dashoffset:0!important}`;

const people = [{ x: 27, h: 60, sit: false }, { x: 34, h: 61, sit: false }, { x: 40, h: 48, sit: true }, { x: 45, h: 60, sit: false }, { x: 52, h: 63, sit: false }, { x: 56, h: 50, sit: true }, { x: 62, h: 61, sit: false }, { x: 70, h: 62, sit: false }, { x: 78, h: 64, sit: false }];

/** Branding-agency hero: a grayscale studio where dozens of taut strings fan down from the ceiling onto the team (photo slot or silhouettes), under a huge indented statement. */
export function HeroConvergingStrings({ text = "Bureau is a digital branding agency. We craft impactful experiences with magic people, Bureau people!", cities = ["Coimbra", "&", "Porto"], image, className }: { text?: string; cities?: string[]; image?: string; className?: string }) {
  const heads = people.map((p) => [p.x * 12, 400 - p.h * 0.62 * 1.5 * 4 * 0.97] as const);
  const tops = Array.from({ length: 48 }, (_, i) => -40 + i * 27);
  const words = text.split(" ");
  return (
    <section className={cn("k-hcs relative isolate min-h-[460px] overflow-hidden bg-[#e9e9e7] px-[1.3%] pt-2 text-[#111]", className)}>
      <style href="k-hcs" precedence="kinetik">{css}</style>
      <div aria-hidden className="absolute inset-0 -z-20 bg-[linear-gradient(90deg,#f4f4f2_0,#dcdcda_8%,#f7f7f5_9%,#ececea_60%,#f5f5f3_100%)]" />
      {image && <div aria-hidden className="absolute inset-0 -z-20 bg-cover bg-center grayscale" style={{ backgroundImage: `url(${image})` }} />}
      {!image && (
        <div aria-hidden className="absolute inset-x-0 bottom-0 -z-10 h-[62%]">
          {people.map((p, i) => (
            <div key={i} className="in absolute bottom-[3%] flex w-[7%] -translate-x-1/2 flex-col items-center" style={{ left: `${p.x}%`, height: `${p.h * 1.5}%`, ["--d" as string]: `${0.4 + i * 0.05}s` }}>
              <span className="aspect-[4/5] w-[36%] shrink-0 rounded-[45%] bg-gradient-to-b from-[#8f8a85] to-[#5d5955]" />
              <span className="h-[3%] w-[22%] bg-[#6b6763]" />
              <span className={cn("w-full rounded-t-[40%_30%] bg-gradient-to-b from-[#222] to-[#111]", p.sit ? "h-[40%]" : "h-[46%]")} />
              <span className="flex w-[62%] flex-1 justify-between"><i className="block w-[44%] bg-[#151515]" /><i className="block w-[44%] bg-[#151515]" /></span>
              <span className="flex w-[80%] justify-between"><i className="block h-2 w-[42%] rounded-full bg-[#333]" /><i className="block h-2 w-[42%] rounded-full bg-[#333]" /></span>
            </div>
          ))}
          <div className="absolute inset-x-0 bottom-0 h-[4%] bg-[#d6d6d4]" />
        </div>
      )}
      <svg aria-hidden viewBox="0 0 1200 400" preserveAspectRatio="none" className="absolute inset-0 -z-10 size-full">
        <g className="strings" stroke="#222" strokeWidth=".9" fill="none">{tops.filter((_, i) => i % 2 === 0).map((x, i) => { const [hx, hy] = heads[i % heads.length]; return <path key={x} className="s" style={{ ["--i" as string]: i }} d={`M${x} 0 L ${hx + ((i % 3) - 1) * 10} ${hy}`} />; })}</g>
        <g className="strings b" stroke="#222" strokeWidth=".7" fill="none">{tops.filter((_, i) => i % 2 === 1).map((x, i) => { const [hx, hy] = heads[(i + 4) % heads.length]; return <path key={x} className="s" style={{ ["--i" as string]: i + 24 }} d={`M${x} 0 L ${hx + ((i % 3) - 1) * 12} ${hy}`} />; })}</g>
      </svg>
      <div className="flex justify-between text-[clamp(.75rem,1.15vw,1.1rem)]">{cities.map((c) => <span key={c}>{c}</span>)}</div>
      <h1 className="in mt-[1.5%] text-[clamp(1.9rem,5.5vw,5.3rem)] leading-[1.03] tracking-[-.055em] indent-[24.5%]">
        {words.map((w, i) => (w.startsWith("magic") ? <span key={i}>magic<span aria-hidden className="magic">✺</span> </span> : <span key={i}>{w} </span>))}
      </h1>
    </section>
  );
}
```

## Usage example
```tsx
"use client";
import { HeroConvergingStrings } from "@/components/kinetik/hero-converging-strings";
export default function Demo() {
  return <HeroConvergingStrings className="h-full" />;
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
