You are given a task to integrate a component from the **kinetik** motion library into this codebase.

# Circle Reveal Menu (`nav-circle-reveal`)

Full-screen menu that pours out of the menu button: a clip-path circle expands from the button's centre, huge links rise from behind a mask with stagger, and hovering a link cross-fades its preview image.

## What it should do
Build a circle-reveal menu with Motion: measure the button centre, animate a full-screen nav's clipPath from circle(0% at btn) to circle(150% at btn) with ease [.76,0,.24,1]; link text rises from y:110% inside overflow-hidden lines with stagger; hovering shows that link's image (multiply blend) crossfading; exit reverses.

## Project requirements
- React 19 + TypeScript, Tailwind CSS v4, shadcn/ui-style CSS variables (`background`, `foreground`, `muted`, `muted-foreground`, `border`, `card`, `primary`, `ring`). If the project lacks shadcn, set it up first (`npx shadcn@latest init`).
- Animation engine: **motion**.
- Install dependencies: `npm i motion`
- Put the component at `components/kinetik/nav-circle-reveal.tsx`.
- `cn` lives at `lib/kinetik/utils.ts` (source below).
- Shared hooks go at `lib/kinetik/core.ts` (source below).

## Non-negotiables
- **Accessibility:** Toggle with aria-expanded; Esc closes and returns focus; links are real anchors. Reduced motion: fade.
- **Performance:** clip-path animation on one layer; images mount on hover only.
- Respect `prefers-reduced-motion` (replace movement with opacity or an instant change).
- Animate only transform / opacity / filter / clip-path. No hard-coded theme colors — use CSS variables so it works in light and dark.

## Source — components/kinetik/nav-circle-reveal.tsx
```tsx
"use client";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { cn, useReducedMotion } from "@/lib/kinetik/core";

export interface NavCircleRevealLink {
  label: string;
  href: string;
  image?: string;
}

export interface NavCircleRevealProps {
  links: NavCircleRevealLink[];
  /** Small print in the menu footer. */
  footer?: string;
  /** Start open (for previews). */
  defaultOpen?: boolean;
  className?: string;
}

/**
 * Full-screen menu that pours out of the menu button: a clip-path circle expands from the button's
 * centre, huge links rise in from behind a mask with stagger, and hovering a link cross-fades its
 * preview image behind the list. Closing reverses into the button. Esc closes and focus returns.
 */
export function NavCircleReveal({ links, footer = "hello@studio.com", defaultOpen = false, className }: NavCircleRevealProps) {
  const reduced = useReducedMotion();
  const [open, setOpen] = useState(defaultOpen);
  const [hover, setHover] = useState<number | null>(null);
  const [origin, setOrigin] = useState("calc(100% - 40px) 40px");
  const btn = useRef<HTMLButtonElement>(null);
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const k = (e: KeyboardEvent) => e.key === "Escape" && (setOpen(false), btn.current?.focus());
    document.addEventListener("keydown", k);
    return () => document.removeEventListener("keydown", k);
  }, [open]);

  const toggle = () => {
    const b = btn.current?.getBoundingClientRect(), r = root.current?.getBoundingClientRect();
    if (b && r) setOrigin(`${b.left - r.left + b.width / 2}px ${b.top - r.top + b.height / 2}px`);
    setOpen((o) => !o);
  };
  const ease = [0.76, 0, 0.24, 1] as const;

  return (
    <div ref={root} className={cn("relative h-full w-full overflow-hidden", className)}>
      <AnimatePresence>
        {open && (
          <motion.nav
            aria-label="Main"
            initial={reduced ? { opacity: 0 } : { clipPath: `circle(0% at ${origin})` }}
            animate={reduced ? { opacity: 1 } : { clipPath: `circle(150% at ${origin})` }}
            exit={reduced ? { opacity: 0 } : { clipPath: `circle(0% at ${origin})`, transition: { duration: 0.6, ease, delay: 0.15 } }}
            transition={{ duration: reduced ? 0.15 : 0.8, ease }}
            className="absolute inset-0 z-20 flex flex-col justify-between bg-[#e8ff5a] p-8 text-zinc-900"
          >
            <AnimatePresence>
              {hover !== null && links[hover]?.image && (
                <motion.img key={hover} src={links[hover].image} alt="" initial={{ opacity: 0, scale: 1.08 }} animate={{ opacity: 0.35, scale: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.45 }} className="pointer-events-none absolute right-8 top-1/2 hidden h-2/3 -translate-y-1/2 rounded-2xl object-cover mix-blend-multiply sm:block sm:w-2/5" />
              )}
            </AnimatePresence>
            <ul className="relative mt-10 space-y-1">
              {links.map((l, i) => (
                <li key={l.href} className="overflow-hidden">
                  <motion.a
                    href={l.href}
                    onClick={() => setOpen(false)}
                    onPointerEnter={() => setHover(i)}
                    onPointerLeave={() => setHover(null)}
                    onFocus={() => setHover(i)}
                    initial={reduced ? { opacity: 0 } : { y: "110%" }}
                    animate={reduced ? { opacity: 1 } : { y: 0 }}
                    exit={reduced ? { opacity: 0 } : { y: "110%", transition: { duration: 0.35, ease, delay: (links.length - i) * 0.03 } }}
                    transition={{ duration: reduced ? 0.15 : 0.7, ease, delay: reduced ? 0 : 0.25 + i * 0.06 }}
                    className="group flex items-baseline gap-4 text-[clamp(2.4rem,8vw,4.5rem)] font-semibold leading-[1.05] tracking-tight outline-none"
                  >
                    <span className="text-xs font-medium tabular-nums opacity-50">0{i + 1}</span>
                    <span className="transition-transform duration-300 group-hover:translate-x-3 group-focus-visible:translate-x-3 group-focus-visible:underline motion-reduce:transition-none">{l.label}</span>
                  </motion.a>
                </li>
              ))}
            </ul>
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1, transition: { delay: reduced ? 0 : 0.6 } }} exit={{ opacity: 0 }} className="relative text-sm">{footer}</motion.p>
          </motion.nav>
        )}
      </AnimatePresence>
      <button
        ref={btn}
        type="button"
        onClick={toggle}
        aria-expanded={open}
        className={cn("absolute right-5 top-5 z-30 flex h-11 items-center gap-2 rounded-full px-4 text-sm font-semibold transition-colors", open ? "bg-zinc-900 text-[#e8ff5a]" : "bg-foreground text-background")}
      >
        {open ? "Close" : "Menu"}
        <span aria-hidden className="relative block h-2.5 w-4">
          <motion.span className="absolute left-0 h-0.5 w-full rounded bg-current" animate={open ? { top: "40%", rotate: 45 } : { top: "0%", rotate: 0 }} transition={{ duration: reduced ? 0 : 0.3 }} />
          <motion.span className="absolute left-0 h-0.5 w-full rounded bg-current" animate={open ? { top: "40%", rotate: -45 } : { top: "80%", rotate: 0 }} transition={{ duration: reduced ? 0 : 0.3 }} />
        </span>
      </button>
    </div>
  );
}
```

## Usage example
```tsx
"use client";
import { photos } from "@/components/kinetik/demo-helpers" /* or inline */;
import { NavCircleReveal } from "@/components/kinetik/nav-circle-reveal";

export default function Demo() {
  return (
    <div className="relative h-full">
      <div className="absolute inset-0 grid place-items-center p-8 text-center">
        <div>
          <p className="text-sm font-semibold">Studio Halo</p>
          <h3 className="mt-2 text-4xl font-semibold tracking-tight">Open the menu →</h3>
        </div>
      </div>
      <NavCircleReveal
        defaultOpen
        links={[
          { label: "Work", href: "#work", image: photos[2] },
          { label: "Studio", href: "#studio", image: photos[0] },
          { label: "Journal", href: "#journal", image: photos[5] },
          { label: "Contact", href: "#contact", image: photos[6] },
        ]}
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
