You are given a task to integrate a component from the **kinetik** motion library into this codebase.

# Form — Emoji Feedback (`form-emoji-feedback`)

Feedback rating where one drawn face does the talking: choose 1–5 and the mouth curve bends from frown to grin, brows tilt, eyes squint and the face warms; a comment box slides open and Send turns into a thank-you.

## What it should do
Map the rating to k = 0..1; derive the mouth quadratic control point, brow rotation, eye height and fill colour from k and animate them with springs; reveal the comment field and submit button once rated.

## Project requirements
- React 19 + TypeScript, Tailwind CSS v4, shadcn/ui-style CSS variables (`background`, `foreground`, `muted`, `muted-foreground`, `border`, `card`, `primary`, `ring`). If the project lacks shadcn, set it up first (`npx shadcn@latest init`).
- Animation engine: **motion**.
- Install dependencies: `npm i motion`
- Put the component at `components/kinetik/form-emoji-feedback.tsx`.
- `cn` lives at `lib/kinetik/utils.ts` (source below).
- Shared hooks go at `lib/kinetik/core.ts` (source below).

## Non-negotiables
- **Accessibility:** Rating is a radiogroup with text labels; the face is decorative. Reduced motion swaps states without springs.
- **Performance:** One SVG; path d and transforms animate.
- Respect `prefers-reduced-motion` (replace movement with opacity or an instant change).
- Animate only transform / opacity / filter / clip-path. No hard-coded theme colors — use CSS variables so it works in light and dark.

## Source — components/kinetik/form-emoji-feedback.tsx
```tsx
"use client";
import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { cn, useReducedMotion } from "@/lib/kinetik/core";

export interface FormEmojiFeedbackProps {
  question?: string;
  labels?: [string, string, string, string, string];
  onSubmit?: (rating: number, comment: string) => void;
  className?: string;
}

const COLORS = ["#ef4444", "#f97316", "#facc15", "#84cc16", "#22c55e"];

/**
 * Feedback rating where one face does all the talking: slide or tap 1–5 and the drawn face morphs —
 * the mouth curve bends from frown to grin, brows tilt, eyes squint into a smile, the face colour
 * warms — then a comment box slides open and Send turns into a thank-you.
 */
export function FormEmojiFeedback({ question = "How was your experience?", labels = ["Awful", "Meh", "Okay", "Good", "Loved it"], onSubmit, className }: FormEmojiFeedbackProps) {
  const reduced = useReducedMotion();
  const [r, setR] = useState<number | null>(null);
  const [comment, setComment] = useState("");
  const [sent, setSent] = useState(false);
  const v = r ?? 2; // face shown before choosing = neutral
  const k = v / 4; // 0..1
  const mouth = `M68 ${128 - k * 4} Q100 ${112 + k * 44} 132 ${128 - k * 4}`;
  const spring = reduced ? { duration: 0 } : { type: "spring" as const, stiffness: 220, damping: 18 };

  return (
    <form
      onSubmit={(e) => (e.preventDefault(), r !== null && (setSent(true), onSubmit?.(r + 1, comment)))}
      className={cn("w-[320px] overflow-hidden rounded-[28px] border bg-card p-6 text-center shadow-xl", className)}
    >
      <AnimatePresence mode="wait" initial={false}>
        {sent ? (
          <motion.div key="thanks" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="space-y-2 py-10">
            <p className="text-4xl" aria-hidden>💌</p>
            <p className="text-lg font-semibold">Thanks for the feedback!</p>
            <button type="button" onClick={() => (setSent(false), setR(null), setComment(""))} className="text-xs text-muted-foreground underline">Rate again</button>
          </motion.div>
        ) : (
          <motion.div key="form" exit={{ opacity: 0, y: -10 }} className="space-y-4">
            <p className="font-semibold">{question}</p>
            <svg viewBox="0 0 200 200" className="mx-auto size-32" aria-hidden>
              <motion.circle cx="100" cy="100" r="80" animate={{ fill: r === null ? "#e4e4e7" : COLORS[v] }} transition={{ duration: reduced ? 0 : 0.35 }} />
              <motion.path d="M58 70 L84 74" stroke="#18181b" strokeWidth="6" strokeLinecap="round" animate={{ rotate: (0.5 - k) * 24, y: k * -4 }} style={{ originX: 0.5, originY: 0.5 }} transition={spring} />
              <motion.path d="M116 74 L142 70" stroke="#18181b" strokeWidth="6" strokeLinecap="round" animate={{ rotate: (k - 0.5) * 24, y: k * -4 }} style={{ originX: 0.5, originY: 0.5 }} transition={spring} />
              <motion.ellipse cx="74" cy="92" rx="8" fill="#18181b" animate={{ ry: 10 - k * 6 }} transition={spring} />
              <motion.ellipse cx="126" cy="92" rx="8" fill="#18181b" animate={{ ry: 10 - k * 6 }} transition={spring} />
              <motion.path fill="none" stroke="#18181b" strokeWidth="7" strokeLinecap="round" animate={{ d: mouth }} transition={spring} />
            </svg>
            <div role="radiogroup" aria-label="Rating" className="flex justify-between gap-1">
              {labels.map((l, i) => (
                <button key={l} type="button" role="radio" aria-checked={r === i} onClick={() => setR(i)} className="relative flex-1 rounded-full py-1.5 text-[11px] font-medium">
                  {r === i && <motion.span layoutId="kn-emoji-pill" className="absolute inset-0 rounded-full" style={{ background: COLORS[i] }} transition={spring} />}
                  <span className={cn("relative", r === i ? "text-black" : "text-muted-foreground")}>{l}</span>
                </button>
              ))}
            </div>
            <AnimatePresence initial={false}>
              {r !== null && (
                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: reduced ? 0 : 0.3 }} className="space-y-3 overflow-hidden">
                  <textarea value={comment} onChange={(e) => setComment(e.target.value)} rows={2} placeholder={r < 2 ? "What went wrong?" : "What did you like?"} aria-label="Comment" className="w-full resize-none rounded-xl border bg-background p-3 text-sm outline-none focus:ring-2 focus:ring-ring" />
                  <button type="submit" className="h-10 w-full rounded-full bg-foreground text-sm font-medium text-background">Send feedback</button>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </form>
  );
}
```

## Usage example
```tsx
"use client";
import { DemoCenter } from "@/components/kinetik/demo-helpers" /* or inline */;
import { FormEmojiFeedback } from "@/components/kinetik/form-emoji-feedback";

export default function Demo() {
  return (
    <DemoCenter>
      <FormEmojiFeedback />
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
