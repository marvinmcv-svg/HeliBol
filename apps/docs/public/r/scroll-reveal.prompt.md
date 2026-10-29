You are given a task to integrate a component from the **kinetik** motion library into this codebase.

# Scroll Reveal (`scroll-reveal`)

Six reveal variants (fade-up, scale, blur, slide-left/right, fade) scrubbed by native CSS scroll-driven animations, with an IntersectionObserver fallback.

## What it should do
Create a scroll reveal wrapper. Primary path: `@supports (animation-timeline: view())` → a `from {}` keyframe (opacity 0 + variant transform/scale/blur via CSS custom properties) with `animation-timeline: view(); animation-range: entry 5% cover 35%` so it's scrubbed by scroll off the main thread. Fallback: IntersectionObserver sets `data-in` which transitions to the resting state (700ms expo-out, staggered by index). Reduced motion forces the resting state.

## Project requirements
- React 19 + TypeScript, Tailwind CSS v4, shadcn/ui-style CSS variables (`background`, `foreground`, `muted`, `muted-foreground`, `border`, `card`, `primary`, `ring`). If the project lacks shadcn, set it up first (`npx shadcn@latest init`).
- Animation engine: **css**.
- No runtime dependencies (CSS only).
- Put the component at `components/kinetik/scroll-reveal.tsx`.
- `cn` lives at `lib/kinetik/utils.ts` (source below).
- Shared hooks go at `lib/kinetik/core.ts` (source below).

## Non-negotiables
- **Accessibility:** Content is in the DOM and readable without JS. Reduced motion: everything visible immediately.
- **Performance:** animation-timeline: view() runs on the compositor — no scroll listeners, better INP/LCP than JS reveal libraries.
- Respect `prefers-reduced-motion` (replace movement with opacity or an instant change).
- Animate only transform / opacity / filter / clip-path. No hard-coded theme colors — use CSS variables so it works in light and dark.

## Source — components/kinetik/scroll-reveal.tsx
```tsx
"use client";
import { useRef, type ElementType, type ReactNode } from "react";
import { cn, useInView } from "@/lib/kinetik/core";

export type RevealVariant = "fade-up" | "fade" | "scale" | "blur" | "slide-left" | "slide-right";

export interface ScrollRevealProps {
  children: ReactNode;
  as?: ElementType;
  variant?: RevealVariant;
  /** Stagger index × 80ms delay for the IntersectionObserver fallback. */
  index?: number;
  className?: string;
}

/*
 * Scroll-driven (CSS animation-timeline: view()) where supported — runs off the main thread
 * and is scrubbed by scroll. Elsewhere, an IntersectionObserver toggles a transition.
 */
const css = `
.k-reveal{--k-from-t:translateY(32px);--k-from-s:1;--k-from-b:0px}
.k-reveal[data-variant=fade]{--k-from-t:none}
.k-reveal[data-variant=scale]{--k-from-t:none;--k-from-s:.88}
.k-reveal[data-variant=blur]{--k-from-t:translateY(12px);--k-from-b:10px}
.k-reveal[data-variant=slide-left]{--k-from-t:translateX(-48px)}
.k-reveal[data-variant=slide-right]{--k-from-t:translateX(48px)}
@keyframes k-reveal{from{opacity:0;transform:var(--k-from-t) scale(var(--k-from-s));filter:blur(var(--k-from-b))}}
@supports (animation-timeline: view()){
  .k-reveal{animation:k-reveal linear both;animation-timeline:view();animation-range:entry 5% cover 35%}
}
@supports not (animation-timeline: view()){
  .k-reveal{opacity:0;transform:var(--k-from-t) scale(var(--k-from-s));filter:blur(var(--k-from-b));transition:opacity .7s cubic-bezier(.16,1,.3,1),transform .7s cubic-bezier(.16,1,.3,1),filter .7s cubic-bezier(.16,1,.3,1);transition-delay:var(--k-delay)}
  .k-reveal[data-in]{opacity:1;transform:none;filter:none}
}
@media (prefers-reduced-motion:reduce){.k-reveal{animation:none!important;transform:none!important;filter:none!important;opacity:1!important}}
[data-reduce-motion] .k-reveal{animation:none!important;transform:none!important;filter:none!important;opacity:1!important}`;

export function ScrollReveal({ children, as: Tag = "div", variant = "fade-up", index = 0, className }: ScrollRevealProps) {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { amount: 0.15 });
  return (
    <>
      <style href="k-reveal" precedence="kinetik">{css}</style>
      <Tag
        ref={ref}
        data-variant={variant}
        data-in={inView ? "" : undefined}
        className={cn("k-reveal", className)}
        style={{ "--k-delay": `${index * 80}ms` } as React.CSSProperties}
      >
        {children}
      </Tag>
    </>
  );
}
```

## Usage example
```tsx
"use client";
import { DemoScroller, photoAlt, photos } from "@/components/kinetik/demo-helpers" /* or inline */;
import { ScrollReveal, type RevealVariant } from "@/components/kinetik/scroll-reveal";

const variants: RevealVariant[] = ["fade-up", "scale", "blur", "slide-left", "slide-right", "fade"];

export default function Demo() {
  return (
    <DemoScroller>
      <div className="mx-auto max-w-2xl space-y-16 px-6 pt-4 pb-24">
        <header className="space-y-1 pb-4"><p className="text-xs uppercase tracking-widest text-muted-foreground">Scroll-driven</p><h3 className="text-2xl font-semibold tracking-tight">Six reveal variants, scrubbed by scroll</h3></header>
        {variants.map((v, i) => (
          <ScrollReveal key={v} variant={v} className="overflow-hidden rounded-2xl border border-border bg-card">
            <img src={photos[i]} alt="" className="aspect-[16/8] w-full object-cover" />
            <div className="flex items-center justify-between p-4">
              <p className="font-medium">{photoAlt[i]}</p>
              <code className="rounded bg-muted px-2 py-0.5 text-xs">variant=&quot;{v}&quot;</code>
            </div>
          </ScrollReveal>
        ))}
      </div>
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
