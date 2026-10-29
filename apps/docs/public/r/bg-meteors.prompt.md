You are given a task to integrate a component from the **kinetik** motion library into this codebase.

# Meteor Shower (`bg-meteors`)

Shooting stars streak diagonally across a card or hero with randomized timing — deterministic so SSR matches.

## What it should do
Create a meteor shower: N 2px white dots rotated to ~145°, each with an 80px gradient tail via ::after, translating 900px along their axis with randomized left, delay (0–6s) and duration (3–8s) — generated deterministically (sine hash of index) to avoid hydration mismatch. Fade in/out at the ends; hidden under reduced motion.

## Project requirements
- React 19 + TypeScript, Tailwind CSS v4, shadcn/ui-style CSS variables (`background`, `foreground`, `muted`, `muted-foreground`, `border`, `card`, `primary`, `ring`). If the project lacks shadcn, set it up first (`npx shadcn@latest init`).
- Animation engine: **css**.
- No runtime dependencies (CSS only).
- Put the component at `components/kinetik/bg-meteors.tsx`.
- `cn` lives at `lib/kinetik/utils.ts` (source below).
- Shared hooks go at `lib/kinetik/core.ts` (source below).

## Non-negotiables
- **Accessibility:** aria-hidden; hidden entirely under reduced motion.
- **Performance:** N spans with transform keyframes; keep count ≤ 30.
- Respect `prefers-reduced-motion` (replace movement with opacity or an instant change).
- Animate only transform / opacity / filter / clip-path. No hard-coded theme colors — use CSS variables so it works in light and dark.

## Source — components/kinetik/bg-meteors.tsx
```tsx
"use client";
import { useMemo, type ReactNode } from "react";
import { cn } from "@/lib/kinetik/core";

export interface BgMeteorsProps {
  children?: ReactNode;
  count?: number;
  angle?: number;
  className?: string;
}

const css = `
.k-meteor{position:absolute;top:-5%;width:2px;height:2px;border-radius:9999px;background:#fff;box-shadow:0 0 0 1px rgb(255 255 255/.08);rotate:var(--k-angle);animation:k-meteor linear infinite}
.k-meteor::after{content:"";position:absolute;top:50%;right:1px;width:80px;height:1px;translate:0 -50%;background:linear-gradient(90deg,transparent,rgb(255 255 255/.7))}
@keyframes k-meteor{0%{transform:translateX(0);opacity:0}5%{opacity:1}70%{opacity:1}100%{transform:translateX(900px);opacity:0}}
@media (prefers-reduced-motion:reduce){.k-meteor{display:none}}
[data-reduce-motion] .k-meteor{display:none}`;

export function BgMeteors({ children, count = 18, angle = 145, className }: BgMeteorsProps) {
  // deterministic pseudo-random so SSR and client match
  const meteors = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => {
        const r = (n: number) => ((Math.sin(i * 9301 + n * 49297) + 1) / 2) % 1;
        return { left: `${r(1) * 110}%`, delay: `${r(2) * 6}s`, duration: `${3 + r(3) * 5}s` };
      }),
    [count],
  );
  return (
    <div className={cn("relative isolate overflow-hidden", className)}>
      <style href="k-meteor" precedence="kinetik">{css}</style>
      <div aria-hidden className="absolute inset-0 -z-10" style={{ "--k-angle": `${angle}deg` } as React.CSSProperties}>
        {meteors.map((m, i) => (
          <span key={i} className="k-meteor" style={{ left: m.left, animationDelay: m.delay, animationDuration: m.duration }} />
        ))}
      </div>
      {children}
    </div>
  );
}
```

## Usage example
```tsx
"use client";
import { BgMeteors } from "@/components/kinetik/bg-meteors";

export default function Demo() {
  return (
    <div className="h-full w-full bg-[radial-gradient(ellipse_at_top,#1e1b4b,#020617_70%)] p-6">
      <BgMeteors className="flex h-full flex-col items-center justify-center gap-2 rounded-3xl border border-white/10 text-center text-white">
        <p className="text-xs uppercase tracking-[0.3em] text-white/50">Launch week</p>
        <h2 className="text-3xl font-semibold">Something is coming.</h2>
      </BgMeteors>
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
