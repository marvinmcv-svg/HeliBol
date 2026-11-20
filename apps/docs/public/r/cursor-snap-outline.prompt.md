You are given a task to integrate a component from the **kinetik** motion library into this codebase.

# Cursor — Snap Outline (`cursor-snap-outline`)

iPadOS-style pointer: a soft dot that morphs into a rounded outline hugging whatever button or link you hover, springing on position, size and radius, with a subtle magnetic pull toward the target's centre.

## What it should do
Track the pointer inside a container; on pointerover of a matching target read its rect and radius; spring x/y/width/height/radius toward the target rect (plus a small offset toward the pointer for magnetism); otherwise shrink to a 10px dot following the pointer.

## Project requirements
- React 19 + TypeScript, Tailwind CSS v4, shadcn/ui-style CSS variables (`background`, `foreground`, `muted`, `muted-foreground`, `border`, `card`, `primary`, `ring`). If the project lacks shadcn, set it up first (`npx shadcn@latest init`).
- Animation engine: **motion**.
- Install dependencies: `npm i motion`
- Put the component at `components/kinetik/cursor-snap-outline.tsx`.
- `cn` lives at `lib/kinetik/utils.ts` (source below).
- Shared hooks go at `lib/kinetik/core.ts` (source below).

## Non-negotiables
- **Accessibility:** Purely decorative overlay (aria-hidden); native cursor stays available. Disabled on touch and under reduced motion.
- **Performance:** Five spring motion values; one pointermove listener; no React re-renders while moving.
- Respect `prefers-reduced-motion` (replace movement with opacity or an instant change).
- Animate only transform / opacity / filter / clip-path. No hard-coded theme colors — use CSS variables so it works in light and dark.

## Source — components/kinetik/cursor-snap-outline.tsx
```tsx
"use client";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { motion, useMotionValue, useSpring } from "motion/react";
import { cn, usePrefersTouch, useReducedMotion } from "@/lib/kinetik/core";

export interface CursorSnapOutlineProps {
  children: ReactNode;
  /** Selector for elements the cursor should wrap. */
  targets?: string;
  className?: string;
}

/**
 * iPadOS-style pointer: a soft round cursor that, over any interactive element, morphs into a
 * rounded rectangle hugging that element (springs on x, y, width, height and radius) and nudges a
 * little toward the real pointer, so buttons feel magnetic. Pointer devices only.
 */
export function CursorSnapOutline({ children, targets = "a, button, [data-snap]", className }: CursorSnapOutlineProps) {
  const reduced = useReducedMotion();
  const touch = usePrefersTouch();
  const area = useRef<HTMLDivElement>(null);
  const [inside, setInside] = useState(false);
  const [snapped, setSnapped] = useState(false);
  const cfg = reduced ? { stiffness: 3000, damping: 150 } : { stiffness: 420, damping: 34, mass: 0.6 };
  const x = useSpring(useMotionValue(0), cfg), y = useSpring(useMotionValue(0), cfg);
  const w = useSpring(useMotionValue(18), cfg), h = useSpring(useMotionValue(18), cfg);
  const r = useSpring(useMotionValue(9), cfg);

  useEffect(() => {
    const el = area.current;
    if (!el || touch) return;
    const move = (e: PointerEvent) => {
      const box = el.getBoundingClientRect();
      const px = e.clientX - box.left, py = e.clientY - box.top;
      const t = (e.target as HTMLElement).closest<HTMLElement>(targets);
      if (t && el.contains(t)) {
        const tb = t.getBoundingClientRect();
        const cx = tb.left - box.left + tb.width / 2, cy = tb.top - box.top + tb.height / 2;
        // magnetic nudge toward the real pointer
        x.set(cx - tb.width / 2 - 6 + (px - cx) * 0.12);
        y.set(cy - tb.height / 2 - 6 + (py - cy) * 0.12);
        w.set(tb.width + 12);
        h.set(tb.height + 12);
        r.set(Math.min(18, parseFloat(getComputedStyle(t).borderRadius) + 6 || 14));
        setSnapped(true);
      } else {
        x.set(px - 9);
        y.set(py - 9);
        w.set(18);
        h.set(18);
        r.set(9);
        setSnapped(false);
      }
    };
    const enter = () => setInside(true);
    const leave = () => setInside(false);
    el.addEventListener("pointermove", move);
    el.addEventListener("pointerenter", enter);
    el.addEventListener("pointerleave", leave);
    return () => { el.removeEventListener("pointermove", move); el.removeEventListener("pointerenter", enter); el.removeEventListener("pointerleave", leave); };
  }, [touch, targets, x, y, w, h, r]);

  return (
    <div ref={area} className={cn("relative", !touch && "cursor-none [&_*]:cursor-none", className)}>
      {children}
      {!touch && (
        <motion.span
          aria-hidden
          className={cn("pointer-events-none absolute left-0 top-0 z-50 transition-[background-color,opacity] duration-200", snapped ? "bg-foreground/10 ring-1 ring-foreground/20" : "bg-foreground/45 backdrop-blur-sm")}
          style={{ x, y, width: w, height: h, borderRadius: r, opacity: inside ? 1 : 0 }}
        />
      )}
    </div>
  );
}
```

## Usage example
```tsx
"use client";
import { Bell, Search, Settings } from "lucide-react";
import { CursorSnapOutline } from "@/components/kinetik/cursor-snap-outline";

export default function Demo() {
  return (
    <CursorSnapOutline className="grid h-full place-items-center p-6">
      <div className="w-full max-w-md space-y-6">
        <nav className="flex items-center gap-1 rounded-2xl border border-border bg-card p-2">
          {["Home", "Projects", "Team", "Billing"].map((l) => <a key={l} href={`#${l}`} className="rounded-lg px-3 py-1.5 text-sm">{l}</a>)}
          <span className="ml-auto flex gap-1">
            {[Search, Bell, Settings].map((I, i) => <button key={i} aria-label={["Search", "Notifications", "Settings"][i]} className="grid size-8 place-items-center rounded-lg"><I className="size-4" /></button>)}
          </span>
        </nav>
        <div className="flex gap-3">
          <button className="flex-1 rounded-xl bg-foreground py-3 text-sm font-semibold text-background">Create project</button>
          <button className="rounded-xl border border-border px-4 py-3 text-sm">Import</button>
        </div>
        <p className="text-center text-xs text-muted-foreground">Glide over links and buttons — the cursor wraps them</p>
      </div>
    </CursorSnapOutline>
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
