You are given a task to integrate a component from the **kinetik** motion library into this codebase.

# Spring Tooltip (`tooltip-animated`)

Tooltips that spring from their anchor (origin-aware), with hover delay, instant on keyboard focus and a quick exit.

## What it should do
Build a tooltip that springs in from its anchor: transform-origin at the anchor side, scale .85→1 and y 6→0 with a spring (500/30), fast 100ms exit. Hover opens after 300ms, focus opens instantly, blur/Esc/leave close. Inject aria-describedby into the trigger via cloneElement; role=tooltip; small rotated-square arrow.

## Project requirements
- React 19 + TypeScript, Tailwind CSS v4, shadcn/ui-style CSS variables (`background`, `foreground`, `muted`, `muted-foreground`, `border`, `card`, `primary`, `ring`). If the project lacks shadcn, set it up first (`npx shadcn@latest init`).
- Animation engine: **motion**.
- Install dependencies: `npm i motion`
- Put the component at `components/kinetik/tooltip-animated.tsx`.
- `cn` lives at `lib/kinetik/utils.ts` (source below).
- Shared hooks go at `lib/kinetik/core.ts` (source below).

## Non-negotiables
- **Accessibility:** role=tooltip wired with aria-describedby; opens on focus, closes on blur and Esc.
- **Performance:** Mounted only while open.
- Respect `prefers-reduced-motion` (replace movement with opacity or an instant change).
- Animate only transform / opacity / filter / clip-path. No hard-coded theme colors — use CSS variables so it works in light and dark.

## Source — components/kinetik/tooltip-animated.tsx
```tsx
"use client";
import { cloneElement, useId, useRef, useState, type ReactElement, type ReactNode } from "react";
import { AnimatePresence, motion } from "motion/react";
import { cn } from "@/lib/kinetik/core";

export interface TooltipAnimatedProps {
  content: ReactNode;
  children: ReactElement<Record<string, unknown>>;
  side?: "top" | "bottom";
  delay?: number;
  className?: string;
}

export function TooltipAnimated({ content, children, side = "top", delay = 300, className }: TooltipAnimatedProps) {
  const [open, setOpen] = useState(false);
  const id = useId();
  const t = useRef<ReturnType<typeof setTimeout>>(undefined);
  const show = () => {
    t.current = setTimeout(() => setOpen(true), delay);
  };
  const hide = () => {
    clearTimeout(t.current);
    setOpen(false);
  };
  const dy = side === "top" ? 6 : -6;
  return (
    <span className="relative inline-flex" onPointerEnter={show} onPointerLeave={hide} onFocus={() => setOpen(true)} onBlur={hide} onKeyDown={(e) => e.key === "Escape" && hide()}>
      {cloneElement(children, { "aria-describedby": open ? id : undefined })}
      <AnimatePresence>
        {open && (
          <motion.span
            id={id}
            role="tooltip"
            initial={{ opacity: 0, scale: 0.85, y: dy }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: dy / 2, transition: { duration: 0.1 } }}
            transition={{ type: "spring", stiffness: 500, damping: 30 }}
            className={cn(
              "pointer-events-none absolute left-1/2 z-50 -translate-x-1/2 whitespace-nowrap rounded-lg bg-foreground px-2.5 py-1.5 text-xs font-medium text-background shadow-lg",
              side === "top" ? "bottom-full mb-2 origin-bottom" : "top-full mt-2 origin-top",
              className,
            )}
          >
            {content}
            <span className={cn("absolute left-1/2 size-2 -translate-x-1/2 rotate-45 bg-foreground", side === "top" ? "-bottom-1" : "-top-1")} />
          </motion.span>
        )}
      </AnimatePresence>
    </span>
  );
}
```

## Usage example
```tsx
"use client";
import { Bold, Italic, Link2, Underline } from "lucide-react";
import { TooltipAnimated } from "@/components/kinetik/tooltip-animated";

export default function Demo() {
  const tools = [
    { icon: Bold, label: "Bold", k: "⌘B" },
    { icon: Italic, label: "Italic", k: "⌘I" },
    { icon: Underline, label: "Underline", k: "⌘U" },
    { icon: Link2, label: "Link", k: "⌘K" },
  ];
  return (
    <div className="flex h-full w-full items-center justify-center p-8">
      <div className="flex gap-1 rounded-xl border border-border bg-card p-1 shadow-sm">
        {tools.map((t) => (
          <TooltipAnimated key={t.label} content={<span className="flex gap-2">{t.label}<kbd className="opacity-60">{t.k}</kbd></span>}>
            <button aria-label={t.label} className="grid size-9 place-items-center rounded-lg hover:bg-accent focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"><t.icon className="size-4" /></button>
          </TooltipAnimated>
        ))}
      </div>
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
```

## Steps
1. Install the dependencies above.
2. Create the files exactly as given, fixing import aliases if the project doesn't use `@/`.
3. Drop the usage example into a page and adapt copy/colors to the project's design system.
4. Verify: toggle "Reduce motion" in OS settings — the component must still be fully usable.
