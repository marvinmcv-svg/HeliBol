You are given a task to integrate a component from the **kinetik** motion library into this codebase.

# Sticky Stacking Cards (`sticky-stack-cards`)

Cards pin as you scroll and stack on top of each other; the ones underneath shrink and dim for depth.

## What it should do
Build stacking cards: each card sits in a `position: sticky` wrapper with `top = base + i*14px`; track the whole section with Motion `useScroll({ offset: ["start start", "end end"] })` and, from the moment card i sticks (progress i/n) to the end, scale it down to `1 - (n-i-1)*0.05` and dim with `brightness()`. Native sticky does the pinning; reduced motion keeps sticky but drops scale/dim.

## Project requirements
- React 19 + TypeScript, Tailwind CSS v4, shadcn/ui-style CSS variables (`background`, `foreground`, `muted`, `muted-foreground`, `border`, `card`, `primary`, `ring`). If the project lacks shadcn, set it up first (`npx shadcn@latest init`).
- Animation engine: **motion**.
- Install dependencies: `npm i motion`
- Put the component at `components/kinetik/sticky-stack-cards.tsx`.
- `cn` lives at `lib/kinetik/utils.ts` (source below).
- Shared hooks go at `lib/kinetik/core.ts` (source below).

## Non-negotiables
- **Accessibility:** Content order equals DOM order; plain sticky positioning remains usable with reduced motion (no scale/dim).
- **Performance:** Pinning is native position: sticky; only scale + filter animate.
- Respect `prefers-reduced-motion` (replace movement with opacity or an instant change).
- Animate only transform / opacity / filter / clip-path. No hard-coded theme colors — use CSS variables so it works in light and dark.

## Source — components/kinetik/sticky-stack-cards.tsx
```tsx
"use client";
import { useRef, type ReactNode, type RefObject } from "react";
import { motion, useScroll, useTransform, type MotionValue } from "motion/react";
import { cn, useReducedMotion } from "@/lib/kinetik/core";

export interface StickyStackCardsProps {
  items: ReactNode[];
  container?: RefObject<HTMLElement | null>;
  /** px offset from the top where cards stick; each card adds `step`. */
  top?: number;
  step?: number;
  className?: string;
}

function Card({ children, i, total, progress, top, step, reduced }: { children: ReactNode; i: number; total: number; progress: MotionValue<number>; top: number; step: number; reduced: boolean }) {
  const start = i / total;
  const scale = useTransform(progress, [start, 1], [1, 1 - (total - i - 1) * 0.05]);
  const filter = useTransform(progress, [start, 1], ["brightness(1)", `brightness(${1 - (total - i - 1) * 0.12})`]);
  return (
    <div className="sticky flex h-[70cqh] items-start justify-center" style={{ top: top + i * step }}>
      <motion.div style={reduced ? undefined : { scale, filter }} className="w-full origin-top">
        {children}
      </motion.div>
    </div>
  );
}

export function StickyStackCards({ items, container, top = 24, step = 14, className }: StickyStackCardsProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, container, offset: ["start start", "end end"] });
  return (
    <div ref={ref} className={cn("relative", className)} style={{ height: `${items.length * 70}cqh` }}>
      {items.map((item, i) => (
        <Card key={i} i={i} total={items.length} progress={scrollYProgress} top={top} step={step} reduced={reduced}>
          {item}
        </Card>
      ))}
    </div>
  );
}
```

## Usage example
```tsx
"use client";
import { DemoScroller, photos, useDemoScroller } from "@/components/kinetik/demo-helpers" /* or inline */;
import { StickyStackCards } from "@/components/kinetik/sticky-stack-cards";

const steps = [
  { t: "Discover", d: "Browse 70+ components by category, engine or page type.", c: "from-violet-600 to-indigo-700" },
  { t: "Preview", d: "Replay, resize and test reduced motion live.", c: "from-fuchsia-600 to-rose-600" },
  { t: "Install", d: "One shadcn command drops the source into your repo.", c: "from-amber-500 to-orange-600" },
  { t: "Prompt", d: "Or paste the AI prompt into your coding agent.", c: "from-emerald-500 to-teal-600" },
];

function Stack() {
  const c = useDemoScroller() ?? undefined;
  return (
    <div className="px-6">
      <div className="h-[30cqh]" />
      <StickyStackCards
        container={c}
        items={steps.map((s, i) => (
          <div key={s.t} className={`mx-auto grid max-w-xl grid-cols-[1fr_140px] items-center gap-4 overflow-hidden rounded-3xl bg-gradient-to-br p-6 text-white shadow-2xl ${s.c}`}>
            <div>
              <p className="text-xs font-medium opacity-70">Step 0{i + 1}</p>
              <h3 className="mt-1 text-2xl font-semibold">{s.t}</h3>
              <p className="mt-2 text-sm opacity-85">{s.d}</p>
            </div>
            <img src={photos[i + 2]} alt="" className="aspect-square rounded-2xl object-cover" />
          </div>
        ))}
      />
      <div className="h-[40cqh]" />
    </div>
  );
}

export default function Demo() {
  return (
    <DemoScroller>
      <Stack />
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
