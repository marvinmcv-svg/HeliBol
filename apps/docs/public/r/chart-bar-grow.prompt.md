You are given a task to integrate a component from the **kinetik** motion library into this codebase.

# Bar Chart Grow (`chart-bar-grow`)

Bars spring up from the baseline in a left-to-right wave when the chart scrolls into view; hover reveals values.

## What it should do
Create a bar chart where each bar's height is set statically and it animates `scaleY 0→1` from a bottom origin with a spring (120/16) staggered 60ms left-to-right on first view. Highlighted bars use a violet→fuchsia gradient; others are muted and brighten on hover with the value shown above. role=img + aria-label summary.

## Project requirements
- React 19 + TypeScript, Tailwind CSS v4, shadcn/ui-style CSS variables (`background`, `foreground`, `muted`, `muted-foreground`, `border`, `card`, `primary`, `ring`). If the project lacks shadcn, set it up first (`npx shadcn@latest init`).
- Animation engine: **motion**.
- Install dependencies: `npm i motion`
- Put the component at `components/kinetik/chart-bar-grow.tsx`.
- `cn` lives at `lib/kinetik/utils.ts` (source below).
- Shared hooks go at `lib/kinetik/core.ts` (source below).

## Non-negotiables
- **Accessibility:** role=img with a text summary of all values.
- **Performance:** scaleY from a bottom origin (no height animation).
- Respect `prefers-reduced-motion` (replace movement with opacity or an instant change).
- Animate only transform / opacity / filter / clip-path. No hard-coded theme colors — use CSS variables so it works in light and dark.

## Source — components/kinetik/chart-bar-grow.tsx
```tsx
"use client";
import { useRef } from "react";
import { motion, useInView } from "motion/react";
import { cn } from "@/lib/kinetik/core";

export interface ChartBarGrowProps {
  data: { label: string; value: number; highlight?: boolean }[];
  height?: number;
  className?: string;
}

export function ChartBarGrow({ data, height = 200, className }: ChartBarGrowProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.5 });
  const max = Math.max(...data.map((d) => d.value));
  return (
    <div ref={ref} role="img" aria-label={`Bar chart: ${data.map((d) => `${d.label} ${d.value}`).join(", ")}`} className={cn("flex w-full items-end gap-2", className)} style={{ height }}>
      {data.map((d, i) => (
        <div key={d.label} className="group flex h-full flex-1 flex-col items-center justify-end gap-2">
          <motion.span className="text-[11px] font-medium tabular-nums text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" aria-hidden>{d.value}</motion.span>
          <motion.div
            className={cn("w-full origin-bottom rounded-t-lg", d.highlight ? "bg-gradient-to-t from-violet-600 to-fuchsia-400" : "bg-muted-foreground/25 group-hover:bg-muted-foreground/40")}
            style={{ height: `${(d.value / max) * 85}%` }}
            initial={{ scaleY: 0 }}
            animate={{ scaleY: inView ? 1 : 0 }}
            transition={{ type: "spring", stiffness: 120, damping: 16, delay: i * 0.06 }}
          />
          <span className="text-[11px] text-muted-foreground" aria-hidden>{d.label}</span>
        </div>
      ))}
    </div>
  );
}
```

## Usage example
```tsx
"use client";
import { ChartBarGrow } from "@/components/kinetik/chart-bar-grow";

const m = ["J", "F", "M", "A", "M", "J", "J", "A", "S", "O", "N", "D"];
const v = [32, 41, 38, 52, 49, 61, 58, 72, 69, 84, 91, 120];

export default function Demo() {
  return (
    <div className="flex h-full w-full flex-col justify-center gap-3 p-6">
      <div className="flex items-baseline justify-between"><p className="text-sm font-semibold">Monthly revenue (k$)</p><p className="text-xs text-muted-foreground">December highlighted</p></div>
      <ChartBarGrow data={m.map((label, i) => ({ label, value: v[i], highlight: i === 11 }))} />
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
