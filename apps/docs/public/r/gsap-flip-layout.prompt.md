You are given a task to integrate a component from the **kinetik** motion library into this codebase.

# Flip Layout Switch (`gsap-flip-layout`)

Grid ↔ list ↔ featured toggle: React re-renders with new classes and Flip animates every card and its nested image from the old box to the new one.

## What it should do
Before setMode, state = Flip.getState('[data-flip], [data-flip-img]') (elements have data-flip-id); after React commits (useGSAP with [mode] dependency) run Flip.from(state, { duration .65, power3.inOut, nested: true, stagger .025 }).

## Project requirements
- React 19 + TypeScript, Tailwind CSS v4, shadcn/ui-style CSS variables (`background`, `foreground`, `muted`, `muted-foreground`, `border`, `card`, `primary`, `ring`). If the project lacks shadcn, set it up first (`npx shadcn@latest init`).
- Animation engine: **gsap**.
- Install dependencies: `npm i gsap @gsap/react lucide-react`
- Put the component at `components/kinetik/gsap-flip-layout.tsx`.
- `cn` lives at `lib/kinetik/utils.ts` (source below).
- Shared hooks go at `lib/kinetik/core.ts` (source below).

## Non-negotiables
- **Accessibility:** Segmented control is a radiogroup with aria-checked; reduced motion swaps instantly.
- **Performance:** Flip state captured right before setState, played in useGSAP after commit; nested: true.
- Respect `prefers-reduced-motion` (replace movement with opacity or an instant change).
- Animate only transform / opacity / filter / clip-path. No hard-coded theme colors — use CSS variables so it works in light and dark.

## Source — components/kinetik/gsap-flip-layout.tsx
```tsx
"use client";
import { useRef, useState, type ReactNode } from "react";
import gsap from "gsap";
import { Flip } from "gsap/Flip";
import { useGSAP } from "@gsap/react";
import { LayoutGrid, List, Rows3 } from "lucide-react";
import { cn, useReducedMotion } from "@/lib/kinetik/core";

gsap.registerPlugin(Flip, useGSAP);

type Mode = "grid" | "list" | "feature";

export interface GsapFlipLayoutProps {
  items: { id: string; image: string; title: string; meta: string }[];
  className?: string;
}

const container: Record<Mode, string> = {
  grid: "grid grid-cols-3 gap-3",
  list: "flex flex-col gap-2",
  feature: "grid grid-cols-4 gap-3 [&>*:first-child]:col-span-2 [&>*:first-child]:row-span-2",
};
const card: Record<Mode, string> = {
  grid: "flex flex-col",
  list: "flex flex-row items-center gap-3",
  feature: "flex flex-col",
};
const img: Record<Mode, string> = {
  grid: "aspect-[4/3] w-full",
  list: "size-12 shrink-0",
  feature: "aspect-square w-full",
};

/**
 * Grid ↔ list ↔ featured layout switch. React re-renders with the new classes and
 * Flip animates every card, image and caption from its old box to its new one —
 * including nested elements (getState on cards + images, `nested: true`).
 */
export function GsapFlipLayout({ items, className }: GsapFlipLayoutProps) {
  const root = useRef<HTMLDivElement>(null);
  const [mode, setMode] = useState<Mode>("grid");
  const state = useRef<Flip.FlipState | null>(null);
  const reduced = useReducedMotion();

  useGSAP(
    () => {
      if (!state.current || reduced) return;
      Flip.from(state.current, { duration: 0.65, ease: "power3.inOut", nested: true, stagger: 0.025, absolute: false, scale: false });
      state.current = null;
    },
    { scope: root, dependencies: [mode] },
  );

  const change = (m: Mode) => {
    if (m === mode) return;
    state.current = Flip.getState(root.current!.querySelectorAll("[data-flip], [data-flip-img]"));
    setMode(m);
  };

  const modes: [Mode, typeof LayoutGrid, string][] = [["grid", LayoutGrid, "Grid"], ["list", List, "List"], ["feature", Rows3, "Featured"]];

  return (
    <div ref={root} className={cn("space-y-4", className)}>
      <div role="radiogroup" aria-label="Layout" className="inline-flex rounded-full border border-border p-1">
        {modes.map(([m, Icon, label]) => (
          <button key={m} role="radio" aria-checked={mode === m} onClick={() => change(m)} className={cn("flex items-center gap-1.5 rounded-full px-3 py-1 text-xs transition-colors", mode === m ? "bg-foreground text-background" : "text-muted-foreground")}>
            <Icon className="size-3.5" />
            {label}
          </button>
        ))}
      </div>
      <div className={container[mode]}>
        {items.map((it) => (
          <article key={it.id} data-flip-id={it.id} data-flip className={cn("overflow-hidden rounded-xl border border-border bg-card p-2", card[mode])}>
            <img data-flip-img data-flip-id={`${it.id}-img`} src={it.image} alt="" className={cn("rounded-lg object-cover", img[mode])} />
            <div className={cn("min-w-0", mode !== "list" && "pt-2")}>
              <p className="truncate text-sm font-medium">{it.title}</p>
              <p className="truncate text-xs text-muted-foreground">{it.meta}</p>
            </div>
          </article>
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
import { GsapFlipLayout } from "@/components/kinetik/gsap-flip-layout";

export default function Demo() {
  return (
    <div className="h-full w-full overflow-auto p-6">
      <GsapFlipLayout items={photos.slice(0, 6).map((p, i) => ({ id: `i${i}`, image: p, title: photoAlt[i], meta: `${12 + i * 7} photos · updated ${i + 1}d ago` }))} />
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
