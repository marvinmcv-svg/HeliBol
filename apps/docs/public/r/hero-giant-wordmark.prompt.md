You are given a task to integrate a component from the **kinetik** motion library into this codebase.

# Hero — Giant Wordmark (`hero-giant-wordmark`)

Brand hero inverted: a white rounded card holds the serif pitch and link columns, while a colossal serif wordmark rises letter by letter out of the sky below.

## What it should do
Build an inverted brand hero: a white card with 32px bottom radius holds a serif H1 with an italic second line, a black CTA and three link columns; below, on a pale-blue sky gradient that slowly shifts, a colossal white serif wordmark (≈26vw) rises letter by letter from 70% with 80ms stagger.

## Project requirements
- React 19 + TypeScript, Tailwind CSS v4, shadcn/ui-style CSS variables (`background`, `foreground`, `muted`, `muted-foreground`, `border`, `card`, `primary`, `ring`). If the project lacks shadcn, set it up first (`npx shadcn@latest init`).
- Animation engine: **css**.
- No runtime dependencies (CSS only).
- Put the component at `components/kinetik/hero-giant-wordmark.tsx`.
- `cn` lives at `lib/kinetik/utils.ts` (source below).
- Shared hooks go at `lib/kinetik/core.ts` (source below).

## Non-negotiables
- **Accessibility:** h1 is the serif pitch; wordmark has aria-label with letters aria-hidden; reduced motion stops letter rise and sky drift.
- **Performance:** Per-letter CSS transforms; background-position loop.
- Respect `prefers-reduced-motion` (replace movement with opacity or an instant change).
- Animate only transform / opacity / filter / clip-path. No hard-coded theme colors — use CSS variables so it works in light and dark.

## Source — components/kinetik/hero-giant-wordmark.tsx
```tsx
"use client";
import { cn } from "@/lib/kinetik/core";

const css = `
.k-hgw .ch{display:inline-block;animation:k-hgw-rise 1.3s cubic-bezier(.16,1,.3,1) both;animation-delay:calc(.3s + var(--i)*80ms)}
@keyframes k-hgw-rise{from{transform:translateY(70%);opacity:0}}
.k-hgw .card{animation:k-hgw-card 1s cubic-bezier(.16,1,.3,1) both}
@keyframes k-hgw-card{from{transform:translateY(-30px);opacity:0}}
.k-hgw .sky{animation:k-hgw-sky 12s ease-in-out infinite alternate}
@keyframes k-hgw-sky{to{background-position:0 100%}}
@media (prefers-reduced-motion:reduce){.k-hgw *{animation:none!important}}
[data-reduce-motion] .k-hgw *{animation:none!important}`;

/** Brand hero inverted: a white rounded card holds the serif pitch and link columns, while a colossal serif wordmark rises letter by letter out of the sky below. */
export function HeroGiantWordmark({ word = "Willow", line = "AI that runs the", italic = "doctor's office", className }: { word?: string; line?: string; italic?: string; className?: string }) {
  const cols: [string, string[]][] = [["Company", ["Call us", "Careers", "Blog"]], ["Socials", ["Instagram", "X", "LinkedIn"]], ["Legal", ["Privacy", "Terms"]]];
  return (
    <section className={cn("k-hgw sky relative overflow-hidden text-[#111]", className)} style={{ background: "linear-gradient(180deg,#bfe3f2,#7cc3e0 50%,#a9d8ec)", backgroundSize: "100% 200%" }}>
      <style href="k-hgw" precedence="kinetik">{css}</style>
      <div className="card relative z-10 grid gap-8 rounded-b-[32px] bg-white px-8 pt-8 pb-12 md:grid-cols-[1.2fr_1fr]">
        <div>
          <h1 className="font-serif text-4xl leading-[1.05] tracking-tight">{line} <em className="block">{italic}</em></h1>
          <a href="#" className="mt-5 inline-block rounded-md bg-[#111] px-3 py-2 text-xs text-white">Get started</a>
        </div>
        <nav className="grid grid-cols-3 gap-4 text-xs">
          {cols.map(([h, ls]) => <div key={h}><p className="mb-2 text-zinc-500">{h}</p>{ls.map((l) => <a key={l} href="#" className="block py-0.5 hover:underline">{l}</a>)}</div>)}
        </nav>
      </div>
      <p aria-label={word} className="-mt-6 text-center font-serif text-[clamp(6rem,26vw,15rem)] leading-[.85] tracking-tight text-white select-none [text-shadow:0_10px_40px_#2b7ea433]">
        {[...word].map((c, i) => <span key={i} aria-hidden className="ch" style={{ ["--i" as string]: i }}>{c}</span>)}
      </p>
    </section>
  );
}
```

## Usage example
```tsx
"use client";
import { HeroGiantWordmark } from "@/components/kinetik/hero-giant-wordmark";
export default function Demo() {
  return <HeroGiantWordmark className="h-full" />;
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
