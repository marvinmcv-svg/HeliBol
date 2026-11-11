You are given a task to integrate a component from the **kinetik** motion library into this codebase.

# Radial Action Menu (`gsap-radial-menu`)

A FAB blooms into a ring of actions with a bouncy stagger — and closes with a different, crisp ease instead of replaying the bounce backwards.

## What it should do
Open: rotate the + icon 135° (back.out), each item fromTo(x0,y0,scale .3,hidden → cos/sin(angle)·radius, scale 1, visible) with back.out(2.2) and i·45ms delay. Close: a separate set of tweens back to center with power3.in, .25s, reversed stagger — different ease for the reverse direction.

## Project requirements
- React 19 + TypeScript, Tailwind CSS v4, shadcn/ui-style CSS variables (`background`, `foreground`, `muted`, `muted-foreground`, `border`, `card`, `primary`, `ring`). If the project lacks shadcn, set it up first (`npx shadcn@latest init`).
- Animation engine: **gsap**.
- Install dependencies: `npm i gsap @gsap/react lucide-react`
- Put the component at `components/kinetik/gsap-radial-menu.tsx`.
- `cn` lives at `lib/kinetik/utils.ts` (source below).
- Shared hooks go at `lib/kinetik/core.ts` (source below).

## Non-negotiables
- **Accessibility:** Toggle has aria-expanded; hidden actions are removed from tab order; each action has a label. Reduced motion places items instantly.
- **Performance:** One tween per item; positions precomputed from angle.
- Respect `prefers-reduced-motion` (replace movement with opacity or an instant change).
- Animate only transform / opacity / filter / clip-path. No hard-coded theme colors — use CSS variables so it works in light and dark.

## Source — components/kinetik/gsap-radial-menu.tsx
```tsx
"use client";
import { useRef, useState, type ComponentType } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { Plus } from "lucide-react";
import { cn, useReducedMotion } from "@/lib/kinetik/core";

gsap.registerPlugin(useGSAP);

export interface RadialItem {
  label: string;
  icon: ComponentType<{ className?: string }>;
  onSelect?: () => void;
}

export interface GsapRadialMenuProps {
  items: RadialItem[];
  /** Orbit radius in px. */
  radius?: number;
  /** Arc in degrees the items spread over (360 = full circle). */
  arc?: number;
  /** Starting angle in degrees (−90 = straight up). */
  startAngle?: number;
  className?: string;
}

/**
 * A FAB that blooms into a ring of actions. Opening uses a bouncy back.out stagger; closing
 * runs a separate, quicker power3.in timeline (a different ease for the reverse direction),
 * so the exit feels crisp instead of replaying the bounce backwards.
 */
export function GsapRadialMenu({ items, radius = 96, arc = 360, startAngle = -90, className }: GsapRadialMenuProps) {
  const root = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const reduced = useReducedMotion();
  const { contextSafe } = useGSAP({ scope: root });

  const pos = (i: number) => {
    const step = arc >= 360 ? arc / items.length : arc / Math.max(1, items.length - 1);
    const a = ((startAngle + step * i) * Math.PI) / 180;
    return { x: Math.cos(a) * radius, y: Math.sin(a) * radius };
  };

  const toggle = contextSafe(() => {
    const next = !open;
    setOpen(next);
    const els = root.current!.querySelectorAll<HTMLElement>("[data-item]");
    const fab = root.current!.querySelector("[data-fab-icon]");
    gsap.killTweensOf([els, fab]);
    if (reduced) {
      els.forEach((el, i) => gsap.set(el, { ...(next ? pos(i) : { x: 0, y: 0 }), autoAlpha: next ? 1 : 0, scale: 1 }));
      return;
    }
    if (next) {
      gsap.to(fab, { rotation: 135, duration: 0.5, ease: "back.out(2)" });
      els.forEach((el, i) =>
        gsap.fromTo(el, { x: 0, y: 0, scale: 0.3, autoAlpha: 0 }, { ...pos(i), scale: 1, autoAlpha: 1, duration: 0.6, ease: "back.out(2.2)", delay: i * 0.045 }),
      );
    } else {
      gsap.to(fab, { rotation: 0, duration: 0.3, ease: "power3.in" });
      gsap.to([...els].reverse(), { x: 0, y: 0, scale: 0.3, autoAlpha: 0, duration: 0.25, ease: "power3.in", stagger: 0.025 });
    }
  });

  return (
    <div ref={root} className={cn("relative grid size-14 place-items-center", className)}>
      {items.map((it, i) => {
        const Icon = it.icon;
        return (
          <button
            key={it.label}
            data-item
            tabIndex={open ? 0 : -1}
            aria-hidden={!open}
            onClick={() => {
              it.onSelect?.();
              toggle();
            }}
            className="invisible absolute grid size-12 place-items-center rounded-full border border-border bg-card shadow-lg opacity-0 hover:bg-accent"
            title={it.label}
          >
            <Icon className="size-5" />
            <span className="sr-only">{it.label}</span>
          </button>
        );
      })}
      <button onClick={toggle} aria-expanded={open} aria-label={open ? "Close actions" : "Open actions"} className="relative z-10 grid size-14 place-items-center rounded-full bg-foreground text-background shadow-xl">
        <Plus data-fab-icon className="size-6" />
      </button>
    </div>
  );
}
```

## Usage example
```tsx
"use client";
import { useEffect, useRef, useState } from "react";
import { Camera, Image, Mic, Music, PenLine, Share2, Video, MapPin } from "lucide-react";
import { GsapRadialMenu } from "@/components/kinetik/gsap-radial-menu";

export default function Demo() {
  const [picked, setPicked] = useState("—");
  const wrap = useRef<HTMLDivElement>(null);
  // open on first paint so the preview shows the ring
  useEffect(() => {
    const t = setTimeout(() => wrap.current?.querySelector<HTMLButtonElement>("[aria-expanded]")?.click(), 400);
    return () => clearTimeout(t);
  }, []);
  const items = [
    ["Photo", Camera], ["Gallery", Image], ["Voice", Mic], ["Music", Music], ["Note", PenLine], ["Share", Share2], ["Video", Video], ["Place", MapPin],
  ] as const;
  return (
    <div ref={wrap} className="flex h-full w-full flex-col items-center justify-center gap-10 p-6">
      <GsapRadialMenu items={items.map(([label, icon]) => ({ label, icon, onSelect: () => setPicked(label) }))} />
      <p className="text-xs text-muted-foreground">Last action: <span className="font-medium text-foreground">{picked}</span></p>
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
