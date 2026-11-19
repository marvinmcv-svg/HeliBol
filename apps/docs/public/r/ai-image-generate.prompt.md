You are given a task to integrate a component from the **kinetik** motion library into this codebase.

# AI Image Generation (`ai-image-generate`)

Diffusion-style generation preview: coloured noise resolves to the final image through decaying blur and noise while a scan light sweeps, a step counter and progress ring tick up, and the prompt types out.

## What it should do
Build an image-generation preview: a square frame with the final image under CSS blur (28 → 0 px), saturation and scale easing with progress; a tiny canvas of random coloured noise (pixelated, overlay blend) fading out; a moving light band; a step counter with a progress ring; typewriter prompt. Drive it with rAF or real progress events.

## Project requirements
- React 19 + TypeScript, Tailwind CSS v4, shadcn/ui-style CSS variables (`background`, `foreground`, `muted`, `muted-foreground`, `border`, `card`, `primary`, `ring`). If the project lacks shadcn, set it up first (`npx shadcn@latest init`).
- Animation engine: **motion**.
- Install dependencies: `npm i motion lucide-react`
- Put the component at `components/kinetik/ai-image-generate.tsx`.
- `cn` lives at `lib/kinetik/utils.ts` (source below).
- Shared hooks go at `lib/kinetik/core.ts` (source below).

## Non-negotiables
- **Accessibility:** Progress announced via aria-live; final image gets the prompt as alt text. Reduced motion: shows the result immediately.
- **Performance:** 64×64 noise canvas scaled up; CSS filters on one image.
- Respect `prefers-reduced-motion` (replace movement with opacity or an instant change).
- Animate only transform / opacity / filter / clip-path. No hard-coded theme colors — use CSS variables so it works in light and dark.

## Source — components/kinetik/ai-image-generate.tsx
```tsx
"use client";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Sparkles } from "lucide-react";
import { cn, useReducedMotion } from "@/lib/kinetik/core";

export interface AiImageGenerateProps {
  /** Final image URL ("generated" result). */
  image: string;
  prompt: string;
  /** Seconds the fake diffusion takes. */
  duration?: number;
  /** Increment to regenerate. */
  runKey?: number;
  className?: string;
}

/**
 * Diffusion-style generation preview: the frame starts as coloured noise, a scanning light sweeps
 * down while the image resolves from heavy blur + pixelation + noise to sharp, a step counter and
 * progress ring tick up, and the prompt types out underneath. Replace the timer with your real
 * progress events.
 */
export function AiImageGenerate({ image, prompt, duration = 4.5, runKey = 0, className }: AiImageGenerateProps) {
  const reduced = useReducedMotion();
  const [p, setP] = useState(reduced ? 1 : 0);
  const noise = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (reduced) return setP(1);
    setP(0);
    const t0 = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      const v = Math.min(1, (now - t0) / 1000 / duration);
      setP(v);
      const c = noise.current;
      const ctx = c?.getContext("2d");
      if (c && ctx && v < 1) {
        const img = ctx.createImageData(c.width, c.height);
        for (let i = 0; i < img.data.length; i += 4) {
          const n = Math.random() * 255;
          img.data[i] = n * (0.6 + Math.random() * 0.4);
          img.data[i + 1] = n * 0.5;
          img.data[i + 2] = n;
          img.data[i + 3] = 255;
        }
        ctx.putImageData(img, 0, 0);
      }
      if (v < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [runKey, duration, reduced]);

  const e = 1 - (1 - p) ** 2.4; // ease-out progress for the visuals
  const steps = Math.round(p * 30);
  const done = p >= 1;
  const typed = prompt.slice(0, Math.ceil(Math.min(1, p * 3) * prompt.length));

  return (
    <figure className={cn("w-full max-w-sm", className)}>
      <div className="relative aspect-square overflow-hidden rounded-3xl bg-zinc-900 shadow-2xl">
        <img
          src={image}
          alt={done ? prompt : ""}
          className="absolute inset-0 size-full object-cover"
          style={{ filter: `blur(${(1 - e) * 28}px) saturate(${0.4 + e * 0.6}) contrast(${1.3 - e * 0.3})`, transform: `scale(${1.15 - e * 0.15})` }}
        />
        <canvas ref={noise} width={64} height={64} aria-hidden className="absolute inset-0 size-full [image-rendering:pixelated] mix-blend-overlay" style={{ opacity: Math.max(0, 1 - e * 1.3) * 0.9 }} />
        {!done && !reduced && (
          <motion.span aria-hidden className="absolute inset-x-0 h-24 bg-gradient-to-b from-transparent via-white/25 to-transparent" animate={{ top: ["-25%", "110%"] }} transition={{ duration: 1.4, repeat: Infinity, ease: "linear" }} />
        )}
        <div className="absolute left-3 top-3 flex items-center gap-2 rounded-full bg-black/50 px-2.5 py-1 text-[11px] font-medium text-white backdrop-blur" aria-live="polite">
          <svg viewBox="0 0 20 20" className="size-4 -rotate-90" aria-hidden>
            <circle cx="10" cy="10" r="8" fill="none" stroke="rgb(255 255 255 / .25)" strokeWidth="2.5" />
            <circle cx="10" cy="10" r="8" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" pathLength={1} strokeDasharray="1" strokeDashoffset={1 - p} />
          </svg>
          {done ? "Done" : `Step ${steps}/30`}
        </div>
        <AnimatePresence>
          {done && !reduced && <motion.span aria-hidden initial={{ opacity: 0.8 }} animate={{ opacity: 0 }} transition={{ duration: 0.8 }} className="absolute inset-0 bg-white" />}
        </AnimatePresence>
      </div>
      <figcaption className="mt-3 flex items-start gap-2 text-sm">
        <Sparkles className="mt-0.5 size-4 shrink-0 text-violet-400" />
        <span className="text-muted-foreground">
          {typed}
          {!done && <span className="ml-0.5 inline-block h-3.5 w-px animate-pulse bg-current align-middle motion-reduce:animate-none" />}
        </span>
      </figcaption>
    </figure>
  );
}
```

## Usage example
```tsx
"use client";
import { useState } from "react";
import { photos } from "@/components/kinetik/demo-helpers" /* or inline */;
import { AiImageGenerate } from "@/components/kinetik/ai-image-generate";

export default function Demo() {
  const [k, setK] = useState(0);
  return (
    <div className="flex h-full flex-col items-center justify-center gap-4 p-6">
      <AiImageGenerate runKey={k} image={photos[5]} prompt="violet aurora over a frozen fjord, long exposure, 35mm film" className="max-w-[17rem]" />
      <button onClick={() => setK((x) => x + 1)} className="rounded-full bg-foreground px-4 py-1.5 text-xs font-medium text-background">Regenerate</button>
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
