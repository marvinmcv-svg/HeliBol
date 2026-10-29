You are given a task to integrate a component from the **kinetik** motion library into this codebase.

# Marquee (`marquee`)

Seamless infinite marquee for logos and testimonials: horizontal or vertical, reverse, edge fade, pause on hover and an optional pause button.

## What it should do
Build a CSS infinite marquee: two identical flex tracks (second aria-hidden) inside an overflow-hidden flex container, each animating `translateX(calc(-100% - gap))` linearly forever so the loop is seamless. Variants via data attributes: reverse, vertical (translateY), pause on hover, paused state from a pause/play button. Edge fade with a linear-gradient mask. Paused under reduced motion.

## Project requirements
- React 19 + TypeScript, Tailwind CSS v4, shadcn/ui-style CSS variables (`background`, `foreground`, `muted`, `muted-foreground`, `border`, `card`, `primary`, `ring`). If the project lacks shadcn, set it up first (`npx shadcn@latest init`).
- Animation engine: **css**.
- Install dependencies: `npm i lucide-react`
- Put the component at `components/kinetik/marquee.tsx`.
- `cn` lives at `lib/kinetik/utils.ts` (source below).
- Shared hooks go at `lib/kinetik/core.ts` (source below).

## Non-negotiables
- **Accessibility:** Duplicate track is aria-hidden; pause control satisfies WCAG 2.2.2; paused entirely under reduced motion.
- **Performance:** One transform keyframe per track, compositor-only.
- Respect `prefers-reduced-motion` (replace movement with opacity or an instant change).
- Animate only transform / opacity / filter / clip-path. No hard-coded theme colors — use CSS variables so it works in light and dark.

## Source — components/kinetik/marquee.tsx
```tsx
"use client";
import { useState, type ReactNode } from "react";
import { Pause, Play } from "lucide-react";
import { cn } from "@/lib/kinetik/core";

export interface MarqueeProps {
  children: ReactNode;
  /** Seconds per loop. */
  duration?: number;
  reverse?: boolean;
  vertical?: boolean;
  pauseOnHover?: boolean;
  /** Fade the edges with a mask. */
  fade?: boolean;
  /** Show a pause/play control (WCAG 2.2.2). */
  controls?: boolean;
  gap?: string;
  className?: string;
}

const css = `
.k-marquee{--k-gap:2rem;display:flex;overflow:hidden;gap:var(--k-gap)}
.k-marquee[data-vertical]{flex-direction:column}
.k-marquee-track{display:flex;flex-shrink:0;gap:var(--k-gap);min-width:100%;justify-content:space-around;animation:k-marquee-x var(--k-dur) linear infinite}
.k-marquee[data-vertical] .k-marquee-track{flex-direction:column;min-width:auto;min-height:100%;animation-name:k-marquee-y}
.k-marquee[data-reverse] .k-marquee-track{animation-direction:reverse}
.k-marquee[data-hover-pause]:hover .k-marquee-track,.k-marquee[data-paused] .k-marquee-track{animation-play-state:paused}
@keyframes k-marquee-x{to{transform:translateX(calc(-100% - var(--k-gap)))}}
@keyframes k-marquee-y{to{transform:translateY(calc(-100% - var(--k-gap)))}}
@media (prefers-reduced-motion:reduce){.k-marquee-track{animation-play-state:paused}}
[data-reduce-motion] .k-marquee-track{animation-play-state:paused!important}`;

export function Marquee({ children, duration = 30, reverse, vertical, pauseOnHover = true, fade = true, controls = false, gap = "2rem", className }: MarqueeProps) {
  const [paused, setPaused] = useState(false);
  const mask = vertical ? "linear-gradient(to bottom,transparent,#000 12%,#000 88%,transparent)" : "linear-gradient(to right,transparent,#000 10%,#000 90%,transparent)";
  return (
    <div className={cn("relative", className)}>
      <style href="k-marquee" precedence="kinetik">{css}</style>
      <div
        className={cn("k-marquee", vertical && "h-full")}
        data-vertical={vertical || undefined}
        data-reverse={reverse || undefined}
        data-hover-pause={pauseOnHover || undefined}
        data-paused={paused || undefined}
        style={{ "--k-dur": `${duration}s`, "--k-gap": gap, maskImage: fade ? mask : undefined, WebkitMaskImage: fade ? mask : undefined } as React.CSSProperties}
      >
        <div className="k-marquee-track">{children}</div>
        <div className="k-marquee-track" aria-hidden>{children}</div>
      </div>
      {controls && (
        <button onClick={() => setPaused((p) => !p)} aria-label={paused ? "Play marquee" : "Pause marquee"} className="absolute top-1/2 right-0 grid size-7 -translate-y-1/2 place-items-center rounded-full border border-border bg-background/80 text-muted-foreground backdrop-blur hover:text-foreground">
          {paused ? <Play className="size-3" /> : <Pause className="size-3" />}
        </button>
      )}
    </div>
  );
}
```

## Usage example
```tsx
"use client";
import { Marquee } from "@/components/kinetik/marquee";

const logos = ["Northwind", "Acme", "Globex", "Initech", "Umbrella", "Hooli", "Stark", "Wayne"];
const quotes = [
  ["Ava Lin", "The AI prompts alone saved us a sprint."],
  ["Kai Moreno", "Finally, reduced motion that's actually designed."],
  ["Noor Haddad", "Our landing page feels expensive now."],
  ["Leo Park", "Same springs on web and native. Chef's kiss."],
];

export default function Demo() {
  return (
    <div className="flex h-full w-full flex-col justify-center gap-6 py-6">
      <Marquee duration={25} controls className="px-0">
        {logos.map((l) => <span key={l} className="text-xl font-semibold tracking-tight text-muted-foreground/70">{l}</span>)}
      </Marquee>
      <Marquee duration={40} reverse gap="1rem">
        {quotes.map(([n, q], i) => (
          <figure key={n} className="w-64 shrink-0 rounded-2xl border border-border bg-card p-4">
            <blockquote className="text-sm">“{q}”</blockquote>
            <figcaption className="mt-3 flex items-center gap-2 text-xs text-muted-foreground"><img src={`/demo/photo-${i + 3}.jpg`} alt="" className="size-6 rounded-full object-cover" />{n}</figcaption>
          </figure>
        ))}
      </Marquee>
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
