You are given a task to integrate a component from the **kinetik** motion library into this codebase.

# Physics Confetti Cannon (`gsap-confetti-cannon`)

Click the button and it fires projectile confetti — Physics2D velocity, angle and gravity so pieces arc and fall naturally while flipping in 3D.

## What it should do
For each piece append an absolutely positioned <i> at the button center, then gsap.to(el, { physics2D: { velocity random(320,640), angle angle ± spread/2, gravity 900, friction .03 }, duration 2.2 }) plus random rotationX/rotationY/rotation over 2.2s and fade from 1.6s; remove on complete. Elastic squash on the button.

## Project requirements
- React 19 + TypeScript, Tailwind CSS v4, shadcn/ui-style CSS variables (`background`, `foreground`, `muted`, `muted-foreground`, `border`, `card`, `primary`, `ring`). If the project lacks shadcn, set it up first (`npx shadcn@latest init`).
- Animation engine: **gsap**.
- Install dependencies: `npm i gsap @gsap/react`
- Put the component at `components/kinetik/gsap-confetti-cannon.tsx`.
- `cn` lives at `lib/kinetik/utils.ts` (source below).
- Shared hooks go at `lib/kinetik/core.ts` (source below).

## Non-negotiables
- **Accessibility:** Pieces are aria-hidden and non-interactive; the wrapped button stays the control. No confetti under reduced motion.
- **Performance:** 60 small elements, removed on complete; transforms + opacity.
- Respect `prefers-reduced-motion` (replace movement with opacity or an instant change).
- Animate only transform / opacity / filter / clip-path. No hard-coded theme colors — use CSS variables so it works in light and dark.

## Source — components/kinetik/gsap-confetti-cannon.tsx
```tsx
"use client";
import { useRef, type ReactNode } from "react";
import gsap from "gsap";
import { Physics2DPlugin } from "gsap/Physics2DPlugin";
import { useGSAP } from "@gsap/react";
import { cn, useReducedMotion } from "@/lib/kinetik/core";

gsap.registerPlugin(Physics2DPlugin, useGSAP);

export interface GsapConfettiCannonProps {
  children: ReactNode;
  /** Pieces per burst. */
  count?: number;
  colors?: string[];
  /** Launch angle in degrees (−90 = straight up). */
  angle?: number;
  /** Cone width in degrees. */
  spread?: number;
  className?: string;
  onFire?: () => void;
}

const COLORS = ["#8b5cf6", "#ec4899", "#f59e0b", "#22d3ee", "#10b981", "#f43f5e"];

/**
 * Wraps a button: clicking fires real projectile confetti from it. Each piece gets a
 * Physics2D velocity/angle/gravity (so it arcs and falls naturally), plus independent
 * 3D flips and a fade, and is removed when it lands.
 */
export function GsapConfettiCannon({ children, count = 60, colors = COLORS, angle = -90, spread = 70, className, onFire }: GsapConfettiCannonProps) {
  const root = useRef<HTMLSpanElement>(null);
  const reduced = useReducedMotion();
  const { contextSafe } = useGSAP({ scope: root });

  const fire = contextSafe(() => {
    onFire?.();
    if (reduced) return;
    const host = root.current!;
    const r = host.getBoundingClientRect();
    for (let i = 0; i < count; i++) {
      const el = document.createElement("i");
      el.setAttribute("aria-hidden", "true");
      const w = gsap.utils.random(6, 11);
      Object.assign(el.style, {
        position: "absolute",
        left: `${r.width / 2}px`,
        top: `${r.height / 2}px`,
        width: `${w}px`,
        height: `${w * gsap.utils.random(0.4, 1.6)}px`,
        background: colors[i % colors.length],
        borderRadius: i % 3 === 0 ? "50%" : "2px",
        pointerEvents: "none",
        zIndex: "50",
      });
      host.appendChild(el);
      gsap
        .timeline({ onComplete: () => el.remove() })
        .to(el, {
          physics2D: { velocity: gsap.utils.random(320, 640), angle: angle + gsap.utils.random(-spread / 2, spread / 2), gravity: 900, friction: 0.03 },
          duration: 2.2,
        })
        .to(el, { rotationX: gsap.utils.random(360, 1080), rotationY: gsap.utils.random(-720, 720), rotation: gsap.utils.random(-360, 360), duration: 2.2, ease: "none" }, 0)
        .to(el, { opacity: 0, duration: 0.5 }, 1.6);
    }
    gsap.fromTo(host.firstElementChild, { scale: 0.9 }, { scale: 1, duration: 0.6, ease: "elastic.out(1.2, 0.4)" });
  });

  return (
    <span ref={root} onClick={fire} className={cn("relative inline-block", className)}>
      {children}
    </span>
  );
}
```

## Usage example
```tsx
"use client";
import { useState } from "react";
import { PartyPopper } from "lucide-react";
import { GsapConfettiCannon } from "@/components/kinetik/gsap-confetti-cannon";

export default function Demo() {
  const [n, setN] = useState(0);
  return (
    <div className="flex h-full w-full flex-col items-center justify-end gap-3 pb-16">
      <p className="text-sm text-muted-foreground">{n === 0 ? "Ship it." : `Shipped ${n}× 🎉`}</p>
      <GsapConfettiCannon onFire={() => setN((x) => x + 1)}>
        <button className="flex items-center gap-2 rounded-full bg-foreground px-6 py-3 text-sm font-semibold text-background shadow-xl">
          <PartyPopper className="size-4" /> Publish release
        </button>
      </GsapConfettiCannon>
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
