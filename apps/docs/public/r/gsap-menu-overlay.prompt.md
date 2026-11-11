You are given a task to integrate a component from the **kinetik** motion library into this codebase.

# Interruptible Menu Overlay (`gsap-menu-overlay`)

Full-screen menu as ONE paused timeline — panels wipe down, link letters rise from masks — played forward to open and reversed (faster) to close, so it can be interrupted at any point.

## What it should do
Build tl = timeline({ paused }) .fromTo(panels, { scaleY 0 }, { scaleY 1, origin top, .8s expo.inOut, stagger .08 }) .from(chars (SplitText chars with mask), { yPercent 110, .7s expo.out, stagger .012 }, '−=.35') .from(footer, { autoAlpha 0, y 12 }); open → tl.timeScale(1).play(), close → tl.timeScale(1.8).reverse().

## Project requirements
- React 19 + TypeScript, Tailwind CSS v4, shadcn/ui-style CSS variables (`background`, `foreground`, `muted`, `muted-foreground`, `border`, `card`, `primary`, `ring`). If the project lacks shadcn, set it up first (`npx shadcn@latest init`).
- Animation engine: **gsap**.
- Install dependencies: `npm i gsap @gsap/react`
- Put the component at `components/kinetik/gsap-menu-overlay.tsx`.
- `cn` lives at `lib/kinetik/utils.ts` (source below).
- Shared hooks go at `lib/kinetik/core.ts` (source below).

## Non-negotiables
- **Accessibility:** Toggle has aria-expanded, links leave tab order when closed, Esc closes. Reduced motion: near-instant timeline.
- **Performance:** Built once; play/reverse never rebuilds tweens.
- Respect `prefers-reduced-motion` (replace movement with opacity or an instant change).
- Animate only transform / opacity / filter / clip-path. No hard-coded theme colors — use CSS variables so it works in light and dark.

## Source — components/kinetik/gsap-menu-overlay.tsx
```tsx
"use client";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { SplitText } from "gsap/SplitText";
import { useGSAP } from "@gsap/react";
import { cn, useReducedMotion } from "@/lib/kinetik/core";

gsap.registerPlugin(SplitText, useGSAP);

export interface GsapMenuOverlayProps {
  links: { label: string; href?: string; meta?: string }[];
  brand?: string;
  className?: string;
}

/**
 * Full-screen menu built as ONE paused timeline: panels wipe down, link letters rise, the
 * footer fades. Open = play(), close = reverse() with timeScale(1.8) — so it is fully
 * interruptible: click mid-animation and it turns around from exactly where it is.
 */
export function GsapMenuOverlay({ links, brand = "studio®", className }: GsapMenuOverlayProps) {
  const root = useRef<HTMLDivElement>(null);
  const tl = useRef<gsap.core.Timeline | null>(null);
  const [open, setOpen] = useState(false);
  const reduced = useReducedMotion();

  useGSAP(
    () => {
      const q = gsap.utils.selector(root);
      const chars = q("[data-link-text]").flatMap((el) => SplitText.create(el, { type: "chars", mask: "chars" }).chars);
      gsap.set(q("[data-overlay]"), { autoAlpha: 1 });
      tl.current = gsap
        .timeline({ paused: true, defaults: { ease: "expo.inOut" } })
        .fromTo(q("[data-panel]"), { scaleY: 0 }, { scaleY: 1, transformOrigin: "top", duration: reduced ? 0.01 : 0.8, stagger: 0.08 })
        .from(chars, { yPercent: 110, duration: reduced ? 0.01 : 0.7, ease: "expo.out", stagger: 0.012 }, reduced ? 0 : "-=0.35")
        .from(q("[data-foot]"), { autoAlpha: 0, y: 12, duration: 0.4, ease: "power2.out" }, "-=0.4");
      gsap.set(q("[data-overlay]"), { pointerEvents: "none" });
    },
    { scope: root, dependencies: [reduced] },
  );

  useEffect(() => {
    const t = tl.current;
    const ov = root.current?.querySelector<HTMLElement>("[data-overlay]");
    if (!t || !ov) return;
    ov.style.pointerEvents = open ? "auto" : "none";
    if (open) t.timeScale(1).play();
    else t.timeScale(1.8).reverse();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <div ref={root} className={cn("relative h-full w-full overflow-hidden", className)}>
      <header className="relative z-20 flex items-center justify-between p-5">
        <span className={cn("font-semibold tracking-tight transition-colors duration-500", open && "text-background")}>{brand}</span>
        <button onClick={() => setOpen((o) => !o)} aria-expanded={open} className={cn("rounded-full border px-4 py-1.5 text-sm transition-colors duration-500", open ? "border-background/40 text-background" : "border-border")}>
          {open ? "Close" : "Menu"}
        </button>
      </header>
      <div data-overlay className="invisible absolute inset-0 z-10" aria-hidden={!open}>
        <div className="absolute inset-0 flex">
          {[0, 1, 2].map((i) => (
            <div key={i} data-panel className="h-full flex-1 bg-foreground" />
          ))}
        </div>
        <nav className="relative flex h-full flex-col justify-center gap-1 px-8 text-background">
          {links.map((l, i) => (
            <a key={l.label} data-link href={l.href ?? "#"} tabIndex={open ? 0 : -1} onClick={(e) => (!l.href && e.preventDefault(), setOpen(false))} className="group flex items-baseline gap-4">
              <span className="font-mono text-xs opacity-50">0{i + 1}</span>
              <span data-link-text className="text-5xl font-semibold tracking-tight transition-transform duration-300 group-hover:translate-x-2 sm:text-6xl">{l.label}</span>
              {l.meta && <span className="text-xs opacity-50">{l.meta}</span>}
            </a>
          ))}
          <div data-foot className="mt-8 flex gap-6 text-xs opacity-60"><span>hello@studio.dev</span><span>Instagram</span><span>Dribbble</span></div>
        </nav>
      </div>
    </div>
  );
}
```

## Usage example
```tsx
"use client";
import { photos } from "@/components/kinetik/demo-helpers" /* or inline */;
import { GsapMenuOverlay } from "@/components/kinetik/gsap-menu-overlay";

export default function Demo() {
  return (
    <div className="relative h-full w-full">
      <img src={photos[0]} alt="" className="absolute inset-0 h-full w-full object-cover opacity-40" />
      <div className="absolute inset-x-0 bottom-0 p-6">
        <p className="max-w-md text-4xl font-semibold leading-tight tracking-tight">Independent design studio crafting motion-first brands.</p>
      </div>
      <GsapMenuOverlay
        className="absolute inset-0"
        links={[{ label: "Work", meta: "(24)" }, { label: "Studio" }, { label: "Journal", meta: "(8)" }, { label: "Contact" }]}
      />
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
