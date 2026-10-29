You are given a task to integrate a component from the **kinetik** motion library into this codebase.

# Horizontal Scroll Section (`horizontal-scroll-section`)

Vertical scrolling slides a pinned track sideways — the classic portfolio / case-study gallery.

## What it should do
Build a horizontal scroll section: an outer section `length × 100vh` tall containing a `position: sticky; top: 0; height: 100vh` frame, inside which a flex track is translated on x from 0 to -(trackWidth - frameWidth) by a GSAP tween with `scrollTrigger: { start: "top top", end: "bottom bottom", scrub: 0.6, invalidateOnRefresh: true }` inside `useGSAP()`. Reduced motion: a native overflow-x snap row instead.

## Project requirements
- React 19 + TypeScript, Tailwind CSS v4, shadcn/ui-style CSS variables (`background`, `foreground`, `muted`, `muted-foreground`, `border`, `card`, `primary`, `ring`). If the project lacks shadcn, set it up first (`npx shadcn@latest init`).
- Animation engine: **gsap**.
- Install dependencies: `npm i gsap @gsap/react`
- Put the component at `components/kinetik/horizontal-scroll-section.tsx`.
- `cn` lives at `lib/kinetik/utils.ts` (source below).
- Shared hooks go at `lib/kinetik/core.ts` (source below).

## Non-negotiables
- **Accessibility:** Reduced motion swaps to a native horizontally scrollable, snap-aligned row that works with keyboard and trackpads.
- **Performance:** Native sticky pinning + one scrubbed transform. invalidateOnRefresh recomputes on resize.
- Respect `prefers-reduced-motion` (replace movement with opacity or an instant change).
- Animate only transform / opacity / filter / clip-path. No hard-coded theme colors — use CSS variables so it works in light and dark.

## Source — components/kinetik/horizontal-scroll-section.tsx
```tsx
"use client";
import { useRef, type ReactNode, type RefObject } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { cn, useReducedMotion } from "@/lib/kinetik/core";

gsap.registerPlugin(ScrollTrigger, useGSAP);

export interface HorizontalScrollSectionProps {
  children: ReactNode;
  /** Scroll container (defaults to window). */
  scroller?: RefObject<HTMLElement | null>;
  /** Vertical scroll distance as a multiple of the viewport height. */
  length?: number;
  className?: string;
  trackClassName?: string;
}

/**
 * Vertical scroll drives a horizontal track. Pinning is native `position: sticky`
 * (robust inside any scroller); GSAP ScrollTrigger scrubs the x translation.
 */
export function HorizontalScrollSection({ children, scroller, length = 3, className, trackClassName }: HorizontalScrollSectionProps) {
  const section = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  useGSAP(
    () => {
      if (reduced || !track.current) return;
      gsap.to(track.current, {
        x: () => -(track.current!.scrollWidth - track.current!.parentElement!.clientWidth),
        ease: "none",
        scrollTrigger: {
          trigger: section.current,
          scroller: scroller?.current ?? undefined,
          start: "top top",
          end: "bottom bottom",
          scrub: 0.6,
          invalidateOnRefresh: true,
        },
      });
    },
    { scope: section, dependencies: [reduced] },
  );

  if (reduced) {
    return (
      <section className={className}>
        <div className={cn("flex snap-x snap-mandatory gap-6 overflow-x-auto p-6", trackClassName)}>{children}</div>
      </section>
    );
  }

  return (
    <section ref={section} className={cn("relative", className)} style={{ height: `${length * 100}cqh` }}>
      {/* cqh = nearest size container (a scroll panel) or the viewport when there is none */}
      <div className="sticky top-0 flex h-[100cqh] items-center overflow-hidden">
        <div ref={track} className={cn("flex gap-6 px-6 will-change-transform", trackClassName)}>
          {children}
        </div>
      </div>
    </section>
  );
}
```

## Usage example
```tsx
"use client";
import { DemoScroller, photoAlt, photos, useDemoScroller } from "@/components/kinetik/demo-helpers" /* or inline */;
import { HorizontalScrollSection } from "@/components/kinetik/horizontal-scroll-section";

function Inner() {
  const s = useDemoScroller() ?? undefined;
  return (
    <div>
      <div className="flex h-[60cqh] flex-col justify-end px-6 pb-6">
        <p className="text-xs uppercase tracking-widest text-muted-foreground">Selected work</p>
        <h3 className="text-3xl font-semibold tracking-tight">Scroll down, move sideways →</h3>
      </div>
      <HorizontalScrollSection scroller={s} length={3}>
        {photos.map((p, i) => (
          <figure key={p} className="w-[62vw] max-w-[360px] shrink-0">
            <img src={p} alt="" className="aspect-[4/5] w-full rounded-2xl object-cover shadow-xl" />
            <figcaption className="mt-2 flex justify-between text-sm"><span>{photoAlt[i]}</span><span className="text-muted-foreground">0{i + 1}</span></figcaption>
          </figure>
        ))}
      </HorizontalScrollSection>
      <div className="grid h-[60cqh] place-items-center text-sm text-muted-foreground">The end.</div>
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
