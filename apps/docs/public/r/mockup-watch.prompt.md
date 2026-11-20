You are given a task to integrate a component from the **kinetik** motion library into this codebase.

# Mockup — Smartwatch (`mockup-watch`)

Smartwatch mockup with a working digital crown: drag the crown, scroll over the face or use ↑/↓ and the app list rolls on a curved fish-eye path — centre rows big and bright, edge rows shrinking inward — snapping to the nearest row.

## What it should do
Keep one motion value y (index × row height); each row derives its offset from the centre and maps it to y, scale, inward x and opacity; wheel, crown drag and arrow keys write y, and release springs to the nearest row.

## Project requirements
- React 19 + TypeScript, Tailwind CSS v4, shadcn/ui-style CSS variables (`background`, `foreground`, `muted`, `muted-foreground`, `border`, `card`, `primary`, `ring`). If the project lacks shadcn, set it up first (`npx shadcn@latest init`).
- Animation engine: **motion**.
- Install dependencies: `npm i motion`
- Put the component at `components/kinetik/mockup-watch.tsx`.
- `cn` lives at `lib/kinetik/utils.ts` (source below).
- Shared hooks go at `lib/kinetik/core.ts` (source below).

## Non-negotiables
- **Accessibility:** Face is a focusable listbox with aria-activedescendant; the crown is a labelled button. Reduced motion snaps without springs.
- **Performance:** One motion value drives every row through transforms; no re-render while scrolling except the active index.
- Respect `prefers-reduced-motion` (replace movement with opacity or an instant change).
- Animate only transform / opacity / filter / clip-path. No hard-coded theme colors — use CSS variables so it works in light and dark.

## Source — components/kinetik/mockup-watch.tsx
```tsx
"use client";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { animate, motion, useMotionValue, useMotionValueEvent, useTransform, type MotionValue } from "motion/react";
import { cn, useReducedMotion } from "@/lib/kinetik/core";

export interface WatchApp { name: string; icon: ReactNode; color: string }
export interface MockupWatchProps {
  apps: WatchApp[];
  className?: string;
}

const ROW = 46;

/**
 * Smartwatch mockup with a working digital crown: turn the crown (drag it, use the mouse wheel over
 * the watch, or ↑/↓ when focused) and the app list scrolls on a curved, fish-eye path — rows near
 * the centre are big and bright, rows at the edges shrink and slide inward, like the real thing.
 * It snaps to the nearest row with a spring.
 */
export function MockupWatch({ apps, className }: MockupWatchProps) {
  const reduced = useReducedMotion();
  const y = useMotionValue(0); // index * ROW
  const crown = useTransform(y, (v) => v * 1.6);
  const [active, setActive] = useState(0);
  useMotionValueEvent(y, "change", (v) => setActive(Math.round(v / ROW)));
  const max = (apps.length - 1) * ROW;
  const snapTo = (v: number) => {
    const t = Math.max(0, Math.min(max, Math.round(v / ROW) * ROW));
    if (reduced) y.set(t);
    else animate(y, t, { type: "spring", stiffness: 300, damping: 30 });
  };
  const nudge = (d: number) => snapTo(y.get() + d * ROW);

  const face = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = face.current;
    if (!el) return;
    let t: ReturnType<typeof setTimeout>;
    const wheel = (e: WheelEvent) => {
      e.preventDefault();
      y.set(Math.max(-ROW / 2, Math.min(max + ROW / 2, y.get() + e.deltaY * 0.35)));
      clearTimeout(t);
      t = setTimeout(() => snapTo(y.get()), 120);
    };
    el.addEventListener("wheel", wheel, { passive: false });
    return () => (el.removeEventListener("wheel", wheel), clearTimeout(t));
  });

  const drag = useRef<number | null>(null);
  return (
    <div className={cn("relative select-none", className)}>
      {/* band */}
      <div aria-hidden className="absolute left-1/2 top-[-70px] h-[calc(100%+140px)] w-[150px] -translate-x-1/2 rounded-[40px] bg-gradient-to-b from-orange-400 via-orange-500 to-orange-400 opacity-90" style={{ backgroundImage: "repeating-linear-gradient(0deg, rgb(0 0 0 / .06) 0 2px, transparent 2px 9px), linear-gradient(#fb923c,#f97316)" }} />
      {/* case */}
      <div className="relative h-[250px] w-[210px] rounded-[58px] bg-gradient-to-br from-zinc-500 via-zinc-800 to-zinc-600 p-[5px] shadow-[0_30px_60px_-20px_rgb(0_0_0/.6)]">
        <div
          ref={face}
          tabIndex={0}
          role="listbox"
          aria-label="Apps"
          aria-activedescendant={`watch-app-${active}`}
          onKeyDown={(e) => (e.key === "ArrowDown" ? (e.preventDefault(), nudge(1)) : e.key === "ArrowUp" ? (e.preventDefault(), nudge(-1)) : null)}
          className="relative h-full w-full overflow-hidden rounded-[53px] bg-black outline-none ring-orange-400 focus-visible:ring-2"
        >
          <p className="absolute right-7 top-4 z-10 font-mono text-sm font-semibold text-white">10:09</p>
          <div className="absolute inset-0 top-1/2">
            {apps.map((a, i) => <Row key={a.name} app={a} i={i} y={y} active={i === active} />)}
          </div>
          <div aria-hidden className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_50%,transparent_55%,#000_95%)]" />
        </div>
      </div>
      {/* crown */}
      <motion.button
        type="button"
        aria-label="Digital crown — drag to scroll"
        className="absolute right-[-13px] top-[62px] h-12 w-4 cursor-ns-resize touch-none rounded-r-md bg-gradient-to-r from-zinc-500 to-zinc-300"
        style={{ backgroundImage: "repeating-linear-gradient(0deg,#52525b 0 1px,transparent 1px 3px)", backgroundPositionY: crown }}
        onPointerDown={(e) => ((drag.current = e.clientY - y.get() / 0.6), e.currentTarget.setPointerCapture(e.pointerId))}
        onPointerMove={(e) => drag.current !== null && y.set(Math.max(-ROW / 2, Math.min(max + ROW / 2, (drag.current - e.clientY) * -0.6)))}
        onPointerUp={() => ((drag.current = null), snapTo(y.get()))}
        onClick={() => face.current?.focus()}
      >
        <span className="absolute inset-y-1 right-0 w-1 rounded-r bg-orange-500" />
      </motion.button>
      <span aria-hidden className="absolute right-[-7px] top-[130px] h-14 w-2 rounded-r bg-zinc-600" />
    </div>
  );
}

function Row({ app, i, y, active }: { app: WatchApp; i: number; y: MotionValue<number>; active: boolean }) {
  const d = useTransform(y, (v) => (i * ROW - v) / ROW); // distance in rows from centre
  const ty = useTransform(d, (v) => v * ROW - 20 - Math.sign(v) * Math.max(0, Math.abs(v) - 1) * 6);
  const scale = useTransform(d, (v) => Math.max(0.45, 1 - Math.abs(v) * 0.17));
  const x = useTransform(d, (v) => Math.abs(v) * Math.abs(v) * 7);
  const opacity = useTransform(d, (v) => Math.max(0, 1 - Math.abs(v) * 0.3));
  return (
    <motion.div id={`watch-app-${i}`} role="option" aria-selected={active} className="absolute left-0 flex w-full items-center gap-3 px-6" style={{ y: ty, scale, x, opacity }}>
      <span className="grid size-10 shrink-0 place-items-center rounded-full text-white" style={{ background: app.color }}>{app.icon}</span>
      <span className="truncate text-base font-medium text-white">{app.name}</span>
    </motion.div>
  );
}
```

## Usage example
```tsx
"use client";
import { Activity, Bell, Cloud, Heart, Map, Music, Timer, Wallet } from "lucide-react";
import { DemoCenter } from "@/components/kinetik/demo-helpers" /* or inline */;
import { MockupWatch } from "@/components/kinetik/mockup-watch";

const apps = [
  { name: "Activity", icon: <Activity className="size-5" />, color: "#22c55e" },
  { name: "Heart Rate", icon: <Heart className="size-5" />, color: "#ef4444" },
  { name: "Music", icon: <Music className="size-5" />, color: "#ec4899" },
  { name: "Weather", icon: <Cloud className="size-5" />, color: "#3b82f6" },
  { name: "Timers", icon: <Timer className="size-5" />, color: "#f59e0b" },
  { name: "Maps", icon: <Map className="size-5" />, color: "#14b8a6" },
  { name: "Wallet", icon: <Wallet className="size-5" />, color: "#18181b" },
  { name: "Alerts", icon: <Bell className="size-5" />, color: "#8b5cf6" },
];

export default function Demo() {
  return (
    <DemoCenter className="flex-row items-center gap-12 overflow-hidden">
      <MockupWatch apps={apps} />
      <p className="hidden max-w-36 text-xs leading-relaxed text-muted-foreground sm:block">Drag the crown, scroll over the face, or focus it and use ↑/↓.</p>
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
