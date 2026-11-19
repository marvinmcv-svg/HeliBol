You are given a task to integrate a component from the **kinetik** motion library into this codebase.

# Stacked Sheets (`sheet-stack`)

iOS-style stacked sheets: each new sheet slides up while the layers beneath scale back, dim and round their corners; drag a sheet down (or Esc) to dismiss and everything springs forward.

## What it should do
Build stacked sheets with Motion: the page and each sheet animate scale (1 − .06·above), y (−10·above), rounded corners and brightness based on how many sheets are above them; new sheets enter from y:100%; the top sheet drags on y with elastic bottom and closes past 120 px or a fast flick.

## Project requirements
- React 19 + TypeScript, Tailwind CSS v4, shadcn/ui-style CSS variables (`background`, `foreground`, `muted`, `muted-foreground`, `border`, `card`, `primary`, `ring`). If the project lacks shadcn, set it up first (`npx shadcn@latest init`).
- Animation engine: **motion**.
- Install dependencies: `npm i motion`
- Put the component at `components/kinetik/sheet-stack.tsx`.
- `cn` lives at `lib/kinetik/utils.ts` (source below).
- Shared hooks go at `lib/kinetik/core.ts` (source below).

## Non-negotiables
- **Accessibility:** Top sheet is an aria-modal dialog that receives focus; lower layers are aria-hidden; Esc and the grabber button close. Reduced motion: no drag, fades.
- **Performance:** Transforms and a brightness filter per layer.
- Respect `prefers-reduced-motion` (replace movement with opacity or an instant change).
- Animate only transform / opacity / filter / clip-path. No hard-coded theme colors — use CSS variables so it works in light and dark.

## Source — components/kinetik/sheet-stack.tsx
```tsx
"use client";
import { useEffect, useRef, type ReactNode } from "react";
import { AnimatePresence, motion } from "motion/react";
import { cn, useReducedMotion } from "@/lib/kinetik/core";

export interface Sheet {
  id: string;
  title: string;
  content: ReactNode;
}

export interface SheetStackProps {
  /** The page under the sheets. */
  children: ReactNode;
  /** Open sheets, bottom to top. */
  sheets: Sheet[];
  onClose: (id: string) => void;
  className?: string;
}

/**
 * iOS-style stacked sheets: each new sheet slides up and the layers beneath scale back, dim and
 * round their corners — the page recedes like a card deck. Drag a sheet down (or press Esc / the
 * grabber) to dismiss it; everything below springs forward again.
 */
export function SheetStack({ children, sheets, onClose, className }: SheetStackProps) {
  const reduced = useReducedMotion();
  const top = sheets.at(-1);
  const topRef = useRef<HTMLDivElement>(null);
  const depth = sheets.length;
  const spring = reduced ? { duration: 0 } : { type: "spring" as const, stiffness: 380, damping: 36 };

  const topId = top?.id;
  useEffect(() => {
    if (!topId) return;
    topRef.current?.focus();
    const k = (e: KeyboardEvent) => e.key === "Escape" && onClose(topId);
    document.addEventListener("keydown", k);
    return () => document.removeEventListener("keydown", k);
  }, [topId, onClose]);

  // how far a layer recedes, given how many sheets sit above it
  const recede = (above: number) => (reduced || above === 0 ? {} : { scale: 1 - 0.06 * above, y: -10 * above, borderRadius: 18, filter: `brightness(${1 - 0.18 * above})` });

  return (
    <div className={cn("relative h-full overflow-hidden bg-black", className)}>
      <motion.div className="h-full origin-top overflow-hidden bg-background" animate={{ scale: 1, y: 0, borderRadius: 0, filter: "brightness(1)", ...recede(depth) }} transition={spring} aria-hidden={depth > 0}>
        {children}
      </motion.div>
      <AnimatePresence>
        {sheets.map((s, i) => {
          const above = depth - 1 - i;
          const isTop = above === 0;
          return (
            <motion.div
              key={s.id}
              ref={isTop ? topRef : undefined}
              role="dialog"
              aria-modal={isTop}
              aria-label={s.title}
              aria-hidden={!isTop}
              tabIndex={-1}
              initial={reduced ? { opacity: 0 } : { y: "100%" }}
              animate={{ opacity: 1, y: 0, scale: 1, borderRadius: 18, filter: "brightness(1)", ...recede(above) }}
              exit={reduced ? { opacity: 0 } : { y: "100%" }}
              transition={spring}
              drag={isTop && !reduced ? "y" : false}
              dragConstraints={{ top: 0, bottom: 0 }}
              dragElastic={{ top: 0.05, bottom: 0.8 }}
              onDragEnd={(_, info) => (info.offset.y > 120 || info.velocity.y > 600) && onClose(s.id)}
              className="absolute inset-x-0 bottom-0 flex origin-top flex-col overflow-hidden bg-card shadow-[0_-10px_40px_rgb(0_0_0/.35)] outline-none"
              style={{ top: 28 + i * 14 }}
            >
              <button type="button" onClick={() => onClose(s.id)} aria-label={`Close ${s.title}`} className="mx-auto mt-2 h-5 w-14 shrink-0 cursor-grab">
                <span className="mx-auto block h-1 w-10 rounded-full bg-muted-foreground/40" />
              </button>
              <h2 className="px-5 pb-2 text-lg font-semibold">{s.title}</h2>
              <div className="min-h-0 flex-1 overflow-y-auto px-5 pb-6">{s.content}</div>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
```

## Usage example
```tsx
"use client";
import { useCallback, useState } from "react";
import { photos } from "@/components/kinetik/demo-helpers" /* or inline */;
import { SheetStack } from "@/components/kinetik/sheet-stack";

const next: Record<string, string | undefined> = { Share: "Options", Options: "Advanced" };
const blurb: Record<string, string> = { Share: "Pick a person or app.", Options: "Fine-tune before sharing.", Advanced: "Advanced settings." };

export default function Demo() {
  const [stack, setStack] = useState<string[]>(["Share", "Options"]);
  const push = (title: string) => setStack((s) => [...s, title]);
  const close = useCallback((id: string) => setStack((s) => s.slice(0, Number(id))), []);
  const sheets = stack.map((title, i) => ({
    id: String(i),
    title,
    content: (
      <div className="space-y-3 text-sm">
        <p className="text-muted-foreground">{blurb[title]}</p>
        {next[title] && (
          <button onClick={() => push(next[title]!)} className="w-full rounded-xl bg-foreground py-2.5 font-medium text-background">
            Open {next[title]!.toLowerCase()} sheet
          </button>
        )}
        <p className="text-xs text-muted-foreground">Drag down or press Esc to dismiss.</p>
      </div>
    ),
  }));
  return (
    <div className="mx-auto h-full max-w-sm">
      <SheetStack sheets={sheets} onClose={close}>
        <div className="flex h-full flex-col">
          <img src={photos[4]} alt="Amber desert road" className="h-1/2 w-full object-cover" />
          <div className="space-y-3 p-5">
            <h3 className="text-xl font-semibold">Route 12, Utah</h3>
            <p className="text-sm text-muted-foreground">Golden hour on the canyon road.</p>
            <button onClick={() => setStack(["Share"])} className="rounded-xl bg-primary px-4 py-2 text-sm font-medium text-primary-foreground">Share</button>
          </div>
        </div>
      </SheetStack>
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
