You are given a task to integrate a component from the **kinetik** motion library into this codebase.

# Throwable Sticker Board (`gsap-throw-board`)

A desk of polaroids and stickers you can pick up and throw — Draggable with InertiaPlugin keeps momentum, bounds keep them on the board, the held item lifts and tilts.

## What it should do
Draggable.create(stickers, { bounds: board, inertia: true, edgeResistance .75, onPress: raise zIndex + scale 1.08 + big shadow, onDrag: rotation = clamp(±25, deltaX·1.5), onRelease: scale 1, random tilt ±12 (back.out) }); entrance: from scale 0, rotation −40 stagger .06.

## Project requirements
- React 19 + TypeScript, Tailwind CSS v4, shadcn/ui-style CSS variables (`background`, `foreground`, `muted`, `muted-foreground`, `border`, `card`, `primary`, `ring`). If the project lacks shadcn, set it up first (`npx shadcn@latest init`).
- Animation engine: **gsap**.
- Install dependencies: `npm i gsap @gsap/react`
- Put the component at `components/kinetik/gsap-throw-board.tsx`.
- `cn` lives at `lib/kinetik/utils.ts` (source below).
- Shared hooks go at `lib/kinetik/core.ts` (source below).

## Non-negotiables
- **Accessibility:** Decorative play surface; don't put essential content only here. Reduced motion keeps drag without inertia or entrance.
- **Performance:** Draggable uses transforms; inertia computed once per throw.
- Respect `prefers-reduced-motion` (replace movement with opacity or an instant change).
- Animate only transform / opacity / filter / clip-path. No hard-coded theme colors — use CSS variables so it works in light and dark.

## Source — components/kinetik/gsap-throw-board.tsx
```tsx
"use client";
import { useRef, type ReactNode } from "react";
import gsap from "gsap";
import { Draggable } from "gsap/Draggable";
import { InertiaPlugin } from "gsap/InertiaPlugin";
import { useGSAP } from "@gsap/react";
import { cn, useReducedMotion } from "@/lib/kinetik/core";

gsap.registerPlugin(Draggable, InertiaPlugin, useGSAP);

export interface ThrowItem {
  node: ReactNode;
  /** Initial position in % of the board. */
  x: number;
  y: number;
  rotate?: number;
}

export interface GsapThrowBoardProps {
  items: ThrowItem[];
  className?: string;
}

/**
 * A desk of stickers you can pick up and throw: Draggable with InertiaPlugin keeps the
 * momentum after release, bounds keep everything on the board, the picked-up item lifts
 * (scale + shadow + tilt with velocity) and comes to the top of the pile.
 */
export function GsapThrowBoard({ items, className }: GsapThrowBoardProps) {
  const root = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  useGSAP(
    () => {
      const els = gsap.utils.toArray<HTMLElement>("[data-sticker]", root.current);
      let z = items.length;
      els.forEach((el, i) => gsap.set(el, { rotation: items[i].rotate ?? 0 }));
      if (!reduced) gsap.from(els, { scale: 0, rotation: "-=40", stagger: 0.06, duration: 0.7, ease: "back.out(2)" });
      const ds = Draggable.create(els, {
        bounds: root.current,
        inertia: !reduced,
        edgeResistance: 0.75,
        onPress() {
          gsap.set(this.target, { zIndex: ++z });
          gsap.to(this.target, { scale: 1.08, boxShadow: "0 24px 48px rgba(0,0,0,.35)", duration: 0.2 });
        },
        onDrag() {
          gsap.to(this.target, { rotation: gsap.utils.clamp(-25, 25, (this.deltaX ?? 0) * 1.5), duration: 0.3, overwrite: "auto" });
        },
        onRelease() {
          gsap.to(this.target, { scale: 1, boxShadow: "0 6px 16px rgba(0,0,0,.2)", rotation: gsap.utils.random(-12, 12), duration: 0.5, ease: "back.out(2)" });
        },
      });
      return () => ds.forEach((d) => d.kill());
    },
    { scope: root, dependencies: [reduced] },
  );

  return (
    <div ref={root} className={cn("relative h-full w-full overflow-hidden", className)}>
      {items.map((it, i) => (
        <div
          key={i}
          data-sticker
          className="absolute cursor-grab touch-none select-none rounded-xl shadow-[0_6px_16px_rgba(0,0,0,.2)] active:cursor-grabbing"
          style={{ left: `${it.x}%`, top: `${it.y}%` }}
        >
          {it.node}
        </div>
      ))}
    </div>
  );
}
```

## Usage example
```tsx
"use client";
import { photos } from "@/components/kinetik/demo-helpers" /* or inline */;
import { GsapThrowBoard } from "@/components/kinetik/gsap-throw-board";

const Polaroid = ({ src, label }: { src: string; label: string }) => (
  <div className="w-32 rounded-lg bg-white p-2 pb-6 text-center text-[11px] font-medium text-neutral-700">
    <img src={src} alt="" draggable={false} className="aspect-square w-full rounded object-cover" />
    <p className="mt-1.5">{label}</p>
  </div>
);
const Pill = ({ children, className }: { children: string; className: string }) => <div className={`rounded-full px-4 py-2 text-sm font-bold ${className}`}>{children}</div>;

export default function Demo() {
  return (
    <div className="relative h-full w-full bg-[radial-gradient(circle_at_1px_1px,rgba(127,127,127,.25)_1px,transparent_0)] [background-size:20px_20px]">
      <p className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-center text-4xl font-semibold tracking-tight text-muted-foreground/40">
        Pick up & throw
      </p>
      <GsapThrowBoard
        items={[
          { x: 8, y: 12, rotate: -8, node: <Polaroid src={photos[0]} label="Dunes '24" /> },
          { x: 62, y: 8, rotate: 6, node: <Polaroid src={photos[5]} label="Aurora" /> },
          { x: 36, y: 52, rotate: 4, node: <Polaroid src={photos[3]} label="Canopy" /> },
          { x: 72, y: 58, rotate: -5, node: <Pill className="bg-amber-300 text-amber-950">✦ ship it</Pill> },
          { x: 12, y: 70, rotate: 10, node: <Pill className="bg-violet-500 text-white">motion ♥</Pill> },
          { x: 44, y: 14, rotate: -14, node: <div className="grid size-16 place-items-center rounded-full bg-rose-500 text-2xl">🔥</div> },
        ]}
      />
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
