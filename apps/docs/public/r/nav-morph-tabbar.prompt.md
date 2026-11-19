You are given a task to integrate a component from the **kinetik** motion library into this codebase.

# Morphing Tab Bar (`nav-morph-tabbar`)

Mobile tab bar where the active tab grows into a coloured pill that reveals its label: the pill slides (shared layout) and changes colour, the label unfurls, the icon hops.

## What it should do
Build a morphing tab bar: dark rounded container of buttons with layout; the active button renders a layoutId pill with its own colour and an AnimatePresence label that animates width 0→auto; the icon is keyed by active state so it hops (spring y −6→0) on select.

## Project requirements
- React 19 + TypeScript, Tailwind CSS v4, shadcn/ui-style CSS variables (`background`, `foreground`, `muted`, `muted-foreground`, `border`, `card`, `primary`, `ring`). If the project lacks shadcn, set it up first (`npx shadcn@latest init`).
- Animation engine: **motion**.
- Install dependencies: `npm i motion`
- Put the component at `components/kinetik/nav-morph-tabbar.tsx`.
- `cn` lives at `lib/kinetik/utils.ts` (source below).
- Shared hooks go at `lib/kinetik/core.ts` (source below).

## Non-negotiables
- **Accessibility:** Buttons with aria-label and aria-current. Reduced motion: instant.
- **Performance:** layoutId pill + width animation on one label.
- Respect `prefers-reduced-motion` (replace movement with opacity or an instant change).
- Animate only transform / opacity / filter / clip-path. No hard-coded theme colors — use CSS variables so it works in light and dark.

## Source — components/kinetik/nav-morph-tabbar.tsx
```tsx
"use client";
import { useId, useState, type ReactNode } from "react";
import { AnimatePresence, motion } from "motion/react";
import { cn, useReducedMotion } from "@/lib/kinetik/core";

export interface NavMorphTab {
  label: string;
  icon: ReactNode;
  /** Accent for the active pill. */
  color?: string;
}

export interface NavMorphTabbarProps {
  tabs: NavMorphTab[];
  defaultIndex?: number;
  onChange?: (i: number) => void;
  className?: string;
}

/**
 * Mobile tab bar where the active tab grows into a coloured pill that reveals its label: the pill
 * slides (shared layout) and changes colour, the label unfurls letter-width by width, inactive icons
 * stay compact, and the icon does a little hop on select.
 */
export function NavMorphTabbar({ tabs, defaultIndex = 0, onChange, className }: NavMorphTabbarProps) {
  const reduced = useReducedMotion();
  const group = useId();
  const [active, setActive] = useState(defaultIndex);
  const t = reduced ? { duration: 0 } : { type: "spring" as const, stiffness: 480, damping: 34 };
  return (
    <nav aria-label="Tabs" className={cn("inline-flex items-center gap-1 rounded-full bg-zinc-900 p-1.5 shadow-2xl", className)}>
      {tabs.map((tab, i) => {
        const on = i === active;
        return (
          <motion.button
            key={tab.label}
            layout
            transition={t}
            type="button"
            aria-current={on ? "page" : undefined}
            aria-label={tab.label}
            onClick={() => (setActive(i), onChange?.(i))}
            className={cn("relative flex h-11 items-center gap-2 rounded-full px-3.5 text-sm font-semibold outline-none focus-visible:ring-2 focus-visible:ring-white/60", on ? "text-zinc-950" : "text-zinc-400 hover:text-zinc-100")}
          >
            {on && <motion.span layoutId={`${group}-pill`} transition={t} className="absolute inset-0 rounded-full" style={{ background: tab.color ?? "#fff" }} />}
            <motion.span key={on ? "on" : "off"} layout="position" className="relative grid size-5 place-items-center" initial={on && !reduced ? { y: -6 } : false} animate={{ y: 0 }} transition={{ type: "spring", stiffness: 600, damping: 12 }}>
              {tab.icon}
            </motion.span>
            <AnimatePresence initial={false}>
              {on && (
                <motion.span
                  key="label"
                  className="relative overflow-hidden whitespace-nowrap"
                  initial={reduced ? { opacity: 0 } : { width: 0, opacity: 0 }}
                  animate={{ width: "auto", opacity: 1 }}
                  exit={reduced ? { opacity: 0 } : { width: 0, opacity: 0 }}
                  transition={t}
                >
                  {tab.label}
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>
        );
      })}
    </nav>
  );
}
```

## Usage example
```tsx
"use client";
import { Compass, Heart, Home, MessageCircle, User } from "lucide-react";
import { DemoCenter } from "@/components/kinetik/demo-helpers" /* or inline */;
import { NavMorphTabbar } from "@/components/kinetik/nav-morph-tabbar";

export default function Demo() {
  return (
    <DemoCenter>
      <NavMorphTabbar
        defaultIndex={1}
        tabs={[
          { label: "Home", icon: <Home className="size-5" />, color: "#e9d5ff" },
          { label: "Explore", icon: <Compass className="size-5" />, color: "#a5f3fc" },
          { label: "Saved", icon: <Heart className="size-5" />, color: "#fecdd3" },
          { label: "Inbox", icon: <MessageCircle className="size-5" />, color: "#d9f99d" },
          { label: "Profile", icon: <User className="size-5" />, color: "#fde68a" },
        ]}
      />
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
