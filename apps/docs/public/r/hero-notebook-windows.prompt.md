You are given a task to integrate a component from the **kinetik** motion library into this codebase.

# Hero — Notebook Windows (`hero-notebook-windows`)

Data-platform hero on dotted pink paper: news ticker, centered-logo nav, italic serif + heavy sans headline with a sparkle, handle-framed CTAs and three product windows rising and overlapping at the fold.

## What it should do
Recreate a data-platform hero on pink dotted paper: mono news ticker; nav with the wordmark centred among links and a handle-framed 'Get started'; italic Instrument Serif line with a three-ray coral sparkle over a heavy Plus Jakarta Sans line; 3-line paragraph; handle-framed coral CTA + white 'Request a demo'; three product windows (SQL notebook, chat answer, data app) with mono labels rising and overlapping at the fold.

## Project requirements
- React 19 + TypeScript, Tailwind CSS v4, shadcn/ui-style CSS variables (`background`, `foreground`, `muted`, `muted-foreground`, `border`, `card`, `primary`, `ring`). If the project lacks shadcn, set it up first (`npx shadcn@latest init`).
- Animation engine: **css**.
- No runtime dependencies (CSS only).
- Put the component at `components/kinetik/hero-notebook-windows.tsx`.
- `cn` lives at `lib/kinetik/utils.ts` (source below).
- Shared hooks go at `lib/kinetik/core.ts` (source below).

## Non-negotiables
- **Accessibility:** Real h1 with serif + sans spans; windows aria-hidden; reduced motion shows windows in place.
- **Performance:** Three window entrances and one tape marquee.
- Respect `prefers-reduced-motion` (replace movement with opacity or an instant change).
- Animate only transform / opacity / filter / clip-path. No hard-coded theme colors — use CSS variables so it works in light and dark.

## Source — components/kinetik/hero-notebook-windows.tsx
```tsx
"use client";
import { cn } from "@/lib/kinetik/core";

const FONT = "https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@1&family=Plus+Jakarta+Sans:wght@400;500;800&family=JetBrains+Mono&display=swap";
const css = `
.k-hnw{font-family:"Plus Jakarta Sans",ui-sans-serif,system-ui,sans-serif}
.k-hnw .mono{font-family:"JetBrains Mono",ui-monospace,monospace}
.k-hnw .tape{animation:k-hnw-tape 40s linear infinite}
@keyframes k-hnw-tape{to{transform:translateX(-50%)}}
.k-hnw .win{animation:k-hnw-win 1.2s cubic-bezier(.16,1,.3,1) both;animation-delay:var(--d)}
@keyframes k-hnw-win{from{opacity:0;transform:translateY(80px)}}
.k-hnw .spark span{animation:k-hnw-spark 1.6s ease-in-out infinite;animation-delay:var(--d)}
@keyframes k-hnw-spark{50%{opacity:.2}}
.k-hnw .in{animation:k-hnw-in .9s cubic-bezier(.16,1,.3,1) both;animation-delay:var(--d,0s)}
@keyframes k-hnw-in{from{opacity:0;transform:translateY(12px)}}
@media (prefers-reduced-motion:reduce){.k-hnw *{animation:none!important}}
[data-reduce-motion] .k-hnw *{animation:none!important}`;

const news = ["Agentic analytics tools that actually work →", "🤖 Notebook Agent Act II: AI tools for data people just got even better →", "🙏 It's just \"Hux\"! Not \"HUX\" or \"Hux dot tech\" →", "↗ Bringing data to everyone →"];
const Handles = () => <>{["-top-1 -left-1", "-top-1 -right-1", "-bottom-1 -left-1", "-bottom-1 -right-1"].map((p) => <i key={p} aria-hidden className={cn("absolute size-1.5 border border-[#e08e7b] bg-white", p)} />)}</>;

/** Data-platform hero on dotted pink paper: news ticker, centered-logo nav, italic serif + heavy sans headline with a sparkle, handle-framed CTAs and three product windows rising and overlapping at the fold. */
export function HeroNotebookWindows({ serif = "Bring the magic of AI", sans = "to data, for everyone", subtitle = "Finally — anyone can explore data using natural language, with or without code, on trusted context, in one integrated platform.", className }: { serif?: string; sans?: string; subtitle?: string; className?: string }) {
  return (
    <section className={cn("k-hnw relative flex flex-col overflow-hidden bg-[#f7efee] px-[1.8%] text-[#1d1a3a]", className)} style={{ backgroundImage: "radial-gradient(#e7d3d3 1px,transparent 1px)", backgroundSize: "10px 10px" }}>
      <link rel="stylesheet" href={FONT} precedence="kinetik-font" />
      <style href="k-hnw" precedence="kinetik">{css}</style>
      <div className="mono overflow-hidden border-b border-[#e6d6d6] py-2 text-[11px]"><div className="tape flex w-max gap-6 pr-6">{[...news, ...news].map((t, i) => <span key={i} aria-hidden={i >= news.length}>{t}</span>)}</div></div>
      <nav className="flex items-center justify-center gap-8 py-4 text-[13px] whitespace-nowrap"><a href="#" className="max-lg:hidden">Platform ⌄</a><a href="#" className="max-lg:hidden">Solutions ⌄</a><a href="#">Enterprise</a><b className="mx-6 text-[22px] font-extrabold tracking-[.08em]">HUX</b><a href="#" className="max-lg:hidden">Resources ⌄</a><a href="#">Pricing</a><a href="#">Log In</a><a href="#" className="relative border border-[#e08e7b] bg-[#fbe4dd] px-3 py-1.5"><Handles />Get started</a></nav>
      <div className="relative pt-[3.5%] text-center">
        <h1 className="leading-[1.05]">
          <span className="in relative inline-block text-[clamp(2.6rem,5.6vw,5.4rem)] tracking-[-.02em]" style={{ fontFamily: '"Instrument Serif",serif', fontStyle: "italic" }}>{serif}<span aria-hidden className="spark absolute -top-[10%] -right-[9%] block size-10">{[-50, -15, 20].map((r, k) => <span key={r} className="absolute bottom-0 left-1/2 block h-4 w-px origin-bottom bg-[#ff7a59]" style={{ transform: `rotate(${r}deg) translateY(-8px)`, ["--d" as string]: `${k * 0.2}s` }} />)}</span></span>
          <span className="in block text-[clamp(2.4rem,5.1vw,4.9rem)] font-extrabold tracking-[-.03em]" style={{ ["--d" as string]: ".12s" }}>{sans}</span>
        </h1>
        <p className="in mx-auto mt-4 max-w-[38rem] text-[clamp(.95rem,1.6vw,1.5rem)] leading-snug text-[#4f4a66]" style={{ ["--d" as string]: ".24s" }}>{subtitle}</p>
        <div className="in mt-6 flex justify-center gap-3 text-[13px]" style={{ ["--d" as string]: ".34s" }}>
          <a href="#" className="relative border border-[#e08e7b] bg-[#fbe4dd] px-5 py-3 font-medium shadow-[0_0_0_4px_#fde9e3]"><Handles />Get started for free</a>
          <a href="#" className="border border-[#e1d6e6] bg-white px-5 py-3">Request a demo</a>
        </div>
      </div>
      <div aria-hidden className="relative mt-[5%] flex-1 text-left text-[10px]">
        <div className="win absolute top-[18%] left-[2%] w-[45%] rounded-t-lg border border-[#e2dbe8] bg-white shadow-xl" style={{ ["--d" as string]: ".55s" }}><span className="mono absolute -top-6 left-2 border border-[#e2dbe8] bg-white/70 px-1.5 py-0.5 text-[9px]">Agentic data notebooks</span><p className="flex justify-between border-b px-3 py-2 font-semibold"><span><b className="tracking-[.08em]">HUX</b>&nbsp;&nbsp;Galactic Revenue Insights</span><span>▣ Notebook</span></p><div className="p-4 pl-10"><p className="text-[clamp(.9rem,1.6vw,1.5rem)] font-bold">NexaCorp Revenue Overview</p><p className="text-zinc-400">Add a description...</p><pre className="mono mt-3 text-[9px] whitespace-pre-wrap text-[#5b4fc4]">{"select quarter, product_line, region, customer_sector,\nfrom galactic_sales.revenue\nwhere quarter in ('Q1-2025', 'Q2-2025', 'Q3-2025')"}</pre></div></div>
        <div className="win absolute top-[22%] right-[2%] w-[24%] rounded-t-lg border border-[#e2dbe8] bg-white shadow-xl" style={{ ["--d" as string]: ".7s" }}><span className="mono absolute -top-6 right-2 border border-[#e2dbe8] bg-white/70 px-1.5 py-0.5 text-[9px]">Beautiful data apps</span><p className="flex justify-end gap-3 border-b px-3 py-2"><span>Edit</span><span>Share</span></p><div className="p-3"><p className="text-[clamp(.9rem,1.5vw,1.4rem)] font-bold">Overview</p><p className="text-zinc-500">Revenue across product lines, regions, and customer sectors.</p><div className="mt-3 grid grid-cols-2 gap-2 font-bold"><span className="rounded border p-2">Mid-Rim</span><span className="rounded border p-2">Commercial</span></div></div></div>
        <div className="win absolute top-0 left-[34%] z-10 w-[39%] rounded-t-lg border border-[#e2dbe8] bg-white shadow-2xl" style={{ ["--d" as string]: ".85s" }}><span className="mono absolute -top-6 left-2 border border-[#e2dbe8] bg-white/70 px-1.5 py-0.5 text-[9px]">Conversational self-serve</span><p className="flex justify-between border-b px-3 py-2"><span><b className="tracking-[.08em]">HUX</b>&nbsp;&nbsp;NexaCorp product line performance (Q3)</span><span>Share&nbsp;&nbsp;Continue in project</span></p><div className="space-y-2 p-3 text-[9px] leading-relaxed"><p className="ml-auto w-3/4 rounded bg-[#eef0ff] p-2 text-[#5b4fc4]">Can you break this down by region? I want to see how each product line performed across the Core Worlds, Mid-Rim, and Outer Rim.</p><p>I'll help you analyze NexaCorp's Q3 revenue by product line and region. Let me search for the most relevant data source.</p><p className="text-zinc-400">› Thought for 11 seconds</p><p>I found regional revenue data in the endorsed semantic model "NexaCorp: Galactic Sales Model." This model contains standardized region definitions…</p></div></div>
      </div>
    </section>
  );
}
```

## Usage example
```tsx
"use client";
import { HeroNotebookWindows } from "@/components/kinetik/hero-notebook-windows";
export default function Demo() {
  return <HeroNotebookWindows className="h-full" />;
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
