You are given a task to integrate a component from the **kinetik** motion library into this codebase.

# Scroll Spy Rail (`gsap-scroll-spy`)

Long-read layout with a lateral rail: the active chapter highlights as you read, the rail fills with progress, and labels glide you to their section with ScrollTo.

## What it should do
Create a scroll-spy: sticky left nav with a 2px rail whose inner fill scaleY 0→1 is scrubbed by the body's ScrollTrigger (top 50% → bottom 50%); one ScrollTrigger per section (top 50% → bottom 50%) sets the active index onToggle; clicking a label runs gsap.to(scroller, { scrollTo: { y: section, offsetY: 24 }, duration 1, power3.inOut }).

## Project requirements
- React 19 + TypeScript, Tailwind CSS v4, shadcn/ui-style CSS variables (`background`, `foreground`, `muted`, `muted-foreground`, `border`, `card`, `primary`, `ring`). If the project lacks shadcn, set it up first (`npx shadcn@latest init`).
- Animation engine: **gsap**.
- Install dependencies: `npm i gsap @gsap/react`
- Put the component at `components/kinetik/gsap-scroll-spy.tsx`.
- `cn` lives at `lib/kinetik/utils.ts` (source below).
- Shared hooks go at `lib/kinetik/core.ts` (source below).

## Non-negotiables
- **Accessibility:** Nav is a labelled <nav> with real buttons and aria-current; reduced motion jumps instantly.
- **Performance:** One ScrollTrigger per section + one scrubbed scaleY.
- Respect `prefers-reduced-motion` (replace movement with opacity or an instant change).
- Animate only transform / opacity / filter / clip-path. No hard-coded theme colors — use CSS variables so it works in light and dark.

## Source — components/kinetik/gsap-scroll-spy.tsx
```tsx
"use client";
import { useRef, useState, type ReactNode, type RefObject } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import { useGSAP } from "@gsap/react";
import { cn, useReducedMotion } from "@/lib/kinetik/core";

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin, useGSAP);

export interface ScrollSpySection {
  id: string;
  label: string;
  content: ReactNode;
}

export interface GsapScrollSpyProps {
  sections: ScrollSpySection[];
  scroller?: RefObject<HTMLElement | null>;
  className?: string;
}

/**
 * Long-read layout with a lateral progress rail: one ScrollTrigger per section sets the active
 * label, the rail's fill scrubs with overall progress, and clicking a label glides there
 * with ScrollToPlugin (offset-aware, inside any scroller).
 */
export function GsapScrollSpy({ sections, scroller, className }: GsapScrollSpyProps) {
  const root = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const reduced = useReducedMotion();

  const { contextSafe } = useGSAP(
    () => {
      const sc = scroller?.current ?? undefined;
      root.current!.querySelectorAll<HTMLElement>("[data-spy]").forEach((el, i) => {
        ScrollTrigger.create({ trigger: el, scroller: sc, start: "top 50%", end: "bottom 50%", onToggle: (s) => s.isActive && setActive(i) });
      });
      gsap.fromTo(
        root.current!.querySelector("[data-fill]"),
        { scaleY: 0 },
        { scaleY: 1, ease: "none", scrollTrigger: { trigger: root.current!.querySelector("[data-body]"), scroller: sc, start: "top 50%", end: "bottom 50%", scrub: true } },
      );
    },
    { scope: root },
  );

  const go = contextSafe((i: number) => {
    const target = root.current!.querySelectorAll<HTMLElement>("[data-spy]")[i];
    const sc = scroller?.current ?? window;
    gsap.to(sc, { scrollTo: { y: target, offsetY: 24 }, duration: reduced ? 0 : 1, ease: "power3.inOut" });
  });

  return (
    <div ref={root} className={cn("relative flex gap-8", className)}>
      <nav aria-label="Sections" className="sticky top-6 h-fit shrink-0 self-start">
        <div className="relative flex gap-3">
          <div className="relative w-0.5 rounded-full bg-border">
            <div data-fill className="absolute inset-0 origin-top rounded-full bg-foreground" />
          </div>
          <ol className="space-y-3 text-sm">
            {sections.map((s, i) => (
              <li key={s.id}>
                <button
                  onClick={() => go(i)}
                  aria-current={active === i ? "true" : undefined}
                  className={cn("flex items-center gap-2 text-left transition-[color,transform] duration-300", active === i ? "translate-x-1 text-foreground" : "text-muted-foreground hover:text-foreground")}
                >
                  <span className="font-mono text-[10px] tabular-nums">{String(i + 1).padStart(2, "0")}</span>
                  {s.label}
                </button>
              </li>
            ))}
          </ol>
        </div>
      </nav>
      <div data-body className="min-w-0 flex-1 space-y-16">
        {sections.map((s) => (
          <section key={s.id} id={s.id} data-spy>
            {s.content}
          </section>
        ))}
      </div>
    </div>
  );
}
```

## Usage example
```tsx
"use client";
import { DemoScroller, photos, useDemoScroller } from "@/components/kinetik/demo-helpers" /* or inline */;
import { GsapScrollSpy } from "@/components/kinetik/gsap-scroll-spy";

const chapters = [
  ["intro", "Introduction", "Why motion matters", 0],
  ["timing", "Timing", "Durations that feel right", 1],
  ["easing", "Easing", "Curves with personality", 2],
  ["choreo", "Choreography", "Stagger, overlap, sequence", 4],
  ["a11y", "Accessibility", "Reduced motion is a feature", 6],
] as const;

function Inner() {
  const s = useDemoScroller() ?? undefined;
  return (
    <div className="px-6 pb-[60cqh] pt-6">
      <GsapScrollSpy
        scroller={s}
        sections={chapters.map(([id, label, title, img]) => ({
          id,
          label,
          content: (
            <article>
              <h3 className="text-2xl font-semibold tracking-tight">{title}</h3>
              <img src={photos[img]} alt="" className="my-3 aspect-[16/7] w-full rounded-xl object-cover" />
              <p className="text-sm leading-relaxed text-muted-foreground">
                Good motion explains what changed, where things went and what you can do next. Each chapter here is tracked by its own ScrollTrigger; the rail on the left fills as you read and every label scrolls you straight to its chapter.
              </p>
            </article>
          ),
        }))}
      />
    </div>
  );
}

export default function Demo() {
  return (
    <DemoScroller hint={false}>
      <Inner />
    </DemoScroller>
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
