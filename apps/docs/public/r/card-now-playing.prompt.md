You are given a task to integrate a component from the **kinetik** motion library into this codebase.

# Card — Now Playing (`card-now-playing`)

Mini player → full player. The compact pill (cover, title, live equaliser) expands in place into a full card — cover, title and play button are shared elements that fly to their new spots — with a scrubber and elapsed/remaining time.

## What it should do
Render either the pill or the full card inside a layout container; give cover, meta and play button the same layoutId in both so they animate between positions; tick the time while playing.

## Project requirements
- React 19 + TypeScript, Tailwind CSS v4, shadcn/ui-style CSS variables (`background`, `foreground`, `muted`, `muted-foreground`, `border`, `card`, `primary`, `ring`). If the project lacks shadcn, set it up first (`npx shadcn@latest init`).
- Animation engine: **motion**.
- Install dependencies: `npm i motion lucide-react`
- Put the component at `components/kinetik/card-now-playing.tsx`.
- `cn` lives at `lib/kinetik/utils.ts` (source below).
- Shared hooks go at `lib/kinetik/core.ts` (source below).

## Non-negotiables
- **Accessibility:** Pill is a button that expands; controls are labelled; seek is a native range input. Reduced motion skips the flight.
- **Performance:** Shared layoutIds for three elements; the equaliser is four transform animations.
- Respect `prefers-reduced-motion` (replace movement with opacity or an instant change).
- Animate only transform / opacity / filter / clip-path. No hard-coded theme colors — use CSS variables so it works in light and dark.

## Source — components/kinetik/card-now-playing.tsx
```tsx
"use client";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ChevronDown, Pause, Play, SkipBack, SkipForward } from "lucide-react";
import { cn, useReducedMotion } from "@/lib/kinetik/core";

export interface Track { title: string; artist: string; cover: string; duration: number }
export interface CardNowPlayingProps {
  track: Track;
  defaultExpanded?: boolean;
  className?: string;
}

const fmt = (s: number) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, "0")}`;

/**
 * Mini player → full player. The compact pill (cover, title, live equaliser) expands in place into a
 * full card — cover, title and controls are shared elements that fly to their new spots — with a
 * draggable scrubber and elapsed/remaining time. Collapse to tuck it back.
 */
export function CardNowPlaying({ track, defaultExpanded = false, className }: CardNowPlayingProps) {
  const reduced = useReducedMotion();
  const [open, setOpen] = useState(defaultExpanded);
  const [playing, setPlaying] = useState(true);
  const [t, setT] = useState(track.duration * 0.32);
  useEffect(() => {
    if (!playing) return;
    const id = setInterval(() => setT((x) => (x + 1) % track.duration), 1000);
    return () => clearInterval(id);
  }, [playing, track.duration]);
  const spring = reduced ? { duration: 0 } : { type: "spring" as const, stiffness: 300, damping: 30 };
  const PlayBtn = ({ big }: { big?: boolean }) => (
    <motion.button layoutId="np-play" transition={spring} type="button" aria-label={playing ? "Pause" : "Play"} onClick={(e) => (e.stopPropagation(), setPlaying(!playing))} className={cn("grid place-items-center rounded-full bg-white text-black", big ? "size-14" : "size-8")}>
      {playing ? <Pause className={big ? "size-6" : "size-4"} fill="currentColor" /> : <Play className={cn(big ? "size-6" : "size-4", "translate-x-px")} fill="currentColor" />}
    </motion.button>
  );

  return (
    <div className={cn("relative grid w-80 place-items-center", className)}>
      <motion.div layout transition={spring} className={cn("overflow-hidden bg-zinc-900 text-white shadow-2xl", open ? "w-80 rounded-[32px] p-5" : "w-72 rounded-full p-2 pr-3")}>
        {open ? (
          <div className="space-y-3.5">
            <button type="button" onClick={() => setOpen(false)} aria-label="Collapse player" className="mx-auto -mt-2 flex text-white/60 hover:text-white"><ChevronDown className="size-5" /></button>
            <motion.img layoutId="np-cover" transition={spring} src={track.cover} alt="" className="aspect-[5/4] w-full rounded-2xl object-cover shadow-lg" />
            <motion.div layoutId="np-meta" transition={spring}>
              <p className="text-lg font-semibold">{track.title}</p>
              <p className="text-sm text-white/60">{track.artist}</p>
            </motion.div>
            <div>
              <input type="range" min={0} max={track.duration} value={t} onChange={(e) => setT(+e.target.value)} aria-label="Seek" className="h-1 w-full cursor-pointer accent-white" />
              <div className="mt-1 flex justify-between font-mono text-[11px] text-white/50"><span>{fmt(t)}</span><span>-{fmt(track.duration - t)}</span></div>
            </div>
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: reduced ? 0 : 0.15 }} className="flex items-center justify-center gap-8">
              <button type="button" aria-label="Previous" onClick={() => setT(0)}><SkipBack className="size-6" fill="currentColor" /></button>
              <PlayBtn big />
              <button type="button" aria-label="Next" onClick={() => setT(0)}><SkipForward className="size-6" fill="currentColor" /></button>
            </motion.div>
          </div>
        ) : (
          <div role="button" tabIndex={0} aria-label={`Expand player: ${track.title}`} onClick={() => setOpen(true)} onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && (e.preventDefault(), setOpen(true))} className="flex cursor-pointer items-center gap-3">
            <motion.img layoutId="np-cover" transition={spring} src={track.cover} alt="" className="size-11 rounded-full object-cover" />
            <motion.div layoutId="np-meta" transition={spring} className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold">{track.title}</p>
              <p className="truncate text-xs text-white/60">{track.artist}</p>
            </motion.div>
            <Eq playing={playing && !reduced} />
            <PlayBtn />
          </div>
        )}
      </motion.div>
      <AnimatePresence>{!open && <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="mt-4 text-xs text-muted-foreground">Tap the player to expand</motion.p>}</AnimatePresence>
    </div>
  );
}

function Eq({ playing }: { playing: boolean }) {
  return (
    <span aria-hidden className="flex h-4 items-end gap-[3px]">
      {[0.6, 1, 0.4, 0.8].map((h, i) => (
        <motion.span key={i} className="w-[3px] rounded-full bg-emerald-400" animate={playing ? { height: ["30%", `${h * 100}%`, "45%", "90%", "30%"] } : { height: "30%" }} transition={{ duration: 1.1 + i * 0.17, repeat: Infinity, ease: "easeInOut" }} />
      ))}
    </span>
  );
}
```

## Usage example
```tsx
"use client";
import { DemoCenter, photos } from "@/components/kinetik/demo-helpers" /* or inline */;
import { CardNowPlaying } from "@/components/kinetik/card-now-playing";

export default function Demo() {
  return (
    <DemoCenter>
      <CardNowPlaying defaultExpanded track={{ title: "Low Tide Static", artist: "Marlowe & the Fern", cover: photos[2]!, duration: 214 }} />
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
