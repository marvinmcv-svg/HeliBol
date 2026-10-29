You are given a task to integrate a component from the **kinetik** motion library into this codebase.

# Native Animated Dialog (`dialog-animated`)

A real <dialog> with enter and exit animations in pure CSS (@starting-style + allow-discrete), blurred backdrop and click-outside.

## What it should do
Build a modal on the native `<dialog>` element opened with `showModal()`. Animate in with `@starting-style` (opacity 0, scale .96, translateY 8px → rest, 320ms expo-out) and out by transitioning `overlay` and `display` with `allow-discrete` (220ms accelerate). The `::backdrop` fades to 45% black with a 4px blur the same way. Close on Esc (native), backdrop click and a close button; sync state via onClose.

## Project requirements
- React 19 + TypeScript, Tailwind CSS v4, shadcn/ui-style CSS variables (`background`, `foreground`, `muted`, `muted-foreground`, `border`, `card`, `primary`, `ring`). If the project lacks shadcn, set it up first (`npx shadcn@latest init`).
- Animation engine: **css**.
- Install dependencies: `npm i lucide-react`
- Put the component at `components/kinetik/dialog-animated.tsx`.
- `cn` lives at `lib/kinetik/utils.ts` (source below).
- Shared hooks go at `lib/kinetik/core.ts` (source below).

## Non-negotiables
- **Accessibility:** showModal() gives focus trapping, Esc, inert page and top-layer stacking natively; labelled by its title.
- **Performance:** No animation library; transitions on opacity/scale/translate only.
- Respect `prefers-reduced-motion` (replace movement with opacity or an instant change).
- Animate only transform / opacity / filter / clip-path. No hard-coded theme colors — use CSS variables so it works in light and dark.

## Source — components/kinetik/dialog-animated.tsx
```tsx
"use client";
import { useEffect, useId, useRef, type ReactNode } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/kinetik/core";

export interface DialogAnimatedProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  children?: ReactNode;
  className?: string;
}

/*
 * Native <dialog> + @starting-style: real focus trapping, Esc, top-layer and inert background
 * for free, with enter AND exit animations in pure CSS (overlay + display allow-discrete).
 */
const css = `
.k-dialog{opacity:0;scale:.96;translate:0 8px;transition:opacity .22s cubic-bezier(.4,0,1,1),scale .22s cubic-bezier(.4,0,1,1),translate .22s cubic-bezier(.4,0,1,1),overlay .22s allow-discrete,display .22s allow-discrete}
.k-dialog[open]{opacity:1;scale:1;translate:0 0;transition-timing-function:cubic-bezier(.16,1,.3,1);transition-duration:.32s}
@starting-style{.k-dialog[open]{opacity:0;scale:.96;translate:0 8px}}
.k-dialog::backdrop{background:rgb(0 0 0/0);backdrop-filter:blur(0);transition:background .32s,backdrop-filter .32s,overlay .32s allow-discrete,display .32s allow-discrete}
.k-dialog[open]::backdrop{background:rgb(0 0 0/.45);backdrop-filter:blur(4px)}
@starting-style{.k-dialog[open]::backdrop{background:rgb(0 0 0/0);backdrop-filter:blur(0)}}
@media (prefers-reduced-motion:reduce){.k-dialog{scale:1!important;translate:0!important}}
[data-reduce-motion] .k-dialog{scale:1!important;translate:0!important}`;

export function DialogAnimated({ open, onOpenChange, title, description, children, className }: DialogAnimatedProps) {
  const ref = useRef<HTMLDialogElement>(null);
  const titleId = useId();
  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (open && !d.open) d.showModal();
    if (!open && d.open) d.close();
  }, [open]);
  return (
    <>
      <style href="k-dialog" precedence="kinetik">{css}</style>
      <dialog
        ref={ref}
        onClose={() => onOpenChange(false)}
        onClick={(e) => e.target === e.currentTarget && onOpenChange(false)}
        aria-labelledby={titleId}
        className={cn("k-dialog m-auto w-[min(92vw,26rem)] rounded-2xl border border-border bg-card p-0 text-card-foreground shadow-2xl", className)}
      >
        <div className="p-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 id={titleId} className="text-lg font-semibold">{title}</h2>
              {description && <p className="mt-1 text-sm text-muted-foreground">{description}</p>}
            </div>
            <button onClick={() => onOpenChange(false)} aria-label="Close" className="grid size-8 shrink-0 place-items-center rounded-lg text-muted-foreground hover:bg-accent"><X className="size-4" /></button>
          </div>
          {children && <div className="mt-5">{children}</div>}
        </div>
      </dialog>
    </>
  );
}
```

## Usage example
```tsx
"use client";
import { useState } from "react";
import { DialogAnimated } from "@/components/kinetik/dialog-animated";

export default function Demo() {
  const [open, setOpen] = useState(false);
  return (
    <div className="flex h-full w-full items-center justify-center p-8">
      <button onClick={() => setOpen(true)} className="rounded-xl bg-foreground px-4 py-2 text-sm font-medium text-background">Invite teammates</button>
      <DialogAnimated open={open} onOpenChange={setOpen} title="Invite your team" description="They'll get access to every component and collection.">
        <form method="dialog" className="space-y-3" onSubmit={() => setOpen(false)}>
          <input autoFocus placeholder="name@company.com" className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring/40" />
          <div className="flex justify-end gap-2">
            <button type="button" onClick={() => setOpen(false)} className="rounded-lg px-3 py-2 text-sm hover:bg-accent">Cancel</button>
            <button className="rounded-lg bg-foreground px-3 py-2 text-sm font-medium text-background">Send invite</button>
          </div>
        </form>
      </DialogAnimated>
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
