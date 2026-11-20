You are given a task to integrate a component from the **kinetik** motion library into this codebase.

# Background — Orbit Rings (`bg-orbit-rings`)

Tilted solar-system backdrop: concentric orbits around a glowing core, each spinning at its own speed and direction and carrying a glowing planet with a comet tail. Pure SVG and CSS keyframes in 3D perspective.

## What it should do
Draw concentric circles in an SVG tilted with perspective + rotateX(64deg); per ring, a group spinning via CSS keyframes (negative delay for phase) containing a short dashed arc as the tail and a glowing planet.

## Project requirements
- React 19 + TypeScript, Tailwind CSS v4, shadcn/ui-style CSS variables (`background`, `foreground`, `muted`, `muted-foreground`, `border`, `card`, `primary`, `ring`). If the project lacks shadcn, set it up first (`npx shadcn@latest init`).
- Animation engine: **css**.
- No runtime dependencies (CSS only).
- Put the component at `components/kinetik/bg-orbit-rings.tsx`.
- `cn` lives at `lib/kinetik/utils.ts` (source below).
- Shared hooks go at `lib/kinetik/core.ts` (source below).

## Non-negotiables
- **Accessibility:** Decorative and aria-hidden. Reduced motion freezes the planets in staggered positions.
- **Performance:** CSS keyframe rotations on SVG groups; no JS per frame.
- Respect `prefers-reduced-motion` (replace movement with opacity or an instant change).
- Animate only transform / opacity / filter / clip-path. No hard-coded theme colors — use CSS variables so it works in light and dark.

## Source — components/kinetik/bg-orbit-rings.tsx
```tsx
"use client";
import type { ReactNode } from "react";
import { cn, useReducedMotion } from "@/lib/kinetik/core";

export interface BgOrbitRingsProps {
  children?: ReactNode;
  /** Number of rings. */
  rings?: number;
  /** Planet colours, one per ring (cycles). */
  colors?: string[];
  className?: string;
}

/**
 * A tilted solar-system backdrop: concentric dashed orbits around a glowing core, each spinning at
 * its own speed and direction, each carrying a glowing planet with a fading comet tail. The whole
 * system is tilted in 3D so the orbits read as ellipses. Pure SVG + CSS keyframes.
 */
export function BgOrbitRings({ children, rings = 5, colors = ["#a78bfa", "#22d3ee", "#f472b6", "#facc15", "#34d399"], className }: BgOrbitRingsProps) {
  const reduced = useReducedMotion();
  return (
    <div className={cn("relative overflow-hidden bg-[radial-gradient(ellipse_at_50%_55%,#1e1b4b_0%,#05050a_65%)]", className)}>
      <style>{`@keyframes kn-orb{to{transform:rotate(360deg)}}`}</style>
      <div aria-hidden className="absolute inset-0" style={{ perspective: 2400 }}>
      <div className="absolute left-1/2 top-[58%] aspect-square w-[115%] max-w-[1100px]" style={{ transform: "translate(-50%,-50%) rotateX(62deg)" }}>
        <svg viewBox="-500 -500 1000 1000" className="absolute inset-0 size-full overflow-visible">
          <defs>
            <radialGradient id="kn-orb-core"><stop offset="0" stopColor="#fff" /><stop offset=".25" stopColor="#c4b5fd" /><stop offset="1" stopColor="#7c3aed" stopOpacity="0" /></radialGradient>
          </defs>
          <circle r="90" fill="url(#kn-orb-core)" />
          {Array.from({ length: rings }, (_, i) => {
            const r = 130 + i * 72, c = colors[i % colors.length]!, dur = 14 + i * 7, dir = i % 2 ? "reverse" : "normal";
            return (
              <g key={i}>
                <circle r={r} fill="none" stroke="#fff" strokeOpacity={0.14 - i * 0.015} strokeDasharray={i % 2 ? "2 10" : "none"} />
                <g style={reduced ? { transform: `rotate(${i * 67}deg)` } : { animation: `kn-orb ${dur}s linear ${-((i * 67) / 360) * dur}s infinite ${dir}` }}>
                  <circle r={r} fill="none" stroke={c} strokeWidth="3" strokeLinecap="round" strokeDasharray={`${r * 0.6} ${r * 10}`} strokeOpacity=".55" transform={dir === "reverse" ? undefined : "scale(1,-1)"} /* tail trails behind the planet */ style={{ filter: `drop-shadow(0 0 6px ${c})` }} />
                  <circle cx={r} cy="0" r={7 - i * 0.6} fill={c} style={{ filter: `drop-shadow(0 0 10px ${c})` }} />
                </g>
              </g>
            );
          })}
        </svg>
      </div>
      </div>
      {children && <div className="relative z-10 h-full">{children}</div>}
    </div>
  );
}
```

## Usage example
```tsx
"use client";
import { BgOrbitRings } from "@/components/kinetik/bg-orbit-rings";

export default function Demo() {
  return (
    <BgOrbitRings className="h-full">
      <div className="grid h-full place-items-start justify-center p-10 pt-14 text-center text-white">
        <div>
          <p className="text-[10px] uppercase tracking-[0.35em] text-violet-200/70">Integrations</p>
          <h3 className="mt-2 text-4xl font-semibold tracking-tight">Everything in orbit</h3>
          <p className="mt-2 text-sm text-white/60">Connect the tools your team already uses.</p>
        </div>
      </div>
    </BgOrbitRings>
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
