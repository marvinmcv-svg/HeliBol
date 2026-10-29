You are given a task to integrate a component from the **kinetik** motion library into this codebase.

# Parallax Layer (`parallax-layer`)

Wrap anything to give it its own scroll speed. Stack several with different speeds for collage-style depth.

## What it should do
Create a ParallaxLayer wrapper: Motion `useScroll({ target: ref, offset: ["start end", "end start"] })` mapped with `useTransform` to `y` from +speed/2 to -speed/2, applied as a transform. Demo three absolutely positioned layers (two photos, one glass card) with different speeds (80, 260, -160). Reduced motion: y = 0.

## Project requirements
- React 19 + TypeScript, Tailwind CSS v4, shadcn/ui-style CSS variables (`background`, `foreground`, `muted`, `muted-foreground`, `border`, `card`, `primary`, `ring`). If the project lacks shadcn, set it up first (`npx shadcn@latest init`).
- Animation engine: **motion**.
- Install dependencies: `npm i motion`
- Put the component at `components/kinetik/parallax-layer.tsx`.
- `cn` lives at `lib/kinetik/utils.ts` (source below).
- Shared hooks go at `lib/kinetik/core.ts` (source below).

## Non-negotiables
- **Accessibility:** Pure decoration; reduced motion pins layers in place.
- **Performance:** Transform-only; one scroll observer per layer via Motion's shared scroll tracker.
- Respect `prefers-reduced-motion` (replace movement with opacity or an instant change).
- Animate only transform / opacity / filter / clip-path. No hard-coded theme colors — use CSS variables so it works in light and dark.

## Source — components/kinetik/parallax-layer.tsx
```tsx
"use client";
import { useRef, type ReactNode, type RefObject } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { cn, useReducedMotion } from "@/lib/kinetik/core";

export interface ParallaxLayerProps {
  children: ReactNode;
  /** Pixels of travel across the element's pass through the viewport. Negative = moves up faster. */
  speed?: number;
  container?: RefObject<HTMLElement | null>;
  className?: string;
}

export function ParallaxLayer({ children, speed = 120, container, className }: ParallaxLayerProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, container, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [speed / 2, -speed / 2]);
  return (
    <motion.div ref={ref} style={{ y: reduced ? 0 : y }} className={cn("will-change-transform", className)}>
      {children}
    </motion.div>
  );
}
```

## Usage example
```tsx
"use client";
import { DemoScroller, photos, useDemoScroller } from "@/components/kinetik/demo-helpers" /* or inline */;
import { ParallaxLayer } from "@/components/kinetik/parallax-layer";

function Scene() {
  const c = useDemoScroller() ?? undefined;
  return (
    <div className="relative px-6 pt-6 pb-[60cqh]">
      <div className="relative mx-auto h-[520px] max-w-3xl">
        <ParallaxLayer container={c} speed={80} className="absolute top-0 left-0 w-[46%]">
          <img src={photos[1]} alt="" className="aspect-[3/4] rounded-2xl object-cover shadow-2xl" />
        </ParallaxLayer>
        <ParallaxLayer container={c} speed={260} className="absolute top-24 right-0 w-[40%]">
          <img src={photos[5]} alt="" className="aspect-[3/4] rounded-2xl object-cover shadow-2xl" />
        </ParallaxLayer>
        <ParallaxLayer container={c} speed={-160} className="absolute top-[45%] left-[30%] z-10 w-[36%]">
          <div className="rounded-2xl border border-border bg-card/80 p-5 shadow-2xl backdrop-blur">
            <p className="text-xs uppercase tracking-widest text-muted-foreground">Depth</p>
            <p className="mt-1 text-xl font-semibold">Three layers, three speeds.</p>
          </div>
        </ParallaxLayer>
      </div>
    </div>
  );
}

export default function Demo() {
  return (
    <DemoScroller>
      <Scene />
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
```

## Steps
1. Install the dependencies above.
2. Create the files exactly as given, fixing import aliases if the project doesn't use `@/`.
3. Drop the usage example into a page and adapt copy/colors to the project's design system.
4. Verify: toggle "Reduce motion" in OS settings — the component must still be fully usable.
