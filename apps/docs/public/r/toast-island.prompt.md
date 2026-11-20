You are given a task to integrate a component from the **kinetik** motion library into this codebase.

# Toast — Dynamic Island (`toast-island`)

Dynamic-Island-style notifications: a black pill at the top morphs in width and height to show loading, success or error, with a promise() helper that walks through the states and an optional detail line.

## What it should do
Provide context with show(kind,title,detail) and promise(p,{loading,success,error}); render one motion.div with layout and rounded-full; contents keyed by state animate in/out; auto-collapse to a small pill after a delay.

## Project requirements
- React 19 + TypeScript, Tailwind CSS v4, shadcn/ui-style CSS variables (`background`, `foreground`, `muted`, `muted-foreground`, `border`, `card`, `primary`, `ring`). If the project lacks shadcn, set it up first (`npx shadcn@latest init`).
- Animation engine: **motion**.
- Install dependencies: `npm i motion lucide-react`
- Put the component at `components/kinetik/toast-island.tsx`.
- `cn` lives at `lib/kinetik/utils.ts` (source below).
- Shared hooks go at `lib/kinetik/core.ts` (source below).

## Non-negotiables
- **Accessibility:** Island is a role=status live region; dismisses after a timeout but pauses on hover.
- **Performance:** One element morphing via layout; icons swap with AnimatePresence.
- Respect `prefers-reduced-motion` (replace movement with opacity or an instant change).
- Animate only transform / opacity / filter / clip-path. No hard-coded theme colors — use CSS variables so it works in light and dark.

## Source — components/kinetik/toast-island.tsx
```tsx
"use client";
import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Check, Loader2, X } from "lucide-react";
import { cn, useReducedMotion } from "@/lib/kinetik/core";

type IslandState = { id: number; kind: "loading" | "success" | "error"; title: string; detail?: string } | null;

interface IslandApi {
  /** Show a loading island that resolves to success/error with the promise. */
  promise: <T>(p: Promise<T>, msgs: { loading: string; success: string; error: string; detail?: string }) => Promise<T>;
  show: (kind: "success" | "error", title: string, detail?: string) => void;
}

const Ctx = createContext<IslandApi | null>(null);
export const useIsland = () => {
  const v = useContext(Ctx);
  if (!v) throw new Error("useIsland must be used inside <ToastIsland>");
  return v;
};

/**
 * Dynamic-Island-style toasts: a black pill at the top that stretches (shared layout spring) from a
 * compact loading capsule into a wider success/error card with icon morph and detail line, then
 * shrinks back and away. One island at a time — new messages morph the existing one.
 */
export function ToastIsland({ children, className }: { children: ReactNode; className?: string }) {
  const reduced = useReducedMotion();
  const [s, setS] = useState<IslandState>(null);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const n = useRef(0);

  const settle = useCallback((next: IslandState, ms = 2600) => {
    clearTimeout(timer.current);
    setS(next);
    if (next && next.kind !== "loading") timer.current = setTimeout(() => setS(null), ms);
  }, []);
  const api: IslandApi = {
    show: (kind, title, detail) => settle({ id: ++n.current, kind, title, detail }),
    promise: async (p, m) => {
      const id = ++n.current;
      settle({ id, kind: "loading", title: m.loading });
      try {
        const v = await p;
        settle({ id, kind: "success", title: m.success, detail: m.detail });
        return v;
      } catch (e) {
        settle({ id, kind: "error", title: m.error, detail: e instanceof Error ? e.message : undefined });
        throw e;
      }
    },
  };
  useEffect(() => () => clearTimeout(timer.current), []);
  const t = reduced ? { duration: 0 } : { type: "spring" as const, stiffness: 400, damping: 30 };

  return (
    <Ctx.Provider value={api}>
      <div className={cn("relative", className)}>
        {children}
        <div className="pointer-events-none absolute inset-x-0 top-3 z-50 flex justify-center" role="status" aria-live="polite">
          <AnimatePresence>
            {s && (
              <motion.div
                key="island"
                layout={!reduced}
                initial={reduced ? { opacity: 0 } : { opacity: 0, scale: 0.6, y: -10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={reduced ? { opacity: 0 } : { opacity: 0, scale: 0.6, y: -10 }}
                transition={t}
                style={{ borderRadius: 999 }}
                className="pointer-events-auto flex items-center gap-3 bg-black py-2 pl-2 pr-5 text-white shadow-2xl"
              >
                <motion.span layout={!reduced} transition={t} className={cn("grid size-7 shrink-0 place-items-center rounded-full", s.kind === "success" ? "bg-emerald-500" : s.kind === "error" ? "bg-rose-500" : "bg-white/15")}>
                  <AnimatePresence mode="popLayout" initial={false}>
                    <motion.span key={s.kind} initial={reduced ? false : { scale: 0, rotate: -90 }} animate={{ scale: 1, rotate: 0 }} exit={{ scale: 0 }} transition={t}>
                      {s.kind === "loading" ? <Loader2 className="size-4 animate-spin motion-reduce:animate-none" /> : s.kind === "success" ? <Check className="size-4" strokeWidth={3} /> : <X className="size-4" strokeWidth={3} />}
                    </motion.span>
                  </AnimatePresence>
                </motion.span>
                <motion.div layout="position" transition={t} className="min-w-0">
                  <p className="whitespace-nowrap text-sm font-medium">{s.title}</p>
                  <AnimatePresence initial={false}>
                    {s.detail && s.kind !== "loading" && (
                      <motion.p initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="whitespace-nowrap text-xs text-white/60">{s.detail}</motion.p>
                    )}
                  </AnimatePresence>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </Ctx.Provider>
  );
}
```

## Usage example
```tsx
"use client";
import { useEffect } from "react";
import { ToastIsland, useIsland } from "@/components/kinetik/toast-island";

function Buttons() {
  const island = useIsland();
  const save = () => island.promise(new Promise((r) => setTimeout(r, 1400)), { loading: "Saving changes…", success: "Saved", error: "Couldn't save", detail: "Synced to 3 devices" }).catch(() => {});
  const fail = () => island.promise(new Promise((_, j) => setTimeout(() => j(new Error("You're offline")), 1200)), { loading: "Uploading…", success: "Uploaded", error: "Upload failed" }).catch(() => {});
  useEffect(() => {
    save();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <div className="flex h-full items-center justify-center gap-3">
      <button onClick={save} className="rounded-xl bg-foreground px-4 py-2 text-sm font-medium text-background">Save</button>
      <button onClick={fail} className="rounded-xl border border-border px-4 py-2 text-sm">Upload offline</button>
      <button onClick={() => island.show("success", "Link copied")} className="rounded-xl border border-border px-4 py-2 text-sm">Copy link</button>
    </div>
  );
}

export default function Demo() {
  return (
    <ToastIsland className="h-full">
      <Buttons />
    </ToastIsland>
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
