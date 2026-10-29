You are given a task to integrate a component from the **kinetik** motion library into this codebase.

# Spotlight Border Cards (`card-spotlight-border`)

Card borders light up near the cursor, and the glow flows continuously across neighbouring cards in the grid.

## What it should do
Build spotlight-border cards: each card is a 1px-padded wrapper (the border) containing an inner card. A single pointermove listener on the grid writes `--k-x/--k-y` relative to EVERY card, so a `radial-gradient(260px circle at var(--k-x) var(--k-y), color, transparent)` in each wrapper lights the borders continuously across neighbours; a fainter 10% gradient tints the inner surface. Fade in on grid hover; skip touch; hide under reduced motion.

## Project requirements
- React 19 + TypeScript, Tailwind CSS v4, shadcn/ui-style CSS variables (`background`, `foreground`, `muted`, `muted-foreground`, `border`, `card`, `primary`, `ring`). If the project lacks shadcn, set it up first (`npx shadcn@latest init`).
- Animation engine: **css**.
- No runtime dependencies (CSS only).
- Put the component at `components/kinetik/card-spotlight-border.tsx`.
- `cn` lives at `lib/kinetik/utils.ts` (source below).
- Shared hooks go at `lib/kinetik/core.ts` (source below).

## Non-negotiables
- **Accessibility:** Decorative glow; card content unchanged. Hidden under reduced motion; ignores touch.
- **Performance:** One grid-level pointer listener writes CSS vars per card; all rendering is CSS gradients.
- Respect `prefers-reduced-motion` (replace movement with opacity or an instant change).
- Animate only transform / opacity / filter / clip-path. No hard-coded theme colors — use CSS variables so it works in light and dark.

## Source — components/kinetik/card-spotlight-border.tsx
```tsx
"use client";
import { useRef, type ReactNode } from "react";
import { cn } from "@/lib/kinetik/core";

export interface SpotlightBorderGridProps {
  children: ReactNode;
  color?: string;
  className?: string;
}

/**
 * Wrap a grid of <SpotlightBorderCard>s: one pointer listener on the grid sets per-card CSS
 * variables so the border glow is continuous across neighbouring cards.
 */
export function SpotlightBorderGrid({ children, color = "rgb(168 85 247)", className }: SpotlightBorderGridProps) {
  const ref = useRef<HTMLDivElement>(null);
  const onMove = (e: React.PointerEvent) => {
    if (e.pointerType === "touch") return;
    ref.current?.querySelectorAll<HTMLElement>("[data-k-sb]").forEach((card) => {
      const r = card.getBoundingClientRect();
      card.style.setProperty("--k-x", `${e.clientX - r.left}px`);
      card.style.setProperty("--k-y", `${e.clientY - r.top}px`);
    });
  };
  return (
    <div ref={ref} onPointerMove={onMove} className={cn("group/sb", className)} style={{ "--k-sb-color": color } as React.CSSProperties}>
      {children}
    </div>
  );
}

export function SpotlightBorderCard({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div data-k-sb className={cn("relative rounded-2xl bg-border p-px", className)}>
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-[inherit] opacity-0 transition-opacity duration-300 group-hover/sb:opacity-100 motion-reduce:hidden"
        style={{ background: "radial-gradient(260px circle at var(--k-x) var(--k-y), var(--k-sb-color), transparent 70%)" }}
      />
      <div className="relative h-full overflow-hidden rounded-[calc(1rem-1px)] bg-card">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover/sb:opacity-100 motion-reduce:hidden"
          style={{ background: "radial-gradient(360px circle at var(--k-x) var(--k-y), color-mix(in oklab, var(--k-sb-color) 10%, transparent), transparent 70%)" }}
        />
        <div className="relative h-full">{children}</div>
      </div>
    </div>
  );
}
```

## Usage example
```tsx
"use client";
import { Gauge, Layers, ShieldCheck, Sparkles } from "lucide-react";
import { SpotlightBorderCard, SpotlightBorderGrid } from "@/components/kinetik/card-spotlight-border";

const features = [
  { icon: Sparkles, t: "AI prompts", d: "Every component ships a paste-ready prompt." },
  { icon: Gauge, t: "60fps", d: "Transforms and opacity only. Always." },
  { icon: ShieldCheck, t: "Accessible", d: "Reduced-motion fallbacks are tested." },
  { icon: Layers, t: "Engines", d: "CSS, Motion, GSAP, Lenis, R3F." },
];

export default function Demo() {
  return (
    <div className="flex h-full w-full items-center justify-center p-6">
      <SpotlightBorderGrid className="grid w-full max-w-xl grid-cols-2 gap-3">
        {features.map((f) => (
          <SpotlightBorderCard key={f.t}>
            <div className="p-5">
              <f.icon className="size-5 text-brand" />
              <p className="mt-3 font-semibold">{f.t}</p>
              <p className="mt-1 text-sm text-muted-foreground">{f.d}</p>
            </div>
          </SpotlightBorderCard>
        ))}
      </SpotlightBorderGrid>
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
