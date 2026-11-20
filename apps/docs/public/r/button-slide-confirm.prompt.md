You are given a task to integrate a component from the **kinetik** motion library into this codebase.

# Button — Slide to Confirm (`button-slide-confirm`)

Slide-to-confirm control for risky actions: drag the knob along the track, the fill follows and the label shimmers and fades; past 85% it completes with a check, otherwise it springs back.

## What it should do
Track with a draggable knob constrained to the track; useTransform the knob x into fill width and label opacity; on drag end if x > 85% animate to end and call onConfirm, else spring back; add keyboard handlers.

## Project requirements
- React 19 + TypeScript, Tailwind CSS v4, shadcn/ui-style CSS variables (`background`, `foreground`, `muted`, `muted-foreground`, `border`, `card`, `primary`, `ring`). If the project lacks shadcn, set it up first (`npx shadcn@latest init`).
- Animation engine: **motion**.
- Install dependencies: `npm i motion lucide-react`
- Put the component at `components/kinetik/button-slide-confirm.tsx`.
- `cn` lives at `lib/kinetik/utils.ts` (source below).
- Shared hooks go at `lib/kinetik/core.ts` (source below).

## Non-negotiables
- **Accessibility:** Role=slider with aria-valuenow; Enter/Space/→/End complete it from the keyboard. Reduced motion removes the shimmer.
- **Performance:** Drag on one motion value; fill and label opacity are derived transforms.
- Respect `prefers-reduced-motion` (replace movement with opacity or an instant change).
- Animate only transform / opacity / filter / clip-path. No hard-coded theme colors — use CSS variables so it works in light and dark.

## Source — components/kinetik/button-slide-confirm.tsx
```tsx
"use client";
import { useRef, useState } from "react";
import { animate, motion, useMotionValue, useTransform } from "motion/react";
import { ArrowRight, Check } from "lucide-react";
import { cn, useReducedMotion } from "@/lib/kinetik/core";

export interface ButtonSlideConfirmProps {
  label?: string;
  doneLabel?: string;
  onConfirm?: () => void;
  /** Track width in px. */
  width?: number;
  className?: string;
}

const KNOB = 52;

/**
 * Slide to confirm (iOS "slide to power off"): drag the knob across — the label fades and a
 * shimmer sweeps the text, the track fills behind the knob, releasing short springs back, reaching
 * the end locks into a green success state. Keyboard: Enter/Space or arrow keys complete it.
 */
export function ButtonSlideConfirm({ label = "Slide to pay", doneLabel = "Paid", onConfirm, width = 300, className }: ButtonSlideConfirmProps) {
  const reduced = useReducedMotion();
  const [done, setDone] = useState(false);
  const max = width - KNOB - 8;
  const x = useMotionValue(0);
  const fill = useTransform(x, (v) => v + KNOB);
  const textOpacity = useTransform(x, [0, max * 0.6], [1, 0]);
  const knob = useRef<HTMLDivElement>(null);

  const complete = () => {
    if (done) return;
    setDone(true);
    animate(x, max, reduced ? { duration: 0 } : { type: "spring", stiffness: 500, damping: 35 });
    onConfirm?.();
  };

  return (
    <div
      className={cn("relative h-[60px] select-none overflow-hidden rounded-full p-1 transition-colors duration-500", done ? "bg-emerald-500" : "bg-zinc-900", className)}
      style={{ width }}
    >
      <motion.div aria-hidden className={cn("absolute inset-y-1 left-1 rounded-full", done ? "bg-emerald-500" : "bg-zinc-700/60")} style={{ width: fill }} />
      <motion.span aria-hidden style={{ opacity: done ? 0 : textOpacity }} className="kn-slide-shimmer pointer-events-none absolute inset-0 grid place-items-center pl-10 text-sm font-semibold text-white/70">
        <span className="bg-[linear-gradient(110deg,rgb(255_255_255/.45)_35%,#fff_50%,rgb(255_255_255/.45)_65%)] bg-[length:200%_100%] bg-clip-text text-transparent motion-safe:animate-[kn-slide-sheen_2.4s_linear_infinite]">{label}</span>
      </motion.span>
      {done && <motion.span initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="absolute inset-0 grid place-items-center pr-10 text-sm font-semibold text-white">{doneLabel}</motion.span>}
      <style href="kn-button-slide-confirm" precedence="kinetik">{`@keyframes kn-slide-sheen { from { background-position: 200% 0 } to { background-position: -200% 0 } } [data-reduce-motion] .kn-slide-shimmer span { animation: none !important; }`}</style>
      <motion.div
        ref={knob}
        role="slider"
        tabIndex={done ? -1 : 0}
        aria-label={label}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={done ? 100 : 0}
        aria-valuetext={done ? doneLabel : "Not confirmed"}
        drag={done ? false : "x"}
        dragConstraints={{ left: 0, right: max }}
        dragElastic={0.04}
        dragMomentum={false}
        onDragEnd={() => (x.get() > max * 0.85 ? complete() : animate(x, 0, reduced ? { duration: 0 } : { type: "spring", stiffness: 500, damping: 30 }))}
        onKeyDown={(e) => ["Enter", " ", "ArrowRight", "End"].includes(e.key) && (e.preventDefault(), complete())}
        style={{ x, width: KNOB, height: KNOB }}
        whileTap={done || reduced ? undefined : { scale: 0.94 }}
        className="relative z-10 grid cursor-grab place-items-center rounded-full bg-white text-zinc-900 shadow-lg outline-none focus-visible:ring-2 focus-visible:ring-ring active:cursor-grabbing"
      >
        {done ? <Check className="size-5 text-emerald-600" strokeWidth={3} /> : <ArrowRight className="size-5" />}
      </motion.div>
    </div>
  );
}
```

## Usage example
```tsx
"use client";
import { useState } from "react";
import { DemoCenter } from "@/components/kinetik/demo-helpers" /* or inline */;
import { ButtonSlideConfirm } from "@/components/kinetik/button-slide-confirm";

export default function Demo() {
  const [k, setK] = useState(0);
  return (
    <DemoCenter className="flex-col gap-5">
      <p className="text-sm text-muted-foreground">Total <span className="font-semibold text-foreground">$128.40</span></p>
      <ButtonSlideConfirm key={k} label="Slide to pay" doneLabel="Paid · $128.40" />
      <button onClick={() => setK((x) => x + 1)} className="text-xs text-muted-foreground underline underline-offset-4">Reset</button>
    </DemoCenter>
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
