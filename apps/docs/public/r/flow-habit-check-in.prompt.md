You are given a task to integrate a flow from the **kinetik** motion library into this codebase.

# Habit Check-in (`flow-habit-check-in`)

Daily habit tracker: checking a habit bursts particles, fills the streak ring, and completing all of them extends the 🔥 streak with a celebration toast.

## What it should do
Build a daily habit check-in screen (dark): date + "Today" header, a card with a progress ring (orange→yellow gradient) around a 🔥 emoji plus "Current streak N days", then 4 habit rows (tinted icon tile, label, round check button), and a celebration banner when all are done.

Motion spec:
- Checking a habit: medium haptic; the check circle fills with the habit color and pops [1, 1.25, 1]; 8 particles burst radially 22px (expo-out, 500ms); label dims with strikethrough.
- Ring: pathLength springs to done/total (spring 120/20).
- All done: success haptic, streak number rolls up (+1) with a bouncy spring, the flame pops, and the banner slides up from the bottom.

## Project requirements
- React 19 + TypeScript, Tailwind CSS v4, shadcn/ui-style CSS variables (`background`, `foreground`, `muted`, `muted-foreground`, `border`, `card`, `primary`, `ring`). If the project lacks shadcn, set it up first (`npx shadcn@latest init`).
- Animation engine: **motion**.
- Install dependencies: `npm i motion lucide-react`
- Put the component at `components/kinetik/flow-habit-check-in.tsx`.
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
- Screens: Fresh day → Halfway → Perfect day.

## Non-negotiables
- **Accessibility:** Each habit is an aria-pressed toggle with a text label; streak count is text.
- **Performance:** 8 particles per check, unmounted after 600ms; ring is one stroke animation.
- Respect `prefers-reduced-motion` (replace movement with opacity or an instant change).
- Animate only transform / opacity / filter / clip-path. No hard-coded theme colors — use CSS variables so it works in light and dark.

## Source — components/kinetik/flow-habit-check-in.tsx
```tsx
"use client";
import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Check, Droplets, Dumbbell, BookOpen, Moon } from "lucide-react";
import { cn } from "@/lib/kinetik/core";
import { spring } from "@/lib/kinetik/tokens";
import { haptic } from "@/components/kinetik/phone" /* demo frame + haptic() stand-in */;

const habits = [
  { id: "water", label: "Drink water", icon: Droplets, color: "#38bdf8" },
  { id: "move", label: "Move 30 min", icon: Dumbbell, color: "#f97316" },
  { id: "read", label: "Read 10 pages", icon: BookOpen, color: "#a78bfa" },
  { id: "sleep", label: "In bed by 11", icon: Moon, color: "#34d399" },
];

export function FlowHabitCheckIn({ initialStep = 0 }: { initialStep?: number }) {
  const [done, setDone] = useState<string[]>(initialStep >= 1 ? ["water", "read"] : []);
  const [burst, setBurst] = useState<string | null>(null);
  const all = done.length === habits.length || initialStep === 2;
  const pct = all ? 1 : done.length / habits.length;
  const streak = 11 + (all ? 1 : 0);

  const toggle = (id: string) => {
    const on = !done.includes(id);
    haptic(on ? "medium" : "light");
    setDone((d) => (on ? [...d, id] : d.filter((x) => x !== id)));
    if (on) {
      setBurst(id);
      setTimeout(() => setBurst(null), 600);
      if (done.length + 1 === habits.length) setTimeout(() => haptic("success"), 200);
    }
  };

  return (
    <div className="flex h-full flex-col bg-zinc-950 px-5 pt-14 pb-8 text-white">
      <p className="text-xs text-white/50">Thursday, Oct 29</p>
      <h2 className="text-2xl font-semibold tracking-tight">Today</h2>
      <div className="mt-5 flex items-center gap-5 rounded-3xl bg-white/5 p-5">
        <div className="relative size-24">
          <svg viewBox="0 0 100 100" className="size-full -rotate-90">
            <circle cx="50" cy="50" r="42" fill="none" stroke="rgb(255 255 255 / .1)" strokeWidth="10" />
            <motion.circle cx="50" cy="50" r="42" fill="none" stroke="url(#k-habit)" strokeWidth="10" strokeLinecap="round" pathLength={1} initial={false} animate={{ pathLength: pct }} transition={spring.gentle} />
            <defs><linearGradient id="k-habit"><stop stopColor="#f97316" /><stop offset="1" stopColor="#facc15" /></linearGradient></defs>
          </svg>
          <div className="absolute inset-0 grid place-items-center">
            <motion.span key={streak} initial={{ scale: 0.5 }} animate={{ scale: [0.5, 1.3, 1] }} transition={{ duration: 0.5 }} className="text-2xl" aria-hidden>
              🔥
            </motion.span>
          </div>
        </div>
        <div>
          <p className="text-xs text-white/50">Current streak</p>
          <p className="text-3xl font-semibold tabular-nums">
            <AnimatePresence mode="popLayout" initial={false}>
              <motion.span key={streak} className="inline-block" initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -20, opacity: 0 }} transition={spring.bouncy}>{streak}</motion.span>
            </AnimatePresence>{" "}days
          </p>
          <p className="text-xs text-white/50">{done.length}/{habits.length} habits done</p>
        </div>
      </div>
      <ul className="mt-5 space-y-2.5">
        {habits.map((h) => {
          const on = done.includes(h.id);
          return (
            <li key={h.id}>
              <motion.button whileTap={{ scale: 0.97 }} onClick={() => toggle(h.id)} aria-pressed={on} className={cn("relative flex w-full items-center gap-3 overflow-hidden rounded-2xl p-3.5 text-left transition-colors", on ? "bg-white/10" : "bg-white/5")}>
                <span className="grid size-10 place-items-center rounded-xl" style={{ background: `${h.color}26`, color: h.color }}><h.icon className="size-5" /></span>
                <span className={cn("flex-1 text-sm font-medium transition-opacity", on && "opacity-50 line-through")}>{h.label}</span>
                <span className="relative grid size-8 place-items-center">
                  <AnimatePresence>
                    {burst === h.id && Array.from({ length: 8 }, (_, n) => (
                      <motion.span key={n} className="absolute size-1.5 rounded-full" style={{ background: h.color }} initial={{ x: 0, y: 0, opacity: 1 }} animate={{ x: Math.cos((n / 8) * Math.PI * 2) * 22, y: Math.sin((n / 8) * Math.PI * 2) * 22, opacity: 0, scale: 0 }} transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }} />
                    ))}
                  </AnimatePresence>
                  <motion.span className="grid size-8 place-items-center rounded-full border-2" animate={{ backgroundColor: on ? h.color : "rgba(0,0,0,0)", borderColor: on ? h.color : "rgba(255,255,255,.25)", scale: on ? [1, 1.25, 1] : 1 }} transition={{ duration: 0.35 }}>
                    {on && <Check className="size-4 text-black" strokeWidth={3} />}
                  </motion.span>
                </span>
              </motion.button>
            </li>
          );
        })}
      </ul>
      <AnimatePresence>
        {all && (
          <motion.p className="mt-auto rounded-2xl bg-gradient-to-r from-orange-500 to-amber-400 p-3.5 text-center text-sm font-semibold text-black" initial={{ y: 40, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 40, opacity: 0 }} transition={spring.bouncy}>
            Perfect day! Streak extended 🔥
          </motion.p>
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
import { FlowHabitCheckIn } from "@/components/kinetik/flow-habit-check-in";

export default function Demo({ initialStep }: { initialStep?: number }) {
  return <Phone dark><FlowHabitCheckIn initialStep={initialStep} /></Phone>;
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
