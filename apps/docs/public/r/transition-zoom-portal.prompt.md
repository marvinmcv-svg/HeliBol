You are given a task to integrate a component from the **kinetik** motion library into this codebase.

# Zoom Portal Transition (`transition-zoom-portal`)

Cards that become pages: clicking a card zooms its image (shared layout) to fill the view while the other cards fall back and blur, then the article rises in. Back reverses into the card.

## What it should do
Build a zoom portal with Motion: cards with motion.img and title sharing layoutIds with a full-screen article's hero image and heading; open = render the article (AnimatePresence) so the image flies to the hero; the grid behind scales to .92, blurs and dims; content rises after .35 s; Back/Esc reverse.

## Project requirements
- React 19 + TypeScript, Tailwind CSS v4, shadcn/ui-style CSS variables (`background`, `foreground`, `muted`, `muted-foreground`, `border`, `card`, `primary`, `ring`). If the project lacks shadcn, set it up first (`npx shadcn@latest init`).
- Animation engine: **motion**.
- Install dependencies: `npm i motion lucide-react`
- Put the component at `components/kinetik/transition-zoom-portal.tsx`.
- `cn` lives at `lib/kinetik/utils.ts` (source below).
- Shared hooks go at `lib/kinetik/core.ts` (source below).

## Non-negotiables
- **Accessibility:** The page is a focusable article; Esc/Back return focus to the originating card; background cards aria-hidden while open. Reduced motion: instant swap.
- **Performance:** layoutId on image and title only.
- Respect `prefers-reduced-motion` (replace movement with opacity or an instant change).
- Animate only transform / opacity / filter / clip-path. No hard-coded theme colors — use CSS variables so it works in light and dark.

## Source — components/kinetik/transition-zoom-portal.tsx
```tsx
"use client";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { AnimatePresence, LayoutGroup, motion } from "motion/react";
import { ArrowLeft } from "lucide-react";
import { cn, useReducedMotion } from "@/lib/kinetik/core";

export interface PortalItem {
  id: string;
  title: string;
  kicker?: string;
  image: string;
  /** Full page content shown after zooming in. */
  page: ReactNode;
}

export interface TransitionZoomPortalProps {
  items: PortalItem[];
  className?: string;
}

/**
 * Cards that become pages: clicking a card zooms its image (shared layout) to fill the viewport
 * while the other cards fall back and blur, then the article content rises in beneath the hero.
 * Back (or Esc) reverses the zoom into the original card. Focus moves to the page and back.
 */
export function TransitionZoomPortal({ items, className }: TransitionZoomPortalProps) {
  const reduced = useReducedMotion();
  const [open, setOpen] = useState<string | null>(null);
  const lastCard = useRef<HTMLButtonElement | null>(null);
  const pageRef = useRef<HTMLDivElement>(null);
  const item = items.find((i) => i.id === open);
  const t = reduced ? { duration: 0 } : { type: "spring" as const, stiffness: 220, damping: 30 };

  useEffect(() => {
    if (!open) return lastCard.current?.focus();
    pageRef.current?.focus();
    const k = (e: KeyboardEvent) => e.key === "Escape" && setOpen(null);
    document.addEventListener("keydown", k);
    return () => document.removeEventListener("keydown", k);
  }, [open]);

  return (
    <LayoutGroup>
      <div className={cn("relative h-full overflow-hidden", className)}>
        <motion.ul
          className="grid h-full grid-cols-3 gap-3 p-4"
          animate={open && !reduced ? { scale: 0.92, filter: "blur(6px)", opacity: 0.4 } : { scale: 1, filter: "blur(0px)", opacity: 1 }}
          transition={{ duration: reduced ? 0 : 0.5, ease: [0.22, 1, 0.36, 1] }}
          aria-hidden={!!open}
        >
          {items.map((it) => (
            <li key={it.id} className="relative">
              <button
                type="button"
                onClick={(e) => ((lastCard.current = e.currentTarget), setOpen(it.id))}
                className="group relative block size-full overflow-hidden rounded-2xl text-left outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                {open !== it.id && <motion.img layoutId={`zp-img-${it.id}`} transition={t} src={it.image} alt="" className="absolute inset-0 size-full object-cover transition-transform duration-700 group-hover:scale-105" style={{ borderRadius: 16 }} />}
                <span className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                <span className="absolute inset-x-0 bottom-0 p-4 text-white">
                  {it.kicker && <span className="block text-[10px] uppercase tracking-[0.3em] text-white/70">{it.kicker}</span>}
                  <motion.span layoutId={`zp-title-${it.id}`} transition={t} className="block text-lg font-semibold leading-tight">{it.title}</motion.span>
                </span>
              </button>
            </li>
          ))}
        </motion.ul>
        <AnimatePresence>
          {item && (
            <motion.article ref={pageRef} tabIndex={-1} aria-label={item.title} className="absolute inset-0 z-10 overflow-y-auto bg-background outline-none" initial={{ backgroundColor: "rgb(0 0 0 / 0)" }} animate={{ backgroundColor: "var(--color-background)" }} exit={{ opacity: 0, transition: { duration: reduced ? 0 : 0.3, delay: reduced ? 0 : 0.1 } }}>
              <div className="relative h-[60%] min-h-56">
                <motion.img layoutId={`zp-img-${item.id}`} transition={t} src={item.image} alt="" className="absolute inset-0 size-full object-cover" style={{ borderRadius: 0 }} />
                <span className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                <button type="button" onClick={() => setOpen(null)} className="absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-full bg-black/40 px-3 py-1.5 text-sm text-white backdrop-blur hover:bg-black/60">
                  <ArrowLeft className="size-4" /> Back
                </button>
                <motion.h2 layoutId={`zp-title-${item.id}`} transition={t} className="absolute bottom-5 left-6 text-4xl font-semibold tracking-tight text-white">{item.title}</motion.h2>
              </div>
              <motion.div initial={reduced ? { opacity: 0 } : { opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0, transition: { delay: reduced ? 0 : 0.35, duration: 0.5 } }} exit={{ opacity: 0, transition: { duration: 0.15 } }} className="mx-auto max-w-xl p-6 text-sm leading-relaxed text-muted-foreground">
                {item.page}
              </motion.div>
            </motion.article>
          )}
        </AnimatePresence>
      </div>
    </LayoutGroup>
  );
}
```

## Usage example
```tsx
"use client";
import { photos } from "@/components/kinetik/demo-helpers" /* or inline */;
import { TransitionZoomPortal } from "@/components/kinetik/transition-zoom-portal";

const story = (place: string) => (
  <>
    <p>We arrived in {place} just before the light turned. Everything slowed down: the wind, the water, our footsteps.</p>
    <p className="mt-4">This is the kind of place that makes you put the camera down for a minute — and then pick it up again, because you know you&apos;ll want to remember exactly this.</p>
  </>
);

export default function Demo() {
  return (
    <TransitionZoomPortal
      items={[
        { id: "a", kicker: "Iceland", title: "Violet aurora", image: photos[5], page: story("Lofoten") },
        { id: "b", kicker: "Utah", title: "Amber road", image: photos[4], page: story("Utah") },
        { id: "c", kicker: "Azores", title: "Ocean glass", image: photos[6], page: story("the Azores") },
      ]}
    />
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
