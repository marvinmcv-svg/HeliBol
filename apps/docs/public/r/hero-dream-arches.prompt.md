You are given a task to integrate a component from the **kinetik** motion library into this codebase.

# Hero — Dream Arches (`hero-dream-arches`)

Studio hero: a surreal pastel room — arched windows onto drifting clouds, a floating pearl and rippling water — under a serif/sans headline.

## What it should do
Build a surreal studio hero: pastel pink room with three arched windows (rounded-t-full) showing a blue→pink sky with drifting clouds, a lilac water strip with shimmering horizontal ripple lines, a floating iridescent pearl (radial gradient) and a rock. Centered kicker, italic serif 'Creating the' over a big sans 'unexpected', each resolving from blur; small white pill CTA.

## Project requirements
- React 19 + TypeScript, Tailwind CSS v4, shadcn/ui-style CSS variables (`background`, `foreground`, `muted`, `muted-foreground`, `border`, `card`, `primary`, `ring`). If the project lacks shadcn, set it up first (`npx shadcn@latest init`).
- Animation engine: **css**.
- No runtime dependencies (CSS only).
- Put the component at `components/kinetik/hero-dream-arches.tsx`.
- `cn` lives at `lib/kinetik/utils.ts` (source below).
- Shared hooks go at `lib/kinetik/core.ts` (source below).

## Non-negotiables
- **Accessibility:** Real h1 with serif and sans spans; scene is aria-hidden; reduced motion freezes clouds, ripples and the pearl.
- **Performance:** All CSS shapes; a handful of transform loops.
- Respect `prefers-reduced-motion` (replace movement with opacity or an instant change).
- Animate only transform / opacity / filter / clip-path. No hard-coded theme colors — use CSS variables so it works in light and dark.

## Source — components/kinetik/hero-dream-arches.tsx
```tsx
"use client";
import { cn } from "@/lib/kinetik/core";

const css = `
.k-hda .ripple{animation:k-hda-ripple 5s ease-in-out infinite;animation-delay:var(--d)}
@keyframes k-hda-ripple{50%{transform:scaleX(1.25) translateX(4%);opacity:.25}}
.k-hda .pearl{animation:k-hda-float 6s ease-in-out infinite}
@keyframes k-hda-float{50%{transform:translateY(-12px)}}
.k-hda .cloud{animation:k-hda-cloud 26s linear infinite}
@keyframes k-hda-cloud{to{transform:translateX(60%)}}
.k-hda .in{animation:k-hda-in 1.6s cubic-bezier(.16,1,.3,1) both;animation-delay:var(--d,0s)}
@keyframes k-hda-in{from{opacity:0;filter:blur(14px);transform:translateY(10px)}}
@media (prefers-reduced-motion:reduce){.k-hda *{animation:none!important}}
[data-reduce-motion] .k-hda *{animation:none!important}`;

/** Studio hero: a surreal pastel room — arched windows onto drifting clouds, a floating pearl and rippling water — under a serif/sans headline. */
export function HeroDreamArches({ kicker = "A brand, digital & motion studio", serif = "Creating the", sans = "unexpected", className }: { kicker?: string; serif?: string; sans?: string; className?: string }) {
  const arch = "absolute bottom-[30%] overflow-hidden rounded-t-full bg-gradient-to-b from-[#a8c6ff] to-[#f3d2e4]";
  return (
    <section className={cn("k-hda relative isolate grid min-h-[460px] place-items-center overflow-hidden bg-[#e8c3b9] text-[#2a2022]", className)}>
      <style href="k-hda" precedence="kinetik">{css}</style>
      <div aria-hidden className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-[#efd0c6] via-[#e2b8ae] to-[#c99d97]" />
        {[{ l: "4%", w: "13%", h: "52%" }, { l: "20%", w: "11%", h: "44%" }, { l: "70%", w: "9%", h: "40%" }].map((a, i) => (
          <div key={i} className={arch} style={{ left: a.l, width: a.w, height: a.h }}><span className="cloud absolute top-[30%] -left-1/2 h-4 w-3/4 rounded-full bg-white/80 blur-sm" /></div>
        ))}
        <div className="absolute inset-x-0 bottom-0 h-[30%] bg-gradient-to-b from-[#b9a2c4] to-[#d8c2d6]">
          {[10, 30, 52, 74].map((t, i) => <span key={t} className="ripple absolute h-px w-1/3 bg-white/60" style={{ top: `${t}%`, left: `${(i * 23) % 60}%`, ["--d" as string]: `${-i * 1.2}s` }} />)}
        </div>
        <div className="pearl absolute top-[44%] right-[30%] size-14 rounded-full bg-[radial-gradient(circle_at_35%_30%,#fff,#f2e6ff_35%,#c7b5e6_70%,#a99bd0)] shadow-[0_20px_40px_-10px_#7c5c8c]" />
        <div className="absolute right-[6%] bottom-[22%] h-[12%] w-[18%] rounded-[50%] bg-gradient-to-b from-[#d9b8a3] to-[#a98a7c]" />
      </div>
      <div className="text-center">
        <p className="in text-[10px] tracking-[.2em] uppercase">{kicker}</p>
        <h1 className="mt-2 leading-[.9]">
          <span className="in block font-serif text-5xl italic sm:text-6xl" style={{ ["--d" as string]: ".15s" }}>{serif}</span>
          <span className="in block text-5xl font-medium tracking-tight sm:text-7xl" style={{ ["--d" as string]: ".35s" }}>{sans}</span>
        </h1>
        <a href="#" className="in mt-6 inline-block rounded-full bg-white px-4 py-1.5 text-xs shadow transition-transform hover:scale-105" style={{ ["--d" as string]: ".6s" }}>View our work ↘</a>
      </div>
    </section>
  );
}
```

## Usage example
```tsx
"use client";
import { HeroDreamArches } from "@/components/kinetik/hero-dream-arches";
export default function Demo() {
  return <HeroDreamArches className="h-full" />;
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
