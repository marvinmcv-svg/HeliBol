You are given a task to integrate a component from the **kinetik** motion library into this codebase.

# Image Reveal Mask (`image-reveal-mask`)

Images wipe in with a clip-path curtain (up, left, center-out) while the photo settles from 1.25× zoom — editorial gallery feel.

## What it should do
Create an image reveal: wrapper starts at `clip-path: inset(100% 0 0 0)` (or left/center variants) and transitions to `inset(0)` over 1.1s with `cubic-bezier(.77,0,.18,1)` when it enters view, while the inner img scales 1.25→1 over 1.6s expo-out. IntersectionObserver sets data-in; reduced motion shows it immediately.

## Project requirements
- React 19 + TypeScript, Tailwind CSS v4, shadcn/ui-style CSS variables (`background`, `foreground`, `muted`, `muted-foreground`, `border`, `card`, `primary`, `ring`). If the project lacks shadcn, set it up first (`npx shadcn@latest init`).
- Animation engine: **css**.
- No runtime dependencies (CSS only).
- Put the component at `components/kinetik/image-reveal-mask.tsx`.
- `cn` lives at `lib/kinetik/utils.ts` (source below).
- Shared hooks go at `lib/kinetik/core.ts` (source below).

## Non-negotiables
- **Accessibility:** Real <img> with alt from the start; reduced motion shows images immediately.
- **Performance:** clip-path + scale transitions; IntersectionObserver toggles one attribute.
- Respect `prefers-reduced-motion` (replace movement with opacity or an instant change).
- Animate only transform / opacity / filter / clip-path. No hard-coded theme colors — use CSS variables so it works in light and dark.

## Source — components/kinetik/image-reveal-mask.tsx
```tsx
"use client";
import { useRef } from "react";
import { cn, useInView } from "@/lib/kinetik/core";

export interface ImageRevealMaskProps {
  src: string;
  alt: string;
  direction?: "up" | "left" | "center" | "diagonal";
  delay?: number;
  className?: string;
}

const css = `
.k-imgrev{clip-path:var(--k-from);transition:clip-path 1.1s cubic-bezier(.77,0,.18,1) var(--k-delay)}
.k-imgrev img{scale:1.25;transition:scale 1.6s cubic-bezier(.16,1,.3,1) var(--k-delay)}
.k-imgrev[data-in]{clip-path:inset(0 0 0 0)}
.k-imgrev[data-in] img{scale:1}
@media (prefers-reduced-motion:reduce){.k-imgrev,.k-imgrev img{transition:none;clip-path:none;scale:1}}
[data-reduce-motion] .k-imgrev,[data-reduce-motion] .k-imgrev img{transition:none!important;clip-path:none!important;scale:1!important}`;

const from = {
  up: "inset(100% 0 0 0)",
  left: "inset(0 100% 0 0)",
  center: "inset(50% 50% 50% 50% round 24px)",
  diagonal: "polygon(0 0, 0 0, 0 0, 0 0)",
};

export function ImageRevealMask({ src, alt, direction = "up", delay = 0, className }: ImageRevealMaskProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { amount: 0.2 });
  const fromValue = direction === "diagonal" ? from.diagonal : from[direction];
  return (
    <div
      ref={ref}
      data-in={inView ? "" : undefined}
      className={cn("k-imgrev overflow-hidden", className)}
      style={{ "--k-from": fromValue, "--k-delay": `${delay}s`, ...(direction === "diagonal" && inView ? { clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%)" } : {}) } as React.CSSProperties}
    >
      <style href="k-imgrev" precedence="kinetik">{css}</style>
      <img src={src} alt={alt} className="h-full w-full object-cover" />
    </div>
  );
}
```

## Usage example
```tsx
"use client";
import { DemoScroller, photoAlt, photos } from "@/components/kinetik/demo-helpers" /* or inline */;
import { ImageRevealMask } from "@/components/kinetik/image-reveal-mask";

export default function Demo() {
  const dirs = ["up", "left", "center", "up"] as const;
  return (
    <DemoScroller>
      <div className="grid grid-cols-2 gap-4 p-6 pt-2 pb-24">
        {photos.slice(0, 8).map((p, i) => (
          <ImageRevealMask key={p} src={p} alt={photoAlt[i]} direction={dirs[i % 4]} delay={(i % 2) * 0.12} className={`rounded-2xl ${i % 3 === 0 ? "aspect-[3/4]" : "aspect-square"}`} />
        ))}
      </div>
    </DemoScroller>
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
