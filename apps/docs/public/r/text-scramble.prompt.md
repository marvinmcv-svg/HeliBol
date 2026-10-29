You are given a task to integrate a component from the **kinetik** motion library into this codebase.

# Scramble Text (`text-scramble`)

Characters decode from random glyphs into the final string — on mount, on hover/focus, or both. Great for nav links and techy headlines.

## What it should do
Create a "decode" text effect: random glyphs resolve left-to-right into the final string on mount, and replay on hover and keyboard focus.

Keep: GSAP `ScrambleTextPlugin` inside `useGSAP()`, hover handlers wrapped in `contextSafe`, `overwrite: true` so rapid hovers don't stack, `aria-label` with the real text, and no scramble at all under reduced motion.

## Project requirements
- React 19 + TypeScript, Tailwind CSS v4, shadcn/ui-style CSS variables (`background`, `foreground`, `muted`, `muted-foreground`, `border`, `card`, `primary`, `ring`). If the project lacks shadcn, set it up first (`npx shadcn@latest init`).
- Animation engine: **gsap**.
- Install dependencies: `npm i gsap @gsap/react`
- Put the component at `components/kinetik/text-scramble.tsx`.
- `cn` lives at `lib/kinetik/utils.ts` (source below).
- Shared hooks go at `lib/kinetik/core.ts` (source below).

## Non-negotiables
- **Accessibility:** aria-label always holds the real text so screen readers never hear scrambled glyphs. Hover effect also fires on focus. Reduced motion: static text.
- **Performance:** Text-node updates on one element; negligible cost.
- Respect `prefers-reduced-motion` (replace movement with opacity or an instant change).
- Animate only transform / opacity / filter / clip-path. No hard-coded theme colors — use CSS variables so it works in light and dark.

## Source — components/kinetik/text-scramble.tsx
```tsx
"use client";
import { useRef, type ElementType } from "react";
import gsap from "gsap";
import { ScrambleTextPlugin } from "gsap/ScrambleTextPlugin";
import { useGSAP } from "@gsap/react";
import { cn, useReducedMotion } from "@/lib/kinetik/core";

gsap.registerPlugin(ScrambleTextPlugin, useGSAP);

export interface TextScrambleProps {
  children: string;
  as?: ElementType;
  /** When to scramble: on mount, on hover/focus, or both. */
  trigger?: "mount" | "hover" | "both";
  chars?: string;
  duration?: number;
  className?: string;
}

export function TextScramble({
  children,
  as: Tag = "span",
  trigger = "both",
  chars = "upperCase",
  duration = 1.1,
  className,
}: TextScrambleProps) {
  const ref = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();

  const { contextSafe } = useGSAP(
    () => {
      if (reduced || trigger === "hover") return;
      gsap.from(ref.current, { duration, scrambleText: { text: children, chars, speed: 0.6, revealDelay: 0.2 } });
    },
    { scope: ref, dependencies: [children, reduced] },
  );

  const play = contextSafe(() => {
    if (reduced || trigger === "mount" || !ref.current) return;
    gsap.to(ref.current, { duration: duration * 0.7, overwrite: true, scrambleText: { text: children, chars, speed: 0.8 } });
  });

  return (
    <Tag
      ref={ref}
      aria-label={children}
      onPointerEnter={play}
      onFocus={play}
      className={cn("inline-block tabular-nums", className)}
    >
      {children}
    </Tag>
  );
}
```

## Usage example
```tsx
"use client";
import { TextScramble } from "@/components/kinetik/text-scramble";

export default function Demo() {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-6 p-8 font-mono">
      <TextScramble as="h2" className="text-3xl font-semibold tracking-tight sm:text-5xl">
        ACCESS GRANTED
      </TextScramble>
      <div className="flex gap-6 text-sm">
        {["Work", "About", "Contact"].map((l) => (
          <a key={l} href="#" onClick={(e) => e.preventDefault()} className="rounded text-muted-foreground outline-none hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring">
            <TextScramble trigger="hover" chars="01">{l.toUpperCase()}</TextScramble>
          </a>
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
