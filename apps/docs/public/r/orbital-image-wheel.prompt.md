You are given a task to integrate a component from the **kinetik** motion library into this codebase.

# Orbital Image Wheel (`orbital-image-wheel`)

Images arranged on a giant wheel whose hub sits below the frame. Drag, scroll or use arrow keys to turn it; it springs so one image sits enlarged at the top with its title.

## What it should do
Build an orbital image wheel with Motion: one angle motion value; each item's rotation = base + angle, position = (sin, −cos)·R, and scale/opacity mapped from its angular distance to the top. Hub placed below the container. Pan adds delta/R in degrees; wheel adds deltaY; on end, spring to the nearest step (shortest way round). Arrow keys step. Show the active title below.

## Project requirements
- React 19 + TypeScript, Tailwind CSS v4, shadcn/ui-style CSS variables (`background`, `foreground`, `muted`, `muted-foreground`, `border`, `card`, `primary`, `ring`). If the project lacks shadcn, set it up first (`npx shadcn@latest init`).
- Animation engine: **motion**.
- Install dependencies: `npm i motion`
- Put the component at `components/kinetik/orbital-image-wheel.tsx`.
- `cn` lives at `lib/kinetik/utils.ts` (source below).
- Shared hooks go at `lib/kinetik/core.ts` (source below).

## Non-negotiables
- **Accessibility:** Focusable region with arrow-key navigation; each image is a labelled button; title announced via aria-live. Reduced motion: snaps without spring.
- **Performance:** All positions are derived from one motion value with useTransform — no React re-render while turning.
- Respect `prefers-reduced-motion` (replace movement with opacity or an instant change).
- Animate only transform / opacity / filter / clip-path. No hard-coded theme colors — use CSS variables so it works in light and dark.

## Source — components/kinetik/orbital-image-wheel.tsx
```tsx
"use client";
import { useEffect, useRef, useState } from "react";
import { animate, motion, useMotionValue, useTransform, type MotionValue } from "motion/react";
import { cn, useReducedMotion } from "@/lib/kinetik/core";

export interface OrbitalImageWheelProps {
  items: { image: string; title: string }[];
  /** Wheel radius as a fraction of the container width. */
  radius?: number;
  className?: string;
}

function Spoke({ i, n, angle, radius, image, title, active, onSelect }: { i: number; n: number; angle: MotionValue<number>; radius: number; image: string; title: string; active: boolean; onSelect: () => void }) {
  const base = (i / n) * 360;
  // Position on the wheel and scale by closeness to the top (the "selected" slot).
  const rot = useTransform(angle, (a) => base + a);
  const x = useTransform(rot, (r) => Math.sin((r * Math.PI) / 180) * radius);
  const y = useTransform(rot, (r) => -Math.cos((r * Math.PI) / 180) * radius);
  const near = useTransform(rot, (r) => {
    const d = Math.abs(((((r % 360) + 540) % 360) - 180));
    return 1 - Math.min(1, d / 60);
  });
  const scale = useTransform(near, [0, 1], [0.62, 1.15]);
  const opacity = useTransform(near, [0, 1], [0.45, 1]);
  return (
    <motion.button
      type="button"
      onClick={onSelect}
      aria-label={title}
      aria-current={active || undefined}
      style={{ x, y, scale, opacity, rotate: rot }}
      className="absolute left-1/2 top-1/2 -ml-[44px] -mt-[58px] h-[116px] w-[88px] overflow-hidden rounded-2xl shadow-xl outline-none ring-offset-2 ring-offset-background focus-visible:ring-2 focus-visible:ring-ring"
    >
      <img src={image} alt="" draggable={false} className="size-full object-cover" />
    </motion.button>
  );
}

/**
 * Images arranged on a big wheel whose hub sits below the frame. Drag, scroll or use the arrow keys
 * to turn it; it snaps so one image sits at the top, enlarged, with its title.
 */
export function OrbitalImageWheel({ items, radius = 0.55, className }: OrbitalImageWheelProps) {
  const reduced = useReducedMotion();
  const box = useRef<HTMLDivElement>(null);
  const [w, setW] = useState(600);
  const angle = useMotionValue(0);
  const [active, setActive] = useState(0);
  const n = items.length;
  const step = 360 / n;

  useEffect(() => {
    const el = box.current;
    if (!el) return;
    const ro = new ResizeObserver(([e]) => setW(e.contentRect.width));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const goTo = (idx: number) => {
    const target = -idx * step;
    // shortest way round from the current angle
    const cur = angle.get();
    const delta = ((((target - cur) % 360) + 540) % 360) - 180;
    const dest = cur + delta;
    setActive(((idx % n) + n) % n);
    if (reduced) angle.set(dest);
    else animate(angle, dest, { type: "spring", stiffness: 140, damping: 22 });
  };
  const snap = () => goTo(Math.round(-angle.get() / step));

  useEffect(() => {
    const el = box.current;
    if (!el) return;
    let t: ReturnType<typeof setTimeout>;
    const wheel = (e: WheelEvent) => {
      e.preventDefault();
      angle.set(angle.get() - (e.deltaY + e.deltaX) * 0.08);
      clearTimeout(t);
      t = setTimeout(snap, 140);
    };
    el.addEventListener("wheel", wheel, { passive: false });
    return () => el.removeEventListener("wheel", wheel);
  });

  const R = w * radius;
  return (
    <div
      ref={box}
      tabIndex={0}
      role="region"
      aria-roledescription="carousel"
      aria-label="Image wheel"
      onKeyDown={(e) => {
        if (e.key === "ArrowRight") goTo(active + 1);
        if (e.key === "ArrowLeft") goTo(active - 1);
      }}
      className={cn("relative h-full w-full touch-pan-y overflow-hidden outline-none", className)}
    >
      <motion.div
        className="absolute inset-0 cursor-grab active:cursor-grabbing"
        onPan={(_, info) => angle.set(angle.get() + info.delta.x * (180 / (Math.PI * R)))}
        onPanEnd={snap}
        style={{ top: R * 0.9 }}
      >
        {items.map((it, i) => (
          <Spoke key={i} i={i} n={n} angle={angle} radius={R} image={it.image} title={it.title} active={i === active} onSelect={() => goTo(i)} />
        ))}
      </motion.div>
      <div className="pointer-events-none absolute inset-x-0 bottom-6 text-center" aria-live="polite">
        <p className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground">{String(active + 1).padStart(2, "0")} / {String(n).padStart(2, "0")}</p>
        <motion.p key={active} initial={reduced ? false : { opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="text-xl font-semibold tracking-tight">{items[active].title}</motion.p>
      </div>
    </div>
  );
}
```

## Usage example
```tsx
"use client";
import { photoAlt, photos } from "@/components/kinetik/demo-helpers" /* or inline */;
import { OrbitalImageWheel } from "@/components/kinetik/orbital-image-wheel";

const items = [...photos, ...photos.slice(0, 4)].map((image, i) => ({ image, title: photoAlt[i % photoAlt.length] }));

export default function Demo() {
  return <OrbitalImageWheel items={items} />;
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
