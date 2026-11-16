You are given a task to integrate a component from the **kinetik** motion library into this codebase.

# Hero — Velocity Type (`hero-velocity-type`)

Sports/performance hero: speed-blur streaks behind giant masked headline lines, a hard-edged CTA and a logo rail.

## What it should do
Build a sports-performance hero on #1c1917: five horizontal blurred gradient streaks (18–60px tall, blur 6–22px) race left→right on 1.3–3.2s linear loops behind a left-to-right dark scrim. Bottom-left H1 of three giant uppercase lines (clamp 2.6–6.5rem, line-height .86, tracking −.04em); each line sits in overflow:hidden and slides up from 105% with expo-out, staggered 80ms. Bottom-right: tiny paragraph and an orange (#ff4d1a) two-part CTA (label block + arrow square that nudges right on hover). Below, a light logo rail scrolling −50% over 22s. Reduced motion: everything static.

## Project requirements
- React 19 + TypeScript, Tailwind CSS v4, shadcn/ui-style CSS variables (`background`, `foreground`, `muted`, `muted-foreground`, `border`, `card`, `primary`, `ring`). If the project lacks shadcn, set it up first (`npx shadcn@latest init`).
- Animation engine: **css**.
- No runtime dependencies (CSS only).
- Put the component at `components/kinetik/hero-velocity-type.tsx`.
- `cn` lives at `lib/kinetik/utils.ts` (source below).
- Shared hooks go at `lib/kinetik/core.ts` (source below).

## Non-negotiables
- **Accessibility:** Real h1 built from masked lines; the logo rail duplicates are aria-hidden; streaks, reveals and marquee stop under reduced motion.
- **Performance:** Five blurred streaks and one marquee, all transform-only CSS keyframes.
- Respect `prefers-reduced-motion` (replace movement with opacity or an instant change).
- Animate only transform / opacity / filter / clip-path. No hard-coded theme colors — use CSS variables so it works in light and dark.

## Source — components/kinetik/hero-velocity-type.tsx
```tsx
"use client";
import { cn } from "@/lib/kinetik/core";

const css = `
.k-hvt{--accent:#ff4d1a}
.k-hvt .streak{position:absolute;height:var(--h);top:var(--t);left:-60%;width:60%;border-radius:999px;background:linear-gradient(90deg,transparent,var(--c),transparent);filter:blur(var(--b));animation:k-hvt-streak var(--s) linear infinite;animation-delay:var(--d)}
@keyframes k-hvt-streak{to{transform:translateX(280%)}}
.k-hvt .line{display:block;overflow:hidden}
.k-hvt .line>span{display:block;animation:k-hvt-up .9s cubic-bezier(.16,1,.3,1) both;animation-delay:var(--d)}
@keyframes k-hvt-up{from{transform:translateY(105%)}}
.k-hvt .fade{animation:k-hvt-fade .8s ease-out both;animation-delay:var(--d)}
@keyframes k-hvt-fade{from{opacity:0;transform:translateY(12px)}}
.k-hvt .logos{animation:k-hvt-marquee 22s linear infinite}
@keyframes k-hvt-marquee{to{transform:translateX(-50%)}}
@media (prefers-reduced-motion:reduce){.k-hvt *{animation:none!important}}
[data-reduce-motion] .k-hvt *{animation:none!important}`;

const streaks = [
  { t: "18%", h: "38px", c: "#3f6212", b: "18px", s: "2.6s", d: "0s" },
  { t: "34%", h: "14px", c: "#d9f99d", b: "8px", s: "1.7s", d: "-.6s" },
  { t: "52%", h: "60px", c: "#57534e", b: "22px", s: "3.2s", d: "-1.4s" },
  { t: "66%", h: "10px", c: "#fafaf9", b: "6px", s: "1.3s", d: "-.2s" },
  { t: "78%", h: "44px", c: "#365314", b: "20px", s: "2.2s", d: "-1s" },
];

/** Sports/performance hero: speed-blur streaks behind giant masked headline lines, a hard-edged CTA and a logo rail. */
export function HeroVelocityType({ lines = ["Unlock", "next level", "performance"], logos = ["NORTHSIDE FC", "VOLT", "TENNIS CLUB", "ARCTIC", "HALFTIME", "PRO LEAGUE"], className }: { lines?: string[]; logos?: string[]; className?: string }) {
  return (
    <section className={cn("k-hvt relative isolate flex flex-col overflow-hidden bg-[#1c1917] text-white", className)}>
      <style href="k-hvt" precedence="kinetik">{css}</style>
      <div aria-hidden className="absolute inset-0 -z-10 overflow-hidden">
        {streaks.map((s, i) => <span key={i} className="streak" style={{ ["--t" as string]: s.t, ["--h" as string]: s.h, ["--c" as string]: s.c, ["--b" as string]: s.b, ["--s" as string]: s.s, ["--d" as string]: s.d }} />)}
        <div className="absolute inset-0 bg-gradient-to-r from-[#1c1917] via-[#1c1917]/70 to-transparent" />
      </div>
      <div className="flex flex-1 flex-wrap items-end justify-between gap-8 px-6 pt-14 pb-8 sm:px-10">
        <h1 className="text-[clamp(2.6rem,9vw,6.5rem)] leading-[.86] font-bold tracking-[-.04em] uppercase">
          {lines.map((l, i) => <span key={l} className="line"><span style={{ ["--d" as string]: `${0.08 * i}s` }}>{l}</span></span>)}
        </h1>
        <div className="fade max-w-56 pb-2" style={{ ["--d" as string]: ".45s" }}>
          <p className="text-xs leading-relaxed text-white/70">Elite diagnostics, personalised training and advanced therapy — whether you go pro or just get started.</p>
          <a href="#" className="mt-5 inline-flex text-[11px] font-semibold tracking-widest uppercase">
            <span className="bg-[var(--accent)] px-4 py-3">Unlock your potential</span>
            <span className="ml-px grid w-10 place-items-center bg-[var(--accent)] transition-transform hover:translate-x-1">→</span>
          </a>
        </div>
      </div>
      <div className="overflow-hidden border-t border-black/10 bg-[#f5f5f4] py-4 text-zinc-900">
        <div className="logos flex w-max gap-14 pr-14 text-sm font-black tracking-tight">
          {[...logos, ...logos].map((l, i) => <span key={i} aria-hidden={i >= logos.length}>{l}</span>)}
        </div>
      </div>
    </section>
  );
}
```

## Usage example
```tsx
"use client";
import { HeroVelocityType } from "@/components/kinetik/hero-velocity-type";
export default function Demo() {
  return <HeroVelocityType className="h-full" />;
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
