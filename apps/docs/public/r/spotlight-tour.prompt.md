You are given a task to integrate a component from the **kinetik** motion library into this codebase.

# Spotlight Product Tour (`spotlight-tour`)

Product tour: a dimmed overlay with a rounded cut-out that glides between targets, a pulse ring, and a tooltip card that flips above/below to stay in view.

## What it should do
Build a spotlight tour: an SVG overlay whose mask has a white full rect and a black rounded rect animated (spring) to the current target's bounds + 8 px; a ring with a ping animation sits on top; a card positioned under or above the target (flip if no room) shows step n/total, copy, dot progress and Skip/Next.

## Project requirements
- React 19 + TypeScript, Tailwind CSS v4, shadcn/ui-style CSS variables (`background`, `foreground`, `muted`, `muted-foreground`, `border`, `card`, `primary`, `ring`). If the project lacks shadcn, set it up first (`npx shadcn@latest init`).
- Animation engine: **motion**.
- Install dependencies: `npm i motion`
- Put the component at `components/kinetik/spotlight-tour.tsx`.
- `cn` lives at `lib/kinetik/utils.ts` (source below).
- Shared hooks go at `lib/kinetik/core.ts` (source below).

## Non-negotiables
- **Accessibility:** Card is an aria-modal dialog that takes focus each step; arrow keys/Enter step, Esc ends. Reduced motion: no glide or pulse.
- **Performance:** SVG mask with one animated rect; measures targets on step and resize.
- Respect `prefers-reduced-motion` (replace movement with opacity or an instant change).
- Animate only transform / opacity / filter / clip-path. No hard-coded theme colors — use CSS variables so it works in light and dark.

## Source — components/kinetik/spotlight-tour.tsx
```tsx
"use client";
import { useEffect, useId, useLayoutEffect, useRef, useState, type RefObject } from "react";
import { AnimatePresence, motion } from "motion/react";
import { cn, useReducedMotion } from "@/lib/kinetik/core";

export interface TourStep {
  /** CSS selector inside the tour root. */
  target: string;
  title: string;
  body: string;
}

export interface SpotlightTourProps {
  steps: TourStep[];
  /** Element the tour lives in (the overlay covers it). */
  root: RefObject<HTMLElement | null>;
  open: boolean;
  onClose: () => void;
  className?: string;
}

type Box = { x: number; y: number; w: number; h: number };

/**
 * Product tour: a dimmed overlay with a rounded cut-out that glides (spring) from one target to the
 * next, a pulse ring around the target, and a tooltip card that flips above/below to stay in view.
 * Arrow keys / Enter step through, Esc ends. Focus moves to the card each step.
 */
export function SpotlightTour({ steps, root, open, onClose, className }: SpotlightTourProps) {
  const reduced = useReducedMotion();
  const [i, setI] = useState(0);
  const [box, setBox] = useState<Box | null>(null);
  const [size, setSize] = useState({ w: 0, h: 0 });
  const card = useRef<HTMLDivElement>(null);
  const uid = useId().replace(/:/g, "");
  const step = steps[i];

  useLayoutEffect(() => {
    if (!open) return;
    const r = root.current;
    const measure = () => {
      const t = r?.querySelector(step.target);
      if (!r || !t) return;
      const rr = r.getBoundingClientRect(), tr = t.getBoundingClientRect();
      setSize({ w: rr.width, h: rr.height });
      setBox({ x: tr.left - rr.left - 8, y: tr.top - rr.top - 8, w: tr.width + 16, h: tr.height + 16 });
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [open, step, root]);

  useEffect(() => {
    if (!open) return setI(0);
    card.current?.focus();
    const k = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight" || e.key === "Enter") (e.preventDefault(), i < steps.length - 1 ? setI(i + 1) : onClose());
      if (e.key === "ArrowLeft") setI((n) => Math.max(0, n - 1));
    };
    document.addEventListener("keydown", k);
    return () => document.removeEventListener("keydown", k);
  }, [open, i, steps.length, onClose]);

  const below = box ? box.y + box.h + 170 < size.h : true;
  const cardX = box ? Math.min(Math.max(12, box.x + box.w / 2 - 140), size.w - 292) : 0;
  const t = reduced ? { duration: 0 } : { type: "spring" as const, stiffness: 260, damping: 30 };

  return (
    <AnimatePresence>
      {open && box && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className={cn("absolute inset-0 z-50", className)}>
          <svg className="absolute inset-0 size-full" aria-hidden>
            <defs>
              <mask id={`kn-tour-${uid}`}>
                <rect width="100%" height="100%" fill="white" />
                <motion.rect animate={{ x: box.x, y: box.y, width: box.w, height: box.h }} transition={t} rx="14" fill="black" />
              </mask>
            </defs>
            <rect width="100%" height="100%" fill="rgb(0 0 0 / .62)" mask={`url(#kn-tour-${uid})`} onClick={onClose} />
          </svg>
          <motion.span aria-hidden className="pointer-events-none absolute rounded-[14px] ring-2 ring-white/80" animate={{ left: box.x, top: box.y, width: box.w, height: box.h }} transition={t}>
            {!reduced && <span className="absolute inset-0 animate-ping rounded-[14px] ring-2 ring-white/40" />}
          </motion.span>
          <motion.div
            ref={card}
            role="dialog"
            aria-modal="true"
            aria-labelledby={`kn-tour-t-${uid}`}
            tabIndex={-1}
            animate={{ left: cardX, top: below ? box.y + box.h + 12 : box.y - 12 - 150 }}
            transition={t}
            className="absolute w-[280px] rounded-2xl bg-popover p-4 text-popover-foreground shadow-2xl outline-none"
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.div key={i} initial={reduced ? false : { opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.18 }}>
                <p className="text-[11px] font-medium text-muted-foreground">Step {i + 1} of {steps.length}</p>
                <h2 id={`kn-tour-t-${uid}`} className="mt-0.5 font-semibold">{step.title}</h2>
                <p className="mt-1 text-sm text-muted-foreground">{step.body}</p>
              </motion.div>
            </AnimatePresence>
            <div className="mt-3 flex items-center justify-between">
              <div className="flex gap-1">{steps.map((_, n) => <motion.span key={n} animate={{ width: n === i ? 16 : 6 }} className={cn("h-1.5 rounded-full", n === i ? "bg-primary" : "bg-muted")} />)}</div>
              <div className="flex gap-2 text-sm">
                <button type="button" onClick={onClose} className="px-2 text-muted-foreground hover:text-foreground">Skip</button>
                <button type="button" onClick={() => (i < steps.length - 1 ? setI(i + 1) : onClose())} className="rounded-lg bg-foreground px-3 py-1.5 font-medium text-background">{i < steps.length - 1 ? "Next" : "Done"}</button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
```

## Usage example
```tsx
"use client";
import { useRef, useState } from "react";
import { Bell, Plus, Search } from "lucide-react";
import { SpotlightTour } from "@/components/kinetik/spotlight-tour";

export default function Demo() {
  const root = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(true);
  return (
    <div ref={root} className="relative h-full overflow-hidden bg-background">
      <header className="flex items-center gap-3 border-b border-border px-5 py-3">
        <span className="font-semibold">Orbit</span>
        <div data-tour="search" className="ml-4 flex h-8 flex-1 items-center gap-2 rounded-lg border border-border px-2.5 text-sm text-muted-foreground"><Search className="size-3.5" /> Search projects</div>
        <button data-tour="bell" aria-label="Notifications" className="grid size-8 place-items-center rounded-lg border border-border"><Bell className="size-4" /></button>
      </header>
      <main className="grid grid-cols-3 gap-3 p-5">
        {["Website", "Mobile app", "Brand"].map((p) => <div key={p} className="h-24 rounded-xl border border-border bg-card p-3 text-sm font-medium">{p}</div>)}
        <button data-tour="new" className="flex h-24 items-center justify-center gap-1.5 rounded-xl border border-dashed border-border text-sm text-muted-foreground"><Plus className="size-4" /> New project</button>
      </main>
      {!open && <button onClick={() => setOpen(true)} className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full bg-foreground px-4 py-2 text-sm text-background">Restart tour</button>}
      <SpotlightTour
        root={root}
        open={open}
        onClose={() => setOpen(false)}
        steps={[
          { target: "[data-tour=search]", title: "Find anything", body: "Search every project, file and comment from here." },
          { target: "[data-tour=new]", title: "Start a project", body: "Templates get you from zero to a shared board in seconds." },
          { target: "[data-tour=bell]", title: "Stay in the loop", body: "Mentions and reviews land here — nothing else." },
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
