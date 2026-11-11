You are given a task to integrate a component from the **kinetik** motion library into this codebase.

# Flip Filter Grid (`gsap-flip-filter`)

Filter chips re-arrange a grid with GSAP Flip — survivors glide to their new cells, new items pop in and removed ones shrink away.

## What it should do
On filter click: state = Flip.getState(items); set display none/'' by tag; Flip.from(state, { duration .7, power3.inOut, scale, absolute, stagger .03, onEnter: els => fromTo scale 0→1 back.out, onLeave: els => to scale 0, opacity 0 }).

## Project requirements
- React 19 + TypeScript, Tailwind CSS v4, shadcn/ui-style CSS variables (`background`, `foreground`, `muted`, `muted-foreground`, `border`, `card`, `primary`, `ring`). If the project lacks shadcn, set it up first (`npx shadcn@latest init`).
- Animation engine: **gsap**.
- Install dependencies: `npm i gsap @gsap/react`
- Put the component at `components/kinetik/gsap-flip-filter.tsx`.
- `cn` lives at `lib/kinetik/utils.ts` (source below).
- Shared hooks go at `lib/kinetik/core.ts` (source below).

## Non-negotiables
- **Accessibility:** Chips are toggle buttons with aria-pressed in a labelled toolbar; reduced motion changes instantly.
- **Performance:** Flip.from with absolute + scale; display toggled, no re-render needed.
- Respect `prefers-reduced-motion` (replace movement with opacity or an instant change).
- Animate only transform / opacity / filter / clip-path. No hard-coded theme colors — use CSS variables so it works in light and dark.

## Source — components/kinetik/gsap-flip-filter.tsx
```tsx
"use client";
import { useRef, useState, type ReactNode } from "react";
import gsap from "gsap";
import { Flip } from "gsap/Flip";
import { useGSAP } from "@gsap/react";
import { cn, useReducedMotion } from "@/lib/kinetik/core";

gsap.registerPlugin(Flip, useGSAP);

export interface FlipFilterItem {
  id: string;
  tags: string[];
  node: ReactNode;
}

export interface GsapFlipFilterProps {
  items: FlipFilterItem[];
  filters: string[];
  className?: string;
}

/**
 * Filterable grid with GSAP Flip: record positions, toggle `hidden` on items, then Flip.from
 * moves the survivors to their new cells while onEnter/onLeave scale new and removed items.
 * Works with any CSS grid / flex layout — the DOM decides, Flip animates.
 */
export function GsapFlipFilter({ items, filters, className }: GsapFlipFilterProps) {
  const root = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState("All");
  const reduced = useReducedMotion();
  const { contextSafe } = useGSAP({ scope: root });

  const apply = contextSafe((f: string) => {
    setActive(f);
    const els = gsap.utils.toArray<HTMLElement>("[data-item]", root.current);
    const state = Flip.getState(els);
    els.forEach((el) => {
      const show = f === "All" || el.dataset.tags!.split(",").includes(f);
      el.style.display = show ? "" : "none";
    });
    if (reduced) return;
    Flip.from(state, {
      duration: 0.7,
      ease: "power3.inOut",
      scale: true,
      absolute: true,
      stagger: 0.03,
      onEnter: (els) => gsap.fromTo(els, { opacity: 0, scale: 0 }, { opacity: 1, scale: 1, duration: 0.6, ease: "back.out(1.6)" }),
      onLeave: (els) => gsap.to(els, { opacity: 0, scale: 0, duration: 0.4 }),
    });
  });

  return (
    <div ref={root} className={cn("space-y-4", className)}>
      <div role="toolbar" aria-label="Filter" className="flex flex-wrap gap-2">
        {["All", ...filters].map((f) => (
          <button
            key={f}
            onClick={() => apply(f)}
            aria-pressed={active === f}
            className={cn("rounded-full border px-3 py-1 text-sm transition-colors", active === f ? "border-foreground bg-foreground text-background" : "border-border text-muted-foreground hover:text-foreground")}
          >
            {f}
          </button>
        ))}
      </div>
      <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
        {items.map((it) => (
          <div key={it.id} data-item data-tags={it.tags.join(",")}>
            {it.node}
          </div>
        ))}
      </div>
    </div>
  );
}
```

## Usage example
```tsx
"use client";
import { photoAlt, photos } from "@/components/kinetik/demo-helpers" /* or inline */;
import { GsapFlipFilter } from "@/components/kinetik/gsap-flip-filter";

const tagsFor = ["Warm", "Cool", "Night", "Green", "Warm", "Night", "Cool", "Warm"];

export default function Demo() {
  const items = [...photos, ...photos.slice(0, 4)].map((p, i) => ({
    id: `p${i}`,
    tags: [tagsFor[i % 8], i % 3 === 0 ? "Featured" : "Archive"],
    node: (
      <figure className="overflow-hidden rounded-xl border border-border bg-card">
        <img src={p} alt={photoAlt[i % 8]} className="aspect-square w-full object-cover" />
        <figcaption className="truncate px-2 py-1.5 text-[11px] text-muted-foreground">{tagsFor[i % 8]} · {photoAlt[i % 8]}</figcaption>
      </figure>
    ),
  }));
  return (
    <div className="h-full w-full overflow-auto p-6">
      <GsapFlipFilter items={items} filters={["Warm", "Cool", "Night", "Green", "Featured"]} />
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
