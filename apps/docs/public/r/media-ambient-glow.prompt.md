You are given a task to integrate a component from the **kinetik** motion library into this codebase.

# Ambient Glow Media (`media-ambient-glow`)

YouTube-style ambient mode: the image or video is drawn into a tiny canvas behind itself, scaled and blurred, so its own colours spill around the frame.

## What it should do
Build an ambient glow wrapper: a 32×18 canvas absolutely positioned behind the media (scale 1.1, blur-3xl, saturate 150%). Draw the media into it with drawImage — once on image load, or every ~160 ms for video. Media must be same-origin or crossOrigin=anonymous.

## Project requirements
- React 19 + TypeScript, Tailwind CSS v4, shadcn/ui-style CSS variables (`background`, `foreground`, `muted`, `muted-foreground`, `border`, `card`, `primary`, `ring`). If the project lacks shadcn, set it up first (`npx shadcn@latest init`).
- Animation engine: **canvas**.
- No runtime dependencies (CSS only).
- Put the component at `components/kinetik/media-ambient-glow.tsx`.
- `cn` lives at `lib/kinetik/utils.ts` (source below).
- Shared hooks go at `lib/kinetik/core.ts` (source below).

## Non-negotiables
- **Accessibility:** Glow canvas is aria-hidden; video is muted. Reduced motion: video doesn't autoplay and the glow doesn't resample.
- **Performance:** 32×18 canvas resampled at ~6 fps for video, once for images; the blur is a CSS filter on a tiny bitmap.
- Respect `prefers-reduced-motion` (replace movement with opacity or an instant change).
- Animate only transform / opacity / filter / clip-path. No hard-coded theme colors — use CSS variables so it works in light and dark.

## Source — components/kinetik/media-ambient-glow.tsx
```tsx
"use client";
import { useEffect, useRef, type ReactNode } from "react";
import { cn, useReducedMotion } from "@/lib/kinetik/core";

export interface MediaAmbientGlowProps {
  /** An image URL or a playing <video> element's src. */
  src: string;
  kind?: "image" | "video";
  /** Glow strength 0–1. */
  intensity?: number;
  className?: string;
  children?: ReactNode;
}

/**
 * YouTube-style "ambient mode": the media is drawn into a tiny canvas behind itself, scaled up and
 * blurred, so its own colours spill around the frame. For video the glow resamples a few times per
 * second (cheap — a 32×18 canvas); images sample once.
 */
export function MediaAmbientGlow({ src, kind = "image", intensity = 0.8, className, children }: MediaAmbientGlowProps) {
  const reduced = useReducedMotion();
  const canvas = useRef<HTMLCanvasElement>(null);
  const media = useRef<HTMLImageElement & HTMLVideoElement>(null);

  useEffect(() => {
    const c = canvas.current, m = media.current;
    const ctx = c?.getContext("2d");
    if (!c || !m || !ctx) return;
    const draw = () => {
      try {
        ctx.drawImage(m, 0, 0, c.width, c.height);
      } catch {
        /* not ready or cross-origin */
      }
    };
    if (kind === "image") {
      if ((m as HTMLImageElement).complete) draw();
      m.addEventListener("load", draw);
      return () => m.removeEventListener("load", draw);
    }
    // video: resample at ~6 fps; a crossfade via CSS transition smooths the steps
    draw();
    if (reduced) return;
    const id = setInterval(draw, 160);
    return () => clearInterval(id);
  }, [src, kind, reduced]);

  return (
    <div className={cn("relative isolate", className)}>
      <canvas
        ref={canvas}
        width={32}
        height={18}
        aria-hidden
        className="absolute inset-0 -z-10 size-full scale-110 blur-3xl saturate-150 transition-opacity duration-700"
        style={{ opacity: intensity }}
      />
      {kind === "video" ? (
        <video ref={media} src={src} autoPlay={!reduced} muted loop playsInline crossOrigin="anonymous" className="relative block size-full rounded-2xl object-cover" />
      ) : (
        <img ref={media} src={src} alt="" crossOrigin="anonymous" className="relative block size-full rounded-2xl object-cover" />
      )}
      {children}
    </div>
  );
}
```

## Usage example
```tsx
"use client";
import { useState } from "react";
import { photoAlt, photos } from "@/components/kinetik/demo-helpers" /* or inline */;
import { MediaAmbientGlow } from "@/components/kinetik/media-ambient-glow";

export default function Demo() {
  const [i, setI] = useState(5);
  return (
    <div className="flex h-full flex-col items-center justify-center gap-6 bg-zinc-950 p-8 text-white">
      <MediaAmbientGlow key={i} src={photos[i]} className="aspect-video w-full max-w-md" />
      <div className="flex gap-2" role="group" aria-label="Choose image">
        {photos.map((p, n) => (
          <button key={p} onClick={() => setI(n)} aria-label={photoAlt[n]} aria-pressed={n === i} className={`size-9 overflow-hidden rounded-lg ring-2 transition ${n === i ? "ring-white" : "ring-transparent opacity-60 hover:opacity-100"}`}>
            <img src={p} alt="" className="size-full object-cover" />
          </button>
        ))}
      </div>
    </div>
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
