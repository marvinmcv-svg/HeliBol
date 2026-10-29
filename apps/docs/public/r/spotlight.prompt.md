You are given a task to integrate a component from the **kinetik** motion library into this codebase.

# Cursor Spotlight (`spotlight`)

A soft radial light follows the pointer across a section — fades in on enter, out on leave.

## What it should do
Create a pointer spotlight section: onPointerMove writes `--k-x`/`--k-y` (pointer position relative to the element) and `--k-o: 1` as CSS variables; an aria-hidden absolute layer paints `radial-gradient(420px circle at var(--k-x) var(--k-y), color, transparent 70%)` with opacity var(--k-o) and a 500ms opacity transition. Skip touch pointers; hide under reduced motion.

## Project requirements
- React 19 + TypeScript, Tailwind CSS v4, shadcn/ui-style CSS variables (`background`, `foreground`, `muted`, `muted-foreground`, `border`, `card`, `primary`, `ring`). If the project lacks shadcn, set it up first (`npx shadcn@latest init`).
- Animation engine: **css**.
- No runtime dependencies (CSS only).
- Put the component at `components/kinetik/spotlight.tsx`.
- `cn` lives at `lib/kinetik/utils.ts` (source below).
- Shared hooks go at `lib/kinetik/core.ts` (source below).

## Non-negotiables
- **Accessibility:** Purely decorative and aria-hidden. Hidden under reduced motion; ignores touch pointers.
- **Performance:** Pointer handler sets CSS custom properties directly — no state, no re-render.
- Respect `prefers-reduced-motion` (replace movement with opacity or an instant change).
- Animate only transform / opacity / filter / clip-path. No hard-coded theme colors — use CSS variables so it works in light and dark.

## Source — components/kinetik/spotlight.tsx
```tsx
"use client";
import { useRef, type ReactNode } from "react";
import { cn } from "@/lib/kinetik/core";

export interface SpotlightProps {
  children: ReactNode;
  /** Radius of the light in px. */
  size?: number;
  color?: string;
  className?: string;
}

/** A soft light that follows the pointer across a section. Writes CSS variables — no React re-renders. */
export function Spotlight({ children, size = 420, color = "rgb(168 85 247 / .22)", className }: SpotlightProps) {
  const ref = useRef<HTMLDivElement>(null);
  const onMove = (e: React.PointerEvent) => {
    const el = ref.current;
    if (!el || e.pointerType === "touch") return;
    const r = el.getBoundingClientRect();
    el.style.setProperty("--k-x", `${e.clientX - r.left}px`);
    el.style.setProperty("--k-y", `${e.clientY - r.top}px`);
    el.style.setProperty("--k-o", "1");
  };
  return (
    <div
      ref={ref}
      onPointerMove={onMove}
      onPointerLeave={() => ref.current?.style.setProperty("--k-o", "0")}
      className={cn("relative isolate overflow-hidden", className)}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 transition-opacity duration-500 motion-reduce:hidden"
        style={{ opacity: "var(--k-o, 0)", background: `radial-gradient(${size}px circle at var(--k-x, 50%) var(--k-y, 50%), ${color}, transparent 70%)` }}
      />
      {children}
    </div>
  );
}
```

## Usage example
```tsx
import { Spotlight } from "@/components/kinetik/spotlight";

export default function Demo() {
  return (
    <Spotlight className="flex h-full w-full flex-col items-center justify-center gap-3 bg-[radial-gradient(circle_at_1px_1px,color-mix(in_oklab,var(--foreground)_12%,transparent)_1px,transparent_0)] [background-size:22px_22px] p-8 text-center">
      <p className="rounded-full border border-border bg-background/60 px-3 py-1 text-xs backdrop-blur">Move your cursor</p>
      <h2 className="max-w-md text-4xl font-semibold tracking-tight">Light follows intent.</h2>
      <p className="max-w-sm text-sm text-muted-foreground">A radial gradient driven by two CSS variables. Zero re-renders, disabled on touch.</p>
    </Spotlight>
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
