You are given a task to integrate a component from the **kinetik** motion library into this codebase.

# Hero — Scribble Strike (`hero-scribble-strike`)

Studio hero: heavy uppercase statement over a cinematic still, where a hand-drawn red strike edits the last word and scribbled notes pop in.

## What it should do
Build a studio hero over a cinematic still with a dark vertical scrim: centered heavy uppercase statement; the last word gets a red (#ef2b2b) hand-drawn strikethrough path drawn with stroke-dashoffset, then a small italic serif correction note pops in. A circled 'explore all work' link gets a hand-drawn red loop. Bottom: a red band with a giant black studio name marquee.

## Project requirements
- React 19 + TypeScript, Tailwind CSS v4, shadcn/ui-style CSS variables (`background`, `foreground`, `muted`, `muted-foreground`, `border`, `card`, `primary`, `ring`). If the project lacks shadcn, set it up first (`npx shadcn@latest init`).
- Animation engine: **css**.
- No runtime dependencies (CSS only).
- Put the component at `components/kinetik/hero-scribble-strike.tsx`.
- `cn` lives at `lib/kinetik/utils.ts` (source below).
- Shared hooks go at `lib/kinetik/core.ts` (source below).

## Non-negotiables
- **Accessibility:** Struck word uses <del> and the note <ins> so screen readers get the edit; band is aria-hidden; reduced motion shows final ink.
- **Performance:** SVG stroke draws run once; background zoom + band are transform loops.
- Respect `prefers-reduced-motion` (replace movement with opacity or an instant change).
- Animate only transform / opacity / filter / clip-path. No hard-coded theme colors — use CSS variables so it works in light and dark.

## Source — components/kinetik/hero-scribble-strike.tsx
```tsx
"use client";
import { cn } from "@/lib/kinetik/core";

const css = `
.k-hss .ink{stroke-dasharray:var(--l);stroke-dashoffset:var(--l);animation:k-hss-ink var(--t,.6s) cubic-bezier(.65,0,.35,1) forwards;animation-delay:var(--d)}
@keyframes k-hss-ink{to{stroke-dashoffset:0}}
.k-hss .note{animation:k-hss-note .4s ease-out both;animation-delay:var(--d)}
@keyframes k-hss-note{from{opacity:0;transform:rotate(-8deg) scale(.7)}}
.k-hss .band{animation:k-hss-band 16s linear infinite}
@keyframes k-hss-band{to{transform:translateX(-50%)}}
.k-hss .bg{animation:k-hss-zoom 20s ease-in-out infinite alternate}
@keyframes k-hss-zoom{to{transform:scale(1.08)}}
@media (prefers-reduced-motion:reduce){.k-hss *{animation:none!important;stroke-dashoffset:0!important}}
[data-reduce-motion] .k-hss *{animation:none!important;stroke-dashoffset:0!important}`;

/** Studio hero: heavy uppercase statement over a cinematic still, where a hand-drawn red strike edits the last word and scribbled notes pop in. */
export function HeroScribbleStrike({ lead = "Where fresh ideas meet flawless execution. See the work that sets us", struck = "apart", note = "above", image, studio = "Freshcut", className }: { lead?: string; struck?: string; note?: string; image?: string; studio?: string; className?: string }) {
  return (
    <section className={cn("k-hss relative isolate flex flex-col overflow-hidden bg-zinc-900 text-[#f4ecdf]", className)}>
      <style href="k-hss" precedence="kinetik">{css}</style>
      <div aria-hidden className="bg absolute inset-0 -z-10" style={{ background: image ? `center/cover url(${image})` : "radial-gradient(ellipse at 50% 80%,#7f1d1d,#1c1917 60%)" }} />
      <div aria-hidden className="absolute inset-0 -z-10 bg-gradient-to-b from-black/60 via-black/30 to-black/70" />
      <div className="flex-1 px-6 pt-12 text-center">
        <h1 className="mx-auto max-w-3xl text-[clamp(1.8rem,5vw,3.4rem)] leading-[1.02] font-black tracking-tight uppercase">
          {lead}{" "}
          <span className="relative inline-block">
            <del className="no-underline">{struck}</del>.
            <svg aria-hidden viewBox="0 0 200 40" preserveAspectRatio="none" className="pointer-events-none absolute inset-x-[-6%] top-[30%] h-[45%] w-[112%]">
              <path className="ink" style={{ ["--l" as string]: 260, ["--d" as string]: ".8s" }} d="M4 26 C40 18 80 24 110 16 S170 22 196 12" fill="none" stroke="#ef2b2b" strokeWidth="6" strokeLinecap="round" />
            </svg>
            <span className="note absolute -right-2 -bottom-6 font-serif text-sm font-normal normal-case italic" style={{ ["--d" as string]: "1.3s" }}><ins className="no-underline">{note}</ins></span>
          </span>
        </h1>
        <a href="#" className="relative mt-16 inline-block px-4 py-1 font-serif text-sm italic">
          explore all work
          <svg aria-hidden viewBox="0 0 160 40" className="absolute inset-0 size-full overflow-visible"><path className="ink" style={{ ["--l" as string]: 420, ["--d" as string]: "1.5s", ["--t" as string]: "1s" }} d="M150 12 C120 -2 30 0 10 14 S40 40 90 36 S160 28 140 8" fill="none" stroke="#ef2b2b" strokeWidth="2" /></svg>
        </a>
      </div>
      <div aria-hidden className="mt-10 overflow-hidden bg-[#ef2b2b] text-black">
        <div className="band flex w-max text-[5rem] leading-[.8] font-black tracking-tighter whitespace-nowrap uppercase">{Array.from({ length: 6 }, (_, i) => <span key={i} className="px-6">{studio}</span>)}</div>
      </div>
    </section>
  );
}
```

## Usage example
```tsx
"use client";
import { HeroScribbleStrike } from "@/components/kinetik/hero-scribble-strike";
import { photos } from "@/components/kinetik/demo-helpers" /* or inline */;
export default function Demo() {
  return <HeroScribbleStrike className="h-full" image={photos[4]} />;
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
