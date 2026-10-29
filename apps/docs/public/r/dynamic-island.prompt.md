You are given a task to integrate a component from the **kinetik** motion library into this codebase.

# Dynamic Island (`dynamic-island`)

A black pill that morphs between sizes — idle, incoming call, now playing, timer — with Apple's slightly bouncy spring.

## What it should do
Recreate the iPhone Dynamic Island for the web: a black, overflow-hidden pill whose width, height and border-radius animate to each state's size with a spring (stiffness 400, damping 30, mass 0.9). Content swaps with `AnimatePresence mode="popLayout"`: exit fast with blur, enter after an 80ms delay with scale .9→1 and blur. States: idle, incoming call, now playing, timer.

## Project requirements
- React 19 + TypeScript, Tailwind CSS v4, shadcn/ui-style CSS variables (`background`, `foreground`, `muted`, `muted-foreground`, `border`, `card`, `primary`, `ring`). If the project lacks shadcn, set it up first (`npx shadcn@latest init`).
- Animation engine: **motion**.
- Install dependencies: `npm i motion`
- Put the component at `components/kinetik/dynamic-island.tsx`.
- `cn` lives at `lib/kinetik/utils.ts` (source below).
- Shared hooks go at `lib/kinetik/core.ts` (source below).

## Non-negotiables
- **Accessibility:** role=status + aria-live=polite announces new content.
- **Performance:** Size + radius animate on one element; contents crossfade with blur.
- Respect `prefers-reduced-motion` (replace movement with opacity or an instant change).
- Animate only transform / opacity / filter / clip-path. No hard-coded theme colors — use CSS variables so it works in light and dark.

## Source — components/kinetik/dynamic-island.tsx
```tsx
"use client";
import { AnimatePresence, motion } from "motion/react";
import type { ReactNode } from "react";
import { cn } from "@/lib/kinetik/core";

export interface IslandState {
  id: string;
  /** Width/height of the pill in this state. */
  size: { width: number; height: number };
  radius?: number;
  content: ReactNode;
}

export interface DynamicIslandProps {
  state: IslandState;
  className?: string;
}

const islandSpring = { type: "spring" as const, stiffness: 400, damping: 30, mass: 0.9 };

/** A black pill that morphs between arbitrary sizes and contents with a slightly bouncy spring. */
export function DynamicIsland({ state, className }: DynamicIslandProps) {
  return (
    <motion.div
      role="status"
      aria-live="polite"
      initial={false}
      animate={{ width: state.size.width, height: state.size.height, borderRadius: state.radius ?? state.size.height / 2 }}
      transition={islandSpring}
      className={cn("relative mx-auto overflow-hidden bg-black text-white shadow-[0_8px_30px_rgb(0_0_0/.35)] ring-1 ring-white/10", className)}
    >
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.div
          key={state.id}
          initial={{ opacity: 0, scale: 0.9, filter: "blur(6px)" }}
          animate={{ opacity: 1, scale: 1, filter: "blur(0px)", transition: { delay: 0.08, duration: 0.25 } }}
          exit={{ opacity: 0, scale: 0.9, filter: "blur(6px)", transition: { duration: 0.12 } }}
          className="absolute inset-0"
        >
          {state.content}
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
}
```

## Usage example
```tsx
"use client";
import { useState } from "react";
import { Phone, PhoneOff, Timer } from "lucide-react";
import { DynamicIsland, type IslandState } from "@/components/kinetik/dynamic-island";

const states: Record<string, IslandState> = {
  idle: { id: "idle", size: { width: 120, height: 34 }, content: null },
  ring: {
    id: "ring",
    size: { width: 340, height: 76 },
    radius: 38,
    content: (
      <div className="flex h-full items-center gap-3 px-3">
        <img src="/demo/photo-8.jpg" alt="" className="size-12 rounded-full object-cover" />
        <div className="flex-1"><p className="text-[11px] text-white/60">mobile</p><p className="text-sm font-semibold">Maya Chen</p></div>
        <span className="grid size-11 place-items-center rounded-full bg-red-500"><PhoneOff className="size-5" /></span>
        <span className="grid size-11 place-items-center rounded-full bg-green-500"><Phone className="size-5" /></span>
      </div>
    ),
  },
  music: {
    id: "music",
    size: { width: 360, height: 150 },
    radius: 42,
    content: (
      <div className="flex h-full flex-col justify-between p-4">
        <div className="flex items-center gap-3">
          <img src="/demo/photo-6.jpg" alt="" className="size-12 rounded-xl object-cover" />
          <div className="flex-1"><p className="text-sm font-semibold">Aurora Drive</p><p className="text-xs text-white/60">Northern Lights</p></div>
          <div className="flex h-5 items-end gap-0.5">{[0, 1, 2, 3].map((i) => <span key={i} className="w-1 animate-pulse rounded-full bg-emerald-400" style={{ height: `${40 + i * 15}%`, animationDelay: `${i * 120}ms` }} />)}</div>
        </div>
        <div className="h-1 overflow-hidden rounded-full bg-white/20"><div className="h-full w-2/5 rounded-full bg-white" /></div>
      </div>
    ),
  },
  timer: {
    id: "timer",
    size: { width: 220, height: 34 },
    content: (
      <div className="flex h-full items-center justify-between px-3 text-xs">
        <Timer className="size-4 text-amber-400" />
        <span className="font-mono text-amber-400 tabular-nums">04:59</span>
      </div>
    ),
  },
};

export default function Demo() {
  const [s, setS] = useState("idle");
  return (
    <div className="flex h-full flex-col items-center justify-between p-6">
      <div className="h-[160px] pt-2"><DynamicIsland state={states[s]} /></div>
      <div className="flex flex-wrap justify-center gap-2">
        {Object.keys(states).map((k) => (
          <button key={k} onClick={() => setS(k)} aria-pressed={s === k} className="rounded-full border border-border px-3 py-1 text-xs capitalize aria-pressed:bg-foreground aria-pressed:text-background">{k}</button>
        ))}
      </div>
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
