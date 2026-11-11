You are given a task to integrate a component from the **kinetik** motion library into this codebase.

# 3D Tilt Scene (`gsap-tilt-scene`)

A whole composition rotates toward the cursor in 3D; layers marked with data-depth float at different translateZ so they separate as it tilts.

## What it should do
Create a tilt scene: wrapper with perspective 1100px, inner stage with transform-style preserve-3d; gsap.set each [data-depth] child to z = depth·30. On pointermove map pointer to −.5..+.5 and quickTo(rotationY)=px·max·2, quickTo(rotationX)=−py·max·2 (.8s power3); reset to 0 on leave.

## Project requirements
- React 19 + TypeScript, Tailwind CSS v4, shadcn/ui-style CSS variables (`background`, `foreground`, `muted`, `muted-foreground`, `border`, `card`, `primary`, `ring`). If the project lacks shadcn, set it up first (`npx shadcn@latest init`).
- Animation engine: **gsap**.
- Install dependencies: `npm i gsap @gsap/react`
- Put the component at `components/kinetik/gsap-tilt-scene.tsx`.
- `cn` lives at `lib/kinetik/utils.ts` (source below).
- Shared hooks go at `lib/kinetik/core.ts` (source below).

## Non-negotiables
- **Accessibility:** Purely visual; content stays readable at rest. Off on touch and under reduced motion (layers still keep their depth offsets).
- **Performance:** Two quickTo setters on one element; preserve-3d layers.
- Respect `prefers-reduced-motion` (replace movement with opacity or an instant change).
- Animate only transform / opacity / filter / clip-path. No hard-coded theme colors — use CSS variables so it works in light and dark.

## Source — components/kinetik/gsap-tilt-scene.tsx
```tsx
"use client";
import { useRef, type ReactNode } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { cn, useReducedMotion } from "@/lib/kinetik/core";

gsap.registerPlugin(useGSAP);

export interface GsapTiltSceneProps {
  children: ReactNode;
  /** Max rotation in degrees. */
  max?: number;
  className?: string;
}

/**
 * The whole scene rotates in 3D toward the cursor (quickTo on rotationX/Y); children marked
 * `data-depth="1..5"` sit at translateZ steps so the layers separate as it tilts.
 */
export function GsapTiltScene({ children, max = 14, className }: GsapTiltSceneProps) {
  const root = useRef<HTMLDivElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const q = useRef<{ rx: gsap.QuickToFunc; ry: gsap.QuickToFunc } | null>(null);

  const { contextSafe } = useGSAP(
    () => {
      stage.current!.querySelectorAll<HTMLElement>("[data-depth]").forEach((el) => gsap.set(el, { z: Number(el.dataset.depth) * 30 }));
      if (reduced) return;
      q.current = {
        rx: gsap.quickTo(stage.current, "rotationX", { duration: 0.8, ease: "power3" }),
        ry: gsap.quickTo(stage.current, "rotationY", { duration: 0.8, ease: "power3" }),
      };
    },
    { scope: root, dependencies: [reduced] },
  );

  const move = contextSafe((e: React.PointerEvent) => {
    if (!q.current || e.pointerType === "touch") return;
    const b = root.current!.getBoundingClientRect();
    const px = (e.clientX - b.left) / b.width - 0.5;
    const py = (e.clientY - b.top) / b.height - 0.5;
    q.current.ry(px * max * 2);
    q.current.rx(-py * max * 2);
  });

  const leave = contextSafe(() => {
    q.current?.rx(0);
    q.current?.ry(0);
  });

  return (
    <div ref={root} onPointerMove={move} onPointerLeave={leave} className={cn("[perspective:1100px]", className)}>
      <div ref={stage} className="relative h-full w-full [transform-style:preserve-3d]">
        {children}
      </div>
    </div>
  );
}
```

## Usage example
```tsx
"use client";
import { photos } from "@/components/kinetik/demo-helpers" /* or inline */;
import { GsapTiltScene } from "@/components/kinetik/gsap-tilt-scene";

export default function Demo() {
  return (
    <div className="grid h-full w-full place-items-center p-6">
      <GsapTiltScene className="h-[300px] w-full max-w-[520px]">
        <div data-depth="0" className="absolute inset-0 overflow-hidden rounded-3xl border border-border bg-card shadow-2xl [transform-style:preserve-3d]">
          <img src={photos[5]} alt="" className="h-full w-full object-cover opacity-80" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
        </div>
        <div data-depth="2" className="absolute bottom-6 left-6 text-white">
          <p className="text-[10px] uppercase tracking-[0.3em] opacity-70">Expedition 07</p>
          <h3 className="text-3xl font-semibold tracking-tight">Aurora Borealis</h3>
        </div>
        <div data-depth="4" className="absolute right-5 top-5 rounded-full bg-white px-3 py-1 text-xs font-semibold text-black shadow-lg">Live now</div>
        <div data-depth="3" className="absolute -left-6 top-10 w-40 rounded-2xl border border-white/20 bg-black/50 p-3 text-xs text-white shadow-xl backdrop-blur">
          <p className="opacity-60">Kp-index</p>
          <p className="text-2xl font-semibold">6.3</p>
          <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/20"><div className="h-full w-3/4 rounded-full bg-emerald-400" /></div>
        </div>
        <div data-depth="5" className="absolute -right-4 bottom-10 size-16 rounded-2xl bg-gradient-to-br from-fuchsia-500 to-violet-600 shadow-xl" />
      </GsapTiltScene>
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
