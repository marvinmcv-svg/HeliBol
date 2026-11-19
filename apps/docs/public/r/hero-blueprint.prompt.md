You are given a task to integrate a component from the **kinetik** motion library into this codebase.

# Hero — Blueprint Grid (`hero-blueprint`)

Architectural AI-agent hero on a ruled cream grid: heavy two-line headline, mono ticker, a line-drawn tower with a red sun dissolving into pixels, a shouty statement and a client row.

## What it should do
Recreate an architectural AI-agent hero on #f1efe6 inside a 1px ruled frame: top band = heavy 2-line uppercase H1 (Archivo 900) | description cell | 'Discover more →' mono cell, with a mono ◎ ticker under the description; main split = line-art tower SVG drawn with stroke-dashoffset (frame, floors, fins) over a red #ff4a1c sun that pops in, white pixel blocks blinking where they cross | heavy uppercase statement (~2.4vw), bordered mono 'Learn more →', a 'Clients ← →' bar and 5 logo cells; mono footnote row at the bottom.

## Project requirements
- React 19 + TypeScript, Tailwind CSS v4, shadcn/ui-style CSS variables (`background`, `foreground`, `muted`, `muted-foreground`, `border`, `card`, `primary`, `ring`). If the project lacks shadcn, set it up first (`npx shadcn@latest init`).
- Animation engine: **css**.
- No runtime dependencies (CSS only).
- Put the component at `components/kinetik/hero-blueprint.tsx`.
- `cn` lives at `lib/kinetik/utils.ts` (source below).
- Shared hooks go at `lib/kinetik/core.ts` (source below).

## Non-negotiables
- **Accessibility:** Heading and statement are real text; the SVG drawing is aria-hidden; reduced motion shows the finished drawing with no ticker.
- **Performance:** SVG stroke-dashoffset draws (~15 paths) run once; one ticker loop.
- Respect `prefers-reduced-motion` (replace movement with opacity or an instant change).
- Animate only transform / opacity / filter / clip-path. No hard-coded theme colors — use CSS variables so it works in light and dark.

## Source — components/kinetik/hero-blueprint.tsx
```tsx
"use client";
import { cn } from "@/lib/kinetik/core";

const FONT = "https://fonts.googleapis.com/css2?family=Archivo:wght@500;800;900&family=IBM+Plex+Mono:wght@400;500&display=swap";
const css = `
.k-hbp{font-family:Archivo,ui-sans-serif,system-ui,sans-serif}
.k-hbp .mono{font-family:"IBM Plex Mono",ui-monospace,monospace}
.k-hbp .draw{stroke-dasharray:var(--l,600);stroke-dashoffset:var(--l,600);animation:k-hbp-draw 2.4s cubic-bezier(.65,0,.35,1) forwards;animation-delay:var(--d,0s)}
@keyframes k-hbp-draw{to{stroke-dashoffset:0}}
.k-hbp .sun{transform-origin:center;transform-box:fill-box;animation:k-hbp-sun 1.4s cubic-bezier(.34,1.56,.64,1) .9s both}
@keyframes k-hbp-sun{from{transform:scale(0)}}
.k-hbp .pix{animation:k-hbp-pix 2.6s steps(4) infinite;animation-delay:var(--d)}
@keyframes k-hbp-pix{50%{opacity:0}}
.k-hbp .tick{animation:k-hbp-tick 22s linear infinite}
@keyframes k-hbp-tick{to{transform:translateX(-50%)}}
.k-hbp .rise{animation:k-hbp-rise .9s cubic-bezier(.16,1,.3,1) both;animation-delay:var(--d,0s)}
@keyframes k-hbp-rise{from{opacity:0;transform:translateY(16px)}}
@media (prefers-reduced-motion:reduce){.k-hbp *{animation:none!important;stroke-dashoffset:0!important}}
[data-reduce-motion] .k-hbp *{animation:none!important;stroke-dashoffset:0!important}`;

const ticks = ["Less busywork", "Faster iterations", "Fewer mistakes", "Less busywork", "Faster iterations", "Fewer mistakes"];
const clients = ["ALCOVE", "SKYLINE", "TERRA NOVA", "PINECREST", "VERTEX"];

/** Architectural AI-agent hero on a ruled cream grid: heavy two-line headline, mono ticker, a line-drawn tower with a red sun dissolving into pixels, a shouty statement and a client row. */
export function HeroBlueprint({ title = "An AI agent that works inside your design tools", statement = "The repetitive parts of modelling shouldn't eat your day. Egret handles the fiddly, manual work so you can stay focused on the design, not the software.", className }: { title?: string; statement?: string; className?: string }) {
  const floors = Array.from({ length: 16 }, (_, i) => 62 + i * 13);
  const fins = Array.from({ length: 12 }, (_, i) => 96 + i * 5);
  const line = "border-[#141414]/30";
  return (
    <section className={cn("k-hbp flex flex-col overflow-hidden bg-[#f1efe6] p-3 text-[#141414]", className)}>
      <link rel="stylesheet" href={FONT} precedence="kinetik-font" />
      <style href="k-hbp" precedence="kinetik">{css}</style>
      <div className={cn("flex flex-1 flex-col border", line)}>
        <div className={cn("grid border-b md:grid-cols-[1fr_auto]", line)}>
          <h1 className="rise p-6 pb-5 text-[clamp(1.6rem,3.55vw,3.3rem)] leading-[.92] font-black tracking-[-.025em] uppercase">{title}</h1>
          <div className={cn("flex flex-col md:w-[42vw] md:border-l", line)}>
            <div className="flex flex-1">
            <p className="rise flex-1 p-4 text-[13px] leading-snug" style={{ ["--d" as string]: ".15s" }}>Egret reviews your model, identifies issues, and proposes solutions. Upon approval, it edits automatically. This concept crafted by <b className="underline">Northlight agency</b>, the award-winning design agency.</p>
            <a href="#" className={cn("mono flex w-[30%] flex-col justify-between border-l p-4 text-[11px] text-[#ff4a1c] uppercase", line)}>Discover more<span className="self-end text-lg">→</span></a>
            </div>
            <div className={cn("mono overflow-hidden border-t py-2 text-[10px] tracking-wide uppercase", line)}><div className="tick flex w-max gap-6 pr-6">{[...ticks, ...ticks].map((t, i) => <span key={i} aria-hidden={i >= ticks.length}>◎ {t}</span>)}</div></div>
          </div>
        </div>
        <div className="grid flex-1 md:grid-cols-2">
          <div className={cn("relative border-r", line)}>
            <svg viewBox="60 0 330 330" aria-hidden className="absolute inset-0 size-full" preserveAspectRatio="xMidYMax meet">
              <circle className="sun" cx="236" cy="112" r="64" fill="#ff4a1c" />
              <g fill="none" stroke="#141414" strokeWidth="1.1">
                <path className="draw" style={{ ["--l" as string]: 1400 }} d="M150 330 V40 L230 22 L262 34 V330 M150 40 L182 50 V330 M230 22 V330" />
                {floors.map((y, i) => <path key={y} className="draw" style={{ ["--l" as string]: 160, ["--d" as string]: `${0.3 + i * 0.06}s` }} d={`M182 ${y} L230 ${y - 10} L262 ${y + 2}`} />)}
                {fins.map((x, i) => <path key={x} className="draw" style={{ ["--l" as string]: 300, ["--d" as string]: `${0.5 + i * 0.05}s` }} d={`M${x + 54} ${46 + (i % 2) * 3} V 200`} strokeWidth="2.4" />)}
                <path className="draw" style={{ ["--l" as string]: 900, ["--d" as string]: ".7s" }} d="M0 270 H150 M10 270 V300 H150 M262 300 H330 L360 290 H400 M40 300 L70 330 M262 250 H300 V300" />
              </g>
              <g fill="#fff">{Array.from({ length: 22 }, (_, i) => <rect key={i} className="pix" x={150 + ((i * 37) % 112)} y={196 + ((i * 13) % 26)} width={6 + (i % 3) * 3} height="6" style={{ ["--d" as string]: `${-(i % 7) * 0.3}s` }} />)}</g>
            </svg>
          </div>
          <div className="flex flex-col">
            <div className="flex flex-1 flex-col justify-center gap-7 py-8 pr-[14%] pl-[17%]">
              <p className="rise text-[clamp(1.1rem,2.45vw,2.3rem)] leading-[.98] font-extrabold tracking-[-.01em] uppercase" style={{ ["--d" as string]: ".5s" }}>{statement}</p>
              <a href="#" className={cn("mono rise flex w-fit items-center border text-[10px] uppercase transition-colors hover:bg-black hover:text-white", line)} style={{ ["--d" as string]: ".65s" }}><span className="px-3 py-2.5">Learn more</span><span className={cn("border-l px-3 py-2.5", line)}>→</span></a>
            </div>
            <div className={cn("mono flex justify-between border-t border-b text-[10px] uppercase", line)}><span className="p-2">Clients</span><span className="flex"><span className={cn("border-l px-4 py-2", line)}>←</span><span className={cn("border-l px-4 py-2", line)}>→</span></span></div>
            <ul className="grid grid-cols-5">{clients.map((c) => <li key={c} className={cn("grid h-20 place-items-center border-r text-center text-[10px] font-medium tracking-[.2em] last:border-r-0", line)}><span><span aria-hidden className="block text-lg">⌂</span>{c}</span></li>)}</ul>
          </div>
        </div>
        <p className={cn("mono border-t px-3 py-1.5 text-[9px] uppercase", line)}>Works natively inside the tools you already use, including Revit, Rhino, ArchiCAD and SketchUp.</p>
      </div>
    </section>
  );
}
```

## Usage example
```tsx
"use client";
import { HeroBlueprint } from "@/components/kinetik/hero-blueprint";
export default function Demo() {
  return <HeroBlueprint className="h-full" />;
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
