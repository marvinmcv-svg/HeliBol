You are given a task to integrate a component from the **kinetik** motion library into this codebase.

# Hero — Multiplayer Canvas (`hero-multiplayer-canvas`)

AI site-builder hero on a design canvas: selection frame with handles, website thumbnails at the edges, live multiplayer cursors and a glowing prompt bar.

## What it should do
Build an AI site-builder hero on a #ebeae6 design canvas: a violet selection frame with corner handles, six website thumbnails sliding in from the left/right edges, two named multiplayer cursors wandering on 7–8s keyframe paths, a social-proof pill, serif H1, and a prompt bar wrapped in an animated rainbow gradient border with a '✦ Generate' button.

## Project requirements
- React 19 + TypeScript, Tailwind CSS v4, shadcn/ui-style CSS variables (`background`, `foreground`, `muted`, `muted-foreground`, `border`, `card`, `primary`, `ring`). If the project lacks shadcn, set it up first (`npx shadcn@latest init`).
- Animation engine: **css**.
- No runtime dependencies (CSS only).
- Put the component at `components/kinetik/hero-multiplayer-canvas.tsx`.
- `cn` lives at `lib/kinetik/utils.ts` (source below).
- Shared hooks go at `lib/kinetik/core.ts` (source below).

## Non-negotiables
- **Accessibility:** Labelled input, real button and h1; canvas chrome, cursors and thumbnails aria-hidden; reduced motion freezes them.
- **Performance:** Two cursor transform loops, one gradient-position loop.
- Respect `prefers-reduced-motion` (replace movement with opacity or an instant change).
- Animate only transform / opacity / filter / clip-path. No hard-coded theme colors — use CSS variables so it works in light and dark.

## Source — components/kinetik/hero-multiplayer-canvas.tsx
```tsx
"use client";
import { cn } from "@/lib/kinetik/core";

const css = `
.k-hmc .cur{animation:k-hmc-path var(--s) ease-in-out infinite alternate;animation-delay:var(--d)}
@keyframes k-hmc-path{0%{transform:translate(0,0)}33%{transform:translate(var(--x1),var(--y1))}66%{transform:translate(var(--x2),var(--y2))}100%{transform:translate(var(--x3),var(--y3))}}
.k-hmc .site{animation:k-hmc-site 1s cubic-bezier(.16,1,.3,1) both;animation-delay:var(--d)}
@keyframes k-hmc-site{from{opacity:0;transform:translateX(var(--from))}}
.k-hmc .ring{background:linear-gradient(90deg,#f97316,#ec4899,#8b5cf6,#3b82f6,#f97316);background-size:300% 100%;animation:k-hmc-ring 6s linear infinite}
@keyframes k-hmc-ring{to{background-position:300% 0}}
@media (prefers-reduced-motion:reduce){.k-hmc *{animation:none!important}}
[data-reduce-motion] .k-hmc *{animation:none!important}`;

const cursors = [
  { name: "Mario", c: "#3b82f6", l: "72%", t: "16%", s: "7s", d: "0s", x1: "-60px", y1: "40px", x2: "-120px", y2: "10px", x3: "-40px", y3: "70px" },
  { name: "Jess", c: "#facc15", l: "18%", t: "44%", s: "8s", d: "-2s", x1: "80px", y1: "-30px", x2: "140px", y2: "40px", x3: "40px", y3: "90px" },
];
const sites = [
  { side: "left", t: "8%", bg: "linear-gradient(135deg,#fbcfe8,#f472b6)", d: ".1s" }, { side: "left", t: "36%", bg: "linear-gradient(135deg,#fff,#e5e7eb)", d: ".2s" }, { side: "left", t: "64%", bg: "linear-gradient(135deg,#111,#3f3f46)", d: ".3s" },
  { side: "right", t: "10%", bg: "linear-gradient(135deg,#e0f2fe,#7dd3fc)", d: ".15s" }, { side: "right", t: "38%", bg: "linear-gradient(135deg,#fef3c7,#c4b5fd)", d: ".25s" }, { side: "right", t: "66%", bg: "linear-gradient(135deg,#fff,#fde68a)", d: ".35s" },
];

/** AI site-builder hero on a design canvas: selection frame with handles, website thumbnails at the edges, live multiplayer cursors and a glowing prompt bar. */
export function HeroMultiplayerCanvas({ title = "Websites designed & built faster with AI", subtitle = "Use AI as your design ally, not a replacement. Generate sitemaps and wireframes in minutes.", className }: { title?: string; subtitle?: string; className?: string }) {
  return (
    <section className={cn("k-hmc relative overflow-hidden bg-[#ebeae6] px-6 py-10 text-[#151515]", className)}>
      <style href="k-hmc" precedence="kinetik">{css}</style>
      <div aria-hidden className="pointer-events-none absolute inset-x-[4%] top-4 bottom-24 border border-[#6d5dfc]">
        {["-top-1 -left-1", "-top-1 -right-1", "-bottom-1 -left-1", "-bottom-1 -right-1"].map((p) => <span key={p} className={cn("absolute size-2 border border-[#6d5dfc] bg-white", p)} />)}
      </div>
      {sites.map((s, i) => <div key={i} aria-hidden className="site absolute h-[22%] w-[17%] rounded-md border border-black/10 shadow-md" style={{ [s.side]: "-4%", top: s.t, background: s.bg, ["--d" as string]: s.d, ["--from" as string]: s.side === "left" ? "-40px" : "40px" }} />)}
      {cursors.map((c) => (
        <div key={c.name} aria-hidden className="cur absolute z-10" style={{ left: c.l, top: c.t, ["--s" as string]: c.s, ["--d" as string]: c.d, ["--x1" as string]: c.x1, ["--y1" as string]: c.y1, ["--x2" as string]: c.x2, ["--y2" as string]: c.y2, ["--x3" as string]: c.x3, ["--y3" as string]: c.y3 }}>
          <svg width="14" height="16" viewBox="0 0 14 16"><path d="M1 1 L13 7 L7 8.5 L4.5 14 Z" fill={c.c} stroke="#fff" /></svg>
          <span className="ml-3 rounded px-1.5 py-0.5 text-[10px] font-medium text-white" style={{ background: c.c, color: c.c === "#facc15" ? "#000" : "#fff" }}>{c.name}</span>
        </div>
      ))}
      <div className="relative mx-auto max-w-xl text-center">
        <p className="mx-auto w-fit rounded-full border border-black/10 bg-white/60 px-3 py-1 text-[11px]">400k+ designers & devs build with us</p>
        <h1 className="mt-4 font-serif text-4xl leading-[1.05] tracking-tight sm:text-5xl">{title}</h1>
        <p className="mt-4 text-sm text-zinc-600">{subtitle}</p>
      </div>
      <form className="ring relative mx-auto mt-8 max-w-md rounded-xl p-[2px]" onSubmit={(e) => e.preventDefault()}>
        <div className="flex items-center gap-2 rounded-[10px] bg-white p-1.5">
          <label htmlFor="k-hmc-in" className="sr-only">Describe a company</label>
          <input id="k-hmc-in" placeholder="Describe a company in a sentence or two…" className="min-w-0 flex-1 bg-transparent px-2 text-sm outline-none" />
          <button className="rounded-lg bg-[#6d5dfc] px-3 py-1.5 text-xs font-medium text-white">✦ Generate</button>
        </div>
      </form>
    </section>
  );
}
```

## Usage example
```tsx
"use client";
import { HeroMultiplayerCanvas } from "@/components/kinetik/hero-multiplayer-canvas";
export default function Demo() {
  return <HeroMultiplayerCanvas className="h-full" />;
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
