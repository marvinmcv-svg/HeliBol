You are given a task to integrate a component from the **kinetik** motion library into this codebase.

# Gooey Tab Bar (`nav-gooey`)

Tab bar whose active blob oozes between items: an SVG goo filter merges the blob with a slower trailing droplet so they stretch and pinch like liquid.

## What it should do
Build a gooey tab bar: an inline SVG filter (feGaussianBlur stdDeviation 7 → feColorMatrix alpha 22 −9 → feComposite atop) applied to a layer with two circles — a big blob (stiff spring) and a smaller droplet (soft spring) both animating left to the active tab centre — so they merge and stretch. Icon buttons sit above the layer.

## Project requirements
- React 19 + TypeScript, Tailwind CSS v4, shadcn/ui-style CSS variables (`background`, `foreground`, `muted`, `muted-foreground`, `border`, `card`, `primary`, `ring`). If the project lacks shadcn, set it up first (`npx shadcn@latest init`).
- Animation engine: **motion**.
- Install dependencies: `npm i motion`
- Put the component at `components/kinetik/nav-gooey.tsx`.
- `cn` lives at `lib/kinetik/utils.ts` (source below).
- Shared hooks go at `lib/kinetik/core.ts` (source below).

## Non-negotiables
- **Accessibility:** Real buttons with aria-current; the goo layer is aria-hidden. Reduced motion: no filter, instant move.
- **Performance:** One SVG filter on a small layer with two moving circles.
- Respect `prefers-reduced-motion` (replace movement with opacity or an instant change).
- Animate only transform / opacity / filter / clip-path. No hard-coded theme colors — use CSS variables so it works in light and dark.

## Source — components/kinetik/nav-gooey.tsx
```tsx
"use client";
import { useId, useState, type ReactNode } from "react";
import { motion } from "motion/react";
import { cn, useReducedMotion } from "@/lib/kinetik/core";

export interface NavGooeyItem {
  label: string;
  icon: ReactNode;
}

export interface NavGooeyProps {
  items: NavGooeyItem[];
  defaultIndex?: number;
  onChange?: (index: number) => void;
  className?: string;
}

/**
 * Tab bar whose active blob oozes between items: an SVG "goo" filter (blur + alpha threshold) merges
 * the moving blob with a trailing droplet, so they stretch and pinch like liquid.
 */
export function NavGooey({ items, defaultIndex = 0, onChange, className }: NavGooeyProps) {
  const reduced = useReducedMotion();
  const [active, setActive] = useState(defaultIndex);
  const filterId = `goo-${useId().replace(/:/g, "")}`;
  const pct = (i: number) => `${(i + 0.5) * (100 / items.length)}%`;

  return (
    <nav aria-label="Primary" className={cn("relative rounded-full bg-zinc-900 p-2 text-zinc-400 shadow-xl", className)}>
      <svg aria-hidden className="absolute size-0">
        <filter id={filterId}>
          <feGaussianBlur in="SourceGraphic" stdDeviation="7" result="blur" />
          <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 22 -9" result="goo" />
          <feComposite in="SourceGraphic" in2="goo" operator="atop" />
        </filter>
      </svg>
      {/* goo layer: blob + droplet, filtered together */}
      <div aria-hidden className="pointer-events-none absolute inset-2" style={{ filter: reduced ? undefined : `url(#${filterId})` }}>
        <motion.span
          className="absolute top-1/2 size-12 -translate-x-1/2 -translate-y-1/2 rounded-full bg-violet-500"
          animate={{ left: pct(active) }}
          transition={reduced ? { duration: 0 } : { type: "spring", stiffness: 300, damping: 24 }}
        />
        <motion.span
          className="absolute top-1/2 size-8 -translate-x-1/2 -translate-y-1/2 rounded-full bg-violet-500"
          animate={{ left: pct(active) }}
          transition={reduced ? { duration: 0 } : { type: "spring", stiffness: 120, damping: 14 }}
        />
      </div>
      <ul className="relative grid" style={{ gridTemplateColumns: `repeat(${items.length}, 4rem)` }}>
        {items.map((it, i) => (
          <li key={it.label}>
            <button
              type="button"
              aria-label={it.label}
              aria-current={i === active ? "page" : undefined}
              onClick={() => (setActive(i), onChange?.(i))}
              className={cn("grid h-12 w-16 place-items-center rounded-full transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-300", i === active ? "text-white" : "hover:text-zinc-200")}
            >
              {it.icon}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
}
```

## Usage example
```tsx
"use client";
import { Bell, Home, Search, Settings, User } from "lucide-react";
import { DemoCenter } from "@/components/kinetik/demo-helpers" /* or inline */;
import { NavGooey } from "@/components/kinetik/nav-gooey";

const items = [
  { label: "Home", icon: <Home className="size-5" /> },
  { label: "Search", icon: <Search className="size-5" /> },
  { label: "Alerts", icon: <Bell className="size-5" /> },
  { label: "Profile", icon: <User className="size-5" /> },
  { label: "Settings", icon: <Settings className="size-5" /> },
];

export default function Demo() {
  return (
    <DemoCenter>
      <NavGooey items={items} />
    </DemoCenter>
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

export interface CanvasFrame {
  ctx: CanvasRenderingContext2D;
  width: number;
  height: number;
  /** seconds since start */
  time: number;
  /** seconds since last frame */
  dt: number;
  /** pointer position in CSS px relative to the canvas, or null when outside */
  pointer: { x: number; y: number } | null;
}

/**
 * Canvas animation loop with the boring parts done: DPR-aware sizing (ResizeObserver), pausing while
 * off-screen or in a background tab, pointer tracking, and a single static frame under reduced motion.
 */
export function useCanvas(draw: (f: CanvasFrame) => void, { maxDpr = 2, interactive = true }: { maxDpr?: number; interactive?: boolean } = {}) {
  const ref = useRef<HTMLCanvasElement>(null);
  const saved = useRef(draw);
  saved.current = draw;
  const reduced = useReducedMotion();
  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    let w = 0;
    let h = 0;
    let visible = true;
    let raf = 0;
    let start = performance.now();
    let last = start;
    let pointer: CanvasFrame["pointer"] = null;
    const frame = (now: number) => {
      saved.current({ ctx, width: w, height: h, time: (now - start) / 1000, dt: Math.min(0.05, (now - last) / 1000), pointer });
      last = now;
    };
    const loop = (now: number) => {
      frame(now);
      raf = requestAnimationFrame(loop);
    };
    const play = () => {
      cancelAnimationFrame(raf);
      if (reduced) {
        frame(performance.now());
        return;
      }
      if (visible && !document.hidden) {
        last = performance.now();
        raf = requestAnimationFrame(loop);
      }
    };
    const ro = new ResizeObserver(() => {
      const dpr = Math.min(maxDpr, window.devicePixelRatio || 1);
      const r = canvas.getBoundingClientRect();
      w = r.width;
      h = r.height;
      canvas.width = Math.max(1, Math.round(w * dpr));
      canvas.height = Math.max(1, Math.round(h * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      if (reduced) frame(performance.now());
    });
    ro.observe(canvas);
    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      play();
    });
    io.observe(canvas);
    const onVis = () => play();
    document.addEventListener("visibilitychange", onVis);
    const host = canvas.parentElement ?? canvas;
    const move = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect();
      pointer = { x: e.clientX - r.left, y: e.clientY - r.top };
    };
    const leave = () => (pointer = null);
    if (interactive) {
      host.addEventListener("pointermove", move);
      host.addEventListener("pointerleave", leave);
    }
    start = performance.now();
    play();
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      document.removeEventListener("visibilitychange", onVis);
      host.removeEventListener("pointermove", move);
      host.removeEventListener("pointerleave", leave);
    };
  }, [reduced, maxDpr, interactive]);
  return ref;
}
```

## Steps
1. Install the dependencies above.
2. Create the files exactly as given, fixing import aliases if the project doesn't use `@/`.
3. Drop the usage example into a page and adapt copy/colors to the project's design system.
4. Verify: toggle "Reduce motion" in OS settings — the component must still be fully usable.
