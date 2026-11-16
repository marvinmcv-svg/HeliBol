You are given a task to integrate a component from the **kinetik** motion library into this codebase.

# Hero — Velocity Type (`hero-velocity-type`)

Sports-performance hero: thin mono nav, a motion-blurred action photo with giant stacked uppercase lines, an orange split CTA, a logo strip and the intro statement below.

## What it should do
Recreate a sports-performance landing hero: thin mono uppercase nav (wordmark left, 5 links centre, orange 'Book a consultation ↗' right); a full-width motion-blurred action photo with blurred light streaks racing across; bottom-left three giant stacked uppercase lines (Inter Tight 500, ~9vw, leading .84, tracking −.045em) that slide up out of masks staggered 100ms; right column small paragraph + orange two-part CTA (label block + arrow square). Below: a light-grey logo strip marquee, then a white section with a mono eyebrow, a large centered statement and two small image blocks.

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

const FONT = "https://fonts.googleapis.com/css2?family=Inter+Tight:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap";
const css = `
.k-hvt{font-family:"Inter Tight",ui-sans-serif,system-ui,sans-serif}
.k-hvt .mono{font-family:"JetBrains Mono",ui-monospace,monospace}
.k-hvt .photo{animation:k-hvt-pan 14s ease-in-out infinite alternate}
@keyframes k-hvt-pan{to{transform:scale(1.12) translateX(-3%)}}
.k-hvt .streak{position:absolute;left:-40%;width:45%;border-radius:999px;filter:blur(14px);animation:k-hvt-streak var(--s) linear infinite;animation-delay:var(--d)}
@keyframes k-hvt-streak{to{transform:translateX(330%)}}
.k-hvt .line{display:block;overflow:hidden}
.k-hvt .line>span{display:block;animation:k-hvt-up 1s cubic-bezier(.16,1,.3,1) both;animation-delay:var(--d)}
@keyframes k-hvt-up{from{transform:translateY(100%)}}
.k-hvt .logos{animation:k-hvt-marquee 26s linear infinite}
@keyframes k-hvt-marquee{to{transform:translateX(-50%)}}
@media (prefers-reduced-motion:reduce){.k-hvt *{animation:none!important}}
[data-reduce-motion] .k-hvt *{animation:none!important}`;

const logos = ["NORTHSIDE FC", "◎", "TENNIS CLUB", "✦", "HALFTIME", "◈", "ARCTIC", "▲", "PRO LEAGUE", "⬡", "NORTHSIDE FC", "◎"];

/** Sports-performance hero: thin mono nav, a motion-blurred action photo with giant stacked uppercase lines, an orange split CTA, a logo strip and the intro statement below. */
export function HeroVelocityType({ lines = ["Unlock", "next level", "performance"], image, className }: { lines?: string[]; image?: string; className?: string }) {
  return (
    <section className={cn("k-hvt flex flex-col overflow-hidden bg-white text-[#111]", className)}>
      <link rel="stylesheet" href={FONT} precedence="kinetik-font" />
      <style href="k-hvt" precedence="kinetik">{css}</style>
      <nav className="mono flex items-center justify-between px-5 py-2.5 text-[11px] tracking-wide uppercase">
        <span className="font-medium">The Kinet◘c Lab</span>
        <span className="hidden gap-8 lg:flex"><a href="#">Home</a><a href="#">Who we are</a><a href="#">Blog</a><a href="#">Contact</a><a href="#" className="ml-10">Services +</a></span>
        <a href="#" className="text-[#ff4a1c]">Book a consultation ↗</a>
      </nav>
      <div className="relative isolate shrink-0 overflow-hidden bg-[#1e1d1a] text-white">
        <div aria-hidden className="photo absolute inset-0 -z-10" style={{ background: image ? `center/cover url(${image})` : "linear-gradient(100deg,#272622 0%,#3b3a2e 35%,#6f6a4a 55%,#2c2b26 80%)", filter: "blur(3px) saturate(.8)" }} />
        <div aria-hidden className="absolute inset-0 -z-10">
          {[["22%", "70px", "#c8d84a66", "2.8s", "0s"], ["48%", "40px", "#ffffff33", "1.9s", "-.8s"], ["70%", "90px", "#9aa63a55", "3.4s", "-1.6s"]].map(([t, h, c, s, d], i) => <span key={i} className="streak" style={{ top: t, height: h, background: `linear-gradient(90deg,transparent,${c},transparent)`, ["--s" as string]: s, ["--d" as string]: d }} />)}
          <div className="absolute inset-0 bg-gradient-to-r from-black/45 via-black/20 to-black/30" />
        </div>
        <div className="flex items-end justify-between gap-10 pt-12 pr-12 pb-6">
          <h1 className="-ml-[0.06em] text-[clamp(3.5rem,9.6vw,9rem)] leading-[.84] font-medium tracking-[-.045em] uppercase">
            {lines.map((l, i) => <span key={l} className="line"><span style={{ ["--d" as string]: `${0.1 * i}s` }}>{l}</span></span>)}
          </h1>
          <div className="mb-8 hidden w-[22%] shrink-0 lg:block">
            <p className="text-[13px] leading-snug text-white/80">The Kinetic Lab specializes in elite diagnostics, personalized training, and advanced therapy to help you reach your physical peak — whether you're a professional athlete or just getting started.</p>
            <a href="#" className="mono mt-12 inline-flex text-[11px] tracking-wider uppercase">
              <span className="bg-[#ff4a1c] px-5 py-4">Unlock your potential</span>
              <span className="ml-1 grid w-12 place-items-center bg-[#ff4a1c] transition-transform hover:translate-x-1">→</span>
            </a>
          </div>
        </div>
      </div>
      <div className="shrink-0 overflow-hidden bg-[#efefef] py-6">
        <div aria-hidden className="logos flex w-max items-center gap-24 pr-24 text-2xl font-semibold tracking-tight text-black">{[...logos, ...logos].map((l, i) => <span key={i}>{l}</span>)}</div>
      </div>
      <div className="relative min-h-40 flex-1 bg-white px-6 pt-[13%] text-center">
        <div aria-hidden className="absolute top-[8%] left-[71.5%] aspect-square w-[10.7%] bg-[radial-gradient(circle_at_60%_55%,#ddd,#222_35%,#050505_70%)]" />
        <div aria-hidden className="absolute bottom-0 left-[3%] h-[14%] w-[17.6%] bg-gradient-to-r from-[#3a4a2e] to-[#6a6a52]" />
        <p className="mono text-[10px] tracking-widest text-zinc-400 uppercase">What is the Kinetic Lab</p>
        <h2 className="mx-auto mt-5 max-w-4xl text-[clamp(2rem,4.4vw,4rem)] leading-[1.02] font-medium tracking-[-.035em]">Helping you move better, recover smarter, and perform at your best</h2>
      </div>
    </section>
  );
}
```

## Usage example
```tsx
"use client";
import { photos } from "@/components/kinetik/demo-helpers" /* or inline */;
import { HeroVelocityType } from "@/components/kinetik/hero-velocity-type";
export default function Demo() {
  return <HeroVelocityType className="h-full" image={photos[4]} />;
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
