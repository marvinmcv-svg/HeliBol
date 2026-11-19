You are given a task to integrate a component from the **kinetik** motion library into this codebase.

# Smoke Trail Cursor (`cursor-smoke-trail`)

A soft glowing smoke trail: the pointer emits puffs that inherit its velocity, rise, swirl on a noise field, expand and fade; additive blending makes overlaps bloom.

## What it should do
Build a smoke trail on canvas: on each frame emit puffs along the segment between the last and current pointer positions (more when fast), each with velocity = pointer velocity × .15 plus upward drift; add a swirl from sin/cos of position and time, damp, grow radius, fade life; draw radial gradients with 'lighter' compositing.

## Project requirements
- React 19 + TypeScript, Tailwind CSS v4, shadcn/ui-style CSS variables (`background`, `foreground`, `muted`, `muted-foreground`, `border`, `card`, `primary`, `ring`). If the project lacks shadcn, set it up first (`npx shadcn@latest init`).
- Animation engine: **canvas**.
- No runtime dependencies (CSS only).
- Put the component at `components/kinetik/cursor-smoke-trail.tsx`.
- `cn` lives at `lib/kinetik/utils.ts` (source below).
- Shared hooks go at `lib/kinetik/core.ts` (source below).

## Non-negotiables
- **Accessibility:** Decorative and contained to its area; pointer-only. Reduced motion: no trail.
- **Performance:** Puffs capped at 420; paused off-screen.
- Respect `prefers-reduced-motion` (replace movement with opacity or an instant change).
- Animate only transform / opacity / filter / clip-path. No hard-coded theme colors — use CSS variables so it works in light and dark.

## Source — components/kinetik/cursor-smoke-trail.tsx
```tsx
"use client";
import { useMemo, type ReactNode } from "react";
import { cn, useCanvas } from "@/lib/kinetik/core";

export interface CursorSmokeTrailProps {
  children?: ReactNode;
  /** Colours puffs cycle through. */
  colors?: string[];
  className?: string;
}

type Puff = { x: number; y: number; vx: number; vy: number; r: number; life: number; hue: number };

/**
 * A soft, glowing smoke trail: the pointer emits puffs that inherit its velocity, rise, swirl on a
 * curl-ish noise field, expand and fade. Additive blending makes overlapping puffs bloom. Contained
 * to its area; paused off-screen; static under reduced motion.
 */
export function CursorSmokeTrail({ children, colors = ["#a78bfa", "#22d3ee", "#f472b6"], className }: CursorSmokeTrailProps) {
  const puffs = useMemo<Puff[]>(() => [], []);
  const last = useMemo(() => ({ x: 0, y: 0, has: false, i: 0 }), []);
  const ref = useCanvas(({ ctx, width, height, time, dt, pointer }) => {
    if (pointer) {
      const vx = last.has ? pointer.x - last.x : 0, vy = last.has ? pointer.y - last.y : 0;
      const n = Math.min(6, 1 + Math.floor(Math.hypot(vx, vy) / 6));
      for (let k = 0; k < n; k++) {
        puffs.push({ x: pointer.x - (vx * k) / n, y: pointer.y - (vy * k) / n, vx: vx * 0.15 + (Math.random() - 0.5), vy: vy * 0.15 - 0.4, r: 6 + Math.random() * 8, life: 1, hue: last.i++ % colors.length });
      }
      Object.assign(last, { x: pointer.x, y: pointer.y, has: true });
    } else last.has = false;
    if (puffs.length > 420) puffs.splice(0, puffs.length - 420);
    ctx.clearRect(0, 0, width, height);
    ctx.globalCompositeOperation = "lighter";
    const step = dt * 60;
    for (let i = puffs.length - 1; i >= 0; i--) {
      const p = puffs[i];
      // swirl field
      const a = Math.sin(p.x * 0.012 + time) + Math.cos(p.y * 0.014 - time * 0.8);
      p.vx += Math.cos(a * 2) * 0.06 * step;
      p.vy += (Math.sin(a * 2) * 0.06 - 0.02) * step;
      p.vx *= 0.97;
      p.vy *= 0.97;
      p.x += p.vx * step;
      p.y += p.vy * step;
      p.r += 0.45 * step;
      p.life -= 0.012 * step;
      if (p.life <= 0) {
        puffs.splice(i, 1);
        continue;
      }
      const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r);
      g.addColorStop(0, `${colors[p.hue]}${Math.round(p.life * 90).toString(16).padStart(2, "0")}`);
      g.addColorStop(1, `${colors[p.hue]}00`);
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalCompositeOperation = "source-over";
  });
  return (
    <div className={cn("relative isolate overflow-hidden", className)}>
      <canvas ref={ref} aria-hidden className="pointer-events-none absolute inset-0 -z-10 size-full" />
      {children}
    </div>
  );
}
```

## Usage example
```tsx
"use client";
import { CursorSmokeTrail } from "@/components/kinetik/cursor-smoke-trail";

export default function Demo() {
  return (
    <CursorSmokeTrail className="grid h-full place-items-center bg-[#06040c] text-white">
      <div className="pointer-events-none text-center">
        <h3 className="text-4xl font-semibold tracking-tight">Draw with smoke</h3>
        <p className="mt-2 text-sm text-white/55">Faster strokes leave thicker trails</p>
      </div>
    </CursorSmokeTrail>
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
