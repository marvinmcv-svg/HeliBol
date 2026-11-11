You are given a task to integrate a component from the **kinetik** motion library into this codebase.

# CustomWiggle Attention (`gsap-wiggle`)

Attention micro-interactions with CustomWiggle: a bell that rings, an input error shake, a jelly squash and a nudge — each always returns exactly to rest.

## What it should do
Register CustomEase + CustomWiggle. ring: rotation 0→22, origin 50% 8%, ease CustomWiggle.create('ring', { wiggles 7, type easeOut }); shake: x 0→10 uniform 6 wiggles .5s; jelly: scaleX→1.25 and scaleY→.8 easeOut wiggles offset 40ms; nudge: y→−8 anticipate. Fire on click/hover/trigger change.

## Project requirements
- React 19 + TypeScript, Tailwind CSS v4, shadcn/ui-style CSS variables (`background`, `foreground`, `muted`, `muted-foreground`, `border`, `card`, `primary`, `ring`). If the project lacks shadcn, set it up first (`npx shadcn@latest init`).
- Animation engine: **gsap**.
- Install dependencies: `npm i gsap @gsap/react`
- Put the component at `components/kinetik/gsap-wiggle.tsx`.
- `cn` lives at `lib/kinetik/utils.ts` (source below).
- Shared hooks go at `lib/kinetik/core.ts` (source below).

## Non-negotiables
- **Accessibility:** Wraps your own control; pair the error shake with aria-invalid + message. Reduced motion: a soft opacity pulse.
- **Performance:** One tween whose ease is the oscillation.
- Respect `prefers-reduced-motion` (replace movement with opacity or an instant change).
- Animate only transform / opacity / filter / clip-path. No hard-coded theme colors — use CSS variables so it works in light and dark.

## Source — components/kinetik/gsap-wiggle.tsx
```tsx
"use client";
import { useRef, type ReactNode } from "react";
import gsap from "gsap";
import { CustomEase } from "gsap/CustomEase";
import { CustomWiggle } from "gsap/CustomWiggle";
import { useGSAP } from "@gsap/react";
import { cn, useReducedMotion } from "@/lib/kinetik/core";

gsap.registerPlugin(CustomEase, CustomWiggle, useGSAP);

export type WiggleKind = "ring" | "shake" | "jelly" | "nudge";

export interface GsapWiggleProps {
  children: ReactNode;
  kind?: WiggleKind;
  /** Wiggle on hover as well as on click/`trigger` changes. */
  onHover?: boolean;
  /** Change this value to fire the wiggle programmatically (e.g. on validation error). */
  trigger?: unknown;
  className?: string;
}

const KINDS: Record<WiggleKind, (el: Element) => gsap.core.Tween | gsap.core.Timeline> = {
  // bell: rotation pivots from the top, decaying "easeOut" wiggle
  ring: (el) => gsap.fromTo(el, { rotation: 0 }, { rotation: 22, transformOrigin: "50% 8%", duration: 1, ease: CustomWiggle.create("kRing", { wiggles: 7, type: "easeOut" }) }),
  // error shake: x only, uniform intensity
  shake: (el) => gsap.fromTo(el, { x: 0 }, { x: 10, duration: 0.5, ease: CustomWiggle.create("kShake", { wiggles: 6, type: "uniform" }) }),
  // jelly: squash & stretch on two axes with offset timing
  jelly: (el) =>
    gsap
      .timeline()
      .fromTo(el, { scaleX: 1 }, { scaleX: 1.25, duration: 0.8, ease: CustomWiggle.create("kJellyX", { wiggles: 4, type: "easeOut" }) }, 0)
      .fromTo(el, { scaleY: 1 }, { scaleY: 0.8, duration: 0.8, ease: CustomWiggle.create("kJellyY", { wiggles: 4, type: "easeOut" }) }, 0.04),
  // nudge: small anticipation-y "look at me"
  nudge: (el) => gsap.fromTo(el, { y: 0 }, { y: -8, duration: 0.7, ease: CustomWiggle.create("kNudge", { wiggles: 3, type: "anticipate" }) }),
};

/**
 * Attention wiggles powered by CustomWiggle: a bell that rings, an error shake, a jelly
 * squash and a nudge — each one tween whose ease *is* the oscillation, so it always
 * returns exactly to rest. Fires on click, hover, or when `trigger` changes.
 */
export function GsapWiggle({ children, kind = "ring", onHover = false, trigger, className }: GsapWiggleProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const reduced = useReducedMotion();
  const first = useRef(true);

  const { contextSafe } = useGSAP(
    () => {
      if (first.current) {
        first.current = false;
        return;
      }
      play();
    },
    { scope: ref, dependencies: [trigger] },
  );

  const play = contextSafe(() => {
    if (!ref.current) return;
    if (reduced) {
      gsap.fromTo(ref.current, { opacity: 0.4 }, { opacity: 1, duration: 0.3 });
      return;
    }
    gsap.killTweensOf(ref.current);
    KINDS[kind](ref.current);
  });

  return (
    <span ref={ref} onClick={play} onPointerEnter={onHover ? play : undefined} className={cn("inline-block will-change-transform", className)}>
      {children}
    </span>
  );
}
```

## Usage example
```tsx
"use client";
import { useState } from "react";
import { Bell, Heart } from "lucide-react";
import { GsapWiggle } from "@/components/kinetik/gsap-wiggle";

export default function Demo() {
  const [errors, setErrors] = useState(0);
  const [email, setEmail] = useState("");
  return (
    <div className="flex h-full w-full flex-wrap items-center justify-center gap-10 p-6">
      <GsapWiggle kind="ring" onHover>
        <button aria-label="Notifications" className="relative grid size-14 place-items-center rounded-2xl border border-border bg-card shadow-sm">
          <Bell className="size-6" />
          <span className="absolute -right-1 -top-1 grid size-5 place-items-center rounded-full bg-rose-500 text-[10px] font-bold text-white">3</span>
        </button>
      </GsapWiggle>
      <form
        className="flex flex-col gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          if (!email.includes("@")) setErrors((n) => n + 1);
        }}
      >
        <GsapWiggle kind="shake" trigger={errors}>
          <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@studio.dev" aria-invalid={errors > 0 && !email.includes("@")} className="h-10 w-56 rounded-lg border border-border bg-background px-3 text-sm outline-none aria-[invalid=true]:border-rose-500" />
        </GsapWiggle>
        <button className="h-9 rounded-lg bg-foreground text-sm font-medium text-background">Subscribe (try empty)</button>
      </form>
      <GsapWiggle kind="jelly" onHover>
        <button className="rounded-full bg-gradient-to-r from-fuchsia-500 to-violet-600 px-6 py-3 text-sm font-semibold text-white shadow-lg">Jelly button</button>
      </GsapWiggle>
      <GsapWiggle kind="nudge" onHover>
        <button aria-label="Like" className="grid size-12 place-items-center rounded-full bg-rose-500/15 text-rose-500"><Heart className="size-5 fill-current" /></button>
      </GsapWiggle>
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
