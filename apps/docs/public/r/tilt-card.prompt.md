You are given a task to integrate a component from the **kinetik** motion library into this codebase.

# 3D Tilt Card (`tilt-card`)

The card rotates in 3D toward the pointer on soft springs, with a moving specular glare. Children can pop out with translateZ.

## What it should do
Build a 3D tilt card: normalized pointer x/y (0–1) map to rotateY ±max and rotateX ∓max through springs (200/20/0.6), `transformPerspective: 900`, `transform-style: preserve-3d` so children can use translateZ. A glare layer uses `useMotionTemplate` for a radial white gradient at the pointer with mix-blend overlay, visible on hover. Reset to center on leave; disable on touch/reduced motion.

## Project requirements
- React 19 + TypeScript, Tailwind CSS v4, shadcn/ui-style CSS variables (`background`, `foreground`, `muted`, `muted-foreground`, `border`, `card`, `primary`, `ring`). If the project lacks shadcn, set it up first (`npx shadcn@latest init`).
- Animation engine: **motion**.
- Install dependencies: `npm i motion`
- Put the component at `components/kinetik/tilt-card.tsx`.
- `cn` lives at `lib/kinetik/utils.ts` (source below).
- Shared hooks go at `lib/kinetik/core.ts` (source below).

## Non-negotiables
- **Accessibility:** Decorative; disabled on touch and reduced motion. Don't put essential info only in the glare.
- **Performance:** Two springs → rotateX/Y; glare is a motion template, no React renders on move.
- Respect `prefers-reduced-motion` (replace movement with opacity or an instant change).
- Animate only transform / opacity / filter / clip-path. No hard-coded theme colors — use CSS variables so it works in light and dark.

## Source — components/kinetik/tilt-card.tsx
```tsx
"use client";
import { useRef, type ReactNode } from "react";
import { motion, useMotionTemplate, useMotionValue, useSpring, useTransform } from "motion/react";
import { cn, usePrefersTouch, useReducedMotion } from "@/lib/kinetik/core";

export interface TiltCardProps {
  children: ReactNode;
  /** Max rotation in degrees. */
  max?: number;
  glare?: boolean;
  className?: string;
}

export function TiltCard({ children, max = 12, glare = true, className }: TiltCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const touch = usePrefersTouch();
  const px = useMotionValue(0.5);
  const py = useMotionValue(0.5);
  const cfg = { stiffness: 200, damping: 20, mass: 0.6 };
  const rx = useSpring(useTransform(py, [0, 1], [max, -max]), cfg);
  const ry = useSpring(useTransform(px, [0, 1], [-max, max]), cfg);
  const gx = useTransform(px, (v) => `${v * 100}%`);
  const gy = useTransform(py, (v) => `${v * 100}%`);
  const glareBg = useMotionTemplate`radial-gradient(circle at ${gx} ${gy}, rgb(255 255 255 / .35), transparent 55%)`;
  const off = reduced || touch;

  return (
    <motion.div
      ref={ref}
      onPointerMove={(e) => {
        if (off || !ref.current) return;
        const r = ref.current.getBoundingClientRect();
        px.set((e.clientX - r.left) / r.width);
        py.set((e.clientY - r.top) / r.height);
      }}
      onPointerLeave={() => {
        px.set(0.5);
        py.set(0.5);
      }}
      style={off ? undefined : { rotateX: rx, rotateY: ry, transformPerspective: 900 }}
      className={cn("group relative [transform-style:preserve-3d]", className)}
    >
      {children}
      {glare && !off && <motion.div aria-hidden className="pointer-events-none absolute inset-0 rounded-[inherit] opacity-0 mix-blend-overlay transition-opacity duration-300 group-hover:opacity-100" style={{ background: glareBg }} />}
    </motion.div>
  );
}
```

## Usage example
```tsx
"use client";
import { TiltCard } from "@/components/kinetik/tilt-card";

export default function Demo() {
  return (
    <div className="flex h-full w-full items-center justify-center p-8">
      <TiltCard className="w-64 rounded-3xl">
        <div className="overflow-hidden rounded-3xl bg-gradient-to-br from-zinc-900 to-zinc-700 p-1 shadow-2xl">
          <img src="/demo/photo-3.jpg" alt="" className="aspect-[4/5] w-full rounded-[1.3rem] object-cover" />
          <div className="flex items-center justify-between px-3 py-3 text-white [transform:translateZ(30px)]">
            <div><p className="text-xs opacity-60">Edition 03</p><p className="text-sm font-semibold">Neon City</p></div>
            <span className="rounded-full bg-white/15 px-2.5 py-1 text-xs">#042</span>
          </div>
        </div>
      </TiltCard>
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
