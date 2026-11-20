You are given a task to integrate a component from the **kinetik** motion library into this codebase.

# Menu — 3D Push Drawer (`nav-drawer-3d`)

Mobile menu that pushes the page back in 3D: the page rotates on Y, slides right and scales down with rounded corners and a deep shadow, revealing a dark menu whose links slide in with a stagger.

## What it should do
Place the menu behind the page; on open animate the page to x 58%, rotateY −12°, scale .82, radius 28 with perspective on the parent; stagger links in; tap the page to close.

## Project requirements
- React 19 + TypeScript, Tailwind CSS v4, shadcn/ui-style CSS variables (`background`, `foreground`, `muted`, `muted-foreground`, `border`, `card`, `primary`, `ring`). If the project lacks shadcn, set it up first (`npx shadcn@latest init`).
- Animation engine: **motion**.
- Install dependencies: `npm i motion`
- Put the component at `components/kinetik/nav-drawer-3d.tsx`.
- `cn` lives at `lib/kinetik/utils.ts` (source below).
- Shared hooks go at `lib/kinetik/core.ts` (source below).

## Non-negotiables
- **Accessibility:** Menu is a nav landmark; closed menu and open page are inert; Esc closes and returns focus to the toggle. Reduced motion: slide only, no rotation.
- **Performance:** Transform-only animation on the page wrapper.
- Respect `prefers-reduced-motion` (replace movement with opacity or an instant change).
- Animate only transform / opacity / filter / clip-path. No hard-coded theme colors — use CSS variables so it works in light and dark.

## Source — components/kinetik/nav-drawer-3d.tsx
```tsx
"use client";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { motion } from "motion/react";
import { cn, useReducedMotion } from "@/lib/kinetik/core";

export interface NavDrawer3DProps {
  /** The page content that gets pushed back. */
  children: ReactNode;
  links: { label: string; href: string; icon?: ReactNode }[];
  footer?: ReactNode;
  defaultOpen?: boolean;
  className?: string;
}

/**
 * Mobile menu that pushes the page back in 3D: the page rotates on Y, slides right and scales down
 * with rounded corners and a shadow, revealing the menu underneath, whose links slide in with a
 * stagger. Tap the page (or Esc) to bring it back. The page is inert while the menu is open.
 */
export function NavDrawer3D({ children, links, footer, defaultOpen = false, className }: NavDrawer3DProps) {
  const reduced = useReducedMotion();
  const [open, setOpen] = useState(defaultOpen);
  const toggle = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    if (!open) return;
    const k = (e: KeyboardEvent) => e.key === "Escape" && (setOpen(false), toggle.current?.focus());
    document.addEventListener("keydown", k);
    return () => document.removeEventListener("keydown", k);
  }, [open]);
  const t = reduced ? { duration: 0 } : { type: "spring" as const, stiffness: 220, damping: 28 };

  return (
    <div className={cn("relative h-full overflow-hidden bg-zinc-950 text-white", className)} style={{ perspective: 1200 }}>
      <nav aria-label="Menu" aria-hidden={!open} className="absolute inset-y-0 left-0 flex w-[62%] flex-col justify-between p-6 pt-16" inert={!open}>
        <ul className="space-y-1">
          {links.map((l, i) => (
            <motion.li key={l.href} initial={false} animate={open ? { x: 0, opacity: 1 } : { x: reduced ? 0 : -24, opacity: 0 }} transition={{ ...t, delay: open && !reduced ? 0.12 + i * 0.05 : 0 }}>
              <a href={l.href} onClick={() => setOpen(false)} className="flex items-center gap-3 rounded-xl px-2 py-2.5 text-lg font-medium text-white/85 hover:bg-white/5 hover:text-white">
                {l.icon && <span className="text-white/50">{l.icon}</span>}
                {l.label}
              </a>
            </motion.li>
          ))}
        </ul>
        {footer && <motion.div initial={false} animate={{ opacity: open ? 1 : 0 }} transition={{ delay: open ? 0.35 : 0 }} className="text-xs text-white/50">{footer}</motion.div>}
      </nav>
      <motion.div
        className="relative h-full origin-left overflow-hidden bg-background text-foreground"
        initial={false}
        animate={open ? { x: "58%", rotateY: reduced ? 0 : -12, scale: reduced ? 1 : 0.82, borderRadius: 28, boxShadow: "-30px 0 60px rgb(0 0 0 / .5)" } : { x: 0, rotateY: 0, scale: 1, borderRadius: 0, boxShadow: "0 0 0 rgb(0 0 0 / 0)" }}
        transition={t}
        onClick={() => open && setOpen(false)}
      >
        <div inert={open} className="h-full">
          <button ref={toggle} type="button" onClick={(e) => (e.stopPropagation(), setOpen(true))} aria-expanded={open} aria-label="Open menu" className="absolute left-4 top-4 z-10 grid size-10 place-items-center rounded-full bg-foreground text-background">
            <span aria-hidden className="space-y-1"><span className="block h-0.5 w-4 bg-current" /><span className="block h-0.5 w-4 bg-current" /></span>
          </button>
          {children}
        </div>
      </motion.div>
    </div>
  );
}
```

## Usage example
```tsx
"use client";
import { Compass, Heart, Home, Settings, User } from "lucide-react";
import { DemoCenter, photos } from "@/components/kinetik/demo-helpers" /* or inline */;
import { NavDrawer3D } from "@/components/kinetik/nav-drawer-3d";

export default function Demo() {
  return (
    <DemoCenter>
      <div className="h-[460px] w-[300px] overflow-hidden rounded-[44px] border-[6px] border-zinc-800 shadow-2xl">
      <NavDrawer3D
        defaultOpen
        footer="Signed in as ava@studio.com"
        links={[
          { label: "Home", href: "#home", icon: <Home className="size-5" /> },
          { label: "Discover", href: "#discover", icon: <Compass className="size-5" /> },
          { label: "Saved", href: "#saved", icon: <Heart className="size-5" /> },
          { label: "Profile", href: "#profile", icon: <User className="size-5" /> },
          { label: "Settings", href: "#settings", icon: <Settings className="size-5" /> },
        ]}
      >
        <img src={photos[6]} alt="" className="h-1/2 w-full object-cover" />
        <div className="space-y-2 p-5 pt-4">
          <p className="text-xs uppercase tracking-widest text-muted-foreground">Today</p>
          <h3 className="text-2xl font-semibold tracking-tight">Ocean glass</h3>
          <p className="text-sm text-muted-foreground">Tap the page to close the menu.</p>
        </div>
      </NavDrawer3D>
      </div>
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
