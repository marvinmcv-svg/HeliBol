You are given a task to integrate a component from the **kinetik** motion library into this codebase.

# Scroll Progress (`scroll-progress`)

Reading-progress bar or ring linked to scroll with CSS scroll timelines (zero JS on modern browsers) and a passive-listener fallback.

## What it should do
Build a reading-progress indicator (bar and ring variants). Modern path: `animation: k-progress linear both; animation-timeline: scroll(nearest)` animating `scaleX(0→1)` (bar) or `stroke-dashoffset 100→0` on a pathLength=100 circle (ring). Fallback when `CSS.supports('animation-timeline: scroll()')` is false: a passive scroll listener writes the same styles.

## Project requirements
- React 19 + TypeScript, Tailwind CSS v4, shadcn/ui-style CSS variables (`background`, `foreground`, `muted`, `muted-foreground`, `border`, `card`, `primary`, `ring`). If the project lacks shadcn, set it up first (`npx shadcn@latest init`).
- Animation engine: **css**.
- No runtime dependencies (CSS only).
- Put the component at `components/kinetik/scroll-progress.tsx`.
- `cn` lives at `lib/kinetik/utils.ts` (source below).
- Shared hooks go at `lib/kinetik/core.ts` (source below).

## Non-negotiables
- **Accessibility:** Decorative (role=presentation). Scroll-linked motion is user-driven so it's allowed under reduced motion.
- **Performance:** animation-timeline: scroll(nearest) — compositor-only. Fallback uses one passive listener.
- Respect `prefers-reduced-motion` (replace movement with opacity or an instant change).
- Animate only transform / opacity / filter / clip-path. No hard-coded theme colors — use CSS variables so it works in light and dark.

## Source — components/kinetik/scroll-progress.tsx
```tsx
"use client";
import { useEffect, useRef, type RefObject } from "react";
import { cn } from "@/lib/kinetik/core";

export interface ScrollProgressProps {
  /** Scroll container; defaults to the page. Must be an ancestor for the CSS path. */
  container?: RefObject<HTMLElement | null>;
  variant?: "bar" | "circle";
  className?: string;
}

const css = `
@keyframes k-progress{from{transform:scaleX(0)}to{transform:scaleX(1)}}
@keyframes k-progress-ring{from{stroke-dashoffset:100}to{stroke-dashoffset:0}}
@supports (animation-timeline: scroll()){
  .k-progress-bar[data-css]{animation:k-progress linear both;animation-timeline:scroll(nearest)}
  .k-progress-ring[data-css]{animation:k-progress-ring linear both;animation-timeline:scroll(nearest)}
}`;

export function ScrollProgress({ container, variant = "bar", className }: ScrollProgressProps) {
  const bar = useRef<HTMLDivElement>(null);
  const ring = useRef<SVGCircleElement>(null);
  const supports = typeof CSS !== "undefined" && CSS.supports?.("animation-timeline: scroll()");

  // JS fallback (Firefox < scroll-timeline, older Safari)
  useEffect(() => {
    if (supports) return;
    const el: HTMLElement | Window = container?.current ?? window;
    const update = () => {
      const t = el instanceof Window ? document.documentElement : el;
      const p = t.scrollTop / Math.max(1, t.scrollHeight - t.clientHeight);
      if (bar.current) bar.current.style.transform = `scaleX(${p})`;
      if (ring.current) ring.current.style.strokeDashoffset = String(100 - p * 100);
    };
    update();
    el.addEventListener("scroll", update, { passive: true });
    return () => el.removeEventListener("scroll", update);
  }, [container, supports]);

  return (
    <>
      <style href="k-progress" precedence="kinetik">{css}</style>
      {variant === "bar" ? (
        <div
          ref={bar}
          data-css={supports ? "" : undefined}
          role="presentation"
          className={cn("k-progress-bar h-1 w-full origin-left bg-gradient-to-r from-violet-500 via-fuchsia-500 to-amber-400", className)}
          style={{ transform: "scaleX(0)" }}
        />
      ) : (
        <svg viewBox="0 0 36 36" className={cn("size-10 -rotate-90", className)} role="presentation">
          <circle cx="18" cy="18" r="15.9" pathLength={100} fill="none" className="stroke-muted" strokeWidth="3" />
          <circle ref={ring} data-css={supports ? "" : undefined} cx="18" cy="18" r="15.9" pathLength={100} fill="none" className="k-progress-ring stroke-foreground" strokeWidth="3" strokeLinecap="round" strokeDasharray="100" strokeDashoffset="100" />
        </svg>
      )}
    </>
  );
}
```

## Usage example
```tsx
"use client";
import { DemoScroller, useDemoScroller } from "@/components/kinetik/demo-helpers" /* or inline */;
import { ScrollProgress } from "@/components/kinetik/scroll-progress";

function Article() {
  const scroller = useDemoScroller();
  return (
    <>
      <div className="sticky top-0 z-10 border-b border-border bg-background/80 backdrop-blur">
        <div className="flex items-center justify-between px-6 py-2 text-sm">
          <span className="font-semibold">The physics of delight</span>
          <ScrollProgress variant="circle" container={scroller ?? undefined} className="size-7" />
        </div>
        <ScrollProgress container={scroller ?? undefined} />
      </div>
      <article className="mx-auto max-w-xl space-y-4 px-6 py-8 text-sm leading-relaxed text-muted-foreground">
        {Array.from({ length: 9 }, (_, i) => (
          <p key={i}>
            {i === 0 && <span className="mb-3 block text-2xl font-semibold tracking-tight text-foreground">Why springs feel alive</span>}
            Springs don&apos;t have a duration — they have stiffness, damping and mass. That&apos;s why interrupted spring animations never jump: velocity carries over, the way objects behave in the real world. Paragraph {i + 1} of 9.
          </p>
        ))}
      </article>
    </>
  );
}

export default function Demo() {
  return (
    <DemoScroller hint={false}>
      <Article />
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
