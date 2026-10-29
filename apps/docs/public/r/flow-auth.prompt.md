You are given a task to integrate a flow from the **kinetik** motion library into this codebase.

# Phone Sign-in (`flow-auth`)

Phone number → SMS code → verified, with a custom keypad, popping digits, a shake on wrong codes and a drawn success check.

## What it should do
Build a phone-number sign-in flow for mobile: (1) "What's your number?" with formatted (555) 000-0000 display and blinking caret, "Send code" button disabled until 10 digits; (2) "Enter the code" with four code cells; (3) verified screen.

Motion spec:
- Screens slide horizontally (enter from +40px, exit to -40px) with spring 260/30.
- Keypad keys: press scale .88 with a gray highlight; light haptic per key.
- Code digits pop in (scale .3→1, bouncy spring 400/15); the active cell has a violet border.
- Wrong code: error haptic + horizontal shake [0,-12,12,-8,8,-3,0] over 450ms, then clear.
- Correct code: success haptic, circle then checkmark draw (pathLength), screen pops in with a bouncy spring.

## Project requirements
- React 19 + TypeScript, Tailwind CSS v4, shadcn/ui-style CSS variables (`background`, `foreground`, `muted`, `muted-foreground`, `border`, `card`, `primary`, `ring`). If the project lacks shadcn, set it up first (`npx shadcn@latest init`).
- Animation engine: **motion**.
- Install dependencies: `npm i motion lucide-react`
- Put the component at `components/kinetik/flow-auth.tsx`.
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
- Screens: Phone number → Verification code → Verified.

## Non-negotiables
- **Accessibility:** Keypad keys are labelled buttons; on native, prefer the system number pad with textContentType oneTimeCode for autofill.
- **Performance:** Only the changed digit animates; shake is a single keyframe.
- Respect `prefers-reduced-motion` (replace movement with opacity or an instant change).
- Animate only transform / opacity / filter / clip-path. No hard-coded theme colors — use CSS variables so it works in light and dark.

## Source — components/kinetik/flow-auth.tsx
```tsx
"use client";
import { useState } from "react";
import { AnimatePresence, motion, useAnimation } from "motion/react";
import { ArrowLeft, Delete } from "lucide-react";
import { cn } from "@/lib/kinetik/core";
import { spring } from "@/lib/kinetik/tokens";
import { haptic } from "@/components/kinetik/phone" /* demo frame + haptic() stand-in */;

const keys = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "", "0", "del"];

export function FlowAuth({ initialStep = 0 }: { initialStep?: number }) {
  const [step, setStep] = useState(initialStep);
  const [phone, setPhone] = useState("4155550142");
  const [code, setCode] = useState(initialStep === 1 ? "42" : "");
  const shake = useAnimation();

  const press = async (k: string) => {
    haptic("light");
    if (step === 0) {
      setPhone((p) => (k === "del" ? p.slice(0, -1) : (p + k).slice(0, 10)));
      return;
    }
    const next = k === "del" ? code.slice(0, -1) : (code + k).slice(0, 4);
    setCode(next);
    if (next.length === 4) {
      if (next === "4242") {
        haptic("success");
        setTimeout(() => setStep(2), 350);
      } else {
        haptic("error");
        await shake.start({ x: [0, -12, 12, -8, 8, -3, 0], transition: { duration: 0.45 } });
        setCode("");
      }
    }
  };

  const fmt = (p: string) => p.replace(/(\d{0,3})(\d{0,3})(\d{0,4})/, (_, a, b, c) => [a && `(${a}`, a.length === 3 ? ") " : "", b, c && `-${c}`].join(""));

  return (
    <div className="flex h-full flex-col bg-white px-6 pt-14 pb-6 text-zinc-900">
      <AnimatePresence mode="popLayout" initial={false}>
        {step === 0 && (
          <motion.div key="p" className="flex-1" initial={{ x: -40, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -40, opacity: 0 }} transition={spring.smooth}>
            <h2 className="text-[26px] font-semibold tracking-tight">What&apos;s your number?</h2>
            <p className="mt-1 text-sm text-zinc-500">We&apos;ll text you a code to sign in.</p>
            <div className="mt-8 flex items-center gap-2 border-b-2 border-zinc-900 pb-2 text-2xl font-medium tabular-nums">
              <span className="text-zinc-400">+1</span>
              <span>{fmt(phone) || <span className="text-zinc-300">(555) 000-0000</span>}</span>
              <span className="h-7 w-0.5 animate-pulse bg-violet-500" />
            </div>
          </motion.div>
        )}
        {step === 1 && (
          <motion.div key="c" className="flex-1" initial={{ x: 40, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -40, opacity: 0 }} transition={spring.smooth}>
            <button onClick={() => setStep(0)} aria-label="Back" className="-ml-1 mb-3 grid size-8 place-items-center rounded-full bg-zinc-100"><ArrowLeft className="size-4" /></button>
            <h2 className="text-[26px] font-semibold tracking-tight">Enter the code</h2>
            <p className="mt-1 text-sm text-zinc-500">Sent to +1 {fmt(phone)} · try <b>4242</b></p>
            <motion.div animate={shake} className="mt-8 flex justify-center gap-3">
              {[0, 1, 2, 3].map((n) => (
                <div key={n} className={cn("grid size-14 place-items-center rounded-2xl border-2 text-2xl font-semibold transition-colors", n === code.length ? "border-violet-500" : code[n] ? "border-zinc-900" : "border-zinc-200")}>
                  <AnimatePresence>{code[n] && <motion.span initial={{ scale: 0.3, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.3, opacity: 0 }} transition={spring.bouncy}>{code[n]}</motion.span>}</AnimatePresence>
                </div>
              ))}
            </motion.div>
          </motion.div>
        )}
        {step === 2 && (
          <motion.div key="s" className="flex flex-1 flex-col items-center justify-center text-center" initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={spring.bouncy}>
            <svg viewBox="0 0 52 52" className="size-24">
              <motion.circle cx="26" cy="26" r="24" fill="none" stroke="#10b981" strokeWidth="3" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.5 }} />
              <motion.path d="M15 27l7 7 15-16" fill="none" stroke="#10b981" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.35, delay: 0.4 }} />
            </svg>
            <h2 className="mt-4 text-2xl font-semibold">You&apos;re verified</h2>
            <button onClick={() => { setStep(0); setCode(""); }} className="mt-4 text-xs text-zinc-400">Restart demo</button>
          </motion.div>
        )}
      </AnimatePresence>
      {step < 2 && (
        <>
          {step === 0 && (
            <motion.button whileTap={{ scale: 0.97 }} disabled={phone.length < 10} onClick={() => { haptic("medium"); setStep(1); }} className="mb-4 h-13 rounded-2xl bg-zinc-900 py-3.5 text-[15px] font-semibold text-white transition-opacity disabled:opacity-30">
              Send code
            </motion.button>
          )}
          <div className="grid grid-cols-3 gap-y-1">
            {keys.map((k, n) => (
              k ? (
                <motion.button key={n} whileTap={{ scale: 0.88, backgroundColor: "rgb(228 228 231)" }} onClick={() => press(k)} aria-label={k === "del" ? "Delete" : k} className="mx-auto grid h-12 w-20 place-items-center rounded-2xl text-2xl font-medium">
                  {k === "del" ? <Delete className="size-6" /> : k}
                </motion.button>
              ) : <span key={n} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
```

## Usage example
```tsx
"use client";
import { Phone } from "@/components/kinetik/phone" /* demo frame + haptic() stand-in */;
import { FlowAuth } from "@/components/kinetik/flow-auth";

export default function Demo({ initialStep }: { initialStep?: number }) {
  return <Phone><FlowAuth initialStep={initialStep} /></Phone>;
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
