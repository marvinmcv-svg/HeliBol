You are given a task to integrate a flow from the **kinetik** motion library into this codebase.

# Onboarding Pager (`flow-onboarding`)

Swipeable 3-page onboarding: pages slide with a spring, hero images parallax and settle, the dot indicator stretches, and the CTA morphs into “Get started”.

## What it should do
Build a 3-page onboarding pager for a mobile app.

Screens: full-bleed hero image (top 70%) under a gradient tint, title + body anchored above the footer; footer has a page indicator and a primary button.

Motion spec:
- Pages: horizontal pager driven by a pan gesture; release past 60px or 400px/s velocity advances/returns; spring stiffness 260, damping 30.
- Parallax: the incoming hero image starts at scale 1.25 and offset 40px in the travel direction, settling to scale 1.05 / 0 over 1.2s expo-out.
- Copy: title then body rise 24px and fade in with 120ms/200ms delays (spring 120/20).
- Indicator: active dot width 8→24px, inactive opacity .35 (spring 500/35).
- CTA: on the last page the label morphs "Next →" → "Get started" (vertical swap) and the pill resizes.
- Haptics: light impact on page change, success notification on Get started.

## Project requirements
- React 19 + TypeScript, Tailwind CSS v4, shadcn/ui-style CSS variables (`background`, `foreground`, `muted`, `muted-foreground`, `border`, `card`, `primary`, `ring`). If the project lacks shadcn, set it up first (`npx shadcn@latest init`).
- Animation engine: **motion**.
- Install dependencies: `npm i motion`
- Put the component at `components/kinetik/flow-onboarding.tsx`.
- Motion tokens go at `lib/kinetik/tokens.ts` (source below). Use tokens instead of magic numbers.

## Target platform: React Native (Expo)
The source below is the **web prototype** of this flow. Build the real thing natively:
- Expo SDK 55+, Expo Router, React Native New Architecture.
- `react-native-reanimated` 4 (+ `react-native-worklets`) for all animation; `react-native-gesture-handler` for pans/drags; `expo-haptics` wherever the prototype calls `haptic()` (light → ImpactFeedbackStyle.Light, medium → Medium, success/error → NotificationFeedbackType).
- Use these exact spring presets with `withSpring` (same physics as web): snappy {stiffness:500,damping:35}, smooth {260,30}, gentle {120,20}, bouncy {400,15}, heavy {200,40,mass:1.5}.
- Gesture- and scroll-driven values must run on the UI thread (shared values, `useAnimatedStyle`, `useAnimatedScrollHandler`). State-driven transitions can use Reanimated's CSS-style API or layout animations (`entering`/`exiting`/`layout`).
- Respect `useReducedMotion()` / `ReduceMotion.System`: swap movement for fades.
- Screens: Meaning → Cross-platform → Accessible.

## Non-negotiables
- **Accessibility:** Dots are a tablist with labels; swipe has button alternatives; haptic on page change.
- **Performance:** Transforms only; one page mounted at a time plus the exiting one.
- Respect `prefers-reduced-motion` (replace movement with opacity or an instant change).
- Animate only transform / opacity / filter / clip-path. No hard-coded theme colors — use CSS variables so it works in light and dark.

## Source — components/kinetik/flow-onboarding.tsx
```tsx
"use client";
import { useState } from "react";
import { AnimatePresence, motion, type PanInfo } from "motion/react";
import { spring } from "@/lib/kinetik/tokens";
import { haptic } from "@/components/kinetik/phone" /* demo frame + haptic() stand-in */;

const pages = [
  { title: "Motion that means something", body: "Every animation explains a change — never decoration for its own sake.", img: "/demo/photo-6.jpg", tint: "from-violet-600/0 via-violet-950/60 to-violet-950" },
  { title: "Same springs, every platform", body: "Web and native share one token system, so your brand feels identical.", img: "/demo/photo-2.jpg", tint: "from-indigo-600/0 via-indigo-950/60 to-indigo-950" },
  { title: "Accessible by default", body: "Reduced motion is designed, not bolted on. Everyone gets a great experience.", img: "/demo/photo-4.jpg", tint: "from-emerald-600/0 via-emerald-950/60 to-emerald-950" },
];

export function FlowOnboarding({ initialStep = 0 }: { initialStep?: number }) {
  const [[i, dir], set] = useState<[number, number]>([initialStep, 1]);
  const go = (n: number) => {
    if (n < 0 || n >= pages.length) return;
    haptic("light");
    set([n, n > i ? 1 : -1]);
  };
  const onDragEnd = (_: unknown, info: PanInfo) => {
    if (info.offset.x < -60 || info.velocity.x < -400) go(i + 1);
    else if (info.offset.x > 60 || info.velocity.x > 400) go(i - 1);
  };
  const p = pages[i];
  return (
    <div className="relative h-full overflow-hidden bg-black text-white">
      <AnimatePresence initial={false} custom={dir}>
        <motion.div
          key={i}
          custom={dir}
          className="absolute inset-0"
          variants={{ enter: (d: number) => ({ x: `${d * 100}%` }), center: { x: 0 }, exit: (d: number) => ({ x: `${d * -35}%`, opacity: 0.4 }) }}
          initial="enter"
          animate="center"
          exit="exit"
          transition={spring.smooth}
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.25}
          onDragEnd={onDragEnd}
        >
          {/* parallax: image moves slower than the page */}
          <motion.img src={p.img} alt="" draggable={false} className="absolute inset-0 h-[70%] w-full object-cover" initial={{ scale: 1.25, x: dir * 40 }} animate={{ scale: 1.05, x: 0 }} transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }} />
          <div className={`absolute inset-0 bg-gradient-to-b ${p.tint}`} />
          <div className="absolute inset-x-0 bottom-36 px-7">
            <motion.h2 className="text-[28px] leading-tight font-semibold tracking-tight" initial={{ y: 24, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.12, ...spring.gentle }}>{p.title}</motion.h2>
            <motion.p className="mt-3 text-[15px] text-white/70" initial={{ y: 24, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2, ...spring.gentle }}>{p.body}</motion.p>
          </div>
        </motion.div>
      </AnimatePresence>
      <div className="absolute inset-x-0 bottom-10 flex items-center justify-between px-7">
        <div className="flex gap-1.5" role="tablist" aria-label="Onboarding pages">
          {pages.map((_, n) => (
            <motion.button key={n} role="tab" aria-selected={n === i} aria-label={`Page ${n + 1}`} onClick={() => go(n)} className="h-2 rounded-full bg-white" animate={{ width: n === i ? 24 : 8, opacity: n === i ? 1 : 0.35 }} transition={spring.snappy} />
          ))}
        </div>
        <motion.button layout onClick={() => (i === pages.length - 1 ? haptic("success") : go(i + 1))} whileTap={{ scale: 0.94 }} transition={spring.smooth} className="h-12 overflow-hidden rounded-full bg-white px-5 text-sm font-semibold text-black">
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.span key={i === pages.length - 1 ? "go" : "next"} className="block" initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -20, opacity: 0 }}>
              {i === pages.length - 1 ? "Get started" : "Next →"}
            </motion.span>
          </AnimatePresence>
        </motion.button>
      </div>
    </div>
  );
}
```

## Usage example
```tsx
"use client";
import { Phone } from "@/components/kinetik/phone" /* demo frame + haptic() stand-in */;
import { FlowOnboarding } from "@/components/kinetik/flow-onboarding";

export default function Demo({ initialStep }: { initialStep?: number }) {
  return <Phone dark><FlowOnboarding initialStep={initialStep} /></Phone>;
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
