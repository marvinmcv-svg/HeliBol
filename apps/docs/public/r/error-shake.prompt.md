You are given a task to integrate a component from the **kinetik** motion library into this codebase.

# Error Shake (`error-shake`)

The macOS login 'no' — a damped horizontal shake triggered by any changing value. Pair with color and text for accessibility.

## What it should do
Create an ErrorShake wrapper: whenever the `trigger` prop changes (truthy), remount the child wrapper via an incrementing key with a damped `translate` keyframe (-8, 7, -5, 4, -2px over 450ms, cubic-bezier(.36,.07,.19,.97)). Demo a password field that also gets aria-invalid, red styling and a role=alert message. No shake under reduced motion.

## Project requirements
- React 19 + TypeScript, Tailwind CSS v4, shadcn/ui-style CSS variables (`background`, `foreground`, `muted`, `muted-foreground`, `border`, `card`, `primary`, `ring`). If the project lacks shadcn, set it up first (`npx shadcn@latest init`).
- Animation engine: **css**.
- No runtime dependencies (CSS only).
- Put the component at `components/kinetik/error-shake.tsx`.
- `cn` lives at `lib/kinetik/utils.ts` (source below).
- Shared hooks go at `lib/kinetik/core.ts` (source below).

## Non-negotiables
- **Accessibility:** Motion is never the only signal: demo pairs it with aria-invalid, red styling and a role=alert message. Reduced motion: no shake.
- **Performance:** One translate keyframe, remounted by key to replay.
- Respect `prefers-reduced-motion` (replace movement with opacity or an instant change).
- Animate only transform / opacity / filter / clip-path. No hard-coded theme colors — use CSS variables so it works in light and dark.

## Source — components/kinetik/error-shake.tsx
```tsx
"use client";
import { useEffect, useState, type ReactNode } from "react";
import { cn } from "@/lib/kinetik/core";

export interface ErrorShakeProps {
  /** Change this value (e.g. increment a counter) to trigger a shake. */
  trigger: unknown;
  children: ReactNode;
  className?: string;
}

const css = `
@keyframes k-shake{0%,100%{translate:0}15%{translate:-8px}30%{translate:7px}45%{translate:-5px}60%{translate:4px}75%{translate:-2px}}
.k-shake{animation:k-shake .45s cubic-bezier(.36,.07,.19,.97)}
@media (prefers-reduced-motion:reduce){.k-shake{animation:none}}
[data-reduce-motion] .k-shake{animation:none}`;

/** Shakes its children whenever `trigger` changes. Reduced motion: no movement (pair with a color/text error). */
export function ErrorShake({ trigger, children, className }: ErrorShakeProps) {
  const [n, setN] = useState(0);
  useEffect(() => {
    if (trigger) setN((x) => x + 1);
  }, [trigger]);
  return (
    <>
      <style href="k-shake" precedence="kinetik">{css}</style>
      <div key={n} className={cn(n > 0 && "k-shake", className)}>{children}</div>
    </>
  );
}
```

## Usage example
```tsx
"use client";
import { useState } from "react";
import { ErrorShake } from "@/components/kinetik/error-shake";

export default function Demo() {
  const [tries, setTries] = useState(0);
  const [pw, setPw] = useState("");
  const wrong = tries > 0;
  return (
    <div className="flex h-full w-full items-center justify-center p-6">
      <form
        className="w-full max-w-xs space-y-3"
        onSubmit={(e) => {
          e.preventDefault();
          if (pw !== "kinetik") setTries((t) => t + 1);
          else setTries(0);
        }}
      >
        <ErrorShake trigger={tries}>
          <input
            type="password"
            value={pw}
            onChange={(e) => setPw(e.target.value)}
            placeholder="Password (hint: kinetik)"
            aria-invalid={wrong || undefined}
            aria-describedby="k-shake-err"
            className="h-11 w-full rounded-xl border border-input bg-card px-3 text-sm outline-none transition-colors focus:ring-2 focus:ring-ring/40 aria-invalid:border-destructive aria-invalid:bg-destructive/5"
          />
        </ErrorShake>
        <p id="k-shake-err" role="alert" className="h-4 text-xs text-destructive">{wrong ? `Incorrect password (${tries})` : ""}</p>
        <button className="h-10 w-full rounded-xl bg-foreground text-sm font-medium text-background">Sign in</button>
      </form>
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
