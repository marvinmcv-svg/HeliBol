You are given a task to integrate a component from the **kinetik** motion library into this codebase.

# ScrollTo Table of Contents (`gsap-scrollto-nav`)

Docs-style table of contents: links glide the scroller to each section with ScrollToPlugin (eased, interruptible) while ScrollTriggers track the active section and a bar slides beside it.

## What it should do
Build a table of contents with GSAP ScrollToPlugin: clicking a link tweens the scroller with scrollTo: { y: section, offsetY: 16, autoKill: true } (power3.inOut, 1 s) and focuses the section. One ScrollTrigger per section (start/end at 40%) sets the active index; an indicator bar tweens to the active link's offsetTop/height.

## Project requirements
- React 19 + TypeScript, Tailwind CSS v4, shadcn/ui-style CSS variables (`background`, `foreground`, `muted`, `muted-foreground`, `border`, `card`, `primary`, `ring`). If the project lacks shadcn, set it up first (`npx shadcn@latest init`).
- Animation engine: **gsap**.
- Install dependencies: `npm i gsap`
- Put the component at `components/kinetik/gsap-scrollto-nav.tsx`.
- `cn` lives at `lib/kinetik/utils.ts` (source below).
- Shared hooks go at `lib/kinetik/core.ts` (source below).

## Non-negotiables
- **Accessibility:** Real anchor links with aria-current=location; sections are focusable regions and receive focus after the jump. Reduced motion: instant jump.
- **Performance:** ScrollTo autoKill hands control back as soon as the user scrolls.
- Respect `prefers-reduced-motion` (replace movement with opacity or an instant change).
- Animate only transform / opacity / filter / clip-path. No hard-coded theme colors — use CSS variables so it works in light and dark.

## Source — components/kinetik/gsap-scrollto-nav.tsx
```tsx
"use client";
import { useEffect, useRef, useState, type ReactNode, type RefObject } from "react";
import gsap from "gsap";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { cn, useReducedMotion } from "@/lib/kinetik/core";

gsap.registerPlugin(ScrollToPlugin, ScrollTrigger);

export interface ScrollToSection {
  id: string;
  label: string;
  content: ReactNode;
}

export interface GsapScrollToNavProps {
  sections: ScrollToSection[];
  /** The element that scrolls (defaults to window). */
  scroller?: RefObject<HTMLElement | null>;
  className?: string;
}

/**
 * Docs-style table of contents: clicking a link glides the scroller to the section with GSAP's
 * ScrollToPlugin (eased, interruptible, offset for the sticky header), while ScrollTriggers track the
 * active section and a bar slides beside the current link.
 */
export function GsapScrollToNav({ sections, scroller, className }: GsapScrollToNavProps) {
  const reduced = useReducedMotion();
  const [active, setActive] = useState(0);
  const root = useRef<HTMLDivElement>(null);
  const list = useRef<HTMLUListElement>(null);
  const bar = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const els = sections.map((s) => root.current!.querySelector<HTMLElement>(`#${CSS.escape(s.id)}`)!);
    const triggers = els.map((el, i) =>
      ScrollTrigger.create({ trigger: el, scroller: scroller?.current ?? undefined, start: "top 40%", end: "bottom 40%", onToggle: (self) => self.isActive && setActive(i) }),
    );
    return () => triggers.forEach((t) => t.kill());
  }, [sections, scroller]);

  useEffect(() => {
    const link = list.current?.children[active] as HTMLElement | undefined;
    if (!link || !bar.current) return;
    gsap.to(bar.current, { y: link.offsetTop, height: link.offsetHeight, duration: reduced ? 0 : 0.45, ease: "power3.out" });
  }, [active, reduced]);

  const go = (i: number) => {
    const el = root.current!.querySelector<HTMLElement>(`#${CSS.escape(sections[i].id)}`)!;
    gsap.to(scroller?.current ?? window, { duration: reduced ? 0 : 1, ease: "power3.inOut", scrollTo: { y: el, offsetY: 16, autoKill: true }, overwrite: true });
    el.focus({ preventScroll: true });
  };

  return (
    <div ref={root} className={cn("grid grid-cols-[9rem_1fr] gap-6", className)}>
      <nav aria-label="On this page" className="sticky top-4 h-fit">
        <p className="mb-2 text-[11px] font-medium uppercase tracking-wider text-muted-foreground">On this page</p>
        <div className="relative pl-3">
          <span aria-hidden className="absolute left-0 top-0 h-full w-px bg-border" />
          <span ref={bar} aria-hidden className="absolute left-0 top-0 w-0.5 -translate-x-[0.5px] rounded-full bg-primary" style={{ height: 0 }} />
          <ul ref={list} className="space-y-1">
            {sections.map((s, i) => (
              <li key={s.id}>
                <a
                  href={`#${s.id}`}
                  aria-current={i === active ? "location" : undefined}
                  onClick={(e) => (e.preventDefault(), go(i))}
                  className={cn("block py-0.5 text-sm transition-colors", i === active ? "font-medium text-foreground" : "text-muted-foreground hover:text-foreground")}
                >
                  {s.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </nav>
      <div className="space-y-10 pb-[60cqh]">
        {sections.map((s) => (
          <section key={s.id} id={s.id} tabIndex={-1} aria-label={s.label} className="scroll-mt-4 outline-none">
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
import { DemoScroller, useDemoScroller } from "@/components/kinetik/demo-helpers" /* or inline */;
import { GsapScrollToNav } from "@/components/kinetik/gsap-scrollto-nav";

const lorem = "Motion should explain, not decorate. Every transition answers a question: where did this come from, where did it go, what changed? Keep durations short and let springs settle naturally.";
const sections = ["Introduction", "Installation", "Tokens", "Reduced motion", "Engines", "FAQ"].map((label, i) => ({
  id: `kn-sto-${i}`,
  label,
  content: (
    <>
      <h3 className="text-xl font-semibold tracking-tight">{label}</h3>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{lorem}</p>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{lorem}</p>
    </>
  ),
}));

function Inner() {
  const s = useDemoScroller() ?? undefined;
  return <GsapScrollToNav scroller={s} sections={sections} className="p-6" />;
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
