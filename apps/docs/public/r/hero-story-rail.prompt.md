You are given a task to integrate a component from the **kinetik** motion library into this codebase.

# Hero — Story Rail (`hero-story-rail`)

Customer-story hero: centered headline over an endless rail of tall photo cards with brand marks; hover pauses the rail and zooms the card.

## What it should do
Build a customer-stories hero on black: centered H1, muted subtitle and two pill buttons (white solid + translucent). Below, an infinite rail of tall 192×240 rounded cards (photo or tinted radial fallback, 45% black overlay, brand mark centered, 'Visit site ›' at bottom) translating −50% over 40s. Hover pauses the rail and zooms the hovered photo 1.06 with expo-out.

## Project requirements
- React 19 + TypeScript, Tailwind CSS v4, shadcn/ui-style CSS variables (`background`, `foreground`, `muted`, `muted-foreground`, `border`, `card`, `primary`, `ring`). If the project lacks shadcn, set it up first (`npx shadcn@latest init`).
- Animation engine: **css**.
- No runtime dependencies (CSS only).
- Put the component at `components/kinetik/hero-story-rail.tsx`.
- `cn` lives at `lib/kinetik/utils.ts` (source below).
- Shared hooks go at `lib/kinetik/core.ts` (source below).

## Non-negotiables
- **Accessibility:** Duplicate rail items are aria-hidden and removed from tab order; hover pauses motion; reduced motion turns the rail into a static, scrollable row.
- **Performance:** Single translateX loop on one list; image zoom only on hover.
- Respect `prefers-reduced-motion` (replace movement with opacity or an instant change).
- Animate only transform / opacity / filter / clip-path. No hard-coded theme colors — use CSS variables so it works in light and dark.

## Source — components/kinetik/hero-story-rail.tsx
```tsx
"use client";
import { cn } from "@/lib/kinetik/core";

const css = `
.k-hsr .rail{animation:k-hsr-scroll 40s linear infinite}
.k-hsr:hover .rail{animation-play-state:paused}
@keyframes k-hsr-scroll{to{transform:translateX(-50%)}}
.k-hsr .card img,.k-hsr .card .ph{transition:transform .8s cubic-bezier(.16,1,.3,1)}
.k-hsr .card:hover img,.k-hsr .card:hover .ph{transform:scale(1.06)}
.k-hsr .in{animation:k-hsr-in .9s cubic-bezier(.16,1,.3,1) both;animation-delay:var(--d,0s)}
@keyframes k-hsr-in{from{opacity:0;transform:translateY(18px)}}
@media (prefers-reduced-motion:reduce){.k-hsr *{animation:none!important}.k-hsr .rail{overflow-x:auto}}
[data-reduce-motion] .k-hsr *{animation:none!important}`;

type Story = { brand: string; cta: string; image?: string };
const defaults: Story[] = [
  { brand: "▲ NORTHWIND", cta: "Read story" }, { brand: "≋ LUMEN LABS", cta: "Visit site" }, { brand: "Halcyon", cta: "Visit site" },
  { brand: "◐ ORBITAL", cta: "Read story" }, { brand: "Fernway", cta: "Visit site" }, { brand: "KITE/OS", cta: "Read story" },
];
const tints = ["#1e3a8a", "#065f46", "#7c2d12", "#4c1d95", "#164e63", "#831843"];

/** Customer-story hero: centered headline over an endless rail of tall photo cards with brand marks; hover pauses the rail and zooms the card. */
export function HeroStoryRail({ title = "Powering teams to move faster", subtitle = "From startups to enterprises, 144K companies in 194 countries build standout sites with us.", stories = defaults, images = [], className }: { title?: string; subtitle?: string; stories?: Story[]; images?: string[]; className?: string }) {
  const list = [...stories, ...stories];
  return (
    <section className={cn("k-hsr overflow-hidden bg-black py-12 text-white", className)}>
      <style href="k-hsr" precedence="kinetik">{css}</style>
      <div className="mx-auto max-w-xl px-6 text-center">
        <h1 className="in text-4xl leading-tight font-semibold tracking-tight sm:text-5xl">{title}</h1>
        <p className="in mt-3 text-sm text-white/60" style={{ ["--d" as string]: ".1s" }}>{subtitle}</p>
        <div className="in mt-5 flex justify-center gap-2 text-xs font-medium" style={{ ["--d" as string]: ".2s" }}>
          <a href="#" className="rounded-full bg-white px-3.5 py-1.5 text-black">Contact sales</a>
          <a href="#" className="rounded-full bg-white/10 px-3.5 py-1.5 hover:bg-white/20">Explore Enterprise</a>
        </div>
      </div>
      <div className="mt-10 overflow-hidden">
        <ul className="rail flex w-max gap-3 pr-3">
          {list.map((s, i) => {
            const img = images[i % stories.length] ?? images[i % Math.max(images.length, 1)];
            return (
              <li key={i} aria-hidden={i >= stories.length} className="card relative h-60 w-48 shrink-0 overflow-hidden rounded-xl border border-white/10">
                {img ? <img src={img} alt="" className="absolute inset-0 size-full object-cover" /> : <div className="ph absolute inset-0" style={{ background: `radial-gradient(circle at 30% 20%,${tints[i % tints.length]},#000 80%)` }} />}
                <div className="absolute inset-0 bg-black/45" />
                <p className="absolute inset-x-0 top-1/2 -translate-y-1/2 text-center text-lg font-bold tracking-tight">{s.brand}</p>
                <a href="#" tabIndex={i >= stories.length ? -1 : 0} className="absolute inset-x-0 bottom-4 text-center text-xs text-white/85">{s.cta} ›</a>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
```

## Usage example
```tsx
"use client";
import { HeroStoryRail } from "@/components/kinetik/hero-story-rail";
import { photos } from "@/components/kinetik/demo-helpers" /* or inline */;
export default function Demo() {
  return <HeroStoryRail className="h-full" images={photos} />;
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
