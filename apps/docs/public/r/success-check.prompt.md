You are given a task to integrate a component from the **kinetik** motion library into this codebase.

# Success / Error Mark (`success-check`)

The circle draws, the check (or cross) strokes in, then the whole mark pops — the moment-of-completion signature.

## What it should do
Create an animated success/error mark in SVG: the circle stroke draws (pathLength 0→1, 400ms ease-in-out) starting at 12 o'clock, a 12% fill fades in, then the check (or two cross strokes, staggered) draws, then the whole SVG pops scale [.8, 1.08, 1]. Green for success, red for error; role=img with label; instant under reduced motion.

## Project requirements
- React 19 + TypeScript, Tailwind CSS v4, shadcn/ui-style CSS variables (`background`, `foreground`, `muted`, `muted-foreground`, `border`, `card`, `primary`, `ring`). If the project lacks shadcn, set it up first (`npx shadcn@latest init`).
- Animation engine: **svg**.
- Install dependencies: `npm i motion`
- Put the component at `components/kinetik/success-check.tsx`.
- `cn` lives at `lib/kinetik/utils.ts` (source below).
- Shared hooks go at `lib/kinetik/core.ts` (source below).

## Non-negotiables
- **Accessibility:** role=img with Success/Error label; pair with a text message. Reduced motion: drawn instantly.
- **Performance:** pathLength animations on 2–3 SVG paths.
- Respect `prefers-reduced-motion` (replace movement with opacity or an instant change).
- Animate only transform / opacity / filter / clip-path. No hard-coded theme colors — use CSS variables so it works in light and dark.

## Source — components/kinetik/success-check.tsx
```tsx
"use client";
import { motion } from "motion/react";
import { cn, useReducedMotion } from "@/lib/kinetik/core";

export interface SuccessCheckProps {
  status: "success" | "error";
  size?: number;
  className?: string;
}

export function SuccessCheck({ status, size = 72, className }: SuccessCheckProps) {
  const reduced = useReducedMotion();
  const color = status === "success" ? "#10b981" : "#ef4444";
  const draw = (delay: number) => (reduced ? { duration: 0 } : { duration: 0.4, delay, ease: [0.65, 0, 0.35, 1] as const });
  return (
    <motion.svg
      key={status}
      role="img"
      aria-label={status === "success" ? "Success" : "Error"}
      viewBox="0 0 52 52"
      width={size}
      height={size}
      className={cn(className)}
      initial={reduced ? false : { scale: 0.8 }}
      animate={{ scale: [0.8, 1.08, 1] }}
      transition={{ duration: 0.5, delay: 0.55, times: [0, 0.5, 1] }}
    >
      <motion.circle cx="26" cy="26" r="24" fill="none" stroke={color} strokeWidth="2.5" initial={{ pathLength: 0, rotate: -90 }} animate={{ pathLength: 1 }} transition={draw(0)} style={{ originX: "50%", originY: "50%" }} />
      <motion.circle cx="26" cy="26" r="24" fill={color} initial={{ opacity: 0 }} animate={{ opacity: 0.12 }} transition={{ delay: reduced ? 0 : 0.4 }} />
      {status === "success" ? (
        <motion.path d="M15 27l7 7 15-16" fill="none" stroke={color} strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={draw(0.35)} />
      ) : (
        <>
          <motion.path d="M18 18l16 16" fill="none" stroke={color} strokeWidth="3.5" strokeLinecap="round" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={draw(0.35)} />
          <motion.path d="M34 18L18 34" fill="none" stroke={color} strokeWidth="3.5" strokeLinecap="round" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={draw(0.5)} />
        </>
      )}
    </motion.svg>
  );
}
```

## Usage example
```tsx
"use client";
import { useState } from "react";
import { SuccessCheck } from "@/components/kinetik/success-check";

export default function Demo() {
  const [k, setK] = useState(0);
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-6 p-6">
      <div className="flex gap-10" key={k}>
        <div className="flex flex-col items-center gap-2"><SuccessCheck status="success" /><p className="text-sm font-medium">Payment received</p></div>
        <div className="flex flex-col items-center gap-2"><SuccessCheck status="error" /><p className="text-sm font-medium">Upload failed</p></div>
      </div>
      <button onClick={() => setK((x) => x + 1)} className="rounded-lg border border-border px-3 py-1.5 text-xs hover:bg-accent">Replay</button>
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
