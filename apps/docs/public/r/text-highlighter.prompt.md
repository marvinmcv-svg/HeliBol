You are given a task to integrate a component from the **kinetik** motion library into this codebase.

# Marker Highlight (`text-highlighter`)

A highlighter-pen stroke or underline draws behind key phrases when they come into view. Wraps across lines.

## What it should do
Create an inline highlighter: a `<mark>` whose background (a solid linear-gradient) grows from 0% to 100% width with an expo-out transition when it enters view, wrapping correctly across lines via `box-decoration-break: clone`.

Keep: marker (88% height, offset low) and underline (0.18em at bottom) variants, IntersectionObserver toggling a `data-in` attribute, CSS transition only, reduced motion = instant.

## Project requirements
- React 19 + TypeScript, Tailwind CSS v4, shadcn/ui-style CSS variables (`background`, `foreground`, `muted`, `muted-foreground`, `border`, `card`, `primary`, `ring`). If the project lacks shadcn, set it up first (`npx shadcn@latest init`).
- Animation engine: **css**.
- No runtime dependencies (CSS only).
- Put the component at `components/kinetik/text-highlighter.tsx`.
- `cn` lives at `lib/kinetik/utils.ts` (source below).
- Shared hooks go at `lib/kinetik/core.ts` (source below).

## Non-negotiables
- **Accessibility:** Uses semantic <mark>. Reduced motion: highlight appears instantly.
- **Performance:** background-size transition; IntersectionObserver toggles one attribute.
- Respect `prefers-reduced-motion` (replace movement with opacity or an instant change).
- Animate only transform / opacity / filter / clip-path. No hard-coded theme colors — use CSS variables so it works in light and dark.

## Source — components/kinetik/text-highlighter.tsx
```tsx
"use client";
import { useRef, type ReactNode } from "react";
import { cn, useInView } from "@/lib/kinetik/core";

export interface TextHighlighterProps {
  children: ReactNode;
  variant?: "marker" | "underline";
  color?: string;
  delay?: number;
  duration?: number;
  className?: string;
}

const css = `
.k-hl{background-repeat:no-repeat;background-size:0% var(--k-hl-h);background-position:0 var(--k-hl-y);transition:background-size var(--k-hl-d) cubic-bezier(.16,1,.3,1) var(--k-hl-delay);padding:0 .1em;margin:0 -.1em;-webkit-box-decoration-break:clone;box-decoration-break:clone}
.k-hl[data-in]{background-size:100% var(--k-hl-h)}
@media (prefers-reduced-motion:reduce){.k-hl{transition:none}}
[data-reduce-motion] .k-hl{transition:none}`;

export function TextHighlighter({ children, variant = "marker", color = "rgb(250 204 21 / .55)", delay = 0, duration = 0.9, className }: TextHighlighterProps) {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { amount: 0.8 });
  return (
    <>
      <style href="k-hl" precedence="kinetik">{css}</style>
      <mark
        ref={ref}
        data-in={inView ? "" : undefined}
        className={cn("k-hl rounded-sm bg-transparent text-inherit", className)}
        style={
          {
            backgroundImage: `linear-gradient(${color},${color})`,
            "--k-hl-h": variant === "marker" ? "88%" : "0.18em",
            "--k-hl-y": variant === "marker" ? "60%" : "100%",
            "--k-hl-d": `${duration}s`,
            "--k-hl-delay": `${delay}s`,
          } as React.CSSProperties
        }
      >
        {children}
      </mark>
    </>
  );
}
```

## Usage example
```tsx
import { TextHighlighter } from "@/components/kinetik/text-highlighter";

export default function Demo() {
  return (
    <div className="flex h-full w-full items-center justify-center p-8">
      <p className="max-w-xl text-2xl leading-relaxed font-medium tracking-tight sm:text-3xl">
        Teams using kinetik ship <TextHighlighter delay={0.2}>twice as many</TextHighlighter> polished interactions, with{" "}
        <TextHighlighter variant="underline" color="rgb(139 92 246)" delay={0.9}>
          accessibility built in
        </TextHighlighter>{" "}
        from day one.
      </p>
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
