You are given a task to integrate a component from the **kinetik** motion library into this codebase.

# Scroll Image Sequence (`gsap-image-sequence`)

Apple-style product spin: a pinned canvas paints frame N of a sequence as you scroll. Works with real frame URLs or a procedural painter.

## What it should do
Create a scroll image sequence: section length·100vh with a sticky canvas; preload frames as Image objects; gsap.to(seq, { frame: frames−1, snap: 'frame', ease: none, scrollTrigger: { start top top, end bottom bottom, scrub .5 }, onUpdate: paint }) where paint draws the frame cover-fitted into a DPR-scaled canvas, only when the frame index changed.

## Project requirements
- React 19 + TypeScript, Tailwind CSS v4, shadcn/ui-style CSS variables (`background`, `foreground`, `muted`, `muted-foreground`, `border`, `card`, `primary`, `ring`). If the project lacks shadcn, set it up first (`npx shadcn@latest init`).
- Animation engine: **gsap**.
- Install dependencies: `npm i gsap @gsap/react`
- Put the component at `components/kinetik/gsap-image-sequence.tsx`.
- `cn` lives at `lib/kinetik/utils.ts` (source below).
- Shared hooks go at `lib/kinetik/core.ts` (source below).

## Non-negotiables
- **Accessibility:** Canvas is aria-hidden; put the message in real text children. Reduced motion shows the last frame, unpinned.
- **Performance:** Frames preloaded; tween a { frame } object with snap; repaint only when the frame number changes; DPR capped at 2.
- Respect `prefers-reduced-motion` (replace movement with opacity or an instant change).
- Animate only transform / opacity / filter / clip-path. No hard-coded theme colors — use CSS variables so it works in light and dark.

## Source — components/kinetik/gsap-image-sequence.tsx
```tsx
"use client";
import { useEffect, useRef, type ReactNode, type RefObject } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { cn, useReducedMotion } from "@/lib/kinetik/core";

gsap.registerPlugin(ScrollTrigger, useGSAP);

export interface GsapImageSequenceProps {
  /** Frame count. */
  frames: number;
  /** Returns the URL of frame i — or omit and pass `draw` to paint frames procedurally. */
  frameUrl?: (i: number) => string;
  /** Procedural painter (used by the demo; handy for generative sequences). */
  draw?: (ctx: CanvasRenderingContext2D, frame: number, w: number, h: number) => void;
  scroller?: RefObject<HTMLElement | null>;
  /** Scroll length in viewport heights. */
  length?: number;
  children?: ReactNode;
  className?: string;
}

/**
 * Apple-style scroll-scrubbed image sequence: a pinned canvas paints frame
 * round(progress × (frames − 1)) — tweening a plain { frame } object with scrub so it eases
 * between scroll positions. Frames are preloaded as Image objects; only one draw per change.
 */
export function GsapImageSequence({ frames, frameUrl, draw, scroller, length = 3, children, className }: GsapImageSequenceProps) {
  const section = useRef<HTMLElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const images = useRef<HTMLImageElement[]>([]);
  const current = useRef(0);
  const reduced = useReducedMotion();

  const paint = (i: number) => {
    const c = canvas.current;
    const ctx = c?.getContext("2d");
    if (!c || !ctx) return;
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    const w = c.clientWidth;
    const h = c.clientHeight;
    if (c.width !== Math.round(w * dpr)) {
      c.width = Math.round(w * dpr);
      c.height = Math.round(h * dpr);
    }
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    if (draw) return draw(ctx, i, w, h);
    const img = images.current[i];
    if (!img?.complete) return;
    const s = Math.max(w / img.naturalWidth, h / img.naturalHeight);
    ctx.clearRect(0, 0, w, h);
    ctx.drawImage(img, (w - img.naturalWidth * s) / 2, (h - img.naturalHeight * s) / 2, img.naturalWidth * s, img.naturalHeight * s);
  };

  useEffect(() => {
    if (!frameUrl) return;
    images.current = Array.from({ length: frames }, (_, i) => {
      const im = new Image();
      im.src = frameUrl(i);
      if (i === 0) im.onload = () => paint(0);
      return im;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [frames, frameUrl]);

  useGSAP(
    () => {
      paint(reduced ? frames - 1 : 0);
      if (reduced) return;
      const seq = { frame: 0 };
      gsap.to(seq, {
        frame: frames - 1,
        snap: "frame",
        ease: "none",
        onUpdate: () => {
          if (seq.frame !== current.current) {
            current.current = seq.frame;
            paint(seq.frame);
          }
        },
        scrollTrigger: { trigger: section.current, scroller: scroller?.current ?? undefined, start: "top top", end: "bottom bottom", scrub: 0.5 },
      });
    },
    { scope: section, dependencies: [reduced, frames] },
  );

  return (
    <section ref={section} className={cn("relative", className)} style={{ height: reduced ? "100cqh" : `${length * 100}cqh` }}>
      <div className="sticky top-0 h-[100cqh] overflow-hidden">
        <canvas ref={canvas} className="absolute inset-0 h-full w-full" aria-hidden />
        <div className="relative h-full">{children}</div>
      </div>
    </section>
  );
}
```

## Usage example
```tsx
"use client";
import { DemoScroller, useDemoScroller } from "@/components/kinetik/demo-helpers" /* or inline */;
import { GsapImageSequence } from "@/components/kinetik/gsap-image-sequence";

const FRAMES = 120;

/** Procedural "product spin": a glossy ring rotating and opening up, frame by frame. */
function draw(ctx: CanvasRenderingContext2D, f: number, w: number, h: number) {
  const t = f / (FRAMES - 1);
  const g = ctx.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, Math.max(w, h) * 0.7);
  g.addColorStop(0, `hsl(${260 + t * 60} 60% 16%)`);
  g.addColorStop(1, "#05050a");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, w, h);
  const cx = w / 2;
  const cy = h / 2;
  const R = Math.min(w, h) * (0.22 + t * 0.08);
  for (let i = 0; i < 36; i++) {
    const a = (i / 36) * Math.PI * 2 + t * Math.PI * 2;
    const tilt = Math.cos(t * Math.PI) * 0.85;
    const x = cx + Math.cos(a) * R;
    const y = cy + Math.sin(a) * R * Math.abs(tilt);
    const z = Math.sin(a);
    const r = 6 + (z + 1) * 6 + t * 6;
    ctx.beginPath();
    ctx.fillStyle = `hsla(${(i * 10 + t * 200) % 360} 85% ${50 + z * 15}% / ${0.55 + (z + 1) * 0.2})`;
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  }
}

function Inner() {
  const s = useDemoScroller() ?? undefined;
  return (
    <GsapImageSequence frames={FRAMES} draw={draw} scroller={s} length={3}>
      <div className="flex h-full flex-col justify-end p-6 text-white">
        <p className="text-[10px] uppercase tracking-[0.3em] opacity-60">Image sequence · 120 frames</p>
        <h3 className="text-3xl font-semibold tracking-tight">Scroll scrubs every frame.</h3>
      </div>
    </GsapImageSequence>
  );
}

export default function Demo() {
  return (
    <DemoScroller>
      <Inner />
    </DemoScroller>
  );
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
