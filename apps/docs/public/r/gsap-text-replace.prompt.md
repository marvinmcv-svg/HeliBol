You are given a task to integrate a component from the **kinetik** motion library into this codebase.

# Text Replace (`gsap-text-replace`)

Animated text replacement with GSAP's TextPlugin: each phrase is rewritten into the next, by character or by word, with a highlight sweeping behind it.

## What it should do
Build a TextPlugin headline: a repeating GSAP timeline that, for each phrase, sweeps a highlight bar in (scaleX 0→1 from the left), tweens the span with text: { value: next, delimiter: mode === 'word' ? ' ' : '' }, then sweeps the bar out to the right. Reduced motion: fade out, set text, fade in.

## Project requirements
- React 19 + TypeScript, Tailwind CSS v4, shadcn/ui-style CSS variables (`background`, `foreground`, `muted`, `muted-foreground`, `border`, `card`, `primary`, `ring`). If the project lacks shadcn, set it up first (`npx shadcn@latest init`).
- Animation engine: **gsap**.
- Install dependencies: `npm i gsap @gsap/react`
- Put the component at `components/kinetik/gsap-text-replace.tsx`.
- `cn` lives at `lib/kinetik/utils.ts` (source below).
- Shared hooks go at `lib/kinetik/core.ts` (source below).

## Non-negotiables
- **Accessibility:** The text node is aria-live=polite; reduced motion swaps phrases with a fade.
- **Performance:** One repeating timeline; TextPlugin edits a single text node.
- Respect `prefers-reduced-motion` (replace movement with opacity or an instant change).
- Animate only transform / opacity / filter / clip-path. No hard-coded theme colors — use CSS variables so it works in light and dark.

## Source — components/kinetik/gsap-text-replace.tsx
```tsx
"use client";
import { useRef } from "react";
import gsap from "gsap";
import { TextPlugin } from "gsap/TextPlugin";
import { useGSAP } from "@gsap/react";
import { cn, useReducedMotion } from "@/lib/kinetik/core";

gsap.registerPlugin(TextPlugin, useGSAP);

export interface GsapTextReplaceProps {
  /** Phrases to replace in turn. */
  phrases: string[];
  /** "char" types character by character; "word" swaps word by word. */
  mode?: "char" | "word";
  /** Seconds each phrase holds. */
  hold?: number;
  className?: string;
}

/**
 * Animated text replacement with GSAP's TextPlugin: the current phrase is rewritten into the next one
 * (by character or by word) with a highlight sweeping behind it, on a repeating timeline.
 */
export function GsapTextReplace({ phrases, mode = "char", hold = 1.6, className }: GsapTextReplaceProps) {
  const root = useRef<HTMLSpanElement>(null);
  const text = useRef<HTMLSpanElement>(null);
  const mark = useRef<HTMLSpanElement>(null);
  const reduced = useReducedMotion();

  useGSAP(
    () => {
      const el = text.current!;
      el.textContent = phrases[0];
      const tl = gsap.timeline({ repeat: -1 });
      phrases.forEach((_, i) => {
        const next = phrases[(i + 1) % phrases.length];
        if (reduced) {
          tl.to(el, { autoAlpha: 0, duration: 0.2, delay: hold }).set(el, { textContent: next }).to(el, { autoAlpha: 1, duration: 0.2 });
          return;
        }
        tl.to(mark.current, { scaleX: 1, transformOrigin: "left", duration: 0.35, ease: "power2.in", delay: hold })
          .to(el, { duration: mode === "char" ? Math.max(0.4, next.length * 0.035) : 0.6, text: { value: next, delimiter: mode === "word" ? " " : "" }, ease: "none" })
          .to(mark.current, { scaleX: 0, transformOrigin: "right", duration: 0.35, ease: "power2.out" });
      });
    },
    { scope: root, dependencies: [phrases.join("|"), mode, hold, reduced], revertOnUpdate: true },
  );

  return (
    <span ref={root} className={cn("relative inline-block", className)}>
      <span ref={mark} aria-hidden className="absolute -inset-x-1 inset-y-0 -z-10 scale-x-0 rounded bg-primary/20" />
      <span ref={text} aria-live="polite">{phrases[0]}</span>
    </span>
  );
}
```

## Usage example
```tsx
"use client";
import { GsapTextReplace } from "@/components/kinetik/gsap-text-replace";

export default function Demo() {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-6 p-8 text-center">
      <h3 className="text-3xl font-semibold tracking-tight sm:text-4xl">
        Build <GsapTextReplace phrases={["landing pages", "AI interfaces", "mobile flows", "3D heroes"]} className="text-primary" />
      </h3>
      <p className="max-w-md text-muted-foreground">
        <GsapTextReplace mode="word" phrases={["Copy the code and ship it today.", "Or paste the prompt into your agent.", "Every piece respects reduced motion."]} />
      </p>
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
