You are given a task to integrate a component from the **kinetik** motion library into this codebase.

# Chart — Live Stream (`chart-live-stream`)

Streaming line chart that scrolls smoothly between ticks: new points arrive every interval while the path translates continuously, the y-range eases to fit, and a pulsing head dot shows the latest value.

## What it should do
Keep a fixed-length buffer, push a random-walk value each tick; draw the path one step wider than the view and translate it left by progress × step inside rAF; ease min/max toward the buffer's range; gradient fill under the line.

## Project requirements
- React 19 + TypeScript, Tailwind CSS v4, shadcn/ui-style CSS variables (`background`, `foreground`, `muted`, `muted-foreground`, `border`, `card`, `primary`, `ring`). If the project lacks shadcn, set it up first (`npx shadcn@latest init`).
- Animation engine: **svg**.
- No runtime dependencies (CSS only).
- Put the component at `components/kinetik/chart-live-stream.tsx`.
- `cn` lives at `lib/kinetik/utils.ts` (source below).
- Shared hooks go at `lib/kinetik/core.ts` (source below).

## Non-negotiables
- **Accessibility:** role=img with an aria-label holding the latest value; pause button; reduced motion updates per tick without the scroll.
- **Performance:** One SVG path rebuilt per tick; between ticks only a transform changes via rAF.
- Respect `prefers-reduced-motion` (replace movement with opacity or an instant change).
- Animate only transform / opacity / filter / clip-path. No hard-coded theme colors — use CSS variables so it works in light and dark.

## Source — components/kinetik/chart-live-stream.tsx
```tsx
"use client";
import { useEffect, useId, useRef, useState } from "react";
import { cn, useInView, useReducedMotion } from "@/lib/kinetik/core";

export interface ChartLiveStreamProps {
  /** Provide real values; called every tick. Defaults to a random walk. */
  next?: (prev: number) => number;
  /** Visible points. */
  points?: number;
  /** ms between samples. */
  interval?: number;
  label?: string;
  unit?: string;
  color?: string;
  className?: string;
}

const W = 600, H = 180;
const randomWalk = (p: number) => Math.max(5, Math.min(95, p + (Math.random() - 0.48) * 12));

/**
 * Live streaming chart: new samples slide in from the right while the window scrolls smoothly
 * between ticks (translate interpolated on rAF, not jumping), a pulsing head dot marks the latest
 * value, and the y-range eases to fit. Pauses when off-screen; reduced motion updates per tick.
 */
export function ChartLiveStream({ next = randomWalk, points = 40, interval = 700, label = "Requests / s", unit = "", color = "#38bdf8", className }: ChartLiveStreamProps) {
  const reduced = useReducedMotion();
  const box = useRef<HTMLDivElement>(null);
  const inView = useInView(box, { once: false, amount: 0.1 });
  const [data, setData] = useState<number[]>(() => {
    const out = [50];
    for (let i = 1; i < points + 1; i++) out.push(next(out[i - 1]));
    return out;
  });
  const path = useRef<SVGGElement>(null);
  const range = useRef({ lo: 0, hi: 100 });
  const gid = `kn-ls-${useId().replace(/:/g, "")}`;

  useEffect(() => {
    if (!inView) return;
    const id = setInterval(() => setData((d) => [...d.slice(1), next(d[d.length - 1])]), interval);
    return () => clearInterval(id);
  }, [inView, interval, next]);

  // smooth scroll between ticks: shift the group left by one step over `interval`
  useEffect(() => {
    const g = path.current;
    if (!g || reduced) return;
    const t0 = performance.now();
    let raf = 0;
    const step = W / (points - 1);
    const tick = (now: number) => {
      const p = Math.min(1, (now - t0) / interval);
      g.setAttribute("transform", `translate(${step * (1 - p)} 0)`);
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [data, interval, points, reduced]);

  const lo = Math.min(...data), hi = Math.max(...data);
  range.current.lo += (lo - 5 - range.current.lo) * 0.3;
  range.current.hi += (hi + 5 - range.current.hi) * 0.3;
  const { lo: rLo, hi: rHi } = range.current;
  const step = W / (points - 1);
  const pts = data.map((v, i) => [(i - 1) * step, H - ((v - rLo) / (rHi - rLo || 1)) * H] as const);
  const line = pts.map(([x, y], i) => `${i ? "L" : "M"}${x.toFixed(1)},${y.toFixed(1)}`).join(" ");
  const last = pts[pts.length - 1];
  const cur = data[data.length - 1];

  return (
    <div ref={box} className={cn("w-full rounded-3xl border border-border bg-card p-5", className)}>
      <div className="flex items-baseline justify-between">
        <p className="flex items-center gap-2 text-sm text-muted-foreground">
          <span className="relative flex size-2"><span className="absolute inline-flex size-full animate-ping rounded-full opacity-60 motion-reduce:animate-none" style={{ background: color }} /><span className="relative inline-flex size-2 rounded-full" style={{ background: color }} /></span>
          {label}
        </p>
        <p className="text-2xl font-semibold tabular-nums" aria-live="off">{cur.toFixed(1)}{unit}</p>
      </div>
      <svg viewBox={`0 0 ${W} ${H}`} className="mt-3 w-full overflow-hidden" role="img" aria-label={`${label}, latest ${cur.toFixed(1)}${unit}`}>
        <defs>
          <linearGradient id={gid} x1="0" x2="0" y1="0" y2="1"><stop offset="0" stopColor={color} stopOpacity=".3" /><stop offset="1" stopColor={color} stopOpacity="0" /></linearGradient>
        </defs>
        {[0.25, 0.5, 0.75].map((g) => <line key={g} x1="0" x2={W} y1={H * g} y2={H * g} stroke="currentColor" strokeOpacity=".08" />)}
        <g ref={path}>
          <path d={`${line} L${last[0]},${H} L${pts[0][0]},${H} Z`} fill={`url(#${gid})`} />
          <path d={line} fill="none" stroke={color} strokeWidth="2.5" strokeLinejoin="round" />
          <circle cx={last[0]} cy={last[1]} r="5" fill={color} />
          <circle cx={last[0]} cy={last[1]} r="10" fill={color} opacity=".25" />
        </g>
      </svg>
    </div>
  );
}
```

## Usage example
```tsx
"use client";
import { ChartLiveStream } from "@/components/kinetik/chart-live-stream";

export default function Demo() {
  return (
    <div className="grid h-full place-items-center p-5">
      <div className="grid w-full max-w-lg gap-3">
        <ChartLiveStream label="Requests / s" unit="k" />
        <ChartLiveStream label="p95 latency" unit=" ms" color="#f472b6" interval={900} />
      </div>
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
