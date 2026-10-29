You are given a task to integrate a flow from the **kinetik** motion library into this codebase.

# Paywall (`flow-paywall`)

Subscription paywall: features stagger in, plan cards share a sliding selection ring, trial switch springs, and the CTA shimmers into a success state.

## What it should do
Build a subscription paywall screen (dark, violet glow at the top).

Layout: close button, two-line headline, 4 feature rows with check bullets, 3 plan cards (Yearly w/ "Save 58%" badge, Monthly, Lifetime) as a radio group, a "Free 7-day trial" switch row, primary CTA pinned to the bottom, "Cancel anytime · Restore purchases" footnote.

Motion spec:
- Feature rows: fade + slide from x -12, staggered 60ms (spring 260/30).
- Plan selection: a single highlight ring + radio dot move between cards as a shared element (spring 500/35); light haptic on change.
- Trial switch: spring thumb; CTA label swaps "Start free trial" ↔ "Subscribe".
- CTA: a soft light band sweeps across every ~2.8s; press scale .97.
- Success: content fades out, a green check circle pops [0 → 1.15 → 1], success haptic.

## Project requirements
- React 19 + TypeScript, Tailwind CSS v4, shadcn/ui-style CSS variables (`background`, `foreground`, `muted`, `muted-foreground`, `border`, `card`, `primary`, `ring`). If the project lacks shadcn, set it up first (`npx shadcn@latest init`).
- Animation engine: **motion**.
- Install dependencies: `npm i motion lucide-react`
- Put the component at `components/kinetik/flow-paywall.tsx`.
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
- Screens: Yearly selected → Monthly selected → Subscribed.

## Non-negotiables
- **Accessibility:** Plans are a radiogroup; trial is a switch; restore/cancel copy always visible (store guidelines).
- **Performance:** Shared layoutId ring; shimmer is a transform loop on one element.
- Respect `prefers-reduced-motion` (replace movement with opacity or an instant change).
- Animate only transform / opacity / filter / clip-path. No hard-coded theme colors — use CSS variables so it works in light and dark.

## Source — components/kinetik/flow-paywall.tsx
```tsx
"use client";
import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Check, X } from "lucide-react";
import { cn } from "@/lib/kinetik/core";
import { spring } from "@/lib/kinetik/tokens";
import { haptic } from "@/components/kinetik/phone" /* demo frame + haptic() stand-in */;

const plans = [
  { id: "year", name: "Yearly", price: "$59.99", per: "$4.99/mo", badge: "Save 58%" },
  { id: "month", name: "Monthly", price: "$11.99", per: "per month" },
  { id: "life", name: "Lifetime", price: "$149", per: "one-time" },
];
const features = ["Unlimited projects", "All 70+ animations", "Mobile flows & Figma kit", "Priority support"];

export function FlowPaywall({ initialStep = 0 }: { initialStep?: number }) {
  const [plan, setPlan] = useState(initialStep === 1 ? "month" : "year");
  const [trial, setTrial] = useState(true);
  const [done, setDone] = useState(initialStep === 2);
  return (
    <div className="relative flex h-full flex-col overflow-hidden bg-zinc-950 px-5 pt-14 pb-8 text-white">
      <div className="pointer-events-none absolute -top-24 left-1/2 size-80 -translate-x-1/2 rounded-full bg-violet-600/40 blur-3xl" />
      <button aria-label="Close" className="absolute top-12 right-4 z-10 grid size-8 place-items-center rounded-full bg-white/10"><X className="size-4" /></button>
      <AnimatePresence mode="wait">
        {done ? (
          <motion.div key="done" className="relative flex flex-1 flex-col items-center justify-center text-center" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={spring.bouncy}>
            <motion.div className="grid size-20 place-items-center rounded-full bg-emerald-500" initial={{ scale: 0 }} animate={{ scale: [0, 1.15, 1] }} transition={{ duration: 0.5 }}><Check className="size-10" strokeWidth={3} /></motion.div>
            <h2 className="mt-5 text-2xl font-semibold">Welcome to Pro</h2>
            <p className="mt-1 text-sm text-white/60">{trial ? "Your 7-day trial has started." : "Thanks for subscribing."}</p>
            <button onClick={() => setDone(false)} className="mt-6 text-xs text-white/50">Restart demo</button>
          </motion.div>
        ) : (
          <motion.div key="form" className="relative flex flex-1 flex-col" exit={{ opacity: 0, y: 20 }}>
            <motion.h2 className="text-[26px] leading-tight font-semibold tracking-tight" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>Unlock everything<br />in kinetik Pro</motion.h2>
            <ul className="mt-5 space-y-2.5">
              {features.map((f, n) => (
                <motion.li key={f} className="flex items-center gap-2.5 text-sm" initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 + n * 0.06, ...spring.smooth }}>
                  <span className="grid size-5 place-items-center rounded-full bg-violet-500"><Check className="size-3" strokeWidth={3} /></span>{f}
                </motion.li>
              ))}
            </ul>
            <div className="mt-6 space-y-2.5" role="radiogroup" aria-label="Plans">
              {plans.map((p) => {
                const on = plan === p.id;
                return (
                  <button key={p.id} role="radio" aria-checked={on} onClick={() => { setPlan(p.id); haptic("light"); }} className={cn("relative flex w-full items-center gap-3 rounded-2xl border p-3.5 text-left transition-colors", on ? "border-violet-400" : "border-white/10 bg-white/5")}>
                    {on && <motion.span layoutId="paywall-sel" transition={spring.snappy} className="absolute inset-0 rounded-2xl bg-violet-500/15 ring-2 ring-violet-400" />}
                    <span className={cn("relative grid size-5 place-items-center rounded-full border-2", on ? "border-violet-400" : "border-white/30")}>{on && <motion.span layoutId="paywall-dot" className="size-2.5 rounded-full bg-violet-400" transition={spring.snappy} />}</span>
                    <span className="relative flex-1"><span className="block text-sm font-semibold">{p.name}</span><span className="text-xs text-white/50">{p.per}</span></span>
                    {p.badge && <span className="relative rounded-full bg-amber-400 px-2 py-0.5 text-[10px] font-bold text-black">{p.badge}</span>}
                    <span className="relative text-sm font-semibold">{p.price}</span>
                  </button>
                );
              })}
            </div>
            <label className="mt-4 flex items-center justify-between rounded-2xl bg-white/5 px-3.5 py-3 text-sm">
              Free 7-day trial
              <button role="switch" aria-checked={trial} onClick={() => { setTrial((t) => !t); haptic("light"); }} className={cn("flex h-7 w-12 rounded-full p-0.5 transition-colors", trial ? "justify-end bg-emerald-500" : "justify-start bg-white/20")}>
                <motion.span layout transition={spring.snappy} className="size-6 rounded-full bg-white" />
              </button>
            </label>
            <motion.button whileTap={{ scale: 0.97 }} onClick={() => { haptic("success"); setDone(true); }} className="relative mt-auto h-14 overflow-hidden rounded-2xl bg-white text-[15px] font-semibold text-black">
              <motion.span aria-hidden className="absolute inset-y-0 w-1/3 bg-gradient-to-r from-transparent via-violet-300/60 to-transparent" animate={{ x: ["-120%", "320%"] }} transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut", repeatDelay: 0.6 }} />
              <span className="relative">{trial ? "Start free trial" : "Subscribe"}</span>
            </motion.button>
            <p className="mt-2 text-center text-[11px] text-white/40">Cancel anytime · Restore purchases</p>
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
import { Phone } from "@/components/kinetik/phone" /* demo frame + haptic() stand-in */;
import { FlowPaywall } from "@/components/kinetik/flow-paywall";

export default function Demo({ initialStep }: { initialStep?: number }) {
  return <Phone dark><FlowPaywall initialStep={initialStep} /></Phone>;
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
