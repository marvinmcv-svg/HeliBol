You are given a task to integrate a component from the **kinetik** motion library into this codebase.

# Shared Element (View Transitions) (`vt-shared-element`)

A card's image and title morph into a detail view using the native View Transitions API — the web's answer to iOS hero transitions.

## What it should do
Implement a gallery → detail "shared element" transition using the native View Transitions API: give each card's image and title a unique `view-transition-name`, give the detail view's image/title the same names, and wrap the state change in `document.startViewTransition(() => flushSync(update))`.

Keep: a reusable `withViewTransition(update)` helper with fallback (no VT support or reduced motion → plain update), focus moved into the detail view, and names unique per item.

## Project requirements
- React 19 + TypeScript, Tailwind CSS v4, shadcn/ui-style CSS variables (`background`, `foreground`, `muted`, `muted-foreground`, `border`, `card`, `primary`, `ring`). If the project lacks shadcn, set it up first (`npx shadcn@latest init`).
- Animation engine: **view-transitions**.
- No runtime dependencies (CSS only).
- Put the component at `components/kinetik/vt-shared-element.tsx`.
- `cn` lives at `lib/kinetik/utils.ts` (source below).
- Shared hooks go at `lib/kinetik/core.ts` (source below).

## Non-negotiables
- **Accessibility:** Real buttons; focus moves to Back when detail opens. Unsupported browsers or reduced motion get an instant swap.
- **Performance:** Browser snapshots and composites; zero JS animation cost. Unique view-transition-name per element.
- Respect `prefers-reduced-motion` (replace movement with opacity or an instant change).
- Animate only transform / opacity / filter / clip-path. No hard-coded theme colors — use CSS variables so it works in light and dark.

## Source — components/kinetik/vt-shared-element.tsx
```tsx
"use client";
import { useState, type ReactNode } from "react";
import { flushSync } from "react-dom";
import { cn, prefersReducedMotion } from "@/lib/kinetik/core";

/** Run a state update inside a View Transition (falls back to a plain update). */
export function withViewTransition(update: () => void) {
  if (typeof document === "undefined" || !document.startViewTransition || prefersReducedMotion()) return update();
  document.startViewTransition(() => flushSync(update));
}

export interface SharedItem {
  id: string;
  title: string;
  subtitle?: string;
  image: string;
  body?: ReactNode;
}

export interface VtSharedElementProps {
  items: SharedItem[];
  className?: string;
}

/** Card grid → detail view where image and title morph between states via `view-transition-name`. */
export function VtSharedElement({ items, className }: VtSharedElementProps) {
  const [openId, setOpenId] = useState<string | null>(null);
  const open = items.find((i) => i.id === openId);
  const vt = (id: string, part: string) => ({ viewTransitionName: `k-${part}-${id}` }) as React.CSSProperties;

  if (open) {
    return (
      <article className={cn("flex h-full flex-col overflow-auto", className)}>
        <div className="relative aspect-[16/9] w-full shrink-0 overflow-hidden" style={vt(open.id, "img")}>
          <img src={open.image} alt="" className="h-full w-full object-cover" />
        </div>
        <div className="space-y-3 p-6">
          <h3 className="text-2xl font-semibold tracking-tight" style={vt(open.id, "title")}>{open.title}</h3>
          <p className="text-sm text-muted-foreground">{open.subtitle}</p>
          <div className="text-sm leading-relaxed">{open.body}</div>
          <button
            autoFocus
            onClick={() => withViewTransition(() => setOpenId(null))}
            className="rounded-lg border border-border px-3 py-1.5 text-sm font-medium hover:bg-accent"
          >
            ← Back
          </button>
        </div>
      </article>
    );
  }

  return (
    <ul className={cn("grid grid-cols-2 gap-3 p-4 sm:grid-cols-3", className)}>
      {items.map((item) => (
        <li key={item.id}>
          <button
            onClick={() => withViewTransition(() => setOpenId(item.id))}
            className="group w-full overflow-hidden rounded-xl border border-border bg-card text-left transition-shadow hover:shadow-lg"
          >
            <div className="aspect-[4/3] overflow-hidden" style={vt(item.id, "img")}>
              <img src={item.image} alt="" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
            </div>
            <p className="p-3 text-sm font-medium" style={vt(item.id, "title")}>{item.title}</p>
          </button>
        </li>
      ))}
    </ul>
  );
}
```

## Usage example
```tsx
"use client";
import { photoAlt, photos } from "@/components/kinetik/demo-helpers" /* or inline */;
import { VtSharedElement } from "@/components/kinetik/vt-shared-element";

const items = photos.slice(0, 6).map((image, i) => ({
  id: String(i),
  title: photoAlt[i],
  subtitle: "Collection · 2026",
  image,
  body: "The thumbnail and title morph into the hero position using the browser's native View Transitions — no animation library, no layout measuring.",
}));

export default function Demo() {
  return <VtSharedElement items={items} className="h-full" />;
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
