You are given a task to integrate a component from the **kinetik** motion library into this codebase.

# Questionnaire (`questionnaire`)

Typeform-style one-question-at-a-time form: answers slide the next question in from the direction of travel, the progress bar springs forward, number keys pick and Enter continues.

## What it should do
Build a one-question-at-a-time questionnaire with Motion: AnimatePresence mode=wait with direction-aware variants (enter from y=40·dir with blur, exit to y=−40·dir). Single-choice answers auto-advance after 260 ms; multi-choice shows Continue. Spring a progress bar width. Number keys pick options, Enter continues, a back button returns. Finish with a success state.

## Project requirements
- React 19 + TypeScript, Tailwind CSS v4, shadcn/ui-style CSS variables (`background`, `foreground`, `muted`, `muted-foreground`, `border`, `card`, `primary`, `ring`). If the project lacks shadcn, set it up first (`npx shadcn@latest init`).
- Animation engine: **motion**.
- Install dependencies: `npm i motion lucide-react`
- Put the component at `components/kinetik/questionnaire.tsx`.
- `cn` lives at `lib/kinetik/utils.ts` (source below).
- Shared hooks go at `lib/kinetik/core.ts` (source below).
- Motion tokens go at `lib/kinetik/tokens.ts` (source below). Use tokens instead of magic numbers.

## Non-negotiables
- **Accessibility:** Each question is a fieldset with legend; options are radio/checkbox roles with aria-checked; progressbar with values; keyboard shortcuts 1–9 and Enter. Reduced motion: crossfade.
- **Performance:** One question mounted at a time (AnimatePresence mode=wait).
- Respect `prefers-reduced-motion` (replace movement with opacity or an instant change).
- Animate only transform / opacity / filter / clip-path. No hard-coded theme colors — use CSS variables so it works in light and dark.

## Source — components/kinetik/questionnaire.tsx
```tsx
"use client";
import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ArrowLeft, Check } from "lucide-react";
import { spring } from "@/lib/kinetik/tokens";
import { cn, useReducedMotion } from "@/lib/kinetik/core";

export interface Question {
  id: string;
  title: string;
  hint?: string;
  options: string[];
  /** Allow picking several options. */
  multiple?: boolean;
}

export interface QuestionnaireProps {
  questions: Question[];
  onComplete?: (answers: Record<string, string[]>) => void;
  className?: string;
}

/**
 * One question at a time, Typeform-style: answers slide the next question in from the direction of
 * travel, a progress bar springs forward, number keys pick options and Enter continues.
 */
export function Questionnaire({ questions, onComplete, className }: QuestionnaireProps) {
  const reduced = useReducedMotion();
  const [step, setStep] = useState(0);
  const [dir, setDir] = useState(1);
  const [answers, setAnswers] = useState<Record<string, string[]>>({});
  const done = step >= questions.length;
  const q = questions[Math.min(step, questions.length - 1)];
  const picked = answers[q.id] ?? [];

  const go = (d: number) => {
    setDir(d);
    const next = step + d;
    if (next === questions.length) onComplete?.(answers);
    setStep(Math.max(0, Math.min(questions.length, next)));
  };
  const pick = (opt: string) => {
    const cur = answers[q.id] ?? [];
    const val = q.multiple ? (cur.includes(opt) ? cur.filter((o) => o !== opt) : [...cur, opt]) : [opt];
    setAnswers((a) => ({ ...a, [q.id]: val }));
    if (!q.multiple) setTimeout(() => go(1), reduced ? 0 : 260);
  };

  const variants = {
    enter: (d: number) => (reduced ? { opacity: 0 } : { opacity: 0, y: d * 40, filter: "blur(6px)" }),
    center: { opacity: 1, y: 0, filter: "blur(0px)" },
    exit: (d: number) => (reduced ? { opacity: 0 } : { opacity: 0, y: d * -40, filter: "blur(6px)" }),
  };

  return (
    <div
      className={cn("flex h-full w-full max-w-lg flex-col", className)}
      onKeyDown={(e) => {
        if (done) return;
        const n = Number(e.key);
        if (n >= 1 && n <= q.options.length) pick(q.options[n - 1]);
        if (e.key === "Enter" && picked.length) go(1);
      }}
    >
      <div className="h-1 overflow-hidden rounded-full bg-muted" role="progressbar" aria-valuemin={0} aria-valuemax={questions.length} aria-valuenow={step}>
        <motion.div className="h-full rounded-full bg-primary" animate={{ width: `${(step / questions.length) * 100}%` }} transition={reduced ? { duration: 0 } : spring.smooth} />
      </div>
      <div className="relative mt-8 flex-1">
        <AnimatePresence mode="wait" custom={dir} initial={false}>
          {done ? (
            <motion.div key="done" variants={variants} custom={dir} initial="enter" animate="center" exit="exit" transition={spring.smooth} className="flex flex-col items-start gap-3">
              <span className="grid size-12 place-items-center rounded-full bg-primary text-primary-foreground"><Check className="size-6" /></span>
              <h3 className="text-2xl font-semibold tracking-tight">All set — thanks!</h3>
              <p className="text-sm text-muted-foreground">We tailored your workspace from {Object.keys(answers).length} answers.</p>
              <button type="button" onClick={() => (setAnswers({}), setDir(-1), setStep(0))} className="text-sm underline underline-offset-4">Start over</button>
            </motion.div>
          ) : (
            <motion.fieldset key={q.id} variants={variants} custom={dir} initial="enter" animate="center" exit="exit" transition={reduced ? { duration: 0.15 } : spring.smooth}>
              <legend className="text-sm text-muted-foreground">
                {step + 1} → {questions.length}
              </legend>
              <h3 className="mt-1 text-2xl font-semibold tracking-tight">{q.title}</h3>
              {q.hint && <p className="mt-1 text-sm text-muted-foreground">{q.hint}</p>}
              <div className="mt-5 grid gap-2">
                {q.options.map((opt, i) => {
                  const on = picked.includes(opt);
                  return (
                    <motion.button
                      key={opt}
                      type="button"
                      role={q.multiple ? "checkbox" : "radio"}
                      aria-checked={on}
                      onClick={() => pick(opt)}
                      whileTap={reduced ? undefined : { scale: 0.98 }}
                      animate={on && !reduced ? { scale: [1, 1.02, 1] } : undefined}
                      className={cn("flex items-center gap-3 rounded-xl border px-3 py-2.5 text-left text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring", on ? "border-primary bg-primary/10" : "border-border hover:bg-muted")}
                    >
                      <kbd className={cn("grid size-6 place-items-center rounded-md border text-[11px]", on ? "border-primary bg-primary text-primary-foreground" : "border-border")}>{on ? <Check className="size-3.5" /> : i + 1}</kbd>
                      {opt}
                    </motion.button>
                  );
                })}
              </div>
              <div className="mt-6 flex items-center gap-3">
                {step > 0 && (
                  <button type="button" onClick={() => go(-1)} aria-label="Previous question" className="grid size-9 place-items-center rounded-lg border border-border hover:bg-muted"><ArrowLeft className="size-4" /></button>
                )}
                {q.multiple && (
                  <button type="button" disabled={!picked.length} onClick={() => go(1)} className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground disabled:opacity-40">
                    Continue <span className="opacity-60">↵</span>
                  </button>
                )}
              </div>
            </motion.fieldset>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
```

## Usage example
```tsx
"use client";
import { Questionnaire, type Question } from "@/components/kinetik/questionnaire";

const questions: Question[] = [
  { id: "role", title: "What best describes you?", options: ["Designer", "Engineer", "Founder", "Student"] },
  { id: "goals", title: "What do you want to build?", hint: "Pick all that apply.", multiple: true, options: ["Marketing site", "Product UI", "Mobile app", "Portfolio"] },
  { id: "team", title: "How big is your team?", options: ["Just me", "2–10", "11–50", "50+"] },
];

export default function Demo() {
  return (
    <div className="grid h-full place-items-center p-8">
      <Questionnaire questions={questions} />
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
