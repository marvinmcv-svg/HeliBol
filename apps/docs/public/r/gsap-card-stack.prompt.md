You are given a task to integrate a component from the **kinetik** motion library into this codebase.

# Cycling Card Stack (`gsap-card-stack`)

A fanned deck: drag the top card away (or press Next/Space) and it arcs off then tucks in behind the pile while the rest step forward. Loops forever.

## What it should do
Keep order = [indices]; place(pos): y = pos·−14, scale 1 − pos·.06, rotation alternating ±pos·2.5, zIndex n−pos, hide beyond 4. Draggable top card; on release beyond 90px (or Next) tween it x ±260, y −40, rotate ±18, rotate order (first → last), place others (.6s), then send the card behind (zIndex 0) and tween it into the last slot.

## Project requirements
- React 19 + TypeScript, Tailwind CSS v4, shadcn/ui-style CSS variables (`background`, `foreground`, `muted`, `muted-foreground`, `border`, `card`, `primary`, `ring`). If the project lacks shadcn, set it up first (`npx shadcn@latest init`).
- Animation engine: **gsap**.
- Install dependencies: `npm i gsap @gsap/react`
- Put the component at `components/kinetik/gsap-card-stack.tsx`.
- `cn` lives at `lib/kinetik/utils.ts` (source below).
- Shared hooks go at `lib/kinetik/core.ts` (source below).

## Non-negotiables
- **Accessibility:** Focusable with Space/→ to advance and a visible Next button; only the top card is exposed to assistive tech.
- **Performance:** Positions recomputed from an order array; transforms only.
- Respect `prefers-reduced-motion` (replace movement with opacity or an instant change).
- Animate only transform / opacity / filter / clip-path. No hard-coded theme colors — use CSS variables so it works in light and dark.

## Source — components/kinetik/gsap-card-stack.tsx
```tsx
"use client";
import { useRef, type ReactNode } from "react";
import gsap from "gsap";
import { Draggable } from "gsap/Draggable";
import { useGSAP } from "@gsap/react";
import { cn, useReducedMotion } from "@/lib/kinetik/core";

gsap.registerPlugin(Draggable, useGSAP);

export interface GsapCardStackProps {
  cards: ReactNode[];
  className?: string;
}

/**
 * A fanned stack of cards. Drag the top card (or press Next / Space) and it arcs off, then
 * tucks in behind the deck; everyone else steps forward. Positions are computed from each
 * card's place in a rotating order array, so it loops forever.
 */
export function GsapCardStack({ cards, className }: GsapCardStackProps) {
  const root = useRef<HTMLDivElement>(null);
  const order = useRef<number[]>(cards.map((_, i) => i));
  const busy = useRef(false);
  const reduced = useReducedMotion();

  const place = (dur: number) => {
    const els = root.current!.querySelectorAll<HTMLElement>("[data-card]");
    order.current.forEach((cardIdx, pos) => {
      gsap.to(els[cardIdx], {
        x: 0,
        y: pos * -18,
        scale: 1 - pos * 0.06,
        rotation: pos === 0 ? 0 : (pos % 2 ? 1 : -1) * pos * 3.5,
        zIndex: cards.length - pos,
        opacity: pos > 3 ? 0 : 1,
        duration: dur,
        ease: "power3.out",
      });
      els[cardIdx].setAttribute("aria-hidden", pos === 0 ? "false" : "true");
    });
  };

  const { contextSafe } = useGSAP(
    () => {
      place(0);
      const els = root.current!.querySelectorAll<HTMLElement>("[data-card]");
      const ds = Draggable.create(els, {
        type: "x,y",
        onPress() {
          if (this.target !== els[order.current[0]]) this.endDrag(this.pointerEvent);
        },
        onDrag() {
          gsap.set(this.target, { rotation: this.x * 0.06 });
        },
        onRelease() {
          if (Math.hypot(this.x, this.y) > 90) cycle(Math.sign(this.x) || 1);
          else gsap.to(this.target, { x: 0, y: 0, rotation: 0, duration: 0.5, ease: "back.out(2)" });
        },
      });
      return () => ds.forEach((d) => d.kill());
    },
    { scope: root },
  );

  const cycle = contextSafe((dir = 1) => {
    if (busy.current) return;
    const els = root.current!.querySelectorAll<HTMLElement>("[data-card]");
    const top = els[order.current[0]];
    order.current = [...order.current.slice(1), order.current[0]];
    if (reduced) return place(0);
    busy.current = true;
    gsap
      .timeline({ onComplete: () => void (busy.current = false) })
      .to(top, { x: dir * 260, y: -40, rotation: dir * 18, duration: 0.35, ease: "power2.out" })
      .add(() => place(0.6))
      .set(top, { zIndex: 0 })
      .to(top, { x: 0, y: (cards.length - 1) * -18, rotation: 0, scale: 1 - (cards.length - 1) * 0.06, opacity: cards.length > 4 ? 0 : 1, duration: 0.6, ease: "power3.inOut" });
  });

  return (
    <div className={cn("flex flex-col items-center gap-6", className)}>
      <div
        ref={root}
        tabIndex={0}
        aria-label="Card stack — drag the top card or press Space"
        onKeyDown={(e) => {
          if (e.key === " " || e.key === "ArrowRight") {
            e.preventDefault();
            cycle(1);
          }
        }}
        className="relative h-80 w-60 outline-none"
      >
        {cards.map((c, i) => (
          <div key={i} data-card className="absolute inset-0 cursor-grab touch-none active:cursor-grabbing">
            {c}
          </div>
        ))}
      </div>
      <button onClick={() => cycle(1)} className="rounded-full border border-border px-4 py-1.5 text-sm hover:bg-accent">Next card</button>
    </div>
  );
}
```

## Usage example
```tsx
"use client";
import { photoAlt, photos } from "@/components/kinetik/demo-helpers" /* or inline */;
import { GsapCardStack } from "@/components/kinetik/gsap-card-stack";

export default function Demo() {
  return (
    <div className="grid h-full w-full place-items-center p-6 pt-14">
      <GsapCardStack
        cards={photos.slice(0, 6).map((p, i) => (
          <figure key={p} className="h-full overflow-hidden rounded-3xl border border-white/10 bg-card shadow-2xl">
            <img src={p} alt={photoAlt[i]} draggable={false} className="h-[78%] w-full object-cover" />
            <figcaption className="p-3">
              <p className="text-sm font-semibold">{photoAlt[i]}</p>
              <p className="text-xs text-muted-foreground">Print · 30×40 cm</p>
            </figcaption>
          </figure>
        ))}
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
