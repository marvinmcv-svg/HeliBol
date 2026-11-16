You are given a task to integrate a component from the **kinetik** motion library into this codebase.

# Hero — Model Number (`hero-model-number`)

Product-glamour hero: neon promo strip, a floating boxed header, and a moody machined e-bike close-up with a pulsing red lamp, a huge model number and a reserve line.

## What it should do
Recreate an e-bike glamour hero: neon-yellow promo strip with a dismiss ✕; a dark radial studio scene of a machined bike (SVG wheel, gradient tubes, saddle, a red tail-lamp pulsing with drop-shadow) settling from scale 1.12; a boxed translucent header (≡ wordmark bag) floating top-centre; a huge light model number (~19vw) sliding in bottom-left; blurb + boxed ↗ Explore at right; 'Reserve now for €150' bottom-right.

## Project requirements
- React 19 + TypeScript, Tailwind CSS v4, shadcn/ui-style CSS variables (`background`, `foreground`, `muted`, `muted-foreground`, `border`, `card`, `primary`, `ring`). If the project lacks shadcn, set it up first (`npx shadcn@latest init`).
- Animation engine: **css**.
- No runtime dependencies (CSS only).
- Put the component at `components/kinetik/hero-model-number.tsx`.
- `cn` lives at `lib/kinetik/utils.ts` (source below).
- Shared hooks go at `lib/kinetik/core.ts` (source below).

## Non-negotiables
- **Accessibility:** Real h1 (model number); promo copy is readable once (duplicates aria-hidden); reduced motion freezes lamp and strip.
- **Performance:** One SVG scene, a drop-shadow pulse and a marquee.
- Respect `prefers-reduced-motion` (replace movement with opacity or an instant change).
- Animate only transform / opacity / filter / clip-path. No hard-coded theme colors — use CSS variables so it works in light and dark.

## Source — components/kinetik/hero-model-number.tsx
```tsx
"use client";
import { cn } from "@/lib/kinetik/core";

const css = `
.k-hmn .lamp{animation:k-hmn-lamp 2.8s ease-in-out infinite}
@keyframes k-hmn-lamp{50%{filter:drop-shadow(0 0 26px #ff2b2b) brightness(1.3)}}
.k-hmn .num{animation:k-hmn-num 1.4s cubic-bezier(.16,1,.3,1) .2s both}
@keyframes k-hmn-num{from{opacity:0;transform:translateX(-12%)}}
.k-hmn .frame{animation:k-hmn-frame 2s cubic-bezier(.16,1,.3,1) both}
@keyframes k-hmn-frame{from{opacity:0;transform:scale(1.12) rotate(-2deg)}}
@media (prefers-reduced-motion:reduce){.k-hmn *{animation:none!important}}
[data-reduce-motion] .k-hmn *{animation:none!important}`;

/** Product-glamour hero: neon promo strip, a floating boxed header, and a moody machined e-bike close-up with a pulsing red lamp, a huge model number and a reserve line. */
export function HeroModelNumber({ model = "S6", brand = "VELOMOOV", promo = "Reserve the S6 by July 31 · Get 1 year of theft proof free · Use code 'RIDESECURE'", blurb = "The wait's over. Introducing our ultimate e-bike.", className }: { model?: string; brand?: string; promo?: string; blurb?: string; className?: string }) {
  return (
    <section className={cn("k-hmn flex flex-col overflow-hidden bg-white", className)}>
      <style href="k-hmn" precedence="kinetik">{css}</style>
      <div className="relative bg-[#ecff3c] py-1.5 text-center font-mono text-[10px] tracking-wider text-black uppercase">{promo}<button type="button" aria-label="Dismiss" className="absolute top-1/2 right-3 -translate-y-1/2">✕</button></div>
      <div className="relative mx-[0.5%] mb-[1.5%] flex-1 overflow-hidden bg-[radial-gradient(ellipse_at_55%_85%,#7a7a80_0,#3a3a3e_35%,#0f0f11_75%)] text-white">
        <svg aria-hidden viewBox="0 0 1440 800" className="frame absolute inset-0 size-full" preserveAspectRatio="xMidYMid slice">
          <defs>
            <linearGradient id="k-hmn-g" x1="0" x2="1"><stop offset="0" stopColor="#111113" /><stop offset=".45" stopColor="#56565c" /><stop offset=".55" stopColor="#6a6a70" /><stop offset="1" stopColor="#1a1a1d" /></linearGradient>
            <linearGradient id="k-hmn-s" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#2b2b2e" /><stop offset="1" stopColor="#0c0c0d" /></linearGradient>
          </defs>
          <circle cx="40" cy="560" r="460" fill="none" stroke="#0a0a0b" strokeWidth="60" />
          <circle cx="40" cy="560" r="400" fill="none" stroke="#1a1a1c" strokeWidth="3" />
          {Array.from({ length: 10 }, (_, i) => <path key={i} d={`M40 560 L ${40 + 400 * Math.cos(-0.2 - i * 0.16)} ${560 + 400 * Math.sin(-0.2 - i * 0.16)}`} stroke="#2a2a2d" strokeWidth="2" />)}
          <path d="M470 160 C 520 330, 600 520, 700 820" stroke="url(#k-hmn-g)" strokeWidth="90" fill="none" strokeLinecap="round" />
          <path d="M560 470 C 800 450, 1100 420, 1500 300" stroke="url(#k-hmn-g)" strokeWidth="60" fill="none" />
          <path d="M1100 430 C 1180 520, 1260 640, 1320 820" stroke="url(#k-hmn-g)" strokeWidth="34" fill="none" />
          <path d="M1250 150 C 1300 200, 1320 260, 1330 330" stroke="#1d1d20" strokeWidth="22" fill="none" strokeLinecap="round" />
          <ellipse cx="430" cy="110" rx="160" ry="85" fill="url(#k-hmn-s)" />
          <path d="M380 180 C 400 300, 470 330, 520 300" fill="none" stroke="#1a1a1c" strokeWidth="40" />
          <path className="lamp" d="M520 330 c 30 -14 66 6 58 40 c -7 28 -48 38 -72 18 c -18 -16 -12 -46 14 -58z" fill="#ff1f1f" />
        </svg>
        <header className="absolute top-[4%] left-1/2 flex w-[40%] min-w-56 -translate-x-1/2 items-center justify-between border border-white/15 bg-black/40 px-4 py-3.5 text-[13px] tracking-[.25em] backdrop-blur"><span aria-hidden>≡</span><span>{brand}</span><span aria-hidden>⛉</span></header>
        <h1 className="num absolute bottom-[12%] left-[9%] text-[clamp(6rem,19vw,18rem)] leading-[.8] font-normal tracking-[-.04em]">{model}</h1>
        <div className="absolute top-[39%] right-[7%] w-[15%] min-w-40 text-[clamp(.7rem,1.05vw,1rem)]">
          <p>{blurb}</p>
          <a href="#" className="mt-4 inline-flex items-center gap-2 transition-transform hover:translate-x-1"><span className="grid size-6 place-items-center border border-white/70 text-xs">↗</span>Explore</a>
        </div>
        <p className="absolute right-[2%] bottom-[5%] text-[clamp(.7rem,1.05vw,1rem)]">Reserve now for €150 ·</p>
      </div>
    </section>
  );
}
```

## Usage example
```tsx
"use client";
import { HeroModelNumber } from "@/components/kinetik/hero-model-number";
export default function Demo() {
  return <HeroModelNumber className="h-full" />;
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
