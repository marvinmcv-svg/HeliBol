You are given a task to integrate a component from the **kinetik** motion library into this codebase.

# Auto-Height Accordion (`gsap-auto-height`)

Accordion with one paused GSAP timeline per panel tweening to height:auto, fading the content and turning the chevron; toggling plays or reverses, so fast clicks turn around mid-flight.

## What it should do
Build an accordion with GSAP: per panel, a paused timeline fromTo height 0 → 'auto', fade/lift the inner content, rotate the chevron 180°. Toggle = tl.play() or tl.reverse(), so interrupted toggles reverse smoothly. Single-open mode reverses the others. Panels inert when closed.

## Project requirements
- React 19 + TypeScript, Tailwind CSS v4, shadcn/ui-style CSS variables (`background`, `foreground`, `muted`, `muted-foreground`, `border`, `card`, `primary`, `ring`). If the project lacks shadcn, set it up first (`npx shadcn@latest init`).
- Animation engine: **gsap**.
- Install dependencies: `npm i gsap @gsap/react lucide-react`
- Put the component at `components/kinetik/gsap-auto-height.tsx`.
- `cn` lives at `lib/kinetik/utils.ts` (source below).
- Shared hooks go at `lib/kinetik/core.ts` (source below).

## Non-negotiables
- **Accessibility:** Buttons with aria-expanded/aria-controls; panels are labelled regions and inert while closed. Reduced motion: zero durations.
- **Performance:** Timelines built once; GSAP measures the auto height.
- Respect `prefers-reduced-motion` (replace movement with opacity or an instant change).
- Animate only transform / opacity / filter / clip-path. No hard-coded theme colors — use CSS variables so it works in light and dark.

## Source — components/kinetik/gsap-auto-height.tsx
```tsx
"use client";
import { useId, useRef, useState, type ReactNode } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ChevronDown } from "lucide-react";
import { cn, useReducedMotion } from "@/lib/kinetik/core";

gsap.registerPlugin(useGSAP);

export interface GsapAutoHeightItem {
  title: string;
  content: ReactNode;
}

export interface GsapAutoHeightProps {
  items: GsapAutoHeightItem[];
  /** Allow several panels open at once. */
  multiple?: boolean;
  className?: string;
}

/**
 * Accordion built on one paused GSAP timeline per panel that tweens to height:"auto" (GSAP measures
 * it), fades and lifts the content, and rotates the chevron. Toggling just plays or reverses that
 * timeline, so rapid clicks reverse smoothly mid-flight instead of jumping.
 */
export function GsapAutoHeight({ items, multiple = false, className }: GsapAutoHeightProps) {
  const reduced = useReducedMotion();
  const root = useRef<HTMLDivElement>(null);
  const tls = useRef<gsap.core.Timeline[]>([]);
  const [open, setOpen] = useState<Set<number>>(new Set());
  const id = useId();

  useGSAP(
    () => {
      tls.current = gsap.utils.toArray<HTMLElement>("[data-panel]").map((panel, i) => {
        const tl = gsap.timeline({ paused: true, defaults: { duration: reduced ? 0 : 0.45, ease: "power3.inOut" } });
        tl.fromTo(panel, { height: 0 }, { height: "auto" })
          .fromTo(panel.firstElementChild, { autoAlpha: 0, y: reduced ? 0 : -8 }, { autoAlpha: 1, y: 0, duration: reduced ? 0 : 0.3, ease: "power2.out" }, reduced ? 0 : 0.15)
          .to(root.current!.querySelectorAll("[data-chevron]")[i], { rotate: 180 }, 0);
        return tl;
      });
    },
    { scope: root, dependencies: [items.length, reduced], revertOnUpdate: true },
  );

  const toggle = (i: number) => {
    setOpen((prev) => {
      const next = new Set(multiple ? prev : prev.has(i) ? [i] : []);
      if (next.has(i)) next.delete(i);
      else next.add(i);
      tls.current.forEach((tl, k) => (next.has(k) ? tl.play() : tl.reverse()));
      return next;
    });
  };

  return (
    <div ref={root} className={cn("w-full divide-y divide-border rounded-2xl border border-border", className)}>
      {items.map((it, i) => (
        <div key={it.title}>
          <h3>
            <button
              type="button"
              id={`${id}-h${i}`}
              aria-expanded={open.has(i)}
              aria-controls={`${id}-p${i}`}
              onClick={() => toggle(i)}
              className="flex w-full items-center justify-between gap-4 px-4 py-3.5 text-left text-sm font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring"
            >
              {it.title}
              <ChevronDown data-chevron className="size-4 shrink-0 text-muted-foreground" />
            </button>
          </h3>
          <div data-panel id={`${id}-p${i}`} role="region" aria-labelledby={`${id}-h${i}`} className="h-0 overflow-hidden" inert={!open.has(i)}>
            <div className="px-4 pb-4 text-sm leading-relaxed text-muted-foreground">{it.content}</div>
          </div>
        </div>
      ))}
    </div>
  );
}
```

## Usage example
```tsx
"use client";
import { GsapAutoHeight } from "@/components/kinetik/gsap-auto-height";

const items = [
  { title: "What does “auto height” mean here?", content: "GSAP measures the panel's natural height and tweens to it, so content of any length opens smoothly — no max-height hacks." },
  { title: "Why one timeline per panel?", content: "Play opens, reverse closes. Click twice quickly and the animation turns around mid-flight from wherever it is." },
  { title: "Is it accessible?", content: <>Buttons expose <code>aria-expanded</code> and control a labelled region; closed panels are <code>inert</code> so their links can't be tabbed into.</> },
  { title: "Reduced motion?", content: "Durations drop to zero — panels open instantly." },
];

export default function Demo() {
  return (
    <div className="grid h-full place-items-center p-6">
      <GsapAutoHeight items={items} className="max-w-md" />
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
