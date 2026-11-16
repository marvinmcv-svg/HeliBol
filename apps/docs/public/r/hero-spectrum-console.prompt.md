You are given a task to integrate a component from the **kinetik** motion library into this codebase.

# Hero — Spectrum Console (`hero-spectrum-console`)

Observability hero: email capture over a console mock flanked by equaliser-style log-volume bars that never stop moving.

## What it should do
Build an observability hero on #0b0b14 with an indigo radial glow: wide-tracked eyebrow, gradient-clipped H1, inline email form (input + glowing indigo button). Below, a console mock that rises with a slight rotateX, flanked by two banks of 14 equaliser bars (scaleY .15↔1, durations .6–1.5s, negative delays) so log volume feels alive; console rows flash a highlight in sequence.

## Project requirements
- React 19 + TypeScript, Tailwind CSS v4, shadcn/ui-style CSS variables (`background`, `foreground`, `muted`, `muted-foreground`, `border`, `card`, `primary`, `ring`). If the project lacks shadcn, set it up first (`npx shadcn@latest init`).
- Animation engine: **css**.
- No runtime dependencies (CSS only).
- Put the component at `components/kinetik/hero-spectrum-console.tsx`.
- `cn` lives at `lib/kinetik/utils.ts` (source below).
- Shared hooks go at `lib/kinetik/core.ts` (source below).

## Non-negotiables
- **Accessibility:** Labelled email input and real button; bars and console are aria-hidden; reduced motion freezes bars and highlights.
- **Performance:** 28 scaleY bars on compositor-only keyframes; one console row highlight loop.
- Respect `prefers-reduced-motion` (replace movement with opacity or an instant change).
- Animate only transform / opacity / filter / clip-path. No hard-coded theme colors — use CSS variables so it works in light and dark.

## Source — components/kinetik/hero-spectrum-console.tsx
```tsx
"use client";
import { cn } from "@/lib/kinetik/core";

const css = `
.k-hsc .bar{transform-origin:bottom;animation:k-hsc-eq var(--s) ease-in-out infinite alternate;animation-delay:var(--d)}
@keyframes k-hsc-eq{from{transform:scaleY(.15)}to{transform:scaleY(1)}}
.k-hsc .in{animation:k-hsc-in .9s cubic-bezier(.16,1,.3,1) both;animation-delay:var(--d,0s)}
@keyframes k-hsc-in{from{opacity:0;transform:translateY(14px)}}
.k-hsc .console{animation:k-hsc-rise 1.2s cubic-bezier(.16,1,.3,1) .45s both}
@keyframes k-hsc-rise{from{opacity:0;transform:perspective(900px) rotateX(18deg) translateY(50px)}}
.k-hsc .row{animation:k-hsc-row 3s steps(1) infinite;animation-delay:var(--d)}
@keyframes k-hsc-row{0%,100%{background:transparent}50%{background:#6366f122}}
@media (prefers-reduced-motion:reduce){.k-hsc *{animation:none!important}}
[data-reduce-motion] .k-hsc *{animation:none!important}`;

const seeded = (n: number) => Array.from({ length: n }, (_, i) => ({ h: 20 + ((i * 37) % 80), s: `${0.6 + ((i * 13) % 10) / 10}s`, d: `${-((i * 7) % 10) / 10}s` }));

/** Observability hero: email capture over a console mock flanked by equaliser-style log-volume bars that never stop moving. */
export function HeroSpectrumConsole({ eyebrow = "Log. Troubleshoot. Resolve.", title = "The fastest log search on the planet", className }: { eyebrow?: string; title?: string; className?: string }) {
  const bars = seeded(28);
  return (
    <section className={cn("k-hsc relative overflow-hidden bg-[#0b0b14] px-6 pt-12 text-white", className)}>
      <style href="k-hsc" precedence="kinetik">{css}</style>
      <div className="absolute inset-x-0 top-0 h-72 bg-[radial-gradient(ellipse_at_top,#312e8155,transparent_70%)]" aria-hidden />
      <div className="relative mx-auto max-w-xl text-center">
        <p className="in text-[11px] font-medium tracking-[.4em] text-indigo-300 uppercase">{eyebrow}</p>
        <h1 className="in mt-4 bg-gradient-to-b from-white to-white/60 bg-clip-text text-4xl font-semibold tracking-tight text-transparent sm:text-5xl" style={{ ["--d" as string]: ".08s" }}>{title}</h1>
        <form className="in mx-auto mt-6 flex max-w-md gap-2" style={{ ["--d" as string]: ".18s" }} onSubmit={(e) => e.preventDefault()}>
          <label className="sr-only" htmlFor="k-hsc-email">Work e-mail</label>
          <input id="k-hsc-email" type="email" placeholder="Your work e-mail" className="min-w-0 flex-1 rounded-lg border border-white/10 bg-white/5 px-3 py-2.5 text-sm outline-none placeholder:text-white/40 focus:border-indigo-400" />
          <button className="rounded-lg bg-indigo-500 px-4 text-sm font-medium shadow-[0_0_24px_#6366f188] hover:bg-indigo-400">Start in 30 seconds</button>
        </form>
      </div>
      <div aria-hidden className="relative mx-auto mt-10 flex max-w-4xl items-end gap-4">
        <div className="hidden h-36 flex-1 items-end gap-[3px] sm:flex">{bars.slice(0, 14).map((b, i) => <span key={i} className="bar w-full rounded-t-sm bg-gradient-to-t from-indigo-600/10 to-indigo-400" style={{ height: `${b.h}%`, ["--s" as string]: b.s, ["--d" as string]: b.d }} />)}</div>
        <div className="console w-full max-w-lg rounded-t-xl border border-white/10 bg-[#11111c] p-3 text-[10px] shadow-2xl sm:w-[60%]">
          <div className="mb-2 flex items-center gap-1.5"><span className="size-2 rounded-full bg-white/20" /><span className="size-2 rounded-full bg-white/20" /><span className="ml-2 text-white/50">Dashboards › Load balancer overview</span></div>
          {["GET /api/v1/search 200 12ms", "POST /ingest 202 4ms", "GET /health 200 1ms", "GET /api/v1/tail 200 9ms", "WARN slow query 812ms"].map((r, i) => <p key={r} className="row rounded px-1.5 py-1 font-mono text-white/70" style={{ ["--d" as string]: `${i * 0.6}s` }}>{r}</p>)}
        </div>
        <div className="hidden h-36 flex-1 items-end gap-[3px] sm:flex">{bars.slice(14).map((b, i) => <span key={i} className="bar w-full rounded-t-sm bg-gradient-to-t from-indigo-600/10 to-indigo-400" style={{ height: `${b.h}%`, ["--s" as string]: b.s, ["--d" as string]: b.d }} />)}</div>
      </div>
    </section>
  );
}
```

## Usage example
```tsx
"use client";
import { HeroSpectrumConsole } from "@/components/kinetik/hero-spectrum-console";
export default function Demo() {
  return <HeroSpectrumConsole className="h-full" />;
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
