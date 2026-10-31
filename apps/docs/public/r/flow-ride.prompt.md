You are given a task to integrate a flow from the **kinetik** motion library into this codebase.

# Ride Booking Sheet (`flow-ride`)

Uber-style booking: the route draws on the map, a draggable bottom sheet snaps between three detents with velocity, the ride selection ring glides.

## What it should do
Build a ride-booking screen: a stylized map where the route path draws (pathLength 0→1) and a car emoji travels along it (offset-path); a bottom sheet with three detents (80/300/520pt from top) — on release project with velocity (y + vy·0.2) and spring to the nearest detent (@gorhom/bottom-sheet or Gesture Handler + Reanimated on native); ride options as a radiogroup with a gliding selection ring; Confirm → "Driver on the way" state. Light haptics on snap/select, success on confirm.

## Project requirements
- React 19 + TypeScript, Tailwind CSS v4, shadcn/ui-style CSS variables (`background`, `foreground`, `muted`, `muted-foreground`, `border`, `card`, `primary`, `ring`). If the project lacks shadcn, set it up first (`npx shadcn@latest init`).
- Animation engine: **motion**.
- Install dependencies: `npm i motion`
- Put the component at `components/kinetik/flow-ride.tsx`.
- Motion tokens go at `lib/kinetik/tokens.ts` (source below). Use tokens instead of magic numbers.

## Target platform: React Native (Expo)
The source below is the **web prototype** of this flow. Build the real thing natively:
- Expo SDK 55+, Expo Router, React Native New Architecture.
- `react-native-reanimated` 4 (+ `react-native-worklets`) for all animation; `react-native-gesture-handler` for pans/drags; `expo-haptics` wherever the prototype calls `haptic()` (light → ImpactFeedbackStyle.Light, medium → Medium, success/error → NotificationFeedbackType).
- Use these exact spring presets with `withSpring` (same physics as web): snappy {stiffness:500,damping:35}, smooth {260,30}, gentle {120,20}, bouncy {400,15}, heavy {200,40,mass:1.5}.
- Gesture- and scroll-driven values must run on the UI thread (shared values, `useAnimatedStyle`, `useAnimatedScrollHandler`). State-driven transitions can use Reanimated's CSS-style API or layout animations (`entering`/`exiting`/`layout`).
- Respect `useReducedMotion()` / `ReduceMotion.System`: swap movement for fades.
- Screens: Choose ride → Sheet expanded → Booked.

## Non-negotiables
- **Accessibility:** Ride options are a radiogroup; the sheet's content is reachable without dragging.
- **Performance:** Single drag motion value; snap via spring.
- Respect `prefers-reduced-motion` (replace movement with opacity or an instant change).
- Animate only transform / opacity / filter / clip-path. No hard-coded theme colors — use CSS variables so it works in light and dark.

## Source — components/kinetik/flow-ride.tsx
```tsx
"use client";
import { useState } from "react";
import { animate, motion, useMotionValue, type PanInfo } from "motion/react";
import { spring } from "@/lib/kinetik/tokens";
import { haptic } from "@/components/kinetik/phone" /* demo frame + haptic() stand-in */;

const rides = [["Economy", "$12.40", "3 min", "🚗"], ["Comfort", "$18.90", "5 min", "🚙"], ["XL", "$24.10", "7 min", "🚐"]];
const SNAPS = [80, 300, 520];

export function FlowRide({ initialStep = 0 }: { initialStep?: number }) {
  const y = useMotionValue(SNAPS[initialStep === 0 ? 1 : initialStep === 1 ? 0 : 1]);
  const [sel, setSel] = useState(1);
  const [booked, setBooked] = useState(initialStep === 2);
  const end = (_: unknown, i: PanInfo) => {
    const target = y.get() + i.velocity.y * 0.2;
    const snap = SNAPS.reduce((a, b) => (Math.abs(b - target) < Math.abs(a - target) ? b : a));
    animate(y, snap, spring.smooth);
    haptic();
  };
  return (
    <div className="relative h-full overflow-hidden bg-[#e8eef3]">
      <svg viewBox="0 0 320 660" className="absolute inset-0 h-full w-full" aria-hidden>
        {[60, 140, 230, 330, 450].map((v) => <path key={v} d={`M0 ${v} Q160 ${v + 40} 320 ${v - 20}`} stroke="#fff" strokeWidth="10" fill="none" />)}
        {[50, 150, 250].map((v) => <path key={v} d={`M${v} 0 L${v + 30} 660`} stroke="#fff" strokeWidth="8" fill="none" />)}
        <motion.path d="M70 420 C110 340 190 330 210 230 S240 120 250 90" stroke="#111" strokeWidth="4" fill="none" strokeLinecap="round" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.4, ease: [0.65, 0, 0.35, 1] }} />
        <circle cx="70" cy="420" r="7" fill="#111" /><rect x="243" y="83" width="14" height="14" fill="#111" />
        <motion.text x="0" y="0" fontSize="18" animate={{ offsetDistance: ["0%", "100%"] } as never} style={{ offsetPath: 'path("M70 420 C110 340 190 330 210 230 S240 120 250 90")' } as React.CSSProperties} transition={{ duration: 6, repeat: Infinity, ease: "linear" }}>🚗</motion.text>
      </svg>
      <motion.div drag="y" dragConstraints={{ top: SNAPS[0], bottom: SNAPS[2] }} dragElastic={0.1} onDragEnd={end} style={{ y }} className="absolute inset-x-0 top-0 h-[600px] cursor-grab touch-none rounded-t-3xl bg-white p-4 shadow-[0_-10px_30px_rgb(0_0_0/.12)] active:cursor-grabbing">
        <span className="mx-auto mb-3 block h-1.5 w-10 rounded-full bg-zinc-300" />
        {booked ? (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-center text-zinc-900"><p className="text-4xl">🚙</p><p className="mt-2 text-lg font-semibold">Driver on the way</p><p className="text-sm text-zinc-500">Maya · Grey Tesla · 4 min</p><button onClick={() => setBooked(false)} className="mt-4 text-xs text-zinc-400">Restart demo</button></motion.div>
        ) : (
          <div className="text-zinc-900">
            <p className="mb-3 font-semibold">Choose a ride</p>
            <div className="space-y-2" role="radiogroup">
              {rides.map(([n, p, eta, e], i) => (
                <button key={n} role="radio" aria-checked={sel === i} onClick={() => (haptic(), setSel(i))} className="relative flex w-full items-center gap-3 rounded-2xl p-3 text-left">
                  {sel === i && <motion.span layoutId="ride-sel" className="absolute inset-0 rounded-2xl border-2 border-zinc-900" transition={spring.snappy} />}
                  <span className="relative text-3xl">{e}</span><span className="relative flex-1"><span className="block font-medium">{n}</span><span className="text-xs text-zinc-500">{eta} away</span></span><span className="relative font-semibold">{p}</span>
                </button>
              ))}
            </div>
            <motion.button whileTap={{ scale: 0.97 }} onClick={() => (haptic("success"), setBooked(true))} className="mt-4 h-12 w-full rounded-2xl bg-zinc-900 font-semibold text-white">Confirm {rides[sel][0]}</motion.button>
          </div>
        )}
      </motion.div>
    </div>
  );
}
```

## Usage example
```tsx
"use client";
import { Phone } from "@/components/kinetik/phone" /* demo frame + haptic() stand-in */;
import { FlowRide } from "@/components/kinetik/flow-ride";
export default function Demo({ initialStep }: { initialStep?: number }) { return <Phone><FlowRide initialStep={initialStep} /></Phone>; }
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
