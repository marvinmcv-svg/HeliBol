You are given a task to integrate a component from the **kinetik** motion library into this codebase.

# Gravity Stars (`bg-gravity-stars`)

A starfield where the cursor is a gravity well: nearby stars curve toward it with a swirl, streak while moving, then spring home. Stars twinkle at rest.

## What it should do
Build a gravity starfield on canvas: each star has home, position and velocity. Each frame, if the pointer is inside, add an inverse-square pull toward it plus a perpendicular component (swirl); always add a weak spring toward home and damp velocity by .94. Draw a streak when fast, otherwise a twinkling dot. Reseed on resize. Pause off-screen and render one frame under reduced motion.

## Project requirements
- React 19 + TypeScript, Tailwind CSS v4, shadcn/ui-style CSS variables (`background`, `foreground`, `muted`, `muted-foreground`, `border`, `card`, `primary`, `ring`). If the project lacks shadcn, set it up first (`npx shadcn@latest init`).
- Animation engine: **canvas**.
- No runtime dependencies (CSS only).
- Put the component at `components/kinetik/bg-gravity-stars.tsx`.
- `cn` lives at `lib/kinetik/utils.ts` (source below).
- Shared hooks go at `lib/kinetik/core.ts` (source below).

## Non-negotiables
- **Accessibility:** Decorative canvas (aria-hidden). Reduced motion: a single static frame.
- **Performance:** useCanvas pauses off-screen/hidden; 220 particles, O(n) per frame.
- Respect `prefers-reduced-motion` (replace movement with opacity or an instant change).
- Animate only transform / opacity / filter / clip-path. No hard-coded theme colors — use CSS variables so it works in light and dark.

## Source — components/kinetik/bg-gravity-stars.tsx
```tsx
"use client";
import { useMemo } from "react";
import { cn, useCanvas } from "@/lib/kinetik/core";

export interface BgGravityStarsProps {
  count?: number;
  /** Pull strength of the cursor "black hole". */
  gravity?: number;
  color?: string;
  className?: string;
}

type Star = { x: number; y: number; vx: number; vy: number; hx: number; hy: number; r: number; tw: number };

/**
 * A starfield where the cursor is a gravity well: nearby stars curve toward it and orbit, then
 * spring back to their home when it leaves. Stars twinkle at rest.
 */
export function BgGravityStars({ count = 220, gravity = 1, color = "255,255,255", className }: BgGravityStarsProps) {
  const stars = useMemo<Star[]>(() => [], []);
  const size = useMemo(() => ({ w: 0, h: 0 }), []);
  const ref = useCanvas(({ ctx, width, height, time, dt, pointer }) => {
    // (re)seed when the count or the canvas size changes
    if (stars.length !== count || size.w !== width || size.h !== height) {
      size.w = width;
      size.h = height;
      stars.length = 0;
      for (let i = 0; i < count; i++) {
        const x = Math.random() * width, y = Math.random() * height;
        stars.push({ x, y, vx: 0, vy: 0, hx: x, hy: y, r: Math.random() * 1.4 + 0.3, tw: Math.random() * 6 });
      }
    }
    ctx.clearRect(0, 0, width, height);
    const step = dt * 60;
    for (const s of stars) {
      if (pointer) {
        const dx = pointer.x - s.x, dy = pointer.y - s.y;
        const d2 = dx * dx + dy * dy + 400;
        const f = (gravity * 900) / d2;
        // pull plus a small tangential component so captured stars swirl instead of collapsing
        s.vx += (dx * f - dy * f * 0.6) * 0.02 * step;
        s.vy += (dy * f + dx * f * 0.6) * 0.02 * step;
      }
      // spring home + damping
      s.vx += (s.hx - s.x) * 0.002 * step;
      s.vy += (s.hy - s.y) * 0.002 * step;
      s.vx *= 0.94;
      s.vy *= 0.94;
      s.x += s.vx * step;
      s.y += s.vy * step;
      const speed = Math.min(1, Math.hypot(s.vx, s.vy) / 4);
      const alpha = 0.35 + 0.45 * (0.5 + 0.5 * Math.sin(time * 2 + s.tw)) + speed * 0.3;
      ctx.strokeStyle = ctx.fillStyle = `rgba(${color},${Math.min(1, alpha)})`;
      if (speed > 0.15) {
        // motion streak
        ctx.lineWidth = s.r;
        ctx.beginPath();
        ctx.moveTo(s.x, s.y);
        ctx.lineTo(s.x - s.vx * 3, s.y - s.vy * 3);
        ctx.stroke();
      } else {
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  });
  return <canvas ref={ref} aria-hidden className={cn("absolute inset-0 size-full", className)} />;
}
```

## Usage example
```tsx
"use client";
import { BgGravityStars } from "@/components/kinetik/bg-gravity-stars";

export default function Demo() {
  return (
    <div className="relative grid h-full place-items-center overflow-hidden bg-[radial-gradient(ellipse_at_bottom,#1e1b4b,#020617_70%)] text-white">
      <BgGravityStars />
      <div className="pointer-events-none relative text-center">
        <h3 className="text-4xl font-semibold tracking-tight">Pull the night sky</h3>
        <p className="mt-2 text-sm text-white/60">Move your cursor through the stars</p>
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
