You are given a task to integrate a component from the **kinetik** motion library into this codebase.

# Magnetic Letters (`text-magnetic-letters`)

Every letter is a tiny spring: near the cursor letters are pushed away (or pulled in), tilt and gain weight, then spring back with a soft wobble when it leaves.

## What it should do
Build magnetic letters: split text into inline-block spans, cache their centres, and on pointermove run a rAF loop where each letter's target offset = direction away from the pointer × (1 − d/radius)² × 28 × strength; integrate a damped spring (stiffness .12, damping .78), rotate by x·0.6°, and raise font weight with influence (variable font). Stop the loop when settled.

## Project requirements
- React 19 + TypeScript, Tailwind CSS v4, shadcn/ui-style CSS variables (`background`, `foreground`, `muted`, `muted-foreground`, `border`, `card`, `primary`, `ring`). If the project lacks shadcn, set it up first (`npx shadcn@latest init`).
- Animation engine: **js**.
- No runtime dependencies (CSS only).
- Put the component at `components/kinetik/text-magnetic-letters.tsx`.
- `cn` lives at `lib/kinetik/utils.ts` (source below).
- Shared hooks go at `lib/kinetik/core.ts` (source below).

## Non-negotiables
- **Accessibility:** aria-label holds the full text; letters are aria-hidden. Off on touch and reduced motion.
- **Performance:** One rAF loop for all letters that stops when everything settles; transforms + font-variation only.
- Respect `prefers-reduced-motion` (replace movement with opacity or an instant change).
- Animate only transform / opacity / filter / clip-path. No hard-coded theme colors — use CSS variables so it works in light and dark.

## Source — components/kinetik/text-magnetic-letters.tsx
```tsx
"use client";
import { useEffect, useRef } from "react";
import { cn, usePrefersTouch, useReducedMotion } from "@/lib/kinetik/core";

export interface TextMagneticLettersProps {
  text: string;
  /** Pixels within which letters react. */
  radius?: number;
  /** Positive pushes letters away from the pointer, negative pulls them in. */
  strength?: number;
  className?: string;
}

/**
 * Every letter is a tiny spring: near the cursor letters are pushed away (or pulled in), tilt and
 * gain weight, then spring back with a soft wobble when the cursor leaves. One rAF loop for all
 * letters, transforms only.
 */
export function TextMagneticLetters({ text, radius = 140, strength = 1, className }: TextMagneticLettersProps) {
  const reduced = useReducedMotion();
  const touch = usePrefersTouch();
  const root = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el || reduced || touch) return;
    const letters = [...el.querySelectorAll<HTMLSpanElement>("[data-l]")];
    const st = letters.map(() => ({ x: 0, y: 0, vx: 0, vy: 0, w: 0 }));
    let centers: { x: number; y: number }[] = [];
    let pointer: { x: number; y: number } | null = null;
    let raf = 0;
    const measure = () => (centers = letters.map((l) => {
      const r = l.getBoundingClientRect();
      return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
    }));
    const tick = () => {
      let moving = false;
      letters.forEach((l, i) => {
        const s = st[i];
        let tx = 0, ty = 0, tw = 0;
        if (pointer) {
          const dx = centers[i].x - pointer.x, dy = centers[i].y - pointer.y;
          const d = Math.hypot(dx, dy);
          if (d < radius) {
            const f = (1 - d / radius) ** 2;
            tx = (dx / (d || 1)) * f * 28 * strength;
            ty = (dy / (d || 1)) * f * 28 * strength;
            tw = f;
          }
        }
        // spring toward target (stiffness .12, damping .78)
        s.vx = (s.vx + (tx - s.x) * 0.12) * 0.78;
        s.vy = (s.vy + (ty - s.y) * 0.12) * 0.78;
        s.x += s.vx;
        s.y += s.vy;
        s.w += (tw - s.w) * 0.15;
        if (Math.abs(s.vx) + Math.abs(s.vy) + Math.abs(tw - s.w) > 0.01) moving = true;
        l.style.transform = `translate(${s.x.toFixed(2)}px, ${s.y.toFixed(2)}px) rotate(${(s.x * 0.6).toFixed(2)}deg)`;
        l.style.fontVariationSettings = `"wght" ${Math.round(400 + s.w * 400)}`;
      });
      raf = moving || pointer ? requestAnimationFrame(tick) : 0;
    };
    const move = (e: PointerEvent) => {
      pointer = { x: e.clientX, y: e.clientY };
      if (!raf) raf = requestAnimationFrame(tick);
    };
    const leave = () => {
      pointer = null;
      if (!raf) raf = requestAnimationFrame(tick);
    };
    measure();
    const host = el.parentElement ?? el;
    host.addEventListener("pointermove", move);
    host.addEventListener("pointerleave", leave);
    window.addEventListener("resize", measure);
    window.addEventListener("scroll", measure, true);
    return () => {
      cancelAnimationFrame(raf);
      host.removeEventListener("pointermove", move);
      host.removeEventListener("pointerleave", leave);
      window.removeEventListener("resize", measure);
      window.removeEventListener("scroll", measure, true);
    };
  }, [radius, strength, reduced, touch, text]);

  return (
    <span ref={root} aria-label={text} className={cn("inline-block", className)}>
      {[...text].map((ch, i) => (
        <span key={i} data-l aria-hidden className="inline-block will-change-transform" style={{ whiteSpace: "pre" }}>
          {ch}
        </span>
      ))}
    </span>
  );
}
```

## Usage example
```tsx
"use client";
import { TextMagneticLetters } from "@/components/kinetik/text-magnetic-letters";

export default function Demo() {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-3 p-8 text-center">
      <TextMagneticLetters text="Push the letters" className="text-5xl tracking-tight sm:text-7xl" />
      <TextMagneticLetters text="or pull them closer" strength={-0.8} className="text-2xl text-muted-foreground sm:text-3xl" />
      <p className="mt-4 text-xs text-muted-foreground">Move your cursor through the words</p>
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
