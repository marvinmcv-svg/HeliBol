You are given a task to integrate a component from the **kinetik** motion library into this codebase.

# Share Sheet (`share-sheet`)

A share button that morphs into a full share sheet (shared layoutId): recent people and targets pop in with a stagger, copy-link confirms inline, and the native share sheet is used when the browser has one.

## What it should do
Give the trigger and the sheet the same layoutId so the button grows into the panel; stagger avatar and target buttons in; copy uses navigator.clipboard and flips to a check; call navigator.share when available.

## Project requirements
- React 19 + TypeScript, Tailwind CSS v4, shadcn/ui-style CSS variables (`background`, `foreground`, `muted`, `muted-foreground`, `border`, `card`, `primary`, `ring`). If the project lacks shadcn, set it up first (`npx shadcn@latest init`).
- Animation engine: **motion**.
- Install dependencies: `npm i motion lucide-react`
- Put the component at `components/kinetik/share-sheet.tsx`.
- `cn` lives at `lib/kinetik/utils.ts` (source below).
- Shared hooks go at `lib/kinetik/core.ts` (source below).

## Non-negotiables
- **Accessibility:** Sheet is a dialog with focus moved in and Esc to close; buttons are labelled. Reduced motion uses a fade.
- **Performance:** One layout morph; pops are transform/opacity.
- Respect `prefers-reduced-motion` (replace movement with opacity or an instant change).
- Animate only transform / opacity / filter / clip-path. No hard-coded theme colors — use CSS variables so it works in light and dark.

## Source — components/kinetik/share-sheet.tsx
```tsx
"use client";
import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Check, Copy, Share2 } from "lucide-react";
import { cn, useReducedMotion } from "@/lib/kinetik/core";

export interface ShareTarget {
  label: string;
  icon: ReactNode;
  color: string;
  href?: string;
}

export interface ShareSheetProps {
  url: string;
  title?: string;
  targets: ShareTarget[];
  /** Recent people shown as avatars. */
  people?: { name: string; avatar: string }[];
  /** Start open (for previews). */
  defaultOpen?: boolean;
  className?: string;
}

/**
 * Share button that morphs into a share sheet (shared layout): the pill grows into a card,
 * recent people and app targets pop in on a staggered spring, the link row copies with a check
 * morph, and the native share sheet is used when available. Esc and outside click close.
 */
export function ShareSheet({ url, title = "Share", targets, people = [], defaultOpen = false, className }: ShareSheetProps) {
  const reduced = useReducedMotion();
  const id = useId();
  const [open, setOpen] = useState(defaultOpen);
  const [copied, setCopied] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const t = reduced ? { duration: 0 } : { type: "spring" as const, stiffness: 380, damping: 32 };

  useEffect(() => {
    if (!open) return;
    const k = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    const d = (e: PointerEvent) => !ref.current?.contains(e.target as Node) && setOpen(false);
    document.addEventListener("keydown", k);
    document.addEventListener("pointerdown", d);
    return () => { document.removeEventListener("keydown", k); document.removeEventListener("pointerdown", d); };
  }, [open]);

  const copy = async () => {
    try { await navigator.clipboard.writeText(url); } catch {}
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };
  const pop = (i: number) => ({ initial: reduced ? { opacity: 0 } : { opacity: 0, scale: 0.4, y: 10 }, animate: { opacity: 1, scale: 1, y: 0 }, transition: reduced ? { duration: 0 } : { type: "spring" as const, stiffness: 500, damping: 22, delay: 0.08 + i * 0.035 } });

  return (
    <div ref={ref} className={cn("relative inline-block", className)}>
      <AnimatePresence initial={false} mode="popLayout">
        {!open ? (
          <motion.button key="btn" layoutId={`${id}-sheet`} transition={t} type="button" onClick={() => setOpen(true)} aria-expanded={false} style={{ borderRadius: 999 }} className="inline-flex h-11 items-center gap-2 bg-foreground px-5 text-sm font-semibold text-background">
            <Share2 className="size-4" /> {title}
          </motion.button>
        ) : (
          <motion.div key="sheet" layoutId={`${id}-sheet`} transition={t} role="dialog" aria-label={title} style={{ borderRadius: 24 }} className="w-80 overflow-hidden bg-popover p-4 text-popover-foreground shadow-2xl ring-1 ring-border">
            <div className="flex items-center justify-between">
              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-sm font-semibold">{title}</motion.p>
              <button type="button" onClick={() => setOpen(false)} className="text-xs text-muted-foreground hover:text-foreground">Done</button>
            </div>
            {people.length > 0 && (
              <ul className="mt-4 flex gap-3">
                {people.map((p, i) => (
                  <motion.li key={p.name} {...pop(i)} className="w-12 text-center">
                    <img src={p.avatar} alt="" className="mx-auto size-12 rounded-full object-cover" />
                    <span className="mt-1 block truncate text-[10px] text-muted-foreground">{p.name}</span>
                  </motion.li>
                ))}
              </ul>
            )}
            <ul className="mt-4 grid grid-cols-4 gap-3">
              {targets.map((tg, i) => (
                <motion.li key={tg.label} {...pop(people.length + i)}>
                  <a href={tg.href ?? "#"} className="group flex flex-col items-center gap-1 text-[10px] text-muted-foreground">
                    <span className="grid size-12 place-items-center rounded-2xl text-white transition-transform group-hover:-translate-y-0.5" style={{ background: tg.color }}>{tg.icon}</span>
                    {tg.label}
                  </a>
                </motion.li>
              ))}
            </ul>
            <motion.div {...pop(people.length + targets.length)} className="mt-4 flex items-center gap-2 rounded-xl bg-muted px-3 py-2">
              <span className="min-w-0 flex-1 truncate text-xs text-muted-foreground">{url}</span>
              <button type="button" onClick={copy} aria-label={copied ? "Copied" : "Copy link"} className="grid size-7 place-items-center rounded-lg bg-background">
                <AnimatePresence mode="popLayout" initial={false}>
                  <motion.span key={String(copied)} initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>
                    {copied ? <Check className="size-3.5 text-emerald-500" /> : <Copy className="size-3.5" />}
                  </motion.span>
                </AnimatePresence>
              </button>
            </motion.div>
            {typeof navigator !== "undefined" && "share" in navigator && (
              <button type="button" onClick={() => navigator.share({ url, title }).catch(() => {})} className="mt-2 w-full text-center text-xs text-muted-foreground underline underline-offset-4">More options…</button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
```

## Usage example
```tsx
"use client";
import { useState } from "react";
import { AtSign, Mail, MessageCircle, Send } from "lucide-react";
import { photos } from "@/components/kinetik/demo-helpers" /* or inline */;
import { ShareSheet } from "@/components/kinetik/share-sheet";

export default function Demo() {
  const [k, setK] = useState(0);
  return (
    <div className="flex h-full flex-col items-center justify-center gap-4 p-6">
      <ShareSheet
        key={k}
        defaultOpen
        url="https://kinetik.dev/c/premium"
        title="Share collection"
        people={[{ name: "Ava", avatar: photos[0] }, { name: "Leo", avatar: photos[1] }, { name: "Noor", avatar: photos[2] }, { name: "Kai", avatar: photos[3] }]}
        targets={[
          { label: "Messages", icon: <MessageCircle className="size-5" />, color: "#22c55e" },
          { label: "Mail", icon: <Mail className="size-5" />, color: "#3b82f6" },
          { label: "Telegram", icon: <Send className="size-5" />, color: "#0ea5e9" },
          { label: "Threads", icon: <AtSign className="size-5" />, color: "#18181b" },
        ]}
      />
      <button onClick={() => setK((x) => x + 1)} className="text-xs text-muted-foreground underline underline-offset-4">Reset</button>
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

export interface CanvasFrame {
  ctx: CanvasRenderingContext2D;
  width: number;
  height: number;
  /** seconds since start */
  time: number;
  /** seconds since last frame */
  dt: number;
  /** pointer position in CSS px relative to the canvas, or null when outside */
  pointer: { x: number; y: number } | null;
}

/**
 * Canvas animation loop with the boring parts done: DPR-aware sizing (ResizeObserver), pausing while
 * off-screen or in a background tab, pointer tracking, and a single static frame under reduced motion.
 */
export function useCanvas(draw: (f: CanvasFrame) => void, { maxDpr = 2, interactive = true }: { maxDpr?: number; interactive?: boolean } = {}) {
  const ref = useRef<HTMLCanvasElement>(null);
  const saved = useRef(draw);
  saved.current = draw;
  const reduced = useReducedMotion();
  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    let w = 0;
    let h = 0;
    let visible = true;
    let raf = 0;
    let start = performance.now();
    let last = start;
    let pointer: CanvasFrame["pointer"] = null;
    const frame = (now: number) => {
      saved.current({ ctx, width: w, height: h, time: (now - start) / 1000, dt: Math.min(0.05, (now - last) / 1000), pointer });
      last = now;
    };
    const loop = (now: number) => {
      frame(now);
      raf = requestAnimationFrame(loop);
    };
    const play = () => {
      cancelAnimationFrame(raf);
      if (reduced) {
        frame(performance.now());
        return;
      }
      if (visible && !document.hidden) {
        last = performance.now();
        raf = requestAnimationFrame(loop);
      }
    };
    const ro = new ResizeObserver(() => {
      const dpr = Math.min(maxDpr, window.devicePixelRatio || 1);
      const r = canvas.getBoundingClientRect();
      w = r.width;
      h = r.height;
      canvas.width = Math.max(1, Math.round(w * dpr));
      canvas.height = Math.max(1, Math.round(h * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      if (reduced) frame(performance.now());
    });
    ro.observe(canvas);
    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      play();
    });
    io.observe(canvas);
    const onVis = () => play();
    document.addEventListener("visibilitychange", onVis);
    const host = canvas.parentElement ?? canvas;
    const move = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect();
      pointer = { x: e.clientX - r.left, y: e.clientY - r.top };
    };
    const leave = () => (pointer = null);
    if (interactive) {
      host.addEventListener("pointermove", move);
      host.addEventListener("pointerleave", leave);
    }
    start = performance.now();
    play();
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      document.removeEventListener("visibilitychange", onVis);
      host.removeEventListener("pointermove", move);
      host.removeEventListener("pointerleave", leave);
    };
  }, [reduced, maxDpr, interactive]);
  return ref;
}
```

## Steps
1. Install the dependencies above.
2. Create the files exactly as given, fixing import aliases if the project doesn't use `@/`.
3. Drop the usage example into a page and adapt copy/colors to the project's design system.
4. Verify: toggle "Reduce motion" in OS settings — the component must still be fully usable.
