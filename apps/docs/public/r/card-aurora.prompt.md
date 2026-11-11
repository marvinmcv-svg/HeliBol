You are given a task to integrate a component from the **kinetik** motion library into this codebase.

# Aurora Card (`card-aurora`)

A quiet card that wakes on hover: drifting aurora blobs fade in behind frosted glass and lean toward the cursor via CSS variables.

## What it should do
Build an aurora card: three large blurred blobs drifting (rotate/translate/scale keyframes, different durations) in a layer at 30% opacity that rises to 100% on hover/focus-within; the layer translates by CSS vars --mx/--my set from the pointer. Content sits on a backdrop-blur card surface inset by 1 px so the light shows as a border.

## Project requirements
- React 19 + TypeScript, Tailwind CSS v4, shadcn/ui-style CSS variables (`background`, `foreground`, `muted`, `muted-foreground`, `border`, `card`, `primary`, `ring`). If the project lacks shadcn, set it up first (`npx shadcn@latest init`).
- Animation engine: **css**.
- No runtime dependencies (CSS only).
- Put the component at `components/kinetik/card-aurora.tsx`.
- `cn` lives at `lib/kinetik/utils.ts` (source below).
- Shared hooks go at `lib/kinetik/core.ts` (source below).

## Non-negotiables
- **Accessibility:** Purely decorative layer; content stays readable at rest. Pointer lean is off on touch and reduced motion; blob drift stops under reduced motion.
- **Performance:** CSS keyframes on three blurred blobs; pointer updates two CSS variables (no React renders).
- Respect `prefers-reduced-motion` (replace movement with opacity or an instant change).
- Animate only transform / opacity / filter / clip-path. No hard-coded theme colors — use CSS variables so it works in light and dark.

## Source — components/kinetik/card-aurora.tsx
```tsx
"use client";
import { useRef, type ReactNode } from "react";
import { cn, usePrefersTouch, useReducedMotion } from "@/lib/kinetik/core";

export interface CardAuroraProps {
  children: ReactNode;
  /** Three aurora colours. */
  colors?: [string, string, string];
  className?: string;
}

const css = `
@keyframes kn-aurora-drift { 0% { transform: translate(-10%, -6%) rotate(0deg) scale(1); } 50% { transform: translate(8%, 6%) rotate(160deg) scale(1.15); } 100% { transform: translate(-10%, -6%) rotate(360deg) scale(1); } }
.kn-aurora-blob { animation: kn-aurora-drift var(--d) linear infinite; }
.kn-aurora-card:hover .kn-aurora-layer, .kn-aurora-card:focus-within .kn-aurora-layer { opacity: 1; }
@media (prefers-reduced-motion: reduce) { .kn-aurora-blob { animation: none; } }
[data-reduce-motion] .kn-aurora-blob { animation: none; }
`;

/**
 * A quiet card that wakes up on hover: drifting aurora blobs fade in behind frosted glass and lean
 * toward the cursor (CSS variables, no re-renders). The border picks up the same light.
 */
export function CardAurora({ children, colors = ["#22d3ee", "#a78bfa", "#f472b6"], className }: CardAuroraProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const touch = usePrefersTouch();
  return (
    <div
      ref={ref}
      onPointerMove={(e) => {
        if (reduced || touch || !ref.current) return;
        const r = ref.current.getBoundingClientRect();
        ref.current.style.setProperty("--mx", `${((e.clientX - r.left) / r.width - 0.5) * 30}%`);
        ref.current.style.setProperty("--my", `${((e.clientY - r.top) / r.height - 0.5) * 30}%`);
      }}
      className={cn("kn-aurora-card group relative overflow-hidden rounded-3xl border border-border bg-card p-px", className)}
    >
      <style href="kn-card-aurora" precedence="kinetik">{css}</style>
      <div aria-hidden className="kn-aurora-layer absolute inset-0 opacity-30 transition-opacity duration-700" style={{ transform: "translate(var(--mx, 0), var(--my, 0))", transition: "opacity .7s, transform .6s cubic-bezier(.2,.8,.2,1)" }}>
        {colors.map((c, i) => (
          <span
            key={i}
            className="kn-aurora-blob absolute size-[70%] rounded-full blur-3xl"
            style={{ background: c, left: `${[-10, 35, 10][i]}%`, top: `${[-15, 10, 45][i]}%`, opacity: 0.7, ["--d" as string]: `${14 + i * 5}s`, animationDirection: i % 2 ? "reverse" : "normal" }}
          />
        ))}
      </div>
      <div className="relative h-full rounded-[calc(1.5rem-1px)] bg-card/70 p-6 backdrop-blur-2xl">{children}</div>
    </div>
  );
}
```

## Usage example
```tsx
"use client";
import { Sparkles, Zap } from "lucide-react";
import { DemoCenter } from "@/components/kinetik/demo-helpers" /* or inline */;
import { CardAurora } from "@/components/kinetik/card-aurora";

export default function Demo() {
  return (
    <DemoCenter>
      <CardAurora className="w-64">
        <Sparkles className="size-5" />
        <h3 className="mt-6 text-lg font-semibold">Smart drafts</h3>
        <p className="mt-1 text-sm text-muted-foreground">Write the first version for you, in your voice.</p>
      </CardAurora>
      <CardAurora className="w-64" colors={["#f59e0b", "#ef4444", "#8b5cf6"]}>
        <Zap className="size-5" />
        <h3 className="mt-6 text-lg font-semibold">Instant sync</h3>
        <p className="mt-1 text-sm text-muted-foreground">Every device, every change, under 50 ms.</p>
      </CardAurora>
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
