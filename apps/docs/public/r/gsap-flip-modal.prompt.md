You are given a task to integrate a component from the **kinetik** motion library into this codebase.

# Flip Grid Modal (`gsap-flip-modal`)

Click a thumbnail and the very same image node flies from the grid into a product dialog (Flip), text staggers in; closing flies it back home.

## What it should do
On open: state = Flip.getState(thumb); render the dialog; append the thumb into the dialog's slot; Flip.from(state, { duration .7, power3.inOut, scale, zIndex 60 }); stagger the text in. On close: state = getState; append back into its grid button; Flip.from(state, … onComplete: unmount dialog).

## Project requirements
- React 19 + TypeScript, Tailwind CSS v4, shadcn/ui-style CSS variables (`background`, `foreground`, `muted`, `muted-foreground`, `border`, `card`, `primary`, `ring`). If the project lacks shadcn, set it up first (`npx shadcn@latest init`).
- Animation engine: **gsap**.
- Install dependencies: `npm i gsap @gsap/react lucide-react`
- Put the component at `components/kinetik/gsap-flip-modal.tsx`.
- `cn` lives at `lib/kinetik/utils.ts` (source below).
- Shared hooks go at `lib/kinetik/core.ts` (source below).

## Non-negotiables
- **Accessibility:** Dialog has role=dialog, aria-modal, focus moves to Close, Esc and backdrop close it.
- **Performance:** Single node re-parented; Flip.from with scale.
- Respect `prefers-reduced-motion` (replace movement with opacity or an instant change).
- Animate only transform / opacity / filter / clip-path. No hard-coded theme colors — use CSS variables so it works in light and dark.

## Source — components/kinetik/gsap-flip-modal.tsx
```tsx
"use client";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { Flip } from "gsap/Flip";
import { useGSAP } from "@gsap/react";
import { X } from "lucide-react";
import { cn, useReducedMotion } from "@/lib/kinetik/core";

gsap.registerPlugin(Flip, useGSAP);

export interface FlipModalItem {
  id: string;
  image: string;
  title: string;
  body: string;
}

export interface GsapFlipModalProps {
  items: FlipModalItem[];
  className?: string;
}

/**
 * Grid → modal with GSAP Flip: the clicked thumbnail is physically moved into the dialog
 * (same DOM node), and Flip.from animates it from the grid cell to its modal box; closing
 * reverses it back into its slot. Text and backdrop fade around the move.
 */
export function GsapFlipModal({ items, className }: GsapFlipModalProps) {
  const root = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState<FlipModalItem | null>(null);
  const reduced = useReducedMotion();
  const closeBtn = useRef<HTMLButtonElement>(null);
  const { contextSafe } = useGSAP({ scope: root });

  const show = contextSafe((it: FlipModalItem) => {
    const thumb = root.current!.querySelector<HTMLElement>(`[data-thumb="${it.id}"]`)!;
    const state = Flip.getState(thumb);
    setOpen(it);
    requestAnimationFrame(() => {
      const slot = root.current!.querySelector<HTMLElement>("[data-modal-slot]")!;
      slot.appendChild(thumb);
      gsap.fromTo(root.current!.querySelector("[data-backdrop]"), { opacity: 0 }, { opacity: 1, duration: reduced ? 0 : 0.4 });
      if (!reduced) {
        Flip.from(state, { duration: 0.7, ease: "power3.inOut", scale: true, zIndex: 60 });
        gsap.fromTo(root.current!.querySelectorAll("[data-modal-text] > *"), { y: 20, opacity: 0 }, { y: 0, opacity: 1, stagger: 0.06, delay: 0.35, duration: 0.5 });
      }
      closeBtn.current?.focus();
    });
  });

  const hide = contextSafe(() => {
    if (!open) return;
    const thumb = root.current!.querySelector<HTMLElement>(`[data-thumb="${open.id}"]`)!;
    const home = root.current!.querySelector<HTMLElement>(`[data-home="${open.id}"]`)!;
    const state = Flip.getState(thumb);
    home.appendChild(thumb);
    const done = () => setOpen(null);
    if (reduced) return done();
    gsap.to(root.current!.querySelector("[data-backdrop]"), { opacity: 0, duration: 0.4 });
    Flip.from(state, { duration: 0.6, ease: "power3.inOut", scale: true, zIndex: 60, onComplete: done });
  });

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && hide();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, hide]);

  return (
    <div ref={root} className={cn("relative", className)}>
      <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
        {items.map((it) => (
          <button key={it.id} data-home={it.id} onClick={() => show(it)} aria-label={`Open ${it.title}`} className="aspect-square overflow-hidden rounded-xl bg-muted">
            <img data-thumb={it.id} src={it.image} alt="" className="h-full w-full rounded-xl object-cover" />
          </button>
        ))}
      </div>
      {open && (
        <div className="absolute inset-0 z-50 grid place-items-center p-2" role="dialog" aria-modal="true" aria-label={open.title}>
          <div data-backdrop className="absolute inset-0 rounded-2xl bg-background/80 backdrop-blur-sm" onClick={hide} />
          <div className="relative grid w-full max-w-xl grid-cols-[1.2fr_1fr] gap-4 rounded-2xl border border-border bg-card p-3 shadow-2xl">
            <div data-modal-slot className="aspect-[4/5] overflow-hidden rounded-xl" />
            <div data-modal-text className="flex flex-col py-2 pr-2">
              <p className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground">Print</p>
              <h3 className="mt-1 text-2xl font-semibold tracking-tight">{open.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{open.body}</p>
              <button className="mt-auto rounded-full bg-foreground px-4 py-2 text-sm font-medium text-background">Add to bag — $64</button>
            </div>
            <button ref={closeBtn} onClick={hide} aria-label="Close" className="absolute right-2 top-2 grid size-8 place-items-center rounded-full bg-background/80 hover:bg-accent">
              <X className="size-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
```

## Usage example
```tsx
"use client";
import { photoAlt, photos } from "@/components/kinetik/demo-helpers" /* or inline */;
import { GsapFlipModal } from "@/components/kinetik/gsap-flip-modal";

export default function Demo() {
  return (
    <div className="h-full w-full p-6">
      <p className="mb-3 text-xs uppercase tracking-[0.25em] text-muted-foreground">Gallery — click any print</p>
      <GsapFlipModal
        className="h-[calc(100%-2rem)]"
        items={photos.map((p, i) => ({ id: `m${i}`, image: p, title: photoAlt[i], body: "Giclée print on 310gsm cotton rag. The same image node flies from the grid into this dialog — and back home when you close it." }))}
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
