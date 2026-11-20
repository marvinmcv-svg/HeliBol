You are given a task to integrate a component from the **kinetik** motion library into this codebase.

# Cursor — Flashlight (`cursor-flashlight`)

X-ray flashlight: a dark top layer has a soft circular hole that trails the pointer with easing, revealing a second layer underneath — hidden messages, blueprints, before/after. Click to widen the beam. Touch and reduced motion get a Reveal toggle.

## What it should do
Stack a cover div over the content and set mask-image: radial-gradient(circle var(--fr) at var(--fx) var(--fy), transparent 70%, #000); lerp --fx/--fy toward the pointer in rAF; animate --fr up on pointerdown.

## Project requirements
- React 19 + TypeScript, Tailwind CSS v4, shadcn/ui-style CSS variables (`background`, `foreground`, `muted`, `muted-foreground`, `border`, `card`, `primary`, `ring`). If the project lacks shadcn, set it up first (`npx shadcn@latest init`).
- Animation engine: **css**.
- No runtime dependencies (CSS only).
- Put the component at `components/kinetik/cursor-flashlight.tsx`.
- `cn` lives at `lib/kinetik/utils.ts` (source below).
- Shared hooks go at `lib/kinetik/core.ts` (source below).

## Non-negotiables
- **Accessibility:** Both layers stay in the DOM; a Reveal toggle (aria-pressed) shows the hidden layer for touch and keyboard users.
- **Performance:** CSS mask-image driven by three custom properties updated in one rAF loop.
- Respect `prefers-reduced-motion` (replace movement with opacity or an instant change).
- Animate only transform / opacity / filter / clip-path. No hard-coded theme colors — use CSS variables so it works in light and dark.

## Source — components/kinetik/cursor-flashlight.tsx
```tsx
"use client";
import { useEffect, useRef, type CSSProperties, type ReactNode } from "react";
import { cn, usePrefersTouch, useReducedMotion } from "@/lib/kinetik/core";

export interface CursorFlashlightProps {
  /** What you see in the dark. */
  children: ReactNode;
  /** What the light reveals (rendered underneath, aligned with children). */
  reveal: ReactNode;
  /** Beam radius in px. */
  radius?: number;
  className?: string;
}

/**
 * X-ray flashlight: a dark top layer has a soft circular hole (CSS mask driven by custom
 * properties) that trails the pointer with easing, revealing a second layer underneath — hidden
 * messages, blueprints, before/after. Click to widen the beam. Touch and reduced motion also get a
 * Reveal toggle; under reduced motion the beam is a still spot. Before the pointer arrives the beam idles on a slow
 * Lissajous path (paused while off-screen).
 */
export function CursorFlashlight({ children, reveal, radius = 110, className }: CursorFlashlightProps) {
  const reduced = useReducedMotion();
  const touch = usePrefersTouch();
  const top = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = top.current;
    const host = el?.parentElement;
    if (!el || !host || reduced) return;
    // Until the pointer arrives (and after it leaves) the beam idles along a slow Lissajous path,
    // so the effect reads at a glance in galleries and on load.
    let idle = true;
    const b0 = host.getBoundingClientRect();
    const cur = { x: b0.width / 2, y: b0.height / 2, r: 0 }, tgt = { x: cur.x, y: cur.y, r: radius * 0.9 };
    let raf = 0;
    const tick = (now: number) => {
      if (idle) {
        const b = host.getBoundingClientRect();
        tgt.x = b.width * (0.5 + Math.cos(now * 0.00055) * 0.3);
        tgt.y = b.height * (0.5 + Math.sin(now * 0.0009) * 0.22);
      }
      const k = idle ? 0.06 : 0.18;
      cur.x += (tgt.x - cur.x) * k;
      cur.y += (tgt.y - cur.y) * k;
      cur.r += (tgt.r - cur.r) * 0.12;
      el.style.setProperty("--fx", `${cur.x}px`);
      el.style.setProperty("--fy", `${cur.y}px`);
      el.style.setProperty("--fr", `${cur.r}px`);
      raf = (idle && visible) || Math.abs(tgt.x - cur.x) + Math.abs(tgt.y - cur.y) + Math.abs(tgt.r - cur.r) > 0.3 ? requestAnimationFrame(tick) : 0;
    };
    const kick = () => (raf ||= requestAnimationFrame(tick));
    let visible = false;
    const io = new IntersectionObserver(([e]) => ((visible = !!e?.isIntersecting), visible && kick()));
    io.observe(host);
    const move = (e: PointerEvent) => {
      const b = host.getBoundingClientRect();
      idle = false;
      tgt.x = e.clientX - b.left;
      tgt.y = e.clientY - b.top;
      kick();
    };
    const leave = () => ((idle = true), (tgt.r = radius * 0.9), kick());
    const enter = () => ((tgt.r = radius), kick());
    const down = () => ((tgt.r = radius * 2.2), kick());
    const up = () => ((tgt.r = radius), kick());
    host.addEventListener("pointermove", move);
    host.addEventListener("pointerleave", leave);
    host.addEventListener("pointerenter", enter);
    host.addEventListener("pointerdown", down);
    window.addEventListener("pointerup", up);
    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      host.removeEventListener("pointermove", move);
      host.removeEventListener("pointerleave", leave);
      host.removeEventListener("pointerenter", enter);
      host.removeEventListener("pointerdown", down);
      window.removeEventListener("pointerup", up);
    };
  }, [radius, reduced]);

  const mask = "radial-gradient(circle var(--fr, 0px) at var(--fx, -999px) var(--fy, -999px), transparent 0%, transparent 70%, #000 100%)";
  const fallback = touch || reduced;
  return (
    <div className={cn("group/fl relative isolate overflow-hidden", className)}>
      <div className="absolute inset-0">{reveal}</div>
      <div
        ref={top}
        className={cn("relative h-full", fallback && "transition-opacity duration-300 group-has-[[data-fl-on]]/fl:opacity-0")}
        style={{ WebkitMaskImage: mask, maskImage: mask, ...(reduced && ({ "--fx": "62%", "--fy": "45%", "--fr": `${radius}px` } as CSSProperties)) }}
      >
        {children}
      </div>
      {fallback && <FallbackToggle />}
    </div>
  );
}

function FallbackToggle() {
  return (
    <button
      type="button"
      onClick={(e) => (e.currentTarget.toggleAttribute("data-fl-on"), e.currentTarget.setAttribute("aria-pressed", String(e.currentTarget.hasAttribute("data-fl-on"))))}
      aria-pressed="false"
      className="absolute bottom-3 right-3 z-10 rounded-full bg-white/90 px-3 py-1.5 text-xs font-medium text-black"
    >
      Reveal
    </button>
  );
}
```

## Usage example
```tsx
"use client";
import { photos } from "@/components/kinetik/demo-helpers" /* or inline */;
import { CursorFlashlight } from "@/components/kinetik/cursor-flashlight";

export default function Demo() {
  return (
    <CursorFlashlight
      className="h-full"
      reveal={
        <div className="relative size-full">
          <img src={photos[2]} alt="" className="absolute inset-0 size-full object-cover" />
          <div className="absolute inset-0 grid place-items-center">
            <p className="rounded-2xl bg-black/40 px-5 py-3 text-center text-2xl font-semibold text-white backdrop-blur">The city never sleeps.</p>
          </div>
        </div>
      }
    >
      <div className="size-full bg-[#07070b] p-8 text-white">
        <div className="max-w-56">
          <p className="text-[10px] uppercase tracking-[0.35em] text-white/40">Night mode</p>
          <h3 className="mt-2 text-3xl font-semibold leading-tight tracking-tight">Shine a light around</h3>
          <p className="mt-1 text-sm text-white/45">Move to explore · press to widen the beam</p>
        </div>
      </div>
    </CursorFlashlight>
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
