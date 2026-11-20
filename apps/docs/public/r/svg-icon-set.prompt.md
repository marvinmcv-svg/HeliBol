You are given a task to integrate a component from the **kinetik** motion library into this codebase.

# Animated Icon Set (`svg-icon-set`)

Six stateful SVG icons with meaningful motion: hamburger ⇄ close, play ⇄ pause path morph, a heart that fills with a spark burst, a ringing bell with a badge, copy → check and sun ⇄ moon.

## What it should do
Build each icon as a button around a 24×24 stroke SVG; animate per-element transforms with springs (menu), interpolate equal-point paths (play/pause), pathLength (check), and a mask circle (moon).

## Project requirements
- React 19 + TypeScript, Tailwind CSS v4, shadcn/ui-style CSS variables (`background`, `foreground`, `muted`, `muted-foreground`, `border`, `card`, `primary`, `ring`). If the project lacks shadcn, set it up first (`npx shadcn@latest init`).
- Animation engine: **motion**.
- Install dependencies: `npm i motion`
- Put the component at `components/kinetik/svg-icon-set.tsx`.
- `cn` lives at `lib/kinetik/utils.ts` (source below).
- Shared hooks go at `lib/kinetik/core.ts` (source below).

## Non-negotiables
- **Accessibility:** Each icon is a toggle button with aria-pressed and a label. Reduced motion switches state without motion.
- **Performance:** Small SVGs animating d, transform and pathLength.
- Respect `prefers-reduced-motion` (replace movement with opacity or an instant change).
- Animate only transform / opacity / filter / clip-path. No hard-coded theme colors — use CSS variables so it works in light and dark.

## Source — components/kinetik/svg-icon-set.tsx
```tsx
"use client";
import { useState } from "react";
import { motion, type Transition } from "motion/react";
import { cn, useReducedMotion } from "@/lib/kinetik/core";

type IconProps = { size?: number; className?: string; label?: string };
const sp: Transition = { type: "spring", stiffness: 420, damping: 26 };

function useT(): Transition {
  return useReducedMotion() ? { duration: 0 } : sp;
}

function Shell({ on, onToggle, label, size = 28, className, children }: { on: boolean; onToggle: () => void; label: string; size?: number; className?: string; children: React.ReactNode }) {
  return (
    <button type="button" aria-pressed={on} aria-label={label} onClick={onToggle} className={cn("grid place-items-center rounded-xl p-2 transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring", className)}>
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        {children}
      </svg>
    </button>
  );
}

/** Hamburger ⇄ close. Top and bottom bars rotate into an X while the middle bar collapses. */
export function IconMenu({ label = "Menu", ...p }: IconProps) {
  const [on, set] = useState(false);
  const t = useT();
  return (
    <Shell on={on} onToggle={() => set(!on)} label={label} {...p}>
      <motion.line x1="4" x2="20" y1="6" y2="6" style={{ originX: 0.5, originY: 0.5 }} animate={on ? { rotate: 45, y: 6 } : { rotate: 0, y: 0 }} transition={t} />
      <motion.line x1="4" x2="20" y1="12" y2="12" animate={{ scaleX: on ? 0 : 1, opacity: on ? 0 : 1 }} transition={t} />
      <motion.line x1="4" x2="20" y1="18" y2="18" style={{ originX: 0.5, originY: 0.5 }} animate={on ? { rotate: -45, y: -6 } : { rotate: 0, y: 0 }} transition={t} />
    </Shell>
  );
}

/** Play ⇄ pause: the triangle's points morph into two bars. */
export function IconPlay({ label = "Play", ...p }: IconProps) {
  const [on, set] = useState(false);
  const t = useT();
  return (
    <Shell on={on} onToggle={() => set(!on)} label={label} {...p}>
      <motion.path fill="currentColor" animate={{ d: on ? "M7 5 L10 5 L10 19 L7 19 Z" : "M7 4 L13 8 L13 16 L7 20 Z" }} transition={t} />
      <motion.path fill="currentColor" animate={{ d: on ? "M14 5 L17 5 L17 19 L14 19 Z" : "M13 8 L19 12 L19 12 L13 16 Z" }} transition={t} />
    </Shell>
  );
}

/** Heart that fills and pops, with six burst sparks. */
export function IconHeart({ label = "Like", ...p }: IconProps) {
  const [on, set] = useState(false);
  const reduced = useReducedMotion();
  return (
    <Shell on={on} onToggle={() => set(!on)} label={label} className={cn(on && "text-rose-500", p.className)} size={p.size}>
      <motion.path
        d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z"
        animate={{ fill: on ? "currentColor" : "rgba(0,0,0,0)", scale: on && !reduced ? [1, 1.25, 1] : 1 }}
        style={{ originX: 0.5, originY: 0.5 }}
        transition={{ duration: 0.35 }}
      />
      {!reduced && Array.from({ length: 6 }, (_, i) => {
        const a = (i / 6) * Math.PI * 2;
        return (
          <motion.circle key={`${i}-${on}`} r={1} fill="currentColor" stroke="none" cx={12} cy={12}
            initial={{ opacity: 0 }}
            animate={on ? { cx: 12 + Math.cos(a) * 11, cy: 12 + Math.sin(a) * 11, opacity: [0, 1, 0] } : { opacity: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }} />
        );
      })}
    </Shell>
  );
}

/** Bell that rings (swings) and shows a badge dot. */
export function IconBell({ label = "Notifications", ...p }: IconProps) {
  const [on, set] = useState(false);
  const reduced = useReducedMotion();
  return (
    <Shell on={on} onToggle={() => set(!on)} label={label} {...p}>
      <motion.g style={{ originX: 0.5, originY: 0 }} animate={on && !reduced ? { rotate: [0, 18, -14, 10, -6, 0] } : { rotate: 0 }} transition={{ duration: 0.7 }}>
        <path d="M6 9a6 6 0 0 1 12 0c0 6 2 7 2 7H4s2-1 2-7" />
        <motion.path d="M10 20a2 2 0 0 0 4 0" animate={on && !reduced ? { x: [0, -2, 2, -1, 0] } : { x: 0 }} transition={{ duration: 0.7 }} />
      </motion.g>
      <motion.circle cx="18" cy="5" r="3" fill="#ef4444" stroke="none" animate={{ scale: on ? 1 : 0 }} style={{ originX: 0.5, originY: 0.5 }} transition={useT()} />
    </Shell>
  );
}

/** Copy → check: the two sheets fold away and a check draws in. */
export function IconCopy({ label = "Copy", ...p }: IconProps) {
  const [on, set] = useState(false);
  const t = useT();
  return (
    <Shell on={on} onToggle={() => { set(true); setTimeout(() => set(false), 1400); }} label={label} className={cn(on && "text-emerald-500", p.className)} size={p.size}>
      <motion.g animate={{ opacity: on ? 0 : 1, scale: on ? 0.6 : 1 }} style={{ originX: 0.5, originY: 0.5 }} transition={t}>
        <rect x="9" y="9" width="11" height="11" rx="2" />
        <path d="M5 15V6a2 2 0 0 1 2-2h8" />
      </motion.g>
      <motion.path d="M5 12.5l4.5 4.5L19 7" initial={false} animate={{ pathLength: on ? 1 : 0, opacity: on ? 1 : 0 }} transition={{ duration: 0.35, delay: on ? 0.1 : 0 }} />
    </Shell>
  );
}

/** Sun ⇄ moon: rays retract and a mask circle slides in to carve the crescent. */
export function IconTheme({ label = "Toggle theme", ...p }: IconProps) {
  const [on, set] = useState(false);
  const t = useT();
  return (
    <Shell on={on} onToggle={() => set(!on)} label={label} {...p}>
      <mask id={`kn-moon-${label.replace(/\W/g, "")}`}>
        <rect width="24" height="24" fill="#fff" stroke="none" />
        <motion.circle r="6" fill="#000" stroke="none" animate={{ cx: on ? 17 : 30, cy: on ? 7 : -6 }} transition={t} />
      </mask>
      <motion.circle cx="12" cy="12" fill="currentColor" mask={`url(#kn-moon-${label.replace(/\W/g, "")})`} animate={{ r: on ? 8 : 4.5 }} transition={t} />
      <motion.g animate={{ rotate: on ? 90 : 0, opacity: on ? 0 : 1, scale: on ? 0.5 : 1 }} style={{ originX: 0.5, originY: 0.5 }} transition={t}>
        {Array.from({ length: 8 }, (_, i) => {
          const a = (i / 8) * Math.PI * 2;
          return <line key={i} x1={12 + Math.cos(a) * 7.5} y1={12 + Math.sin(a) * 7.5} x2={12 + Math.cos(a) * 9.5} y2={12 + Math.sin(a) * 9.5} />;
        })}
      </motion.g>
    </Shell>
  );
}

export const SvgIconSet = { Menu: IconMenu, Play: IconPlay, Heart: IconHeart, Bell: IconBell, Copy: IconCopy, Theme: IconTheme };
```

## Usage example
```tsx
"use client";
import { DemoCenter } from "@/components/kinetik/demo-helpers" /* or inline */;
import { IconBell, IconCopy, IconHeart, IconMenu, IconPlay, IconTheme } from "@/components/kinetik/svg-icon-set";

export default function Demo() {
  const items = [
    ["Menu", <IconMenu key="m" />],
    ["Play", <IconPlay key="p" />],
    ["Like", <IconHeart key="h" />],
    ["Bell", <IconBell key="b" />],
    ["Copy", <IconCopy key="c" />],
    ["Theme", <IconTheme key="t" />],
  ] as const;
  return (
    <DemoCenter className="flex-col gap-5">
      <div className="grid grid-cols-3 gap-3 sm:grid-cols-6">
        {items.map(([name, icon]) => (
          <div key={name} className="flex flex-col items-center gap-1.5 rounded-2xl border bg-card p-3">
            {icon}
            <span className="text-[11px] text-muted-foreground">{name}</span>
          </div>
        ))}
      </div>
      <p className="text-xs text-muted-foreground">Click each icon to toggle its state</p>
    </DemoCenter>
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
