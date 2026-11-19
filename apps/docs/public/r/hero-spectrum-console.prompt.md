You are given a task to integrate a component from the **kinetik** motion library into this codebase.

# Hero — Spectrum Console (`hero-spectrum-console`)

Observability hero: dark nav + announcement bar, spaced eyebrow, big headline, email capture with glowing CTA, and a logs dashboard rising between equaliser-style volume bars.

## What it should do
Recreate an observability hero on #0b0c1a: nav (logo, 6 links, Sign in, violet Sign up) and a rounded announcement bar; wide-tracked eyebrow, 2-line gradient-clipped H1 (~4.5vw), 2-line paragraph, email input + violet button with an offset ring, 'Start monitoring for free or book a demo'; at the bottom a logs dashboard (sidebar, panels, sparkline, a named cursor) rising with a violet glow, flanked by two banks of thin equaliser bars animating scaleY.

## Project requirements
- React 19 + TypeScript, Tailwind CSS v4, shadcn/ui-style CSS variables (`background`, `foreground`, `muted`, `muted-foreground`, `border`, `card`, `primary`, `ring`). If the project lacks shadcn, set it up first (`npx shadcn@latest init`).
- Animation engine: **css**.
- No runtime dependencies (CSS only).
- Put the component at `components/kinetik/hero-spectrum-console.tsx`.
- `cn` lives at `lib/kinetik/utils.ts` (source below).
- Shared hooks go at `lib/kinetik/core.ts` (source below).

## Non-negotiables
- **Accessibility:** Labelled email input and real button; bars and console are aria-hidden; reduced motion freezes bars and highlights.
- **Performance:** 28 scaleY bars on compositor-only keyframes; one console row highlight loop.
- Respect `prefers-reduced-motion` (replace movement with opacity or an instant change).
- Animate only transform / opacity / filter / clip-path. No hard-coded theme colors — use CSS variables so it works in light and dark.

## Source — components/kinetik/hero-spectrum-console.tsx
```tsx
"use client";
import { cn } from "@/lib/kinetik/core";

const css = `
.k-hsc .bar{transform-origin:bottom;animation:k-hsc-eq var(--s) ease-in-out infinite alternate;animation-delay:var(--d)}
@keyframes k-hsc-eq{from{transform:scaleY(.2)}to{transform:scaleY(1)}}
.k-hsc .in{animation:k-hsc-in .9s cubic-bezier(.16,1,.3,1) both;animation-delay:var(--d,0s)}
@keyframes k-hsc-in{from{opacity:0;transform:translateY(14px)}}
.k-hsc .console{animation:k-hsc-rise 1.2s cubic-bezier(.16,1,.3,1) .45s both}
@keyframes k-hsc-rise{from{opacity:0;transform:translateY(60px)}}
.k-hsc .spark{animation:k-hsc-spark 2.2s steps(12) infinite}
@keyframes k-hsc-spark{to{background-position:-120px 0}}
.k-hsc .cursor{animation:k-hsc-cur 6s ease-in-out infinite}
@keyframes k-hsc-cur{50%{transform:translate(-40px,14px)}}
@media (prefers-reduced-motion:reduce){.k-hsc *{animation:none!important}}
[data-reduce-motion] .k-hsc *{animation:none!important}`;

const seeded = (n: number, o = 0) => Array.from({ length: n }, (_, i) => ({ h: 25 + (((i + o) * 37) % 75), s: `${0.7 + (((i + o) * 13) % 10) / 9}s`, d: `${-(((i + o) * 7) % 10) / 10}s` }));
const Bars = ({ o, className }: { o: number; className?: string }) => (
  <div aria-hidden className={cn("absolute bottom-0 flex h-[22%] items-end gap-[6px]", className)}>{seeded(16, o).map((b, i) => <span key={i} className="bar w-[3px] rounded-t bg-gradient-to-t from-[#5b5bd6]/0 via-[#6d6dff]/60 to-[#9a9aff]" style={{ height: `${b.h}%`, ["--s" as string]: b.s, ["--d" as string]: b.d }} />)}</div>
);
const side = ["Live tail", "Dashboards", "Alerts", "Sources", "Explore"];

/** Observability hero: dark nav + announcement bar, spaced eyebrow, big headline, email capture with glowing CTA, and a logs dashboard rising between equaliser-style volume bars. */
export function HeroSpectrumConsole({ eyebrow = "Log. Troubleshoot. Resolve.", title = "The fastest log search on the planet", className }: { eyebrow?: string; title?: string; className?: string }) {
  return (
    <section className={cn("k-hsc relative flex flex-col overflow-hidden bg-[#0b0c1a] text-white", className)}>
      <style href="k-hsc" precedence="kinetik">{css}</style>
      <div aria-hidden className="absolute inset-x-0 bottom-0 h-1/2 bg-[radial-gradient(ellipse_at_50%_100%,#3b2f9a66,transparent_65%)]" />
      <div className="mx-auto w-full max-w-[1120px] px-6 pt-4 text-[13px]">
        <nav className="flex items-center justify-between">
          <span className="flex items-center gap-10"><b className="flex items-center gap-1.5 font-semibold"><span aria-hidden className="flex gap-px">{[6, 10, 14].map((h) => <i key={h} className="block w-1 -skew-x-12 bg-white" style={{ height: h }} />)}</span>Lumber Stack</b><span className="hidden gap-8 text-white/80 lg:flex"><a href="#">Platform ⌄</a><a href="#">Documentation</a><a href="#">Pricing</a><a href="#">Community ⌄</a><a href="#">Company ⌄</a><a href="#">Enterprise</a></span></span>
          <span className="flex items-center gap-4"><a href="#" className="text-white/80">Sign in</a><a href="#" className="rounded-md bg-[#5b5bd6] px-2.5 py-1">Sign up</a></span>
        </nav>
        <a href="#" className="mt-3 flex items-center justify-between rounded-md border border-white/5 bg-white/[.04] px-3 py-1.5 text-[12px] text-white/80"><span>📢&nbsp;&nbsp;Logpile is now part of Lumber Stack</span><span className="text-white/40">Learn more</span></a>
      </div>
      <div className="relative mx-auto mt-[6.5%] max-w-2xl px-6 text-center">
        <p className="in text-[13px] font-medium tracking-[.42em] text-[#c9c9ff] uppercase">{eyebrow}</p>
        <h1 className="in mx-auto mt-7 max-w-[16ch] bg-gradient-to-b from-white to-[#c9c9de] bg-clip-text text-[clamp(2.3rem,4.5vw,4.15rem)] leading-[1.06] font-semibold tracking-[-.035em] text-transparent" style={{ ["--d" as string]: ".08s" }}>{title}</h1>
        <p className="in mx-auto mt-6 max-w-md text-[clamp(.95rem,1.4vw,1.25rem)] leading-relaxed text-white/80" style={{ ["--d" as string]: ".14s" }}>Lumber Stack lets you see inside any stack, debug any issue, and resolve any incident.</p>
        <form className="in mx-auto mt-9 flex max-w-[34rem] gap-3" style={{ ["--d" as string]: ".2s" }} onSubmit={(e) => e.preventDefault()}>
          <label className="sr-only" htmlFor="k-hsc-email">Work e-mail</label>
          <input id="k-hsc-email" type="email" placeholder="Your work e-mail" className="min-w-0 flex-1 rounded-lg border border-white/10 bg-white/[.04] px-4 py-3.5 text-[15px] outline-none placeholder:text-white/40 focus:border-[#7b7bff]" />
          <button className="rounded-lg bg-[#5b5bd6] px-6 text-[15px] font-medium ring-2 ring-[#5b5bd6]/40 ring-offset-2 ring-offset-[#0b0c1a] hover:bg-[#6d6de8]">Start in 30 seconds</button>
        </form>
        <p className="in mt-6 text-sm text-white/50" style={{ ["--d" as string]: ".26s" }}>Start monitoring for free or <a href="#" className="text-white/90">book a demo</a></p>
      </div>
      <Bars o={0} className="left-[5%]" />
      <Bars o={5} className="right-[5%]" />
      <div aria-hidden className="console relative mx-auto mt-auto w-[71%] translate-y-[1px] overflow-hidden rounded-t-xl border border-b-0 border-white/10 bg-[#11121f] pt-[5%] text-[10px] text-white/60 shadow-[0_-20px_80px_#4b3fd655]">
        <div className="absolute inset-x-0 top-0 flex h-full">
          <ul className="w-[16%] space-y-1.5 border-r border-white/5 p-3"><li className="font-semibold text-white">Logs & Metrics</li>{side.map((s, i) => <li key={s} className={cn("rounded px-1.5 py-0.5", i === 1 && "bg-white/10 text-white")}>▢ {s}</li>)}</ul>
          <div className="flex-1 p-3">
            <div className="flex justify-between"><span>▦ Dashboards › <b className="text-white">Load balancer overview</b></span><span className="flex gap-1.5"><i className="rounded border border-white/10 px-1.5 not-italic">◷ Last 3 hours</i><i className="rounded border border-white/10 px-1.5 not-italic">30s</i></span></div>
            <div className="mt-3 grid grid-cols-[1fr_1.3fr_.8fr] gap-3">
              <div><p className="text-white">Frequent requests (last 5 minutes)</p>{["/api/v1/search", "/ingest", "/health"].map((r, i) => <p key={r} className="mt-1 flex justify-between border-b border-white/5 py-0.5 font-mono"><span>{r}</span><span>{[133524, 98112, 41007][i]}</span></p>)}</div>
              <div className="relative"><p className="text-white">Traffic from known bots</p><div className="spark mt-6 h-10 w-full opacity-70" style={{ background: "repeating-linear-gradient(90deg,#7b7bff 0 2px,transparent 2px 5px)", maskImage: "linear-gradient(transparent 30%,#000)" }} /><span className="cursor absolute top-3 right-6 rounded-full bg-[#5b5bd6] px-1.5 text-white">Ashton</span></div>
              <div><p className="text-white">CPU Utilization</p><div className="mt-4 h-10 rounded bg-gradient-to-t from-[#5b5bd6]/40 to-transparent" /></div>
            </div>
          </div>
        </div>
        <div className="h-28" />
      </div>
    </section>
  );
}
```

## Usage example
```tsx
"use client";
import { HeroSpectrumConsole } from "@/components/kinetik/hero-spectrum-console";
export default function Demo() {
  return <HeroSpectrumConsole className="h-full" />;
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
