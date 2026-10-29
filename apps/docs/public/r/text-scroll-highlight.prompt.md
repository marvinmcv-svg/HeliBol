You are given a task to integrate a component from the **kinetik** motion library into this codebase.

# Scroll Highlight Text (`text-scroll-highlight`)

Words light up one by one, scrubbed to scroll position — the 'read along' manifesto paragraph.

## What it should do
Build a scroll-scrubbed paragraph: each word starts at 15% opacity and reaches 100% as the paragraph moves from 85% to 40% of the viewport, word ranges evenly divided across the scroll progress.

Keep: Motion `useScroll({ target, offset: ["start 0.85", "end 0.4"] })` and one `useTransform` per word, optional `container` ref, aria-label sentence with aria-hidden words, reduced motion = static paragraph.

## Project requirements
- React 19 + TypeScript, Tailwind CSS v4, shadcn/ui-style CSS variables (`background`, `foreground`, `muted`, `muted-foreground`, `border`, `card`, `primary`, `ring`). If the project lacks shadcn, set it up first (`npx shadcn@latest init`).
- Animation engine: **motion**.
- Install dependencies: `npm i motion`
- Put the component at `components/kinetik/text-scroll-highlight.tsx`.
- `cn` lives at `lib/kinetik/utils.ts` (source below).
- Shared hooks go at `lib/kinetik/core.ts` (source below).

## Non-negotiables
- **Accessibility:** Full sentence in aria-label; words aria-hidden. Reduced motion: plain paragraph at full opacity.
- **Performance:** One scroll listener (Motion), opacity-only per word.
- Respect `prefers-reduced-motion` (replace movement with opacity or an instant change).
- Animate only transform / opacity / filter / clip-path. No hard-coded theme colors — use CSS variables so it works in light and dark.

## Source — components/kinetik/text-scroll-highlight.tsx
```tsx
"use client";
import { useRef, type RefObject } from "react";
import { motion, useScroll, useTransform, type MotionValue } from "motion/react";
import { cn, useReducedMotion } from "@/lib/kinetik/core";

export interface TextScrollHighlightProps {
  children: string;
  /** Scroll container (defaults to the window). */
  container?: RefObject<HTMLElement | null>;
  className?: string;
  /** Opacity of not-yet-read words. */
  dim?: number;
}

function Word({ word, range, progress, dim }: { word: string; range: [number, number]; progress: MotionValue<number>; dim: number }) {
  const opacity = useTransform(progress, range, [dim, 1]);
  return (
    <motion.span style={{ opacity }} className="inline-block whitespace-pre">
      {word}
    </motion.span>
  );
}

export function TextScrollHighlight({ children, container, className, dim = 0.15 }: TextScrollHighlightProps) {
  const ref = useRef<HTMLParagraphElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, container, offset: ["start 0.85", "end 0.4"] });
  const words = children.split(" ");

  if (reduced) return <p ref={ref} className={className}>{children}</p>;

  return (
    <p ref={ref} className={cn("flex flex-wrap", className)} aria-label={children}>
      {words.map((w, i) => (
        <span key={i} aria-hidden className="relative mr-[0.25em]">
          <Word word={w} progress={scrollYProgress} range={[i / words.length, (i + 1) / words.length]} dim={dim} />
        </span>
      ))}
    </p>
  );
}
```

## Usage example
```tsx
"use client";
import { DemoScroller, useDemoScroller } from "@/components/kinetik/demo-helpers" /* or inline */;
import { TextScrollHighlight } from "@/components/kinetik/text-scroll-highlight";

function Inner() {
  const scroller = useDemoScroller();
  return (
    <div className="px-8 pt-[40cqh] pb-[60cqh] sm:px-14">
      <TextScrollHighlight container={scroller ?? undefined} className="text-2xl font-semibold leading-snug tracking-tight sm:text-4xl">
        Great motion is invisible. It guides the eye, explains what changed, and makes software feel like it respects your time. Every word here lights up exactly as you read it.
      </TextScrollHighlight>
    </div>
  );
}

export default function Demo() {
  return (
    <DemoScroller>
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
```

## Steps
1. Install the dependencies above.
2. Create the files exactly as given, fixing import aliases if the project doesn't use `@/`.
3. Drop the usage example into a page and adapt copy/colors to the project's design system.
4. Verify: toggle "Reduce motion" in OS settings — the component must still be fully usable.
