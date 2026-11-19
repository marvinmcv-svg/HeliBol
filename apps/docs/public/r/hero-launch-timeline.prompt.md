You are given a task to integrate a component from the **kinetik** motion library into this codebase.

# Hero — Launch Timeline (`hero-launch-timeline`)

Release-notes hero on warm beige: edition wordmark and roman-numeral index at left, a storefront preview whose banner swaps as a vertical schedule timeline ticks through each launch.

## What it should do
Recreate a release-notes hero on beige #dcd8cc: top bar (Editions wordmark + season, Editions ⌄, Search, 'Start for free' pill) with a torn-paper strip top-right; left column: bold 'The Ren///ssance Edition' and a roman-numeral section index; centre: bold H1, serif subtitle, 'Get notified ＋', a storefront preview with a 'Rollouts / New Years Sale · Scheduled' chip whose banner crossfades; right: a vertical timeline line with date chips that activate in turn.

## Project requirements
- React 19 + TypeScript, Tailwind CSS v4, shadcn/ui-style CSS variables (`background`, `foreground`, `muted`, `muted-foreground`, `border`, `card`, `primary`, `ring`). If the project lacks shadcn, set it up first (`npx shadcn@latest init`).
- Animation engine: **motion**.
- Install dependencies: `npm i motion`
- Put the component at `components/kinetik/hero-launch-timeline.tsx`.
- `cn` lives at `lib/kinetik/utils.ts` (source below).
- Shared hooks go at `lib/kinetik/core.ts` (source below).

## Non-negotiables
- **Accessibility:** Schedule is an ordered list; banner text is real; reduced motion stops the auto-advance.
- **Performance:** One interval; AnimatePresence crossfade of a single banner.
- Respect `prefers-reduced-motion` (replace movement with opacity or an instant change).
- Animate only transform / opacity / filter / clip-path. No hard-coded theme colors — use CSS variables so it works in light and dark.

## Source — components/kinetik/hero-launch-timeline.tsx
```tsx
"use client";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { cn, useReducedMotion } from "@/lib/kinetik/core";

const FONT = "https://fonts.googleapis.com/css2?family=Inter+Tight:wght@500;700&family=Newsreader:opsz@6..72&display=swap";
type Slot = { date: string; banner: string; sub: string; tone: string };
const defaults: Slot[] = [
  { date: "January 1, 2026 at 12:00am EST", banner: "Drop in on our biggest sale", sub: "Start the year with up to 40% off clothing", tone: "from-[#2b3340] via-[#3d4757] to-[#1f2530]" },
  { date: "January 5, 2026 at 12:00am EST", banner: "New season. New colours.", sub: "The spring capsule has landed", tone: "from-[#5b2a14] via-[#8a3d17] to-[#2f160b]" },
];
const index = ["Assistant", "Agentic", "Online", "Retail", "Marketing", "Checkout", "Operations", "Shop app", "B2B", "Finance", "Shipping", "Developer"];
const roman = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X", "XI", "XII"];

/** Release-notes hero on warm beige: edition wordmark and roman-numeral index at left, a storefront preview whose banner swaps as a vertical schedule timeline ticks through each launch. */
export function HeroLaunchTimeline({ title = "Test and time your launches with Rollouts", subtitle = "Schedule theme changes and A/B test with Rollouts, built directly into the admin.", slots = defaults, className }: { title?: string; subtitle?: string; slots?: Slot[]; className?: string }) {
  const reduced = useReducedMotion();
  const [i, setI] = useState(0);
  useEffect(() => {
    if (reduced) return;
    const t = setInterval(() => setI((n) => (n + 1) % slots.length), 2800);
    return () => clearInterval(t);
  }, [reduced, slots.length]);
  return (
    <section className={cn("relative flex flex-col overflow-hidden bg-[#dcd8cc] text-[#191919]", className)} style={{ fontFamily: '"Inter Tight",ui-sans-serif,sans-serif' }}>
      <link rel="stylesheet" href={FONT} precedence="kinetik-font" />
      <div aria-hidden className="absolute top-0 right-[6%] h-[6%] w-[22%] bg-[linear-gradient(170deg,#3a3a3a_0,#8a8a84_40%,transparent_75%)] opacity-60 [clip-path:polygon(0_0,100%_0,96%_60%,70%_100%,40%_55%,8%_80%)]" />
      <header className="relative flex items-center justify-between px-[1.3%] py-2.5 text-[12px]"><span className="flex items-center gap-[4vw]"><b className="flex items-center gap-1.5 font-semibold">◧ Storefront Editions <span className="font-normal text-zinc-600">Winter '26</span></b><span>Editions ⌄</span><span>Search ⌕</span></span><span className="flex items-center gap-4"><span className="text-zinc-600">storefront.com</span><a href="#" className="rounded-full bg-black px-3 py-1.5 text-white">Start for free</a></span></header>
      <div className="grid flex-1 grid-cols-[11%_1fr] gap-[6%] px-[1.3%] pb-3">
        <div className="flex flex-col justify-between">
          <p className="text-[clamp(.8rem,1.35vw,1.3rem)] leading-[.9] font-bold tracking-tight">The<br />Ren///ssance<br />Edition</p>
          <div><ol className="text-[clamp(.7rem,1.15vw,1.1rem)] leading-[1] font-bold tracking-tight text-[#8a877e]">{index.map((x, k) => <li key={x} className={cn("flex justify-between", k === 2 && "text-black")}><span>{x}</span><span className="text-[.55em] font-normal" style={{ fontFamily: "Newsreader,serif" }}>{roman[k]}</span></li>)}</ol><p className="mt-4 text-[7px] leading-tight">© Storefront Inc<br />Terms of Service<br />Privacy Policy</p></div>
        </div>
        <div className="relative">
          <h1 className="mt-[3%] text-[clamp(1.3rem,2.2vw,2.1rem)] leading-tight font-bold tracking-[-.035em]">{title}</h1>
          <p className="max-w-[34rem] text-[clamp(.85rem,1.3vw,1.25rem)] leading-[1.05]" style={{ fontFamily: "Newsreader,serif" }}>{subtitle}</p>
          <span className="mt-2 inline-block rounded bg-white px-1.5 py-0.5 text-[9px] shadow-sm">Get notified ＋</span>
          <div className="relative mt-[5%] w-[64%]">
            <span className="absolute -top-[6%] left-[2%] z-10 rounded-md bg-white px-2 py-1 text-[9px] shadow-md">◫ Rollouts / <b>New Years Sale</b> <span className="ml-1 rounded bg-[#fff1b8] px-1 text-[#a17a00]">Scheduled</span></span>
            <div className="overflow-hidden rounded-lg bg-white shadow-[0_30px_60px_-20px_#0005]">
              <AnimatePresence mode="popLayout" initial={false}>
                <motion.div key={i} initial={{ opacity: 0, scale: 1.04 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.6 }} className={cn("relative aspect-[1.75] bg-gradient-to-br text-white", slots[i].tone)}>
                  <p className="absolute top-[5%] left-[4%] text-[7px] tracking-widest">ALL&nbsp;&nbsp;APPAREL&nbsp;&nbsp;SKATE</p><p className="absolute top-[4%] left-1/2 -translate-x-1/2 font-serif text-sm italic">mvse</p>
                  <div aria-hidden className="absolute bottom-0 left-[20%] h-[78%] w-[22%] rounded-t-[45%] bg-gradient-to-b from-[#58613d] to-[#c9bc9c]" />
                  <div className="absolute top-1/2 right-[8%] w-[38%] -translate-y-1/2 text-center"><p className="text-[clamp(1rem,1.9vw,1.8rem)] leading-[.95] font-bold uppercase">{slots[i].banner}</p><p className="mt-2 text-[9px]">{slots[i].sub}</p><span className="mt-2 inline-block border border-white px-2 py-0.5 text-[7px]">SHOP SALE</span></div>
                </motion.div>
              </AnimatePresence>
              <div className="flex justify-around py-3">{["#e5e7eb", "#5b4636", "#18181b", "#5b21b6"].map((c) => <span key={c} className="size-7 rounded-full" style={{ background: c }} />)}</div>
            </div>
          </div>
          <ol className="absolute top-[30%] bottom-0 left-[77%] flex flex-col justify-around border-l border-zinc-700" aria-label="Schedule">
            {slots.map((s, k) => (
              <li key={s.date} className="relative pl-3">
                <span className={cn("absolute top-1/2 -left-[5px] size-2.5 -translate-y-1/2 rounded-full border border-zinc-700 transition-colors", k === i ? "bg-zinc-900" : "bg-[#dcd8cc]")} />
                <span className={cn("block rounded-md bg-white px-2 py-1.5 text-[10px] whitespace-nowrap shadow transition-all duration-500", k === i ? "opacity-100" : "opacity-50")}>▣ {s.date}</span>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
```

## Usage example
```tsx
"use client";
import { HeroLaunchTimeline } from "@/components/kinetik/hero-launch-timeline";
export default function Demo() {
  return <HeroLaunchTimeline className="h-full" />;
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
