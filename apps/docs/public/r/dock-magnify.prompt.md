You are given a task to integrate a component from the **kinetik** motion library into this codebase.

# Magnifying Dock (`dock-magnify`)

The macOS Dock: icons swell based on cursor distance with springy, interruptible physics and hover labels.

## What it should do
Recreate the macOS dock: a shared `mouseX` motion value (Infinity when outside); each icon derives its distance to the cursor from its bounding rect and maps [-140, 0, 140] → [44, 76, 44]px through a spring (400/28/0.2) for width/height. Items align to the bottom so they grow upward; tooltips on hover/focus.

## Project requirements
- React 19 + TypeScript, Tailwind CSS v4, shadcn/ui-style CSS variables (`background`, `foreground`, `muted`, `muted-foreground`, `border`, `card`, `primary`, `ring`). If the project lacks shadcn, set it up first (`npx shadcn@latest init`).
- Animation engine: **motion**.
- Install dependencies: `npm i motion`
- Put the component at `components/kinetik/dock-magnify.tsx`.
- `cn` lives at `lib/kinetik/utils.ts` (source below).
- Shared hooks go at `lib/kinetik/core.ts` (source below).

## Non-negotiables
- **Accessibility:** Each icon is a labelled button; labels show on keyboard focus. No magnification on touch or reduced motion.
- **Performance:** One shared mouseX motion value; per-icon springs; zero re-renders.
- Respect `prefers-reduced-motion` (replace movement with opacity or an instant change).
- Animate only transform / opacity / filter / clip-path. No hard-coded theme colors — use CSS variables so it works in light and dark.

## Source — components/kinetik/dock-magnify.tsx
```tsx
"use client";
import { useRef, type ReactNode } from "react";
import { motion, useMotionValue, useSpring, useTransform, type MotionValue } from "motion/react";
import { cn, usePrefersTouch, useReducedMotion } from "@/lib/kinetik/core";

export interface DockItem {
  label: string;
  icon: ReactNode;
  onClick?: () => void;
}

function DockIcon({ item, mouseX, base, max, distance }: { item: DockItem; mouseX: MotionValue<number>; base: number; max: number; distance: number }) {
  const ref = useRef<HTMLButtonElement>(null);
  const d = useTransform(mouseX, (x) => {
    const r = ref.current?.getBoundingClientRect();
    return r ? x - r.left - r.width / 2 : Infinity;
  });
  const size = useSpring(useTransform(d, [-distance, 0, distance], [base, max, base]), { stiffness: 400, damping: 28, mass: 0.2 });
  return (
    <motion.button
      ref={ref}
      onClick={item.onClick}
      aria-label={item.label}
      style={{ width: size, height: size }}
      whileTap={{ scale: 0.9 }}
      className="group relative grid aspect-square place-items-center rounded-2xl bg-gradient-to-b from-zinc-100 to-zinc-300 text-zinc-800 shadow-md outline-none focus-visible:ring-2 focus-visible:ring-ring dark:from-zinc-700 dark:to-zinc-800 dark:text-zinc-100"
    >
      <span className="pointer-events-none absolute -top-9 whitespace-nowrap rounded-md bg-foreground px-2 py-0.5 text-xs text-background opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">{item.label}</span>
      <span className="grid size-1/2 place-items-center [&>svg]:size-full">{item.icon}</span>
    </motion.button>
  );
}

export function DockMagnify({ items, base = 44, max = 76, distance = 140, className }: { items: DockItem[]; base?: number; max?: number; distance?: number; className?: string }) {
  const mouseX = useMotionValue(Infinity);
  const off = useReducedMotion() || usePrefersTouch();
  return (
    <nav
      onPointerMove={(e) => !off && mouseX.set(e.clientX)}
      onPointerLeave={() => mouseX.set(Infinity)}
      className={cn("mx-auto flex h-[68px] items-end gap-3 rounded-3xl border border-border bg-background/60 px-3 pb-3 backdrop-blur-xl", className)}
    >
      {items.map((it) => <DockIcon key={it.label} item={it} mouseX={mouseX} base={base} max={off ? base : max} distance={distance} />)}
    </nav>
  );
}
```

## Usage example
```tsx
"use client";
import { Calendar, Camera, Compass, Mail, Music, Settings, Terminal } from "lucide-react";
import { DockMagnify } from "@/components/kinetik/dock-magnify";

export default function Demo() {
  return (
    <div className="flex h-full w-full items-end justify-center bg-[url(/demo/photo-2.jpg)] bg-cover bg-center p-6">
      <DockMagnify
        items={[
          { label: "Finder", icon: <Compass /> },
          { label: "Mail", icon: <Mail /> },
          { label: "Calendar", icon: <Calendar /> },
          { label: "Music", icon: <Music /> },
          { label: "Photos", icon: <Camera /> },
          { label: "Terminal", icon: <Terminal /> },
          { label: "Settings", icon: <Settings /> },
        ]}
      />
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
