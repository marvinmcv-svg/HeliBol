You are given a task to integrate a component from the **kinetik** motion library into this codebase.

# Drawn Checkbox (`checkbox-draw`)

The checkmark draws itself with a stroke-dashoffset transition; optional strike-through sweeps across the label.

## What it should do
Create a checkbox where a native sr-only input drives a custom box via the `:checked + .box` sibling selector; the SVG check path has `stroke-dasharray: 22` and transitions `stroke-dashoffset` 22→0 with an expo-out ease. Optional strike-through: the label's 1.5px linear-gradient background grows 0%→100% width and the text dims. Press scales the box to 0.9.

## Project requirements
- React 19 + TypeScript, Tailwind CSS v4, shadcn/ui-style CSS variables (`background`, `foreground`, `muted`, `muted-foreground`, `border`, `card`, `primary`, `ring`). If the project lacks shadcn, set it up first (`npx shadcn@latest init`).
- Animation engine: **svg**.
- No runtime dependencies (CSS only).
- Put the component at `components/kinetik/checkbox-draw.tsx`.
- `cn` lives at `lib/kinetik/utils.ts` (source below).
- Shared hooks go at `lib/kinetik/core.ts` (source below).

## Non-negotiables
- **Accessibility:** Native visually-hidden <input type=checkbox> keeps full keyboard + screen-reader semantics; visible focus ring on the box.
- **Performance:** CSS transitions only; the React wrapper is just for controlled state.
- Respect `prefers-reduced-motion` (replace movement with opacity or an instant change).
- Animate only transform / opacity / filter / clip-path. No hard-coded theme colors — use CSS variables so it works in light and dark.

## Source — components/kinetik/checkbox-draw.tsx
```tsx
"use client";
import { useId, useState, type ReactNode } from "react";
import { cn } from "@/lib/kinetik/core";

export interface CheckboxDrawProps {
  checked?: boolean;
  defaultChecked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  children?: ReactNode;
  /** Strike through the label when checked (todo lists). */
  strike?: boolean;
  className?: string;
}

const css = `
.k-check-path{stroke-dasharray:22;stroke-dashoffset:22;transition:stroke-dashoffset .25s cubic-bezier(.16,1,.3,1) .05s}
.k-check-input:checked+.k-check-box .k-check-path{stroke-dashoffset:0}
.k-check-box{transition:background-color .15s,border-color .15s,scale .15s}
.k-check-input:active+.k-check-box{scale:.9}
.k-check-label{background:linear-gradient(currentColor,currentColor) 0 55%/0% 1.5px no-repeat;transition:background-size .3s cubic-bezier(.16,1,.3,1),color .3s}
.k-check-input:checked~.k-check-label[data-strike]{background-size:100% 1.5px;color:var(--color-muted-foreground,gray)}
@media (prefers-reduced-motion:reduce){.k-check-path,.k-check-label{transition:none}}
[data-reduce-motion] .k-check-path,[data-reduce-motion] .k-check-label{transition:none}`;

export function CheckboxDraw({ checked, defaultChecked, onCheckedChange, children, strike = false, className }: CheckboxDrawProps) {
  const id = useId();
  const [internal, setInternal] = useState(defaultChecked ?? false);
  const isChecked = checked ?? internal;
  return (
    <>
      <style href="k-check" precedence="kinetik">{css}</style>
      <label htmlFor={id} className={cn("inline-flex cursor-pointer items-center gap-3 text-sm", className)}>
        <input
          id={id}
          type="checkbox"
          className="k-check-input peer sr-only"
          checked={isChecked}
          onChange={(e) => {
            if (checked === undefined) setInternal(e.target.checked);
            onCheckedChange?.(e.target.checked);
          }}
        />
        <span className="k-check-box grid size-5 shrink-0 place-items-center rounded-md border-2 border-muted-foreground/40 peer-checked:border-primary peer-checked:bg-primary peer-focus-visible:ring-2 peer-focus-visible:ring-ring peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-background">
          <svg viewBox="0 0 24 24" className="size-3.5 text-primary-foreground" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
            <path className="k-check-path" d="M5 12.5l4.5 4.5L19 7.5" />
          </svg>
        </span>
        {children && <span className="k-check-label" data-strike={strike || undefined}>{children}</span>}
      </label>
    </>
  );
}
```

## Usage example
```tsx
"use client";
import { CheckboxDraw } from "@/components/kinetik/checkbox-draw";

export default function Demo() {
  return (
    <div className="flex h-full w-full items-center justify-center p-8">
      <div className="w-72 space-y-3 rounded-2xl border border-border bg-card p-5">
        <p className="text-sm font-semibold">Launch checklist</p>
        <CheckboxDraw strike defaultChecked>Design tokens</CheckboxDraw>
        <CheckboxDraw strike>Reduced-motion fallbacks</CheckboxDraw>
        <CheckboxDraw strike>Ship it 🚀</CheckboxDraw>
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
