You are given a task to integrate a component from the **kinetik** motion library into this codebase.

# Hero — Halo Event (`hero-halo-event`)

Keynote/event hero: slim global nav over a sky-blue field where a glassy orb with an iridescent rotating rim glows above a one-line announcement and a single pill CTA.

## What it should do
Recreate a keynote/event hero: slim centered global nav on white; a sky-blue gradient field with a glassy radial orb whose thin iridescent conic rim (masked ring, @property angle) rotates with a soft blurred halo, growing in from scale .6 + blur; a 2-line semibold announcement and a white 'Watch the event' pill.

## Project requirements
- React 19 + TypeScript, Tailwind CSS v4, shadcn/ui-style CSS variables (`background`, `foreground`, `muted`, `muted-foreground`, `border`, `card`, `primary`, `ring`). If the project lacks shadcn, set it up first (`npx shadcn@latest init`).
- Animation engine: **css**.
- No runtime dependencies (CSS only).
- Put the component at `components/kinetik/hero-halo-event.tsx`.
- `cn` lives at `lib/kinetik/utils.ts` (source below).
- Shared hooks go at `lib/kinetik/core.ts` (source below).

## Non-negotiables
- **Accessibility:** Real h1 and link; halo aria-hidden; reduced motion freezes the ring.
- **Performance:** Masked conic gradient animating an @property angle; two blur layers.
- Respect `prefers-reduced-motion` (replace movement with opacity or an instant change).
- Animate only transform / opacity / filter / clip-path. No hard-coded theme colors — use CSS variables so it works in light and dark.

## Source — components/kinetik/hero-halo-event.tsx
```tsx
"use client";
import { cn } from "@/lib/kinetik/core";

const css = `
@property --ha{syntax:"<angle>";initial-value:0deg;inherits:false}
.k-hhe .rim{background:conic-gradient(from var(--ha),#ff9ad5,#ffe08a,#9dffe0,#8ec5ff,#d39bff,#ff9ad5);-webkit-mask:radial-gradient(circle,transparent 64%,#000 66%,#000 67.5%,transparent 70%);mask:radial-gradient(circle,transparent 64%,#000 66%,#000 67.5%,transparent 70%);animation:k-hhe-spin 8s linear infinite}
@keyframes k-hhe-spin{to{--ha:360deg}}
.k-hhe .glass{background:radial-gradient(circle at 50% 55%,#ffffff 0,#f2f8ff 12%,#cfe4ff 30%,#8fbaf0 55%,#8fb5ea99 64%,transparent 69%);animation:k-hhe-breathe 4s ease-in-out infinite}
@keyframes k-hhe-breathe{50%{filter:brightness(1.12)}}
.k-hhe .in{animation:k-hhe-in 1.2s cubic-bezier(.16,1,.3,1) both;animation-delay:var(--d,0s)}
@keyframes k-hhe-in{from{opacity:0;transform:translateY(12px)}}
.k-hhe .grow{animation:k-hhe-grow 1.6s cubic-bezier(.16,1,.3,1) both}
@keyframes k-hhe-grow{from{opacity:0;transform:scale(.6);filter:blur(20px)}}
@media (prefers-reduced-motion:reduce){.k-hhe *{animation:none!important}}
[data-reduce-motion] .k-hhe *{animation:none!important}`;

const nav = ["Store", "Mac", "Pad", "Phone", "Watch", "Vision", "Pods", "TV & Home", "Entertainment", "Accessories", "Support"];

/** Keynote/event hero: slim global nav over a sky-blue field where a glassy orb with an iridescent rotating rim glows above a one-line announcement and a single pill CTA. */
export function HeroHaloEvent({ announce = "Introducing Phone Duo, Phone 18 Pro, Watch Series 12, Watch Ultra 4, and Pods 5.", cta = "Watch the event", className }: { announce?: string; cta?: string; className?: string }) {
  return (
    <section className={cn("k-hhe flex flex-col overflow-hidden bg-white text-white", className)}>
      <style href="k-hhe" precedence="kinetik">{css}</style>
      <nav className="flex items-center justify-center gap-[2.6%] bg-white/90 py-3 text-[11px] text-[#1d1d1f]"><span aria-hidden className="text-sm">◉</span>{nav.map((n) => <a key={n} href="#">{n}</a>)}<span aria-hidden>⌕</span><span aria-hidden>⛉</span></nav>
      <div className="relative flex flex-1 flex-col items-center justify-center bg-[linear-gradient(180deg,#78a7e0_0%,#5d8fd3_55%,#4b7cc3_100%)] px-6 py-[3%] text-center">
        <div aria-hidden className="grow relative aspect-square w-[19%] max-w-72 min-w-36">
          <div className="absolute inset-[-25%] rounded-full bg-[radial-gradient(circle,#ffffff66,transparent_60%)] blur-2xl" />
          <div className="glass absolute inset-0 rounded-full" />
          <div className="rim absolute inset-0 rounded-full opacity-80 blur-[1.5px]" />
          <div className="rim absolute inset-[-12%] rounded-full opacity-40 blur-2xl" />
          <div className="absolute inset-[38%] rounded-full bg-white blur-lg" />
        </div>
        <h1 className="in mt-[1.5%] max-w-[37rem] text-[clamp(1rem,1.6vw,1.5rem)] leading-tight font-semibold" style={{ ["--d" as string]: ".5s" }}>{announce}</h1>
        <a href="#" className="in mt-5 rounded-full bg-white px-5 py-2.5 text-[clamp(.75rem,1.1vw,1rem)] text-[#1d1d1f] transition-transform hover:scale-105" style={{ ["--d" as string]: ".7s" }}>{cta}</a>
      </div>
    </section>
  );
}
```

## Usage example
```tsx
"use client";
import { HeroHaloEvent } from "@/components/kinetik/hero-halo-event";
export default function Demo() {
  return <HeroHaloEvent className="h-full" />;
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
