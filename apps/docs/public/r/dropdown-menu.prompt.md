You are given a task to integrate a component from the **kinetik** motion library into this codebase.

# Dropdown Menu (`dropdown-menu`)

Menu button with the full WAI-ARIA keyboard model — arrows, Home/End, type-ahead, Esc returns focus. The panel springs from the trigger's corner, items stagger in and a highlight pill glides between them.

## What it should do
Build an animated dropdown menu: a trigger with aria-haspopup/expanded, a role=menu panel (variants: hidden scale .92 → show with staggerChildren .025) whose items are menuitem or menuitemcheckbox. Track an active index for keyboard (arrows, Home/End, type-ahead, Enter/Space, Esc) and pointer hover; render a layoutId highlight under the active item. Close on outside pointerdown.

## Project requirements
- React 19 + TypeScript, Tailwind CSS v4, shadcn/ui-style CSS variables (`background`, `foreground`, `muted`, `muted-foreground`, `border`, `card`, `primary`, `ring`). If the project lacks shadcn, set it up first (`npx shadcn@latest init`).
- Animation engine: **motion**.
- Install dependencies: `npm i motion lucide-react`
- Put the component at `components/kinetik/dropdown-menu.tsx`.
- `cn` lives at `lib/kinetik/utils.ts` (source below).
- Shared hooks go at `lib/kinetik/core.ts` (source below).
- Motion tokens go at `lib/kinetik/tokens.ts` (source below). Use tokens instead of magic numbers.

## Non-negotiables
- **Accessibility:** menu / menuitem / menuitemcheckbox roles with aria-activedescendant; Esc and Tab close; focus returns to the trigger. Reduced motion: fades only.
- **Performance:** Panel mounts only while open; one layoutId highlight.
- Respect `prefers-reduced-motion` (replace movement with opacity or an instant change).
- Animate only transform / opacity / filter / clip-path. No hard-coded theme colors — use CSS variables so it works in light and dark.

## Source — components/kinetik/dropdown-menu.tsx
```tsx
"use client";
import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Check, ChevronDown } from "lucide-react";
import { spring } from "@/lib/kinetik/tokens";
import { cn, useReducedMotion } from "@/lib/kinetik/core";

export type DropdownItem =
  | { type?: "item"; label: string; icon?: ReactNode; shortcut?: string; danger?: boolean; onSelect?: () => void }
  | { type: "check"; label: string; checked: boolean; onCheckedChange: (v: boolean) => void }
  | { type: "separator" }
  | { type: "label"; label: string };

export interface DropdownMenuProps {
  trigger: ReactNode;
  items: DropdownItem[];
  align?: "start" | "end";
  className?: string;
}

/**
 * Menu button with the full WAI-ARIA keyboard model (arrows, Home/End, type-ahead, Esc returns
 * focus). The panel springs from the trigger's corner, items stagger in, and a highlight pill
 * glides between items as you hover or arrow through them.
 */
export function DropdownMenu({ trigger, items, align = "start", className }: DropdownMenuProps) {
  const reduced = useReducedMotion();
  const id = useId();
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(-1);
  const btn = useRef<HTMLButtonElement>(null);
  const menu = useRef<HTMLDivElement>(null);
  const focusable = items.map((it, i) => (it.type === "separator" || it.type === "label" ? -1 : i)).filter((i) => i >= 0);

  const close = (refocus = true) => {
    setOpen(false);
    setActive(-1);
    if (refocus) btn.current?.focus();
  };
  useEffect(() => {
    if (!open) return;
    menu.current?.focus();
    const down = (e: PointerEvent) => !menu.current?.contains(e.target as Node) && !btn.current?.contains(e.target as Node) && close(false);
    document.addEventListener("pointerdown", down);
    return () => document.removeEventListener("pointerdown", down);
  }, [open]);

  const select = (i: number) => {
    const it = items[i];
    if (!it) return;
    if (it.type === "check") it.onCheckedChange(!it.checked);
    else if (it.type !== "separator" && it.type !== "label") {
      it.onSelect?.();
      close();
    }
  };
  const move = (dir: 1 | -1) => {
    const pos = focusable.indexOf(active);
    setActive(focusable[(pos + dir + focusable.length) % focusable.length]);
  };
  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") (e.preventDefault(), move(1));
    else if (e.key === "ArrowUp") (e.preventDefault(), move(-1));
    else if (e.key === "Home") (e.preventDefault(), setActive(focusable[0]));
    else if (e.key === "End") (e.preventDefault(), setActive(focusable.at(-1)!));
    else if (e.key === "Enter" || e.key === " ") (e.preventDefault(), select(active));
    else if (e.key === "Escape" || e.key === "Tab") close(e.key === "Escape");
    else if (e.key.length === 1) {
      const hit = focusable.find((i) => { const it = items[i]; return "label" in it && it.label.toLowerCase().startsWith(e.key.toLowerCase()); });
      if (hit !== undefined) setActive(hit);
    }
  };

  return (
    <div className={cn("relative inline-block", className)}>
      <button
        ref={btn}
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={`${id}-menu`}
        onClick={() => (open ? close() : (setOpen(true), setActive(focusable[0])))}
        onKeyDown={(e) => e.key === "ArrowDown" && (e.preventDefault(), setOpen(true), setActive(focusable[0]))}
        className="inline-flex h-9 items-center gap-2 rounded-xl border border-border bg-background px-3 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        {trigger}
        <motion.span animate={{ rotate: open ? 180 : 0 }} transition={reduced ? { duration: 0 } : spring.snappy}>
          <ChevronDown className="size-4 text-muted-foreground" />
        </motion.span>
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            ref={menu}
            id={`${id}-menu`}
            role="menu"
            tabIndex={-1}
            aria-activedescendant={active >= 0 ? `${id}-i${active}` : undefined}
            onKeyDown={onKey}
            variants={{
              hidden: reduced ? { opacity: 0 } : { opacity: 0, scale: 0.92, y: -4 },
              show: { opacity: 1, scale: 1, y: 0, transition: reduced ? { duration: 0.1 } : { ...spring.snappy, staggerChildren: 0.025 } },
              exit: reduced ? { opacity: 0 } : { opacity: 0, scale: 0.96, transition: { duration: 0.12 } },
            }}
            initial="hidden"
            animate="show"
            exit="exit"
            style={{ transformOrigin: align === "end" ? "top right" : "top left" }}
            className={cn("absolute top-full z-50 mt-2 min-w-56 rounded-2xl border border-border bg-popover p-1.5 text-sm text-popover-foreground shadow-xl outline-none", align === "end" ? "right-0" : "left-0")}
          >
            {items.map((it, i) => {
              if (it.type === "separator") return <div key={i} role="separator" className="my-1 h-px bg-border" />;
              if (it.type === "label") return <p key={i} className="px-2.5 pb-1 pt-2 text-[11px] font-medium uppercase tracking-wider text-muted-foreground">{it.label}</p>;
              const isCheck = it.type === "check";
              return (
                <motion.div
                  key={i}
                  id={`${id}-i${i}`}
                  role={isCheck ? "menuitemcheckbox" : "menuitem"}
                  aria-checked={isCheck ? it.checked : undefined}
                  variants={reduced ? undefined : { hidden: { opacity: 0, y: -4 }, show: { opacity: 1, y: 0 } }}
                  onPointerEnter={() => setActive(i)}
                  onClick={() => select(i)}
                  className={cn("relative flex cursor-default select-none items-center gap-2.5 rounded-lg px-2.5 py-1.5", !isCheck && it.danger && "text-rose-500")}
                >
                  {active === i && <motion.span layoutId={`${id}-hl`} transition={reduced ? { duration: 0 } : spring.snappy} className="absolute inset-0 rounded-lg bg-muted" />}
                  <span className="relative grid size-4 place-items-center text-muted-foreground">
                    {isCheck ? (it.checked ? <Check className="size-4 text-foreground" /> : null) : it.icon}
                  </span>
                  <span className="relative flex-1">{it.label}</span>
                  {!isCheck && it.shortcut && <kbd className="relative font-sans text-xs text-muted-foreground">{it.shortcut}</kbd>}
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
```

## Usage example
```tsx
"use client";
import { useState } from "react";
import { Copy, Pencil, Share2, Trash2 } from "lucide-react";
import { DropdownMenu } from "@/components/kinetik/dropdown-menu";

export default function Demo() {
  const [grid, setGrid] = useState(true);
  const [last, setLast] = useState("—");
  return (
    <div className="flex h-full flex-col items-center gap-4 p-8 pt-10">
      <DropdownMenu
        trigger="Actions"
        items={[
          { type: "label", label: "File" },
          { label: "Rename", icon: <Pencil className="size-4" />, shortcut: "⌘R", onSelect: () => setLast("Rename") },
          { label: "Duplicate", icon: <Copy className="size-4" />, shortcut: "⌘D", onSelect: () => setLast("Duplicate") },
          { label: "Share", icon: <Share2 className="size-4" />, onSelect: () => setLast("Share") },
          { type: "separator" },
          { type: "check", label: "Show grid", checked: grid, onCheckedChange: setGrid },
          { type: "separator" },
          { label: "Delete", icon: <Trash2 className="size-4" />, danger: true, onSelect: () => setLast("Delete") },
        ]}
      />
      <p className="mt-auto text-xs text-muted-foreground" aria-live="polite">Last action: {last} · grid {grid ? "on" : "off"}</p>
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

## lib/kinetik/tokens.ts
```ts
/**
 * kinetik motion tokens — the single motion language shared by web (CSS / Motion / GSAP)
 * and native (Reanimated). Import tokens, never inline magic numbers.
 */

/** Durations in milliseconds. */
export const duration = {
  instant: 0,
  micro: 100,
  fast: 150,
  base: 220,
  moderate: 320,
  slow: 480,
  slower: 700,
  cinematic: 1200,
} as const;
export type DurationToken = keyof typeof duration;

/** Durations in seconds (Motion / GSAP use seconds). */
export const durationS = Object.fromEntries(
  Object.entries(duration).map(([k, v]) => [k, v / 1000]),
) as { [K in DurationToken]: number };

type Bezier = readonly [number, number, number, number];

/** Cubic-bezier control points (Motion accepts these arrays directly). */
export const easeBezier = {
  standard: [0.2, 0, 0, 1],
  enter: [0, 0, 0.2, 1],
  exit: [0.4, 0, 1, 1],
  emphasized: [0.2, 0, 0, 1],
  expoOut: [0.16, 1, 0.3, 1],
  backOut: [0.34, 1.56, 0.64, 1],
} as const satisfies Record<string, Bezier>;
export type EaseToken = keyof typeof easeBezier | "springCss" | "linear";

/** Spring-like easing in pure CSS via linear() (stiffness≈260, damping≈30). */
export const springCss =
  "linear(0, 0.009, 0.035 2.1%, 0.141 4.4%, 0.281 6.7%, 0.723 12.9%, 0.938 16.7%, 1.017 19.4%, 1.067, 1.099 24.3%, 1.108 26%, 1.100, 1.078 30.1%, 1.002 35.7%, 0.981 38.5%, 0.968 41.5%, 0.965 44.7%, 0.976 51.4%, 1.001 60%, 1.008 66.7%, 1.002 81%, 1)";

/** CSS easing strings. */
export const ease: Record<EaseToken, string> = {
  ...(Object.fromEntries(
    Object.entries(easeBezier).map(([k, v]) => [k, `cubic-bezier(${v.join(", ")})`]),
  ) as Record<keyof typeof easeBezier, string>),
  springCss,
  linear: "linear",
};

/** Matching GSAP ease names. */
export const gsapEase: Record<EaseToken, string> = {
  standard: "power3.out",
  enter: "power2.out",
  exit: "power2.in",
  emphasized: "power4.out",
  expoOut: "expo.out",
  backOut: "back.out(1.7)",
  springCss: "elastic.out(1, 0.6)",
  linear: "none",
};

/** Matching Anime.js v4 ease names. */
export const animeEase: Record<EaseToken, string> = {
  standard: "outCubic",
  enter: "outQuad",
  exit: "inQuad",
  emphasized: "outQuart",
  expoOut: "outExpo",
  backOut: "outBack(1.7)",
  springCss: "outElastic(1, .6)",
  linear: "linear",
};

export type SpringToken = "snappy" | "smooth" | "gentle" | "bouncy" | "heavy";

/** Spring presets — numbers are identical for Motion and Reanimated. */
export const springConfig: Record<SpringToken, { stiffness: number; damping: number; mass: number }> = {
  snappy: { stiffness: 500, damping: 35, mass: 1 },
  smooth: { stiffness: 260, damping: 30, mass: 1 },
  gentle: { stiffness: 120, damping: 20, mass: 1 },
  bouncy: { stiffness: 400, damping: 15, mass: 1 },
  heavy: { stiffness: 200, damping: 40, mass: 1.5 },
};

/** Ready-to-spread Motion transitions: `transition={spring.smooth}`. */
export const spring = Object.fromEntries(
  Object.entries(springConfig).map(([k, v]) => [k, { type: "spring" as const, ...v }]),
) as Record<SpringToken, { type: "spring"; stiffness: number; damping: number; mass: number }>;

/** Motion's perceptual equivalents ({ visualDuration, bounce }). */
export const springVisual: Record<SpringToken, { type: "spring"; visualDuration: number; bounce: number }> = {
  snappy: { type: "spring", visualDuration: 0.18, bounce: 0.05 },
  smooth: { type: "spring", visualDuration: 0.3, bounce: 0.1 },
  gentle: { type: "spring", visualDuration: 0.45, bounce: 0.15 },
  bouncy: { type: "spring", visualDuration: 0.3, bounce: 0.45 },
  heavy: { type: "spring", visualDuration: 0.5, bounce: 0 },
};

/** Reanimated `withSpring` configs (same physics). */
export const reanimatedSpring = springConfig;

export const distance = { xs: 4, sm: 8, md: 16, lg: 32, xl: 64 } as const;
export const stagger = { tight: 0.02, base: 0.05, loose: 0.1 } as const;
export const blur = { in: 8 } as const;
export const press = { scale: 0.97, hoverLift: -2 } as const;

/** CSS custom properties, e.g. for `:root`. */
export function toCssVars(): Record<string, string> {
  const vars: Record<string, string> = {};
  for (const [k, v] of Object.entries(duration)) vars[`--k-duration-${k}`] = `${v}ms`;
  for (const [k, v] of Object.entries(ease)) vars[`--k-ease-${k}`] = v;
  for (const [k, v] of Object.entries(distance)) vars[`--k-distance-${k}`] = `${v}px`;
  for (const [k, v] of Object.entries(stagger)) vars[`--k-stagger-${k}`] = `${v}s`;
  return vars;
}

export const tokens = { duration, durationS, ease, easeBezier, gsapEase, animeEase, spring, springConfig, springVisual, distance, stagger, blur, press };
export default tokens;
```

## Steps
1. Install the dependencies above.
2. Create the files exactly as given, fixing import aliases if the project doesn't use `@/`.
3. Drop the usage example into a page and adapt copy/colors to the project's design system.
4. Verify: toggle "Reduce motion" in OS settings — the component must still be fully usable.
