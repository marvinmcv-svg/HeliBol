You are given a task to integrate a component from the **kinetik** motion library into this codebase.

# SVG Path Draw (`svg-path-draw`)

Every stroke inside an SVG draws itself — once on view, or scrubbed with scroll — with GSAP DrawSVG. Illustrations, signatures, diagrams.

## What it should do
Create an SVG wrapper that draws all stroked children (path, line, polyline, circle, rect, ellipse) with GSAP `DrawSVGPlugin`: `gsap.from(shapes, { drawSVG: 0, stagger })` triggered by ScrollTrigger at "top 80%", or scrubbed between "top 80%" and "bottom 40%" in scrub mode. Inside `useGSAP()`; skip under reduced motion.

## Project requirements
- React 19 + TypeScript, Tailwind CSS v4, shadcn/ui-style CSS variables (`background`, `foreground`, `muted`, `muted-foreground`, `border`, `card`, `primary`, `ring`). If the project lacks shadcn, set it up first (`npx shadcn@latest init`).
- Animation engine: **gsap**.
- Install dependencies: `npm i gsap @gsap/react`
- Put the component at `components/kinetik/svg-path-draw.tsx`.
- `cn` lives at `lib/kinetik/utils.ts` (source below).
- Shared hooks go at `lib/kinetik/core.ts` (source below).

## Non-negotiables
- **Accessibility:** Add role=img + aria-label (or <title>) to meaningful illustrations; decorative ones aria-hidden. Reduced motion: drawn immediately.
- **Performance:** stroke-dashoffset only; works on any shape type (path, line, circle, rect…).
- Respect `prefers-reduced-motion` (replace movement with opacity or an instant change).
- Animate only transform / opacity / filter / clip-path. No hard-coded theme colors — use CSS variables so it works in light and dark.

## Source — components/kinetik/svg-path-draw.tsx
```tsx
"use client";
import { useRef, type ReactNode, type RefObject } from "react";
import gsap from "gsap";
import { DrawSVGPlugin } from "gsap/DrawSVGPlugin";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { cn, useReducedMotion } from "@/lib/kinetik/core";

gsap.registerPlugin(DrawSVGPlugin, ScrollTrigger, useGSAP);

export interface SvgPathDrawProps {
  /** SVG markup (paths, lines, circles…) — every stroked shape is drawn. */
  children: ReactNode;
  viewBox: string;
  /** "view" draws once on enter; "scrub" ties drawing to scroll position. */
  mode?: "view" | "scrub";
  scroller?: RefObject<HTMLElement | null>;
  duration?: number;
  stagger?: number;
  className?: string;
}

export function SvgPathDraw({ children, viewBox, mode = "view", scroller, duration = 1.6, stagger = 0.15, className }: SvgPathDrawProps) {
  const ref = useRef<SVGSVGElement>(null);
  const reduced = useReducedMotion();
  useGSAP(
    () => {
      if (reduced) return;
      const shapes = ref.current!.querySelectorAll("path, line, polyline, circle, rect, ellipse");
      gsap.from(shapes, {
        drawSVG: 0,
        duration,
        stagger,
        ease: mode === "scrub" ? "none" : "power2.inOut",
        scrollTrigger: {
          trigger: ref.current,
          scroller: scroller?.current ?? undefined,
          start: "top 80%",
          end: mode === "scrub" ? "bottom 40%" : undefined,
          scrub: mode === "scrub" ? 0.5 : false,
        },
      });
    },
    { scope: ref, dependencies: [reduced, mode] },
  );
  return (
    <svg ref={ref} viewBox={viewBox} fill="none" className={cn("overflow-visible", className)}>
      {children}
    </svg>
  );
}
```

## Usage example
```tsx
"use client";
import { SvgPathDraw } from "@/components/kinetik/svg-path-draw";

export default function Demo() {
  return (
    <div className="flex h-full w-full items-center justify-center gap-10 p-6">
      <SvgPathDraw viewBox="0 0 200 120" className="w-72 text-foreground" duration={2.2} stagger={0.3}>
        <path d="M10 110 L60 30 L90 75 L120 45 L190 110" stroke="currentColor" strokeWidth="3" strokeLinejoin="round" strokeLinecap="round" />
        <circle cx="150" cy="28" r="12" stroke="#f59e0b" strokeWidth="3" />
        <path d="M10 110 H190" stroke="currentColor" strokeOpacity=".4" strokeWidth="2" strokeLinecap="round" />
        <path d="M25 92 C 55 70, 75 100, 105 85 S 160 70, 180 92" stroke="#8b5cf6" strokeWidth="2.5" strokeLinecap="round" strokeDasharray="0" />
      </SvgPathDraw>
      <SvgPathDraw viewBox="0 0 120 40" className="hidden w-40 text-foreground sm:block" duration={2.4}>
        <path d="M5 30 C 15 5, 25 5, 22 28 C 20 38, 32 10, 40 12 C 48 14, 40 32, 50 28 C 58 25, 60 10, 68 14 C 74 18, 66 32, 76 28 C 86 24, 90 8, 98 12 C 106 16, 100 34, 115 26" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
      </SvgPathDraw>
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
```

## Steps
1. Install the dependencies above.
2. Create the files exactly as given, fixing import aliases if the project doesn't use `@/`.
3. Drop the usage example into a page and adapt copy/colors to the project's design system.
4. Verify: toggle "Reduce motion" in OS settings — the component must still be fully usable.
