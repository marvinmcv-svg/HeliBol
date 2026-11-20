You are given a task to integrate a component from the **kinetik** motion library into this codebase.

# AI — Plan Graph (`ai-plan-graph`)

Agent plan visualiser: a goal node grows a tree of steps; each step's sub-tasks spin then tick off, finished steps collapse into an 'N done' chip, and the next step unfolds — like watching an agent think.

## What it should do
Render the goal, then step nodes connected by a vertical line; a timer advances task index; running tasks show a spinner, done tasks a check; when a step completes collapse its tasks into a chip with layout; loop with a Replay button.

## Project requirements
- React 19 + TypeScript, Tailwind CSS v4, shadcn/ui-style CSS variables (`background`, `foreground`, `muted`, `muted-foreground`, `border`, `card`, `primary`, `ring`). If the project lacks shadcn, set it up first (`npx shadcn@latest init`).
- Animation engine: **motion**.
- Install dependencies: `npm i motion lucide-react`
- Put the component at `components/kinetik/ai-plan-graph.tsx`.
- `cn` lives at `lib/kinetik/utils.ts` (source below).
- Shared hooks go at `lib/kinetik/core.ts` (source below).

## Non-negotiables
- **Accessibility:** Plan is an ordered list with status text per item; progress is announced politely. Reduced motion shows the final state.
- **Performance:** Small DOM; height animations via layout on a handful of nodes.
- Respect `prefers-reduced-motion` (replace movement with opacity or an instant change).
- Animate only transform / opacity / filter / clip-path. No hard-coded theme colors — use CSS variables so it works in light and dark.

## Source — components/kinetik/ai-plan-graph.tsx
```tsx
"use client";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Check, Loader2 } from "lucide-react";
import { cn, useReducedMotion } from "@/lib/kinetik/core";

export interface PlanStep {
  id: string;
  title: string;
  /** Sub-tasks that branch out of this step. */
  children?: { id: string; title: string }[];
}

export interface AiPlanGraphProps {
  goal: string;
  steps: PlanStep[];
  /** ms per sub-task. */
  speed?: number;
  className?: string;
}

/**
 * An agent's plan as a growing tree: the goal sits at the top, steps unfold one at a time with a
 * connector line drawing down to each, each step branches into sub-tasks that spin then tick, and a
 * finished step collapses its branches into a summary count. Status is announced as it progresses.
 */
export function AiPlanGraph({ goal, steps, speed = 650, className }: AiPlanGraphProps) {
  const reduced = useReducedMotion();
  const flat = steps.flatMap((s) => [s.id, ...(s.children ?? []).map((c) => c.id)]);
  const [done, setDone] = useState(reduced ? flat.length : 0);

  useEffect(() => {
    if (reduced || done >= flat.length) return;
    const id = setTimeout(() => setDone((d) => d + 1), speed);
    return () => clearTimeout(id);
  }, [done, flat.length, speed, reduced]);

  const idx = (id: string) => flat.indexOf(id);
  const status = (id: string) => (idx(id) < done ? "done" : idx(id) === done ? "active" : "todo");
  const stepComplete = (s: PlanStep) => (s.children ?? []).every((c) => status(c.id) === "done") && status(s.id) === "done";
  const visibleSteps = steps.filter((s) => idx(s.id) <= done);

  const Dot = ({ st }: { st: string }) => (
    <span className={cn("grid size-5 shrink-0 place-items-center rounded-full", st === "done" ? "bg-emerald-500 text-white" : st === "active" ? "bg-primary/15 text-primary" : "bg-muted")}>
      {st === "done" ? <Check className="size-3" strokeWidth={3} /> : st === "active" ? <Loader2 className="size-3 animate-spin motion-reduce:animate-none" /> : null}
    </span>
  );

  return (
    <div className={cn("w-full max-w-md rounded-3xl border border-border bg-card p-5 text-sm", className)}>
      <div className="flex items-center gap-2 rounded-2xl bg-muted px-3 py-2">
        <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Goal</span>
        <span className="font-medium">{goal}</span>
      </div>
      <p className="sr-only" aria-live="polite">{done >= flat.length ? "Plan complete" : `Working on step ${visibleSteps.length} of ${steps.length}`}</p>
      <ol className="relative mt-2 pl-4">
        <AnimatePresence initial={false}>
          {visibleSteps.map((s) => {
            const complete = stepComplete(s);
            return (
              <motion.li key={s.id} layout={!reduced} initial={reduced ? false : { opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} className="relative pt-3">
                <motion.span aria-hidden className="absolute -left-[9px] top-0 w-px bg-border" initial={reduced ? false : { height: 0 }} animate={{ height: "100%" }} transition={{ duration: 0.4 }} />
                <span aria-hidden className="absolute -left-[9px] top-[1.35rem] h-px w-3 bg-border" />
                <div className="flex items-center gap-2">
                  <Dot st={complete ? "done" : status(s.id) === "todo" ? "todo" : "active"} />
                  <span className="font-medium">{s.title}</span>
                  {complete && s.children?.length ? <motion.span initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} className="ml-auto rounded-full bg-emerald-500/15 px-2 py-0.5 text-[11px] text-emerald-600 dark:text-emerald-400">{s.children.length} done</motion.span> : null}
                </div>
                <AnimatePresence initial={false}>
                  {!complete && s.children && (
                    <motion.ul initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: reduced ? 0 : 0.3 }} className="ml-2.5 overflow-hidden border-l border-dashed border-border pl-4">
                      {s.children.filter((c) => idx(c.id) <= done).map((c) => (
                        <motion.li key={c.id} initial={reduced ? false : { opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-2 py-1 text-muted-foreground">
                          <Dot st={status(c.id)} />
                          <span className={cn(status(c.id) === "done" && "text-foreground")}>{c.title}</span>
                        </motion.li>
                      ))}
                    </motion.ul>
                  )}
                </AnimatePresence>
              </motion.li>
            );
          })}
        </AnimatePresence>
      </ol>
    </div>
  );
}
```

## Usage example
```tsx
"use client";
import { useState } from "react";
import { AiPlanGraph } from "@/components/kinetik/ai-plan-graph";

export default function Demo() {
  const [k, setK] = useState(0);
  return (
    <div className="flex h-full flex-col items-center gap-3 overflow-y-auto p-5">
      <AiPlanGraph
        key={k}
        goal="Launch the spring campaign"
        steps={[
          { id: "a", title: "Research the audience", children: [{ id: "a1", title: "Pull last quarter's cohorts" }, { id: "a2", title: "Summarise 12 interviews" }] },
          { id: "b", title: "Draft the landing page", children: [{ id: "b1", title: "Write hero copy" }, { id: "b2", title: "Pick a template" }, { id: "b3", title: "Generate visuals" }] },
          { id: "c", title: "Schedule the emails", children: [{ id: "c1", title: "Segment the list" }, { id: "c2", title: "Queue 3 sends" }] },
        ]}
      />
      <button onClick={() => setK((x) => x + 1)} className="text-xs text-muted-foreground underline underline-offset-4">Run again</button>
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
