You are given a task to integrate a component from the **kinetik** motion library into this codebase.

# Scroll Text Mask (`scroll-text-mask`)

Giant knockout type as a window: the photo shows only through the letters, then scroll scales the type ~40× from inside a letter until the image fills the screen and the next content fades in.

## What it should do
Build a scroll text mask: sticky viewport with the photo underneath and an SVG 'sheet' (background-coloured rect masked by a big text knockout) on top; scale the SVG from 1 to 42 around a point inside a letter as scroll progresses 0→.75, also scale the photo 1.35→1, fade the sheet out late as a safety net and fade the follow-up content in.

## Project requirements
- React 19 + TypeScript, Tailwind CSS v4, shadcn/ui-style CSS variables (`background`, `foreground`, `muted`, `muted-foreground`, `border`, `card`, `primary`, `ring`). If the project lacks shadcn, set it up first (`npx shadcn@latest init`).
- Animation engine: **motion**.
- Install dependencies: `npm i motion`
- Put the component at `components/kinetik/scroll-text-mask.tsx`.
- `cn` lives at `lib/kinetik/utils.ts` (source below).
- Shared hooks go at `lib/kinetik/core.ts` (source below).

## Non-negotiables
- **Accessibility:** The word is available as sr-only text; reduced motion shows the image with the content on top.
- **Performance:** One SVG mask scaled with a transform; sheet fades as a fallback.
- Respect `prefers-reduced-motion` (replace movement with opacity or an instant change).
- Animate only transform / opacity / filter / clip-path. No hard-coded theme colors — use CSS variables so it works in light and dark.

## Source — components/kinetik/scroll-text-mask.tsx
```tsx
"use client";
import { useId, useRef, type ReactNode, type RefObject } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { cn, useReducedMotion } from "@/lib/kinetik/core";

export interface ScrollTextMaskProps {
  /** Word(s) the image shows through. Short and heavy works best. */
  text: string;
  image: string;
  /** Content revealed after the mask opens. */
  children?: ReactNode;
  container?: RefObject<HTMLElement | null>;
  className?: string;
}

/**
 * Giant knockout type as a window: the photo shows only through the letters, then as you scroll the
 * type scales up ~40× from a point inside a letter until the image fills the screen and the
 * follow-up content fades in. The mask is real SVG text, so it stays crisp at any scale.
 */
export function ScrollTextMask({ text, image, children, container, className }: ScrollTextMaskProps) {
  const reduced = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const maskId = `kn-tm-${useId().replace(/:/g, "")}`;
  const { scrollYProgress: p } = useScroll({ target: ref, container, offset: ["start start", "end end"] });
  const scale = useTransform(p, [0, 0.75], [1, 42], { clamp: true });
  const imgScale = useTransform(p, [0, 0.75], [1.35, 1]);
  const after = useTransform(p, [0.7, 0.9], [0, 1]);
  const veil = useTransform(p, [0, 0.6], [1, 0]);
  // safety net: if the zoom origin lands between letters, the sheet still fades away
  const sheet = useTransform(p, [0.55, 0.78], [1, 0]);

  if (reduced)
    return (
      <div ref={ref} className={cn("relative h-[100cqh] overflow-hidden", className)}>
        <img src={image} alt="" className="size-full object-cover" />
        <div className="absolute inset-0 grid place-items-center bg-black/40 p-6 text-white">{children ?? <h3 className="text-5xl font-black">{text}</h3>}</div>
      </div>
    );

  return (
    <div ref={ref} className={cn("relative h-[280cqh]", className)}>
      <div className="sticky top-0 h-[100cqh] overflow-hidden bg-background">
        <div className="absolute inset-0">
          <motion.img src={image} alt="" className="absolute inset-0 size-full object-cover" style={{ scale: imgScale }} />
        </div>
        {/* mask: background-coloured sheet with the word cut out, scaled from a point inside the first letter */}
        <motion.svg aria-hidden viewBox="0 0 1000 600" preserveAspectRatio="xMidYMid slice" className="absolute inset-0 size-full" style={{ scale, opacity: sheet, transformOrigin: "47% 52%" }}>
          <defs>
            <mask id={maskId}>
              <rect width="1000" height="600" fill="white" />
              <text x="500" y="375" textAnchor="middle" fontSize="300" fontWeight="900" letterSpacing="-14" fill="black" fontFamily="inherit">{text}</text>
            </mask>
          </defs>
          <rect width="1000" height="600" mask={`url(#${maskId})`} className="fill-background" />
        </motion.svg>
        <motion.p style={{ opacity: veil }} className="absolute inset-x-0 bottom-8 text-center text-xs uppercase tracking-[0.3em] text-muted-foreground">Scroll to step inside</motion.p>
        <motion.div style={{ opacity: after }} className="absolute inset-0 grid place-items-center bg-black/35 p-6 text-center text-white">
          {children}
        </motion.div>
      </div>
      <span className="sr-only">{text}</span>
    </div>
  );
}
```

## Usage example
```tsx
"use client";
import { DemoScroller, photos, useDemoScroller } from "@/components/kinetik/demo-helpers" /* or inline */;
import { ScrollTextMask } from "@/components/kinetik/scroll-text-mask";

function Inner() {
  const s = useDemoScroller() ?? undefined;
  return (
    <ScrollTextMask container={s} text="WILD" image={photos[3]}>
      <div>
        <p className="text-[10px] uppercase tracking-[0.35em] opacity-80">Field guide · Vol. 2</p>
        <h3 className="mt-2 text-4xl font-semibold tracking-tight">Into the canopy</h3>
      </div>
    </ScrollTextMask>
  );
}

export default function Demo() {
  return (
    <DemoScroller thumbAt={0.01}>
      <Inner />
    </DemoScroller>
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
