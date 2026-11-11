You are given a task to integrate a flow from the **kinetik** motion library into this codebase.

# Empty State → First Task (`flow-empty-state`)

Mobbin-style first-run journey: a bobbing empty-state illustration and pulsing FAB, a compose sheet, the first task dropping in as the empty state blurs away, and a confetti + streak celebration on first completion.

## What it should do
Build a first-run empty-state flow: (1) an empty "Today" screen with a softly bobbing illustration, friendly copy and a FAB whose box-shadow pulses to draw the eye; (2) tapping the FAB slides up a bottom sheet with an autofocused input and an Add button; (3) the new task drops into the list with a bouncy spring while the empty state exits with scale + blur (AnimatePresence popLayout); (4) completing the first task fires a 14-piece confetti burst, success haptic and a "1-day streak" chip that springs in. Native: Expo + Reanimated layout animations (FadeOut / ZoomIn), a Gesture Handler bottom sheet and expo-haptics.

## Project requirements
- React 19 + TypeScript, Tailwind CSS v4, shadcn/ui-style CSS variables (`background`, `foreground`, `muted`, `muted-foreground`, `border`, `card`, `primary`, `ring`). If the project lacks shadcn, set it up first (`npx shadcn@latest init`).
- Animation engine: **motion**.
- Install dependencies: `npm i motion lucide-react`
- Put the component at `components/kinetik/flow-empty-state.tsx`.
- `cn` lives at `lib/kinetik/utils.ts` (source below).
- Shared hooks go at `lib/kinetik/core.ts` (source below).
- Motion tokens go at `lib/kinetik/tokens.ts` (source below). Use tokens instead of magic numbers.

## Target platform: React Native (Expo)
The source below is the **web prototype** of this flow. Build the real thing natively:
- Expo SDK 55+, Expo Router, React Native New Architecture.
- `react-native-reanimated` 4 (+ `react-native-worklets`) for all animation; `react-native-gesture-handler` for pans/drags; `expo-haptics` wherever the prototype calls `haptic()` (light → ImpactFeedbackStyle.Light, medium → Medium, success/error → NotificationFeedbackType).
- Use these exact spring presets with `withSpring` (same physics as web): snappy {stiffness:500,damping:35}, smooth {260,30}, gentle {120,20}, bouncy {400,15}, heavy {200,40,mass:1.5}.
- Gesture- and scroll-driven values must run on the UI thread (shared values, `useAnimatedStyle`, `useAnimatedScrollHandler`). State-driven transitions can use Reanimated's CSS-style API or layout animations (`entering`/`exiting`/`layout`).
- Respect `useReducedMotion()` / `ReduceMotion.System`: swap movement for fades.
- Screens: Empty → Compose → First task → Celebrate.

## Non-negotiables
- **Accessibility:** FAB and checkboxes labelled; sheet input autofocuses and submits with Enter; checkboxes use aria-pressed. Reduced motion: no bobbing, pulsing or confetti.
- **Performance:** Springs on a few elements; confetti is 14 short-lived spans.
- Respect `prefers-reduced-motion` (replace movement with opacity or an instant change).
- Animate only transform / opacity / filter / clip-path. No hard-coded theme colors — use CSS variables so it works in light and dark.

## Source — components/kinetik/flow-empty-state.tsx
```tsx
"use client";
import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Check, Plus, X } from "lucide-react";
import { spring } from "@/lib/kinetik/tokens";
import { useReducedMotion } from "@/lib/kinetik/core";
import { haptic } from "@/components/kinetik/phone" /* demo frame + haptic() stand-in */;

type Task = { id: number; title: string; done: boolean };

/**
 * Empty state → first item → celebration. A friendly illustration bobs, the FAB pulses to point
 * the way, the compose sheet slides up, the new task drops into the list and the empty state
 * morphs away. Completing the first task fires a small confetti burst and a streak chip.
 */
export function FlowEmptyState({ initialStep = 0 }: { initialStep?: number }) {
  const reduced = useReducedMotion();
  const [tasks, setTasks] = useState<Task[]>(initialStep >= 2 ? [{ id: 1, title: "Plan the week", done: initialStep >= 3 }] : []);
  const [sheet, setSheet] = useState(initialStep === 1);
  const [draft, setDraft] = useState(initialStep === 1 ? "Plan the week" : "");
  const [celebrate, setCelebrate] = useState(initialStep >= 3);
  const t = reduced ? { duration: 0 } : spring.smooth;

  const add = () => {
    if (!draft.trim()) return;
    haptic("success");
    setTasks((ts) => [...ts, { id: Date.now(), title: draft.trim(), done: false }]);
    setDraft("");
    setSheet(false);
  };
  const toggle = (id: number) => {
    setTasks((ts) => ts.map((x) => (x.id === id ? { ...x, done: !x.done } : x)));
    const first = tasks.every((x) => !x.done);
    if (first) { haptic("success"); setCelebrate(true); }
  };

  return (
    <div className="relative flex h-full flex-col bg-white px-5 pt-14 text-zinc-900">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Today</h2>
        <AnimatePresence>
          {celebrate && (
            <motion.span initial={{ scale: 0, rotate: -20 }} animate={{ scale: 1, rotate: 0 }} exit={{ scale: 0 }} transition={reduced ? { duration: 0 } : spring.bouncy} className="rounded-full bg-amber-100 px-2.5 py-1 text-xs font-semibold text-amber-700">
              🔥 1-day streak
            </motion.span>
          )}
        </AnimatePresence>
      </div>

      <div className="relative mt-4 flex-1">
        <AnimatePresence mode="popLayout" initial={false}>
          {tasks.length === 0 ? (
            <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, scale: 0.9, filter: reduced ? "none" : "blur(6px)" }} transition={t} className="flex h-full flex-col items-center justify-center pb-24 text-center">
              <motion.div animate={reduced ? undefined : { y: [0, -8, 0] }} transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }} className="relative grid size-28 place-items-center rounded-[2rem] bg-gradient-to-br from-violet-100 to-sky-100 text-5xl">
                ✨<span className="absolute -right-2 -top-2 text-2xl">☁️</span>
              </motion.div>
              <h3 className="mt-6 text-lg font-semibold">A clean slate</h3>
              <p className="mt-1 max-w-[14rem] text-sm text-zinc-500">Nothing on your plate yet. Add your first task and we&apos;ll keep it moving.</p>
            </motion.div>
          ) : (
            <motion.ul key="list" className="space-y-2">
              <AnimatePresence initial={false}>
                {tasks.map((x) => (
                  <motion.li key={x.id} layout initial={reduced ? { opacity: 0 } : { opacity: 0, y: -30, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={reduced ? { duration: 0 } : spring.bouncy} className="flex items-center gap-3 rounded-2xl border border-zinc-200 p-3">
                    <button onClick={() => toggle(x.id)} aria-pressed={x.done} aria-label={x.done ? `Mark ${x.title} not done` : `Complete ${x.title}`} className={`grid size-6 place-items-center rounded-full border-2 transition-colors ${x.done ? "border-emerald-500 bg-emerald-500 text-white" : "border-zinc-300"}`}>
                      <AnimatePresence>{x.done && <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}><Check className="size-3.5" strokeWidth={3} /></motion.span>}</AnimatePresence>
                    </button>
                    <span className={`text-sm transition-colors ${x.done ? "text-zinc-400 line-through" : ""}`}>{x.title}</span>
                  </motion.li>
                ))}
              </AnimatePresence>
            </motion.ul>
          )}
        </AnimatePresence>
        {celebrate && !reduced && (
          <div aria-hidden className="pointer-events-none absolute left-8 top-4">
            {Array.from({ length: 14 }, (_, i) => (
              <motion.span key={i} className="absolute size-2 rounded-sm" style={{ background: ["#a78bfa", "#f472b6", "#fbbf24", "#34d399"][i % 4] }} initial={{ x: 0, y: 0, opacity: 1, rotate: 0 }} animate={{ x: Math.cos(i * 0.45) * (60 + (i % 3) * 30), y: Math.sin(i * 0.45) * 50 + 80, opacity: 0, rotate: 360 }} transition={{ duration: 1.1, ease: "easeOut" }} />
            ))}
          </div>
        )}
      </div>

      <motion.button
        onClick={() => (haptic(), setSheet(true))}
        aria-label="Add task"
        className="absolute bottom-8 right-5 grid size-14 place-items-center rounded-full bg-zinc-900 text-white shadow-xl"
        animate={tasks.length === 0 && !sheet && !reduced ? { boxShadow: ["0 0 0 0 rgb(139 92 246 / .5)", "0 0 0 16px rgb(139 92 246 / 0)"] } : undefined}
        transition={{ duration: 1.6, repeat: Infinity }}
        whileTap={reduced ? undefined : { scale: 0.9 }}
      >
        <Plus className="size-6" />
      </motion.button>

      <AnimatePresence>
        {sheet && (
          <>
            <motion.div key="scrim" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSheet(false)} className="absolute inset-0 bg-black/30" />
            <motion.form
              key="sheet"
              onSubmit={(e) => (e.preventDefault(), add())}
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={reduced ? { duration: 0 } : spring.smooth}
              className="absolute inset-x-0 bottom-0 rounded-t-3xl bg-white p-5 pb-8 shadow-2xl"
            >
              <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-zinc-200" />
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">New task</h3>
                <button type="button" onClick={() => setSheet(false)} aria-label="Close"><X className="size-5 text-zinc-400" /></button>
              </div>
              <input autoFocus value={draft} onChange={(e) => setDraft(e.target.value)} placeholder="What needs doing?" aria-label="Task title" className="mt-3 w-full rounded-xl bg-zinc-100 px-3 py-3 text-sm outline-none focus:ring-2 focus:ring-violet-400" />
              <button type="submit" disabled={!draft.trim()} className="mt-3 w-full rounded-xl bg-zinc-900 py-3 text-sm font-semibold text-white disabled:opacity-40">Add task</button>
            </motion.form>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
```

## Usage example
```tsx
"use client";
import { Phone } from "@/components/kinetik/phone" /* demo frame + haptic() stand-in */;
import { FlowEmptyState } from "@/components/kinetik/flow-empty-state";
export default function Demo({ initialStep }: { initialStep?: number }) { return <Phone><FlowEmptyState initialStep={initialStep} /></Phone>; }
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

## lib/kinetik/tokens.ts
```ts
/**
 * kinetik motion tokens — the single motion language shared by web (CSS / Motion / GSAP)
 * and native (Reanimated). Import tokens, never inline magic numbers.
 */

/** Durations in milliseconds. */
export const duration = {
  instant: 0,
  micro: 100,
  fast: 150,
  base: 220,
  moderate: 320,
  slow: 480,
  slower: 700,
  cinematic: 1200,
} as const;
export type DurationToken = keyof typeof duration;

/** Durations in seconds (Motion / GSAP use seconds). */
export const durationS = Object.fromEntries(
  Object.entries(duration).map(([k, v]) => [k, v / 1000]),
) as { [K in DurationToken]: number };

type Bezier = readonly [number, number, number, number];

/** Cubic-bezier control points (Motion accepts these arrays directly). */
export const easeBezier = {
  standard: [0.2, 0, 0, 1],
  enter: [0, 0, 0.2, 1],
  exit: [0.4, 0, 1, 1],
  emphasized: [0.2, 0, 0, 1],
  expoOut: [0.16, 1, 0.3, 1],
  backOut: [0.34, 1.56, 0.64, 1],
} as const satisfies Record<string, Bezier>;
export type EaseToken = keyof typeof easeBezier | "springCss" | "linear";

/** Spring-like easing in pure CSS via linear() (stiffness≈260, damping≈30). */
export const springCss =
  "linear(0, 0.009, 0.035 2.1%, 0.141 4.4%, 0.281 6.7%, 0.723 12.9%, 0.938 16.7%, 1.017 19.4%, 1.067, 1.099 24.3%, 1.108 26%, 1.100, 1.078 30.1%, 1.002 35.7%, 0.981 38.5%, 0.968 41.5%, 0.965 44.7%, 0.976 51.4%, 1.001 60%, 1.008 66.7%, 1.002 81%, 1)";

/** CSS easing strings. */
export const ease: Record<EaseToken, string> = {
  ...(Object.fromEntries(
    Object.entries(easeBezier).map(([k, v]) => [k, `cubic-bezier(${v.join(", ")})`]),
  ) as Record<keyof typeof easeBezier, string>),
  springCss,
  linear: "linear",
};

/** Matching GSAP ease names. */
export const gsapEase: Record<EaseToken, string> = {
  standard: "power3.out",
  enter: "power2.out",
  exit: "power2.in",
  emphasized: "power4.out",
  expoOut: "expo.out",
  backOut: "back.out(1.7)",
  springCss: "elastic.out(1, 0.6)",
  linear: "none",
};

/** Matching Anime.js v4 ease names. */
export const animeEase: Record<EaseToken, string> = {
  standard: "outCubic",
  enter: "outQuad",
  exit: "inQuad",
  emphasized: "outQuart",
  expoOut: "outExpo",
  backOut: "outBack(1.7)",
  springCss: "outElastic(1, .6)",
  linear: "linear",
};

export type SpringToken = "snappy" | "smooth" | "gentle" | "bouncy" | "heavy";

/** Spring presets — numbers are identical for Motion and Reanimated. */
export const springConfig: Record<SpringToken, { stiffness: number; damping: number; mass: number }> = {
  snappy: { stiffness: 500, damping: 35, mass: 1 },
  smooth: { stiffness: 260, damping: 30, mass: 1 },
  gentle: { stiffness: 120, damping: 20, mass: 1 },
  bouncy: { stiffness: 400, damping: 15, mass: 1 },
  heavy: { stiffness: 200, damping: 40, mass: 1.5 },
};

/** Ready-to-spread Motion transitions: `transition={spring.smooth}`. */
export const spring = Object.fromEntries(
  Object.entries(springConfig).map(([k, v]) => [k, { type: "spring" as const, ...v }]),
) as Record<SpringToken, { type: "spring"; stiffness: number; damping: number; mass: number }>;

/** Motion's perceptual equivalents ({ visualDuration, bounce }). */
export const springVisual: Record<SpringToken, { type: "spring"; visualDuration: number; bounce: number }> = {
  snappy: { type: "spring", visualDuration: 0.18, bounce: 0.05 },
  smooth: { type: "spring", visualDuration: 0.3, bounce: 0.1 },
  gentle: { type: "spring", visualDuration: 0.45, bounce: 0.15 },
  bouncy: { type: "spring", visualDuration: 0.3, bounce: 0.45 },
  heavy: { type: "spring", visualDuration: 0.5, bounce: 0 },
};

/** Reanimated `withSpring` configs (same physics). */
export const reanimatedSpring = springConfig;

export const distance = { xs: 4, sm: 8, md: 16, lg: 32, xl: 64 } as const;
export const stagger = { tight: 0.02, base: 0.05, loose: 0.1 } as const;
export const blur = { in: 8 } as const;
export const press = { scale: 0.97, hoverLift: -2 } as const;

/** CSS custom properties, e.g. for `:root`. */
export function toCssVars(): Record<string, string> {
  const vars: Record<string, string> = {};
  for (const [k, v] of Object.entries(duration)) vars[`--k-duration-${k}`] = `${v}ms`;
  for (const [k, v] of Object.entries(ease)) vars[`--k-ease-${k}`] = v;
  for (const [k, v] of Object.entries(distance)) vars[`--k-distance-${k}`] = `${v}px`;
  for (const [k, v] of Object.entries(stagger)) vars[`--k-stagger-${k}`] = `${v}s`;
  return vars;
}

export const tokens = { duration, durationS, ease, easeBezier, gsapEase, animeEase, spring, springConfig, springVisual, distance, stagger, blur, press };
export default tokens;
```

## Steps
1. Install the dependencies above.
2. Create the files exactly as given, fixing import aliases if the project doesn't use `@/`.
3. Drop the usage example into a page and adapt copy/colors to the project's design system.
4. Verify: toggle "Reduce motion" in OS settings — the component must still be fully usable.
