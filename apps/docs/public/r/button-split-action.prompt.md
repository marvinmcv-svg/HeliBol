You are given a task to integrate a component from the **kinetik** motion library into this codebase.

# Button — Split Action (`button-split-action`)

Split button whose menu grows out of the button itself: the chevron opens a panel that morphs from the pill's shape with options staggering in; picking one rolls the main label to the new action.

## What it should do
Render a pill with a primary button and a chevron; the menu animates from scale .4 / radius 999 / y −24 at the top-right to a 16px-radius panel; items stagger in; choosing one rolls the primary label with AnimatePresence and closes the menu.

## Project requirements
- React 19 + TypeScript, Tailwind CSS v4, shadcn/ui-style CSS variables (`background`, `foreground`, `muted`, `muted-foreground`, `border`, `card`, `primary`, `ring`). If the project lacks shadcn, set it up first (`npx shadcn@latest init`).
- Animation engine: **motion**.
- Install dependencies: `npm i motion lucide-react`
- Put the component at `components/kinetik/button-split-action.tsx`.
- `cn` lives at `lib/kinetik/utils.ts` (source below).
- Shared hooks go at `lib/kinetik/core.ts` (source below).

## Non-negotiables
- **Accessibility:** Chevron has aria-haspopup/expanded; menu uses menuitemradio with arrow keys, Esc returns focus. Reduced motion fades.
- **Performance:** One panel morph and a few staggered items; label roll via AnimatePresence.
- Respect `prefers-reduced-motion` (replace movement with opacity or an instant change).
- Animate only transform / opacity / filter / clip-path. No hard-coded theme colors — use CSS variables so it works in light and dark.

## Source — components/kinetik/button-split-action.tsx
```tsx
"use client";
import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Check, ChevronDown } from "lucide-react";
import { cn, useReducedMotion } from "@/lib/kinetik/core";

export interface SplitOption { id: string; label: string; hint?: string; icon?: ReactNode }
export interface ButtonSplitActionProps {
  options: SplitOption[];
  defaultId?: string;
  onAction?: (id: string) => void;
  className?: string;
}

/**
 * Split button whose menu grows out of the button itself: the chevron opens a panel that morphs
 * from the button's shape (shared layout) with options staggering in; picking one rolls the main
 * label to the new action and closes the panel back into the button. Full menu keyboard support.
 */
export function ButtonSplitAction({ options, defaultId, onAction, className }: ButtonSplitActionProps) {
  const reduced = useReducedMotion();
  const uid = useId();
  const [sel, setSel] = useState(defaultId ?? options[0]!.id);
  const [open, setOpen] = useState(false);
  const [fired, setFired] = useState(0);
  const items = useRef<(HTMLButtonElement | null)[]>([]);
  const chevron = useRef<HTMLButtonElement>(null);
  const cur = options.find((o) => o.id === sel) ?? options[0]!;
  const spring = reduced ? { duration: 0 } : { type: "spring" as const, stiffness: 420, damping: 34 };

  useEffect(() => {
    if (!open) return;
    items.current[Math.max(0, options.findIndex((o) => o.id === sel))]?.focus();
    const close = (e: PointerEvent) => !(e.target as Element).closest(`[data-split="${uid}"]`) && setOpen(false);
    document.addEventListener("pointerdown", close);
    return () => document.removeEventListener("pointerdown", close);
  }, [open, options, sel, uid]);

  const choose = (id: string) => {
    setSel(id);
    setOpen(false);
    chevron.current?.focus();
  };

  return (
    <div data-split={uid} className={cn("relative inline-block", className)}>
      <motion.div layout transition={spring} className="relative flex h-11 overflow-hidden rounded-full bg-foreground text-background shadow-lg">
        <button type="button" onClick={() => (setFired((f) => f + 1), onAction?.(sel))} className="relative flex items-center gap-2 pl-5 pr-4 text-sm font-medium outline-none focus-visible:bg-white/10">
          <span className="relative grid h-5 overflow-hidden">
            <AnimatePresence initial={false} mode="popLayout">
              <motion.span key={cur.id} className="col-start-1 row-start-1 flex items-center gap-2 whitespace-nowrap" initial={{ y: reduced ? 0 : 22, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: reduced ? 0 : -22, opacity: 0 }} transition={spring}>
                {cur.icon}
                {cur.label}
              </motion.span>
            </AnimatePresence>
          </span>
          {fired > 0 && !reduced && <motion.span key={fired} aria-hidden className="absolute inset-0 bg-white" initial={{ opacity: 0.25 }} animate={{ opacity: 0 }} transition={{ duration: 0.5 }} />}
        </button>
        <span aria-hidden className="my-2.5 w-px bg-background/25" />
        <button
          ref={chevron}
          type="button"
          aria-haspopup="menu"
          aria-expanded={open}
          aria-label="More actions"
          onClick={() => setOpen((o) => !o)}
          onKeyDown={(e) => e.key === "ArrowDown" && (e.preventDefault(), setOpen(true))}
          className="grid w-11 place-items-center outline-none focus-visible:bg-white/10"
        >
          <motion.span animate={{ rotate: open ? 180 : 0 }} transition={spring}><ChevronDown className="size-4" /></motion.span>
        </button>
      </motion.div>
      <AnimatePresence>
        {open && (
          <motion.div
            role="menu"
            aria-label="Actions"
            className="absolute right-0 top-full z-20 mt-2 w-64 origin-top-right overflow-hidden rounded-2xl border bg-popover p-1.5 text-popover-foreground shadow-2xl"
            initial={reduced ? { opacity: 0 } : { opacity: 0, scale: 0.4, y: -24, borderRadius: 999 }}
            animate={{ opacity: 1, scale: 1, y: 0, borderRadius: 16 }}
            exit={reduced ? { opacity: 0 } : { opacity: 0, scale: 0.5, y: -20, borderRadius: 999, transition: { duration: 0.18 } }}
            transition={spring}
            onKeyDown={(e) => {
              const i = items.current.findIndex((x) => x === document.activeElement);
              if (e.key === "ArrowDown" || e.key === "ArrowUp") {
                e.preventDefault();
                items.current[(i + (e.key === "ArrowDown" ? 1 : -1) + options.length) % options.length]?.focus();
              } else if (e.key === "Escape" || e.key === "Tab") {
                setOpen(false);
                if (e.key === "Escape") chevron.current?.focus();
              }
            }}
          >
            {options.map((o, i) => (
              <motion.button
                key={o.id}
                ref={(el) => void (items.current[i] = el)}
                role="menuitemradio"
                aria-checked={o.id === sel}
                type="button"
                onClick={() => choose(o.id)}
                initial={{ opacity: 0, y: reduced ? 0 : -6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: reduced ? 0 : 0.05 + i * 0.04 }}
                className="flex w-full items-start gap-3 rounded-xl px-3 py-2 text-left outline-none hover:bg-muted focus-visible:bg-muted"
              >
                <span className="mt-0.5 text-muted-foreground">{o.icon}</span>
                <span className="flex-1">
                  <span className="block text-sm font-medium">{o.label}</span>
                  {o.hint && <span className="block text-xs text-muted-foreground">{o.hint}</span>}
                </span>
                {o.id === sel && <Check className="mt-0.5 size-4" />}
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
```

## Usage example
```tsx
"use client";
import { Clock, GitMerge, Layers, Send } from "lucide-react";
import { DemoCenter } from "@/components/kinetik/demo-helpers" /* or inline */;
import { ButtonSplitAction } from "@/components/kinetik/button-split-action";

export default function Demo() {
  return (
    <DemoCenter className="items-start pt-24">
      <ButtonSplitAction
        options={[
          { id: "merge", label: "Merge pull request", hint: "All commits added to main", icon: <GitMerge className="size-4" /> },
          { id: "squash", label: "Squash and merge", hint: "One commit on main", icon: <Layers className="size-4" /> },
          { id: "schedule", label: "Merge at 6 pm", hint: "Queue for the evening deploy", icon: <Clock className="size-4" /> },
          { id: "review", label: "Request review", hint: "Ping two reviewers", icon: <Send className="size-4" /> },
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
