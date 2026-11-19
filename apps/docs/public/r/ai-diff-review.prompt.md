You are given a task to integrate a component from the **kinetik** motion library into this codebase.

# AI Diff Review (`ai-diff-review`)

An agent's proposed edit streaming in: diff lines appear one by one with a cursor, additions flash green and deletions strike through, then each hunk gets Accept / Reject and collapses into a verdict chip.

## What it should do
Build an AI diff review: stream lines across hunks with a timer; each line enters with a green flash (add) or fade (del with line-through), a block cursor sits on the last line; when a hunk completes show Accept/Reject; on decision collapse the body (height → 0) and show an Accepted/Rejected chip in the header.

## Project requirements
- React 19 + TypeScript, Tailwind CSS v4, shadcn/ui-style CSS variables (`background`, `foreground`, `muted`, `muted-foreground`, `border`, `card`, `primary`, `ring`). If the project lacks shadcn, set it up first (`npx shadcn@latest init`).
- Animation engine: **motion**.
- Install dependencies: `npm i motion lucide-react`
- Put the component at `components/kinetik/ai-diff-review.tsx`.
- `cn` lives at `lib/kinetik/utils.ts` (source below).
- Shared hooks go at `lib/kinetik/core.ts` (source below).

## Non-negotiables
- **Accessibility:** Each hunk is a labelled section; status announced via aria-live; real buttons. Reduced motion: all lines shown at once.
- **Performance:** One timeout per line while streaming; height collapse on decision.
- Respect `prefers-reduced-motion` (replace movement with opacity or an instant change).
- Animate only transform / opacity / filter / clip-path. No hard-coded theme colors — use CSS variables so it works in light and dark.

## Source — components/kinetik/ai-diff-review.tsx
```tsx
"use client";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Check, FileCode2, X } from "lucide-react";
import { cn, useReducedMotion } from "@/lib/kinetik/core";

export interface DiffLine {
  type: "ctx" | "add" | "del";
  text: string;
}

export interface DiffHunk {
  id: string;
  file: string;
  summary: string;
  lines: DiffLine[];
}

export interface AiDiffReviewProps {
  hunks: DiffHunk[];
  /** ms between streamed lines. */
  speed?: number;
  onDecision?: (id: string, accepted: boolean) => void;
  className?: string;
}

/**
 * An AI agent's proposed edit, streaming in: diff lines appear one by one with a cursor, additions
 * flash green and deletions strike through, then each hunk gets Accept / Reject — accepted hunks
 * collapse into a green chip, rejected ones fold away. Live region announces progress.
 */
export function AiDiffReview({ hunks, speed = 70, onDecision, className }: AiDiffReviewProps) {
  const reduced = useReducedMotion();
  const total = hunks.reduce((s, h) => s + h.lines.length, 0);
  const [shown, setShown] = useState(reduced ? total : 0);
  const [decided, setDecided] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (reduced) return setShown(total);
    if (shown >= total) return;
    const id = setTimeout(() => setShown((n) => n + 1), speed);
    return () => clearTimeout(id);
  }, [shown, total, speed, reduced]);

  let offset = 0;
  const decide = (id: string, ok: boolean) => (setDecided((d) => ({ ...d, [id]: ok })), onDecision?.(id, ok));

  return (
    <div className={cn("w-full space-y-3 font-mono text-[12.5px]", className)}>
      <p className="sr-only" aria-live="polite">{shown < total ? "Agent is writing changes" : "Changes ready for review"}</p>
      {hunks.map((h) => {
        const start = offset;
        offset += h.lines.length;
        const visible = Math.max(0, Math.min(h.lines.length, shown - start));
        const complete = visible === h.lines.length;
        const verdict = decided[h.id];
        if (visible === 0) return null;
        return (
          <motion.section key={h.id} layout={!reduced} initial={reduced ? false : { opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="overflow-hidden rounded-2xl border border-border bg-card" aria-label={`${h.file}: ${h.summary}`}>
            <header className="flex items-center gap-2 border-b border-border bg-muted/40 px-3 py-2 font-sans text-xs">
              <FileCode2 className="size-3.5 text-muted-foreground" />
              <span className="font-medium">{h.file}</span>
              <span className="truncate text-muted-foreground">— {h.summary}</span>
              {verdict !== undefined && (
                <motion.span initial={{ scale: 0.6, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className={cn("ml-auto rounded-full px-2 py-0.5 text-[11px] font-semibold", verdict ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400" : "bg-muted text-muted-foreground")}>
                  {verdict ? "Accepted" : "Rejected"}
                </motion.span>
              )}
            </header>
            <AnimatePresence initial={false}>
              {verdict === undefined && (
                <motion.div exit={reduced ? { opacity: 0 } : { height: 0, opacity: 0 }} transition={{ duration: 0.3 }}>
                  <pre className="overflow-x-auto py-2">
                    {h.lines.slice(0, visible).map((l, i) => (
                      <motion.div
                        key={i}
                        initial={reduced ? false : l.type === "add" ? { backgroundColor: "rgb(34 197 94 / .45)" } : { opacity: 0 }}
                        animate={{ opacity: 1, backgroundColor: l.type === "add" ? "rgb(34 197 94 / .12)" : l.type === "del" ? "rgb(244 63 94 / .1)" : "rgb(0 0 0 / 0)" }}
                        transition={{ duration: 0.5 }}
                        className={cn("flex px-3", l.type === "del" && "text-rose-500 line-through decoration-rose-500/50", l.type === "add" && "text-emerald-600 dark:text-emerald-400")}
                      >
                        <span className="w-5 shrink-0 select-none text-muted-foreground">{l.type === "add" ? "+" : l.type === "del" ? "−" : " "}</span>
                        <span className="whitespace-pre">{l.text}</span>
                        {i === visible - 1 && !complete && <span className="ml-0.5 inline-block w-2 animate-pulse bg-foreground/70 motion-reduce:animate-none" />}
                      </motion.div>
                    ))}
                  </pre>
                  {complete && (
                    <motion.div initial={reduced ? false : { opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} className="flex justify-end gap-2 border-t border-border px-3 py-2 font-sans">
                      <button type="button" onClick={() => decide(h.id, false)} className="inline-flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs text-muted-foreground hover:bg-muted hover:text-foreground"><X className="size-3.5" /> Reject</button>
                      <button type="button" onClick={() => decide(h.id, true)} className="inline-flex items-center gap-1 rounded-lg bg-foreground px-2.5 py-1 text-xs font-medium text-background"><Check className="size-3.5" /> Accept</button>
                    </motion.div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.section>
        );
      })}
    </div>
  );
}
```

## Usage example
```tsx
"use client";
import { useState } from "react";
import { AiDiffReview } from "@/components/kinetik/ai-diff-review";

export default function Demo() {
  const [k, setK] = useState(0);
  return (
    <div className="mx-auto flex h-full max-w-lg flex-col gap-3 overflow-y-auto p-5">
      <div className="flex items-center justify-between text-sm">
        <span className="font-medium">Agent: “Add reduced-motion support to the hero”</span>
        <button onClick={() => setK((x) => x + 1)} className="text-xs text-muted-foreground underline underline-offset-4">Replay</button>
      </div>
      <AiDiffReview
        key={k}
        hunks={[
          {
            id: "1",
            file: "hero.tsx",
            summary: "respect prefers-reduced-motion",
            lines: [
              { type: "ctx", text: "export function Hero() {" },
              { type: "add", text: "  const reduced = useReducedMotion();" },
              { type: "del", text: "  const y = useTransform(p, [0, 1], [0, 200]);" },
              { type: "add", text: "  const y = useTransform(p, [0, 1], [0, reduced ? 0 : 200]);" },
              { type: "ctx", text: "  return <motion.h1 style={{ y }}>…</motion.h1>;" },
            ],
          },
          {
            id: "2",
            file: "globals.css",
            summary: "stop the marquee for reduced motion",
            lines: [
              { type: "add", text: "@media (prefers-reduced-motion: reduce) {" },
              { type: "add", text: "  .marquee { animation: none; }" },
              { type: "add", text: "}" },
            ],
          },
        ]}
      />
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
