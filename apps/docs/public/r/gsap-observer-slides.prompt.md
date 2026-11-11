You are given a task to integrate a component from the **kinetik** motion library into this codebase.

# Observer Fullscreen Slides (`gsap-observer-slides`)

Full-screen slides that move one step per wheel flick, swipe or arrow key (GSAP Observer), with a sliding mask, counter-zooming image and rolling title letters. Loops forever.

## What it should do
Observer.create({ target, type: 'wheel,touch,pointer', wheelSpeed −1, tolerance 12, preventDefault, onUp: next, onDown: prev }). Transition: outer wrapper yPercent 100·dir→0 while inner yPercent −100·dir→0 (sliding mask), image scale 1.4→1, old image yPercent −15·dir, title chars (split once up front) yPercent 120·dir→0 stagger random; ignore input while busy.

## Project requirements
- React 19 + TypeScript, Tailwind CSS v4, shadcn/ui-style CSS variables (`background`, `foreground`, `muted`, `muted-foreground`, `border`, `card`, `primary`, `ring`). If the project lacks shadcn, set it up first (`npx shadcn@latest init`).
- Animation engine: **gsap**.
- Install dependencies: `npm i gsap @gsap/react`
- Put the component at `components/kinetik/gsap-observer-slides.tsx`.
- `cn` lives at `lib/kinetik/utils.ts` (source below).
- Shared hooks go at `lib/kinetik/core.ts` (source below).

## Non-negotiables
- **Accessibility:** Focusable region with aria-roledescription carousel; arrow keys work; inactive slides aria-hidden. Reduced motion swaps instantly.
- **Performance:** One timeline per transition; input locked while animating.
- Respect `prefers-reduced-motion` (replace movement with opacity or an instant change).
- Animate only transform / opacity / filter / clip-path. No hard-coded theme colors — use CSS variables so it works in light and dark.

## Source — components/kinetik/gsap-observer-slides.tsx
```tsx
"use client";
import { useRef, useState } from "react";
import gsap from "gsap";
import { Observer } from "gsap/Observer";
import { SplitText } from "gsap/SplitText";
import { useGSAP } from "@gsap/react";
import { cn, useReducedMotion } from "@/lib/kinetik/core";

gsap.registerPlugin(Observer, SplitText, useGSAP);

export interface ObserverSlide {
  title: string;
  image: string;
  kicker?: string;
}

export interface GsapObserverSlidesProps {
  slides: ObserverSlide[];
  className?: string;
}

/**
 * Full-screen slides driven by GSAP Observer: one wheel flick, swipe or arrow key moves one
 * slide (infinite loop, either direction). Outer/inner wrappers counter-translate to create a
 * sliding mask, the image counter-zooms, and the title's characters roll in.
 */
export function GsapObserverSlides({ slides, className }: GsapObserverSlidesProps) {
  const root = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);
  const cur = useRef(0);
  const busy = useRef(false);
  const chars = useRef<Element[][]>([]);
  const reduced = useReducedMotion();

  const { contextSafe } = useGSAP(
    () => {
      const q = gsap.utils.selector(root);
      gsap.set(q("[data-slide]"), { autoAlpha: 0, zIndex: 0 });
      gsap.set(q("[data-slide]")[0], { autoAlpha: 1, zIndex: 1 });
      chars.current = q("[data-title]").map((el) => SplitText.create(el, { type: "chars" }).chars);
      const obs = Observer.create({
        target: root.current,
        type: "wheel,touch,pointer",
        wheelSpeed: -1,
        tolerance: 12,
        preventDefault: true,
        onDown: () => go(cur.current - 1, -1),
        onUp: () => go(cur.current + 1, 1),
      });
      return () => obs.kill();
    },
    { scope: root },
  );

  const go = contextSafe((to: number, dir: 1 | -1) => {
    if (busy.current) return;
    const n = slides.length;
    const next = ((to % n) + n) % n;
    const q = gsap.utils.selector(root);
    const all = q("[data-slide]");
    const from = all[cur.current];
    const target = all[next];
    cur.current = next;
    setIndex(next);
    if (reduced) {
      gsap.set(from, { autoAlpha: 0, zIndex: 0 });
      gsap.set(target, { autoAlpha: 1, zIndex: 1 });
      return;
    }
    busy.current = true;
    const outer = target.querySelector("[data-outer]");
    const inner = target.querySelector("[data-inner]");
    gsap
      .timeline({ defaults: { duration: 1.1, ease: "power3.inOut" }, onComplete: () => void (busy.current = false) })
      .set(target, { autoAlpha: 1, zIndex: 1 })
      .set(from, { zIndex: 0 })
      .fromTo(outer, { yPercent: 100 * dir }, { yPercent: 0 }, 0)
      .fromTo(inner, { yPercent: -100 * dir }, { yPercent: 0 }, 0)
      .fromTo(target.querySelector("img"), { scale: 1.4 }, { scale: 1 }, 0)
      .to(from.querySelector("img"), { yPercent: -15 * dir, duration: 1.1 }, 0)
      .fromTo(chars.current[next], { yPercent: 120 * dir, autoAlpha: 0 }, { yPercent: 0, autoAlpha: 1, duration: 0.8, ease: "power3.out", stagger: { each: 0.025, from: "random" } }, 0.35)
      .set(from, { autoAlpha: 0 })
      .set(from.querySelector("img"), { yPercent: 0 });
  });

  return (
    <div
      ref={root}
      tabIndex={0}
      role="region"
      aria-roledescription="carousel"
      aria-label="Slides — scroll, swipe or use arrow keys"
      onKeyDown={(e) => {
        if (e.key === "ArrowDown" || e.key === "ArrowRight") go(cur.current + 1, 1);
        if (e.key === "ArrowUp" || e.key === "ArrowLeft") go(cur.current - 1, -1);
      }}
      className={cn("relative h-full w-full touch-none overflow-hidden bg-black outline-none", className)}
    >
      {slides.map((s, i) => (
        <section key={s.title} data-slide aria-hidden={index !== i} className="absolute inset-0">
          <div data-outer className="h-full w-full overflow-hidden">
            <div data-inner className="h-full w-full overflow-hidden">
              <img src={s.image} alt="" className="absolute inset-0 h-full w-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-black/30" />
              <div className="absolute inset-x-0 bottom-0 p-8 text-white">
                {s.kicker && <p className="text-xs uppercase tracking-[0.3em] opacity-70">{s.kicker}</p>}
                <h3 data-title className="text-5xl font-semibold tracking-tight sm:text-6xl">{s.title}</h3>
              </div>
            </div>
          </div>
        </section>
      ))}
      <div className="absolute right-5 top-1/2 z-10 flex -translate-y-1/2 flex-col gap-2" aria-hidden>
        {slides.map((s, i) => (
          <span key={s.title} className={cn("h-6 w-1 rounded-full bg-white/30 transition-all duration-500", index === i && "h-10 bg-white")} />
        ))}
      </div>
      <p className="absolute left-5 top-4 z-10 font-mono text-xs text-white/70">
        {String(index + 1).padStart(2, "0")} / {String(slides.length).padStart(2, "0")}
      </p>
    </div>
  );
}
```

## Usage example
```tsx
"use client";
import { photos } from "@/components/kinetik/demo-helpers" /* or inline */;
import { GsapObserverSlides } from "@/components/kinetik/gsap-observer-slides";

const slides = [
  { title: "Violet Aurora", kicker: "Chapter 01", image: photos[5] },
  { title: "Amber Road", kicker: "Chapter 02", image: photos[4] },
  { title: "Glass Ocean", kicker: "Chapter 03", image: photos[6] },
  { title: "Neon Haze", kicker: "Chapter 04", image: photos[2] },
];

export default function Demo() {
  return <GsapObserverSlides slides={slides} />;
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
