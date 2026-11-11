You are given a task to integrate a component from the **kinetik** motion library into this codebase.

# Flair Cursor Trail (`gsap-flair-trail`)

Every few pixels of pointer travel a sprite (emoji, star, shape) pops out, flies in the direction you moved, spins and falls with gravity, then disappears.

## What it should do
Create a flair trail container: on pointermove, when the pointer has moved ≥ spacing px since the last spawn, append an absolutely positioned span with the next sprite at the pointer, then a GSAP timeline: scale 0→random(.8,1.4) back.out(3); x += dx·2.5 (power2.out) and y += dy·1.5 + 140 (power2.in) in parallel over 1.2s so it arcs and falls; spin += random(±360); fade out from .8s; remove on complete.

## Project requirements
- React 19 + TypeScript, Tailwind CSS v4, shadcn/ui-style CSS variables (`background`, `foreground`, `muted`, `muted-foreground`, `border`, `card`, `primary`, `ring`). If the project lacks shadcn, set it up first (`npx shadcn@latest init`).
- Animation engine: **gsap**.
- Install dependencies: `npm i gsap @gsap/react`
- Put the component at `components/kinetik/gsap-flair-trail.tsx`.
- `cn` lives at `lib/kinetik/utils.ts` (source below).
- Shared hooks go at `lib/kinetik/core.ts` (source below).

## Non-negotiables
- **Accessibility:** Sprites are aria-hidden and pointer-events:none; nothing spawns under reduced motion.
- **Performance:** Spawns are distance-throttled (spacing) and removed on complete; transforms only.
- Respect `prefers-reduced-motion` (replace movement with opacity or an instant change).
- Animate only transform / opacity / filter / clip-path. No hard-coded theme colors — use CSS variables so it works in light and dark.

## Source — components/kinetik/gsap-flair-trail.tsx
```tsx
"use client";
import { useRef, type ReactNode } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { cn, useReducedMotion } from "@/lib/kinetik/core";

gsap.registerPlugin(useGSAP);

export interface GsapFlairTrailProps {
  children?: ReactNode;
  /** Sprites to spawn (emoji, text, or any node rendered once and cloned). */
  flair?: string[];
  /** Minimum pointer travel (px) between spawns. */
  spacing?: number;
  className?: string;
}

/**
 * Pointer "flair": every few pixels of travel a sprite pops out at the cursor, flies in the
 * direction you're moving, spins and drops with a gravity-like ease, then is removed.
 */
export function GsapFlairTrail({ children, flair = ["✦", "★", "●", "◆", "✿"], spacing = 36, className }: GsapFlairTrailProps) {
  const root = useRef<HTMLDivElement>(null);
  const last = useRef<{ x: number; y: number } | null>(null);
  const n = useRef(0);
  const reduced = useReducedMotion();
  const { contextSafe } = useGSAP({ scope: root });

  const onMove = contextSafe((e: React.PointerEvent) => {
    if (reduced) return;
    const box = root.current!.getBoundingClientRect();
    const x = e.clientX - box.left;
    const y = e.clientY - box.top;
    const prev = last.current;
    if (prev && Math.hypot(x - prev.x, y - prev.y) < spacing) return;
    const dx = prev ? x - prev.x : 0;
    const dy = prev ? y - prev.y : 0;
    last.current = { x, y };
    const el = document.createElement("span");
    el.textContent = flair[n.current++ % flair.length];
    el.setAttribute("aria-hidden", "true");
    el.className = "pointer-events-none absolute left-0 top-0 select-none text-2xl";
    el.style.color = `hsl(${(n.current * 37) % 360} 90% 65%)`;
    root.current!.appendChild(el);
    gsap
      .timeline({ onComplete: () => el.remove() })
      .set(el, { x, y, xPercent: -50, yPercent: -50, scale: 0, rotation: gsap.utils.random(-90, 90) })
      .to(el, { scale: gsap.utils.random(0.8, 1.4), duration: 0.25, ease: "back.out(3)" })
      .to(el, { x: x + dx * 2.5, duration: 1.2, ease: "power2.out" }, 0)
      .to(el, { y: y + dy * 1.5 + 140, duration: 1.2, ease: "power2.in" }, 0)
      .to(el, { rotation: `+=${gsap.utils.random(-360, 360)}`, duration: 1.2, ease: "none" }, 0)
      .to(el, { opacity: 0, scale: 0.4, duration: 0.4 }, 0.8);
  });

  return (
    <div ref={root} onPointerMove={onMove} onPointerLeave={() => (last.current = null)} className={cn("relative overflow-hidden", className)}>
      {children}
    </div>
  );
}
```

## Usage example
```tsx
"use client";
import { GsapFlairTrail } from "@/components/kinetik/gsap-flair-trail";

export default function Demo() {
  return (
    <GsapFlairTrail className="h-full w-full" flair={["✦", "🎉", "★", "💜", "✿", "⚡"]}>
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_60%_at_50%_40%,rgba(139,92,246,0.25),transparent)]" />
      <div className="relative grid h-full place-items-center text-center">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Launch party</p>
          <h3 className="mt-2 text-5xl font-semibold tracking-tight">Wiggle your cursor</h3>
          <p className="mt-3 text-sm text-muted-foreground">Flair flies out in the direction you move.</p>
        </div>
      </div>
      <div aria-hidden className="pointer-events-none absolute inset-0">
        {["left-[12%] top-[20%] text-pink-400", "left-[80%] top-[30%] text-amber-300", "left-[22%] top-[72%] text-sky-400", "left-[70%] top-[75%] text-violet-400", "left-[48%] top-[12%] text-emerald-400"].map((c, i) => (
          <span key={i} className={`absolute text-3xl ${c}`} style={{ rotate: `${i * 35}deg` }}>{["✦", "★", "✿", "◆", "●"][i]}</span>
        ))}
      </div>
    </GsapFlairTrail>
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
