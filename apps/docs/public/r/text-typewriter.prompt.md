You are given a task to integrate a component from the **kinetik** motion library into this codebase.

# Typewriter (`text-typewriter`)

Types, holds, deletes and cycles through a list of phrases with a blinking caret.

## What it should do
Build a typewriter that types a phrase, pauses, deletes it, and moves to the next phrase in a list, with a 2px blinking caret.

Keep: a single `setTimeout` state machine (typing / holding / deleting); caret blink as a stepped opacity keyframe (`times: [0, .5, .5, 1]`) so it's crisp, not fading; all phrases in an `sr-only` span for screen readers; reduced motion swaps entire words with no typing.

## Project requirements
- React 19 + TypeScript, Tailwind CSS v4, shadcn/ui-style CSS variables (`background`, `foreground`, `muted`, `muted-foreground`, `border`, `card`, `primary`, `ring`). If the project lacks shadcn, set it up first (`npx shadcn@latest init`).
- Animation engine: **motion**.
- Install dependencies: `npm i motion`
- Put the component at `components/kinetik/text-typewriter.tsx`.
- `cn` lives at `lib/kinetik/utils.ts` (source below).
- Shared hooks go at `lib/kinetik/core.ts` (source below).

## Non-negotiables
- **Accessibility:** Screen readers get all phrases once via sr-only text; the typed span and caret are aria-hidden. Reduced motion: whole words swap without typing; caret stops blinking.
- **Performance:** One timeout at a time; no RAF.
- Respect `prefers-reduced-motion` (replace movement with opacity or an instant change).
- Animate only transform / opacity / filter / clip-path. No hard-coded theme colors — use CSS variables so it works in light and dark.

## Source — components/kinetik/text-typewriter.tsx
```tsx
"use client";
import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { cn, useReducedMotion } from "@/lib/kinetik/core";

export interface TextTypewriterProps {
  words: string[];
  /** ms per typed character */
  typeSpeed?: number;
  deleteSpeed?: number;
  /** ms to hold a finished word */
  pause?: number;
  loop?: boolean;
  className?: string;
  caretClassName?: string;
}

export function TextTypewriter({
  words,
  typeSpeed = 70,
  deleteSpeed = 35,
  pause = 1400,
  loop = true,
  className,
  caretClassName,
}: TextTypewriterProps) {
  const reduced = useReducedMotion();
  const [index, setIndex] = useState(0);
  const [text, setText] = useState("");
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const word = words[index % words.length] ?? "";
    if (reduced) {
      setText(word);
      const t = setTimeout(() => (loop || index < words.length - 1) && setIndex((i) => (i + 1) % words.length), pause * 1.5);
      return () => clearTimeout(t);
    }
    let t: ReturnType<typeof setTimeout>;
    if (!deleting && text === word) {
      if (!loop && index === words.length - 1) return;
      t = setTimeout(() => setDeleting(true), pause);
    } else if (deleting && text === "") {
      setDeleting(false);
      setIndex((i) => (i + 1) % words.length);
    } else {
      t = setTimeout(
        () => setText(deleting ? word.slice(0, text.length - 1) : word.slice(0, text.length + 1)),
        deleting ? deleteSpeed : typeSpeed,
      );
    }
    return () => clearTimeout(t);
  }, [text, deleting, index, words, reduced, loop, pause, typeSpeed, deleteSpeed]);

  return (
    <span className={cn("inline-flex items-baseline", className)}>
      <span className="sr-only">{words.join(", ")}</span>
      <span aria-hidden className="whitespace-pre">{text}</span>
      <motion.span
        aria-hidden
        className={cn("ml-0.5 inline-block w-[2px] self-stretch bg-current", caretClassName)}
        animate={reduced ? { opacity: 1 } : { opacity: [1, 1, 0, 0] }}
        transition={{ duration: 1, repeat: Infinity, times: [0, 0.5, 0.5, 1] }}
      />
    </span>
  );
}
```

## Usage example
```tsx
"use client";
import { TextTypewriter } from "@/components/kinetik/text-typewriter";

export default function Demo() {
  return (
    <div className="flex h-full w-full items-center justify-center p-8">
      <h2 className="text-center text-3xl font-semibold tracking-tight sm:text-5xl">
        Ship{" "}
        <TextTypewriter
          words={["landing pages", "dashboards", "mobile apps", "delight"]}
          className="bg-gradient-to-r from-violet-500 to-sky-500 bg-clip-text text-transparent"
          caretClassName="bg-sky-500"
        />
        <br />
        <span className="text-muted-foreground">in an afternoon.</span>
      </h2>
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
