You are given a task to integrate a component from the **kinetik** motion library into this codebase.

# Hover Image Preview List (`gsap-hover-preview`)

Agency project index: hovering a row reveals its image in a card that trails the cursor, tilts with your speed and clip-reveals between projects.

## What it should do
Build a project list with a cursor-following preview: a 160×192 rounded card absolutely positioned (xPercent/yPercent −50) moved by gsap.quickTo(x/y, .5s power3) to the pointer and quickTo(rotation) = clamp(±12, Δx·.6). Row enter: card scale 0→1 back.out(1.6) and that row's image clipPath inset(100% 0 0 0)→inset(0) + scale 1.3→1 (expo.out); dim other rows to 30%. Leave: scale to 0.

## Project requirements
- React 19 + TypeScript, Tailwind CSS v4, shadcn/ui-style CSS variables (`background`, `foreground`, `muted`, `muted-foreground`, `border`, `card`, `primary`, `ring`). If the project lacks shadcn, set it up first (`npx shadcn@latest init`).
- Animation engine: **gsap**.
- Install dependencies: `npm i gsap @gsap/react`
- Put the component at `components/kinetik/gsap-hover-preview.tsx`.
- `cn` lives at `lib/kinetik/utils.ts` (source below).
- Shared hooks go at `lib/kinetik/core.ts` (source below).

## Non-negotiables
- **Accessibility:** Rows are real links; focus also reveals the preview; image is decorative (aria-hidden). Reduced motion keeps the list behaviour without the floating card.
- **Performance:** gsap.quickTo for x/y/rotation (no new tweens per move); images stacked and clip-revealed.
- Respect `prefers-reduced-motion` (replace movement with opacity or an instant change).
- Animate only transform / opacity / filter / clip-path. No hard-coded theme colors — use CSS variables so it works in light and dark.

## Source — components/kinetik/gsap-hover-preview.tsx
```tsx
"use client";
import { useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { cn, useReducedMotion } from "@/lib/kinetik/core";

gsap.registerPlugin(useGSAP);

export interface HoverPreviewItem {
  title: string;
  meta: string;
  image: string;
  href?: string;
}

export interface GsapHoverPreviewProps {
  items: HoverPreviewItem[];
  className?: string;
}

/**
 * Agency-style project index: hovering a row reveals its image in a card that trails the
 * cursor (gsap.quickTo for x/y, velocity-based rotation) and clip-reveals between images.
 */
export function GsapHoverPreview({ items, className }: GsapHoverPreviewProps) {
  const root = useRef<HTMLDivElement>(null);
  const card = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(-1);
  const reduced = useReducedMotion();
  const movers = useRef<{ x: gsap.QuickToFunc; y: gsap.QuickToFunc; r: gsap.QuickToFunc } | null>(null);
  const lastX = useRef(0);

  const { contextSafe } = useGSAP(
    () => {
      gsap.set(card.current, { xPercent: -50, yPercent: -50, scale: 0, autoAlpha: 0 });
      movers.current = {
        x: gsap.quickTo(card.current, "x", { duration: 0.5, ease: "power3" }),
        y: gsap.quickTo(card.current, "y", { duration: 0.5, ease: "power3" }),
        r: gsap.quickTo(card.current, "rotation", { duration: 0.8, ease: "power3" }),
      };
    },
    { scope: root },
  );

  const onMove = contextSafe((e: React.PointerEvent) => {
    if (reduced || !movers.current) return;
    const b = root.current!.getBoundingClientRect();
    const x = e.clientX - b.left;
    movers.current.x(x);
    movers.current.y(e.clientY - b.top);
    movers.current.r(gsap.utils.clamp(-12, 12, (x - lastX.current) * 0.6));
    lastX.current = x;
  });

  const enter = contextSafe((i: number) => {
    setActive(i);
    if (reduced) return;
    gsap.to(card.current, { scale: 1, autoAlpha: 1, duration: 0.4, ease: "back.out(1.6)" });
    const imgs = card.current!.querySelectorAll<HTMLElement>("[data-img]");
    gsap.fromTo(imgs[i], { clipPath: "inset(100% 0 0 0)", scale: 1.3 }, { clipPath: "inset(0% 0 0 0)", scale: 1, duration: 0.6, ease: "expo.out", overwrite: true });
  });

  const leave = contextSafe(() => {
    setActive(-1);
    gsap.to(card.current, { scale: 0, autoAlpha: 0, duration: 0.3, ease: "power2.in" });
  });

  return (
    <div ref={root} onPointerMove={onMove} onPointerLeave={leave} className={cn("relative", className)}>
      <ul className="divide-y divide-border border-y border-border">
        {items.map((it, i) => (
          <li key={it.title}>
            <a
              href={it.href ?? "#"}
              onClick={(e) => !it.href && e.preventDefault()}
              onPointerEnter={() => enter(i)}
              onFocus={() => enter(i)}
              onBlur={leave}
              className={cn("flex items-baseline justify-between gap-4 py-5 transition-[opacity,padding] duration-300", active !== -1 && active !== i && "opacity-30", active === i && "pl-3")}
            >
              <span className="text-3xl font-semibold tracking-tight sm:text-4xl">{it.title}</span>
              <span className="shrink-0 text-sm text-muted-foreground">{it.meta}</span>
            </a>
          </li>
        ))}
      </ul>
      <div ref={card} aria-hidden className="pointer-events-none absolute left-0 top-0 z-10 h-48 w-40 overflow-hidden rounded-xl shadow-2xl">
        {items.map((it, i) => (
          <img key={it.image} data-img src={it.image} alt="" className="absolute inset-0 h-full w-full object-cover" style={{ zIndex: i === active ? 2 : 1, clipPath: "inset(100% 0 0 0)" }} />
        ))}
      </div>
    </div>
  );
}
```

## Usage example
```tsx
"use client";
import { photos } from "@/components/kinetik/demo-helpers" /* or inline */;
import { GsapHoverPreview } from "@/components/kinetik/gsap-hover-preview";

const items = [
  { title: "Northern Lights", meta: "Brand · 2026", image: photos[5] },
  { title: "Desert Road", meta: "Campaign · 2025", image: photos[4] },
  { title: "Glass Ocean", meta: "Web · 2025", image: photos[6] },
  { title: "Neon District", meta: "Motion · 2024", image: photos[2] },
];

export default function Demo() {
  return (
    <div className="flex h-full w-full flex-col justify-center p-8 sm:p-12">
      <p className="mb-4 text-xs uppercase tracking-[0.25em] text-muted-foreground">Selected work — hover a row</p>
      <GsapHoverPreview items={items} />
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
