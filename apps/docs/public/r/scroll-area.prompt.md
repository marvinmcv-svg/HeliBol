You are given a task to integrate a component from the **kinetik** motion library into this codebase.

# Scroll Area (`scroll-area`)

Native scrolling with a custom overlay scrollbar that appears while scrolling or hovering, grows when grabbed and can be dragged; top/bottom fades appear only when there is more content that way.

## What it should do
Build a scroll area: a native overflow-y viewport with the scrollbar hidden, a mask-image gradient whose top/bottom stops turn transparent only when not at the start/end, and an absolutely positioned thumb sized clientHeight/scrollHeight and positioned by scrollTop. Thumb shows while scrolling (900 ms timeout) or hovering and is draggable (pointer delta / size).

## Project requirements
- React 19 + TypeScript, Tailwind CSS v4, shadcn/ui-style CSS variables (`background`, `foreground`, `muted`, `muted-foreground`, `border`, `card`, `primary`, `ring`). If the project lacks shadcn, set it up first (`npx shadcn@latest init`).
- Animation engine: **js**.
- No runtime dependencies (CSS only).
- Put the component at `components/kinetik/scroll-area.tsx`.
- `cn` lives at `lib/kinetik/utils.ts` (source below).
- Shared hooks go at `lib/kinetik/core.ts` (source below).

## Non-negotiables
- **Accessibility:** The viewport is a focusable labelled region using native scroll, so keyboard, wheel, touch and screen readers work unchanged. Reduced motion: no mask transition.
- **Performance:** One ResizeObserver; scroll handler updates two numbers; native scrollbar hidden.
- Respect `prefers-reduced-motion` (replace movement with opacity or an instant change).
- Animate only transform / opacity / filter / clip-path. No hard-coded theme colors — use CSS variables so it works in light and dark.

## Source — components/kinetik/scroll-area.tsx
```tsx
"use client";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { cn, useReducedMotion } from "@/lib/kinetik/core";

export interface ScrollAreaProps {
  children: ReactNode;
  /** Accessible name for the scroll region. */
  label: string;
  className?: string;
  /** Height of the edge fades in px. */
  fade?: number;
}

/**
 * Native scrolling with a custom overlay scrollbar: the thumb appears while you scroll or hover,
 * grows when grabbed, and can be dragged; top/bottom fades appear only when there is more content
 * that way. Keyboard, wheel, touch and screen readers keep the native behaviour.
 */
export function ScrollArea({ children, label, className, fade = 32 }: ScrollAreaProps) {
  const reduced = useReducedMotion();
  const vp = useRef<HTMLDivElement>(null);
  const [m, setM] = useState({ top: 0, size: 1, atTop: true, atEnd: true });
  const [active, setActive] = useState(false);
  const [grab, setGrab] = useState(false);
  const hide = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => {
    const el = vp.current;
    if (!el) return;
    const measure = () => {
      const { scrollTop, scrollHeight, clientHeight } = el;
      const size = clientHeight / scrollHeight;
      setM({ top: (scrollTop / scrollHeight) * 100, size, atTop: scrollTop < 2, atEnd: scrollTop + clientHeight >= scrollHeight - 2 });
    };
    const onScroll = () => {
      measure();
      setActive(true);
      clearTimeout(hide.current);
      hide.current = setTimeout(() => setActive(false), 900);
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    if (el.firstElementChild) ro.observe(el.firstElementChild);
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => { ro.disconnect(); el.removeEventListener("scroll", onScroll); clearTimeout(hide.current); };
  }, []);

  const dragThumb = (e: React.PointerEvent) => {
    const el = vp.current!;
    const startY = e.clientY, start = el.scrollTop;
    setGrab(true);
    const move = (ev: PointerEvent) => (el.scrollTop = start + (ev.clientY - startY) / m.size);
    const up = () => (setGrab(false), window.removeEventListener("pointermove", move), window.removeEventListener("pointerup", up));
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
  };
  const scrollable = m.size < 1;
  const mask = `linear-gradient(to bottom, ${m.atTop ? "black" : "transparent"}, black ${fade}px, black calc(100% - ${fade}px), ${m.atEnd ? "black" : "transparent"})`;

  return (
    <div className={cn("group relative overflow-hidden", className)}>
      <div
        ref={vp}
        role="region"
        aria-label={label}
        tabIndex={0}
        className="h-full overflow-y-auto overscroll-contain outline-none [scrollbar-width:none] focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring [&::-webkit-scrollbar]:hidden"
        style={{ maskImage: mask, WebkitMaskImage: mask, transition: reduced ? undefined : "mask-image .2s" }}
      >
        <div>{children}</div>
      </div>
      {scrollable && (
        <div aria-hidden className={cn("absolute inset-y-1 right-1 w-2.5 transition-opacity duration-300", active || grab ? "opacity-100" : "opacity-0 group-hover:opacity-100")}>
          <div
            onPointerDown={dragThumb}
            className={cn("absolute right-0 cursor-grab touch-none rounded-full bg-foreground/30 transition-[width,background-color] duration-150 hover:bg-foreground/50 active:cursor-grabbing", grab ? "w-2.5 bg-foreground/50" : "w-1.5")}
            style={{ top: `${m.top}%`, height: `${Math.max(8, m.size * 100)}%` }}
          />
        </div>
      )}
    </div>
  );
}
```

## Usage example
```tsx
"use client";
import { ScrollArea } from "@/components/kinetik/scroll-area";

const releases = Array.from({ length: 24 }, (_, i) => ({ v: `v2.${24 - i}.0`, note: ["Faster thumbnails", "New three.js scenes", "Saved collections", "MCP install docs", "Mobile filter drawer", "OG images"][i % 6] }));

export default function Demo() {
  return (
    <div className="grid h-full place-items-center p-6">
      <ScrollArea label="Release notes" className="h-72 w-64 rounded-2xl border border-border bg-card">
        <ul className="divide-y divide-border">
          {releases.map((r) => (
            <li key={r.v} className="flex items-center justify-between px-4 py-3 text-sm">
              <span className="font-mono text-xs text-muted-foreground">{r.v}</span>
              <span>{r.note}</span>
            </li>
          ))}
        </ul>
      </ScrollArea>
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
