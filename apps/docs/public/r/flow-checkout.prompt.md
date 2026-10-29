You are given a task to integrate a flow from the **kinetik** motion library into this codebase.

# Swipe-to-Pay Checkout (`flow-checkout`)

Mobile bag with rolling quantity stepper and a swipe-to-pay slider that fills green, snaps home if released early, and lands on a spinning success badge.

## What it should do
Build a mobile checkout: "Your bag" with a product card (image, title, variant, price) and a pill quantity stepper whose number rolls vertically on change; a summary (subtotal, shipping, total); and a swipe-to-pay slider pinned at the bottom.

Motion spec:
- Swipe-to-pay: pan the white knob along the track; a green fill follows (width = x + knob); the label fades out over the first 120px. Release past 85% → snap to end (spring 500/35), success haptic, proceed; otherwise spring back (400/15). Tapping the knob also pays (accessibility).
- Quantity: press scale .85 + light haptic, digit rolls ±14px.
- Success: badge scales from 0 with -90° rotation on a bouncy spring.

## Project requirements
- React 19 + TypeScript, Tailwind CSS v4, shadcn/ui-style CSS variables (`background`, `foreground`, `muted`, `muted-foreground`, `border`, `card`, `primary`, `ring`). If the project lacks shadcn, set it up first (`npx shadcn@latest init`).
- Animation engine: **motion**.
- Install dependencies: `npm i motion lucide-react`
- Put the component at `components/kinetik/flow-checkout.tsx`.
- Motion tokens go at `lib/kinetik/tokens.ts` (source below). Use tokens instead of magic numbers.

## Target platform: React Native (Expo)
The source below is the **web prototype** of this flow. Build the real thing natively:
- Expo SDK 55+, Expo Router, React Native New Architecture.
- `react-native-reanimated` 4 (+ `react-native-worklets`) for all animation; `react-native-gesture-handler` for pans/drags; `expo-haptics` wherever the prototype calls `haptic()` (light → ImpactFeedbackStyle.Light, medium → Medium, success/error → NotificationFeedbackType).
- Use these exact spring presets with `withSpring` (same physics as web): snappy {stiffness:500,damping:35}, smooth {260,30}, gentle {120,20}, bouncy {400,15}, heavy {200,40,mass:1.5}.
- Gesture- and scroll-driven values must run on the UI thread (shared values, `useAnimatedStyle`, `useAnimatedScrollHandler`). State-driven transitions can use Reanimated's CSS-style API or layout animations (`entering`/`exiting`/`layout`).
- Respect `useReducedMotion()` / `ReduceMotion.System`: swap movement for fades.
- Screens: Bag → Quantity → Paid.

## Non-negotiables
- **Accessibility:** The slider handle is also a button (tap to pay) so the gesture is never required; quantity buttons labelled.
- **Performance:** Single drag motion value drives handle, fill and label fade.
- Respect `prefers-reduced-motion` (replace movement with opacity or an instant change).
- Animate only transform / opacity / filter / clip-path. No hard-coded theme colors — use CSS variables so it works in light and dark.

## Source — components/kinetik/flow-checkout.tsx
```tsx
"use client";
import { useRef, useState } from "react";
import { animate, AnimatePresence, motion, useMotionValue, useTransform } from "motion/react";
import { ChevronRight, Minus, Plus } from "lucide-react";
import { spring } from "@/lib/kinetik/tokens";
import { haptic } from "@/components/kinetik/phone" /* demo frame + haptic() stand-in */;

function SwipeToPay({ onDone, label }: { onDone: () => void; label: string }) {
  const track = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const max = () => (track.current?.offsetWidth ?? 280) - 56;
  const fill = useTransform(x, (v) => v + 56);
  const textOpacity = useTransform(x, [0, 120], [1, 0]);
  return (
    <div ref={track} className="relative h-14 overflow-hidden rounded-full bg-zinc-900 text-white">
      <motion.div className="absolute inset-y-0 left-0 rounded-full bg-emerald-500" style={{ width: fill }} />
      <motion.span style={{ opacity: textOpacity }} className="absolute inset-0 grid place-items-center text-sm font-semibold">{label}</motion.span>
      <motion.button
        aria-label={label}
        onClick={() => { haptic("success"); onDone(); }}
        drag="x"
        dragConstraints={track}
        dragElastic={0}
        dragMomentum={false}
        style={{ x }}
        onDragEnd={() => {
          if (x.get() > max() * 0.85) {
            animate(x, max(), spring.snappy);
            haptic("success");
            setTimeout(onDone, 250);
          } else animate(x, 0, spring.bouncy);
        }}
        className="absolute top-1 left-1 z-10 grid size-12 cursor-grab place-items-center rounded-full bg-white text-zinc-900 active:cursor-grabbing"
      >
        <ChevronRight className="size-5" />
      </motion.button>
    </div>
  );
}

export function FlowCheckout({ initialStep = 0 }: { initialStep?: number }) {
  const [qty, setQty] = useState(1);
  const [paid, setPaid] = useState(initialStep === 2);
  const total = 64 * qty + 8;
  return (
    <div className="flex h-full flex-col bg-zinc-50 px-5 pt-14 pb-8 text-zinc-900">
      <AnimatePresence mode="wait">
        {paid ? (
          <motion.div key="ok" className="flex flex-1 flex-col items-center justify-center text-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <motion.div className="grid size-24 place-items-center rounded-full bg-emerald-500 text-4xl text-white" initial={{ scale: 0, rotate: -90 }} animate={{ scale: 1, rotate: 0 }} transition={spring.bouncy}>✓</motion.div>
            <h2 className="mt-5 text-2xl font-semibold">Paid ${total}</h2>
            <p className="text-sm text-zinc-500">Arriving Tuesday · Order #2048</p>
            <button onClick={() => setPaid(false)} className="mt-6 text-xs text-zinc-400">Restart demo</button>
          </motion.div>
        ) : (
          <motion.div key="cart" className="flex flex-1 flex-col" exit={{ opacity: 0, y: -20 }}>
            <h2 className="text-2xl font-semibold tracking-tight">Your bag</h2>
            <motion.div layout className="mt-5 flex gap-3 rounded-3xl bg-white p-3 shadow-sm">
              <img src="/demo/photo-6.jpg" alt="" className="size-24 rounded-2xl object-cover" />
              <div className="flex flex-1 flex-col">
                <p className="font-semibold">Aurora Print</p>
                <p className="text-xs text-zinc-500">A3 · Matte</p>
                <div className="mt-auto flex items-center justify-between">
                  <p className="font-semibold tabular-nums">${64 * qty}</p>
                  <div className="flex items-center gap-2 rounded-full bg-zinc-100 p-1">
                    <motion.button whileTap={{ scale: 0.85 }} onClick={() => { setQty((q) => Math.max(1, q - 1)); haptic(); }} aria-label="Decrease" className="grid size-7 place-items-center rounded-full bg-white"><Minus className="size-3.5" /></motion.button>
                    <span className="relative w-4 overflow-hidden text-center text-sm font-semibold tabular-nums">
                      <AnimatePresence mode="popLayout" initial={false}><motion.span key={qty} className="block" initial={{ y: 14, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -14, opacity: 0 }} transition={spring.snappy}>{qty}</motion.span></AnimatePresence>
                    </span>
                    <motion.button whileTap={{ scale: 0.85 }} onClick={() => { setQty((q) => Math.min(9, q + 1)); haptic(); }} aria-label="Increase" className="grid size-7 place-items-center rounded-full bg-white"><Plus className="size-3.5" /></motion.button>
                  </div>
                </div>
              </div>
            </motion.div>
            <dl className="mt-5 space-y-2 text-sm">
              <div className="flex justify-between text-zinc-500"><dt>Subtotal</dt><dd className="tabular-nums">${64 * qty}</dd></div>
              <div className="flex justify-between text-zinc-500"><dt>Shipping</dt><dd>$8</dd></div>
              <div className="flex justify-between border-t border-zinc-200 pt-2 text-base font-semibold"><dt>Total</dt><dd className="tabular-nums">${total}</dd></div>
            </dl>
            <div className="mt-auto"><SwipeToPay label={`Swipe to pay $${total}`} onDone={() => setPaid(true)} /></div>
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
import { FlowCheckout } from "@/components/kinetik/flow-checkout";

export default function Demo({ initialStep }: { initialStep?: number }) {
  return <Phone><FlowCheckout initialStep={initialStep} /></Phone>;
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
