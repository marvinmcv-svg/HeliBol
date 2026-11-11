You are given a task to integrate a block from the **kinetik** motion library into this codebase.

# Hero — Ink Reveal (`hero-ink-reveal`)

Editorial hero where the cursor paints blooming, wobbly ink blots that bleed colour into a monochrome photo; blots spread then slowly dry away. Click to spill more.

## What it should do
Build an ink-reveal hero: a grayscale photo with a canvas above it. On pointermove (every 18 px) push a blot {x,y,r→max 40–90 px, life}; each frame grow r toward max, decay life, draw a wobbly radial-gradient shape, then set globalCompositeOperation='source-in' and draw the colour photo (object-cover maths) so colour only shows inside the ink. Click adds six big blots. A cream gradient keeps the left-hand copy readable.

## Project requirements
- React 19 + TypeScript, Tailwind CSS v4, shadcn/ui-style CSS variables (`background`, `foreground`, `muted`, `muted-foreground`, `border`, `card`, `primary`, `ring`). If the project lacks shadcn, set it up first (`npx shadcn@latest init`).
- Animation engine: **canvas**.
- No runtime dependencies (CSS only).
- Put the component at `components/kinetik/hero-ink-reveal.tsx`.
- `cn` lives at `lib/kinetik/utils.ts` (source below).
- Shared hooks go at `lib/kinetik/core.ts` (source below).

## Non-negotiables
- **Accessibility:** Canvas is aria-hidden; copy and CTA are real HTML. Touch and reduced motion show the full-colour image with no effect.
- **Performance:** Single canvas; blots expire, image composited with source-in once per frame; DPR capped at 2.
- Respect `prefers-reduced-motion` (replace movement with opacity or an instant change).
- Animate only transform / opacity / filter / clip-path. No hard-coded theme colors — use CSS variables so it works in light and dark.

## Source — components/kinetik/hero-ink-reveal.tsx
```tsx
"use client";
import { useEffect, useRef } from "react";
import { usePrefersTouch, useReducedMotion } from "@/lib/kinetik/core";

/**
 * Ink reveal hero: moving the cursor paints soft, blooming ink blots that reveal a second image
 * (colour) through the first (monochrome). Blots spread, then slowly dry away. The mask is a
 * canvas used as CSS mask-image via a data URL-free approach: the colour photo is drawn into the
 * canvas with "source-in" compositing.
 */
export function HeroInkReveal({ base = "/demo/photo-2.jpg", reveal = "/demo/photo-2.jpg" }: { base?: string; reveal?: string }) {
  const reduced = useReducedMotion();
  const touch = usePrefersTouch();
  const wrap = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const el = wrap.current, c = canvas.current;
    const ctx = c?.getContext("2d");
    if (!el || !c || !ctx) return;
    const img = new Image();
    img.src = reveal;
    const blots: { x: number; y: number; r: number; max: number; life: number }[] = [];
    let w = 0, h = 0, raf = 0, last: { x: number; y: number } | null = null;
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    const resize = () => { w = el.clientWidth; h = el.clientHeight; c.width = w * dpr; c.height = h * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0); };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(el);

    const add = (x: number, y: number, big = 1) => blots.push({ x: x + (Math.random() - 0.5) * 20, y: y + (Math.random() - 0.5) * 20, r: 4, max: (40 + Math.random() * 50) * big, life: 1 });
    const move = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      const p = { x: e.clientX - r.left, y: e.clientY - r.top };
      const dist = last ? Math.hypot(p.x - last.x, p.y - last.y) : 999;
      if (dist > 18) { add(p.x, p.y); last = p; }
    };
    const down = (e: PointerEvent) => { const r = el.getBoundingClientRect(); for (let i = 0; i < 6; i++) add(e.clientX - r.left, e.clientY - r.top, 1.8); };

    const cover = (iw: number, ih: number) => { const s = Math.max(w / iw, h / ih); return [(w - iw * s) / 2, (h - ih * s) / 2, iw * s, ih * s] as const; };
    const frame = () => {
      ctx.clearRect(0, 0, w, h);
      ctx.globalCompositeOperation = "source-over";
      for (let i = blots.length - 1; i >= 0; i--) {
        const b = blots[i];
        b.r += (b.max - b.r) * 0.08; // bloom
        b.life -= 0.0045; // dry
        if (b.life <= 0) { blots.splice(i, 1); continue; }
        const g = ctx.createRadialGradient(b.x, b.y, 0, b.x, b.y, b.r);
        g.addColorStop(0, `rgba(0,0,0,${Math.min(1, b.life * 1.4)})`);
        g.addColorStop(0.7, `rgba(0,0,0,${b.life * 0.8})`);
        g.addColorStop(1, "rgba(0,0,0,0)");
        ctx.fillStyle = g;
        ctx.beginPath();
        // wobbly ink edge
        for (let a = 0; a <= Math.PI * 2 + 0.01; a += Math.PI / 10) {
          const rr = b.r * (0.85 + 0.15 * Math.sin(a * 3 + b.x));
          ctx[a === 0 ? "moveTo" : "lineTo"](b.x + Math.cos(a) * rr, b.y + Math.sin(a) * rr);
        }
        ctx.fill();
      }
      if (img.complete && img.naturalWidth) {
        ctx.globalCompositeOperation = "source-in";
        ctx.drawImage(img, ...cover(img.naturalWidth, img.naturalHeight));
      }
      raf = requestAnimationFrame(frame);
    };
    if (!reduced && !touch) {
      el.addEventListener("pointermove", move);
      el.addEventListener("pointerdown", down);
      raf = requestAnimationFrame(frame);
    }
    return () => { cancelAnimationFrame(raf); ro.disconnect(); el.removeEventListener("pointermove", move); el.removeEventListener("pointerdown", down); };
  }, [reveal, reduced, touch]);

  return (
    <section ref={wrap} className="relative h-full min-h-[520px] overflow-hidden rounded-[2rem] bg-[#f3efe7] text-zinc-900">
      {/* base: monochrome. Under reduced motion / touch the colour image simply shows. */}
      <img src={base} alt="" className="absolute inset-0 size-full object-cover" style={{ filter: reduced || touch ? "none" : "grayscale(1) contrast(1.1) brightness(1.08)" }} />
      <canvas ref={canvas} aria-hidden className="pointer-events-none absolute inset-0 size-full" />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-[#f3efe7] via-[#f3efe7]/70 to-transparent" />
      <div className="relative flex h-full max-w-xl flex-col justify-center p-8 sm:p-12">
        <p className="text-xs uppercase tracking-[0.3em] text-zinc-500">Ink & Field — Studio</p>
        <h1 className="mt-4 font-serif text-[clamp(2.6rem,6vw,4.6rem)] leading-[0.95] tracking-tight">Colour is<br /><em className="text-violet-700">earned.</em></h1>
        <p className="mt-5 max-w-sm text-zinc-600">Move across the image to bleed colour into it. Click to spill more.</p>
        <a href="#work" className="pointer-events-auto mt-8 w-fit rounded-full bg-zinc-900 px-5 py-2.5 text-sm font-medium text-white">See the series</a>
      </div>
    </section>
  );
}
```

## Usage example
```tsx
"use client";
import { HeroInkReveal } from "@/components/kinetik/hero-ink-reveal";
export default function Demo() {
  return <div className="h-full p-3"><HeroInkReveal base="/demo/photo-4.jpg" reveal="/demo/photo-4.jpg" /></div>;
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
