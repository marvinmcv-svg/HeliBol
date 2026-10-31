You are given a task to integrate a flow from the **kinetik** motion library into this codebase.

# Expanding Music Player (`flow-music-player`)

Apple Music-style mini player that expands into a full-screen player: artwork, title and shell morph with shared layout; art shrinks when paused.

## What it should do
Build an expanding music player: a floating mini player (art, title, play/pause) whose container, artwork and title share layout IDs with a full-screen player (Reanimated shared transitions / layout animations on native) — tapping expands with a smooth spring, the chevron collapses it. In the full player, artwork scales to .86 when paused (Apple Music feel), controls fade up after 150ms. Light haptic on expand/collapse, medium on play/pause.

## Project requirements
- React 19 + TypeScript, Tailwind CSS v4, shadcn/ui-style CSS variables (`background`, `foreground`, `muted`, `muted-foreground`, `border`, `card`, `primary`, `ring`). If the project lacks shadcn, set it up first (`npx shadcn@latest init`).
- Animation engine: **motion**.
- Install dependencies: `npm i motion lucide-react`
- Put the component at `components/kinetik/flow-music-player.tsx`.
- Motion tokens go at `lib/kinetik/tokens.ts` (source below). Use tokens instead of magic numbers.

## Target platform: React Native (Expo)
The source below is the **web prototype** of this flow. Build the real thing natively:
- Expo SDK 55+, Expo Router, React Native New Architecture.
- `react-native-reanimated` 4 (+ `react-native-worklets`) for all animation; `react-native-gesture-handler` for pans/drags; `expo-haptics` wherever the prototype calls `haptic()` (light → ImpactFeedbackStyle.Light, medium → Medium, success/error → NotificationFeedbackType).
- Use these exact spring presets with `withSpring` (same physics as web): snappy {stiffness:500,damping:35}, smooth {260,30}, gentle {120,20}, bouncy {400,15}, heavy {200,40,mass:1.5}.
- Gesture- and scroll-driven values must run on the UI thread (shared values, `useAnimatedStyle`, `useAnimatedScrollHandler`). State-driven transitions can use Reanimated's CSS-style API or layout animations (`entering`/`exiting`/`layout`).
- Respect `useReducedMotion()` / `ReduceMotion.System`: swap movement for fades.
- Screens: Mini player → Now playing → Paused.

## Non-negotiables
- **Accessibility:** Mini player is a button; Minimize and Play/Pause labelled.
- **Performance:** Shared layout transitions; transforms only.
- Respect `prefers-reduced-motion` (replace movement with opacity or an instant change).
- Animate only transform / opacity / filter / clip-path. No hard-coded theme colors — use CSS variables so it works in light and dark.

## Source — components/kinetik/flow-music-player.tsx
```tsx
"use client";
import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ChevronDown, Pause, Play, SkipBack, SkipForward } from "lucide-react";
import { spring } from "@/lib/kinetik/tokens";
import { haptic } from "@/components/kinetik/phone" /* demo frame + haptic() stand-in */;

export function FlowMusicPlayer({ initialStep = 0 }: { initialStep?: number }) {
  const [open, setOpen] = useState(initialStep >= 1);
  const [playing, setPlaying] = useState(initialStep !== 2);
  return (
    <div className="relative h-full overflow-hidden bg-zinc-950 text-white">
      <div className="space-y-3 px-5 pt-14">
        <h2 className="text-2xl font-semibold">Library</h2>
        {[1, 3, 4, 5, 7].map((n, i) => <div key={n} className="flex items-center gap-3"><img src={`/demo/photo-${n}.jpg`} alt="" className="size-12 rounded-lg object-cover" /><div className="text-sm"><p className="font-medium">Track {i + 1}</p><p className="text-white/50">Kinetik Radio</p></div></div>)}
      </div>
      <AnimatePresence initial={false}>
        {!open ? (
          <motion.button key="mini" layoutId="mp-shell" onClick={() => (haptic(), setOpen(true))} transition={spring.smooth} className="absolute inset-x-2 bottom-6 flex items-center gap-3 rounded-2xl bg-zinc-800 p-2 text-left" style={{ borderRadius: 16 }}>
            <motion.img layoutId="mp-art" src="/demo/photo-6.jpg" alt="" className="size-11 rounded-lg object-cover" transition={spring.smooth} />
            <motion.div layoutId="mp-title" className="flex-1 text-sm"><p className="font-medium">Aurora Drive</p><p className="text-xs text-white/50">Northern Lights</p></motion.div>
            <span onClick={(e) => (e.stopPropagation(), setPlaying((p) => !p))} className="mr-2">{playing ? <Pause className="size-5 fill-current" /> : <Play className="size-5 fill-current" />}</span>
          </motion.button>
        ) : (
          <motion.div key="full" layoutId="mp-shell" transition={spring.smooth} className="absolute inset-0 flex flex-col bg-gradient-to-b from-violet-900 to-zinc-950 px-6 pt-12 pb-10" style={{ borderRadius: 0 }}>
            <button onClick={() => (haptic(), setOpen(false))} aria-label="Minimize" className="mx-auto"><ChevronDown className="size-6" /></button>
            <motion.img layoutId="mp-art" src="/demo/photo-6.jpg" alt="" transition={spring.smooth} animate={{ scale: playing ? 1 : 0.86 }} className="mt-6 aspect-square w-full rounded-2xl object-cover shadow-2xl" />
            <motion.div layoutId="mp-title" className="mt-6"><p className="text-xl font-semibold">Aurora Drive</p><p className="text-white/60">Northern Lights</p></motion.div>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0, transition: { delay: 0.15 } }} className="mt-auto">
              <div className="h-1 rounded-full bg-white/20"><div className="h-full w-2/5 rounded-full bg-white" /></div>
              <div className="mt-6 flex items-center justify-center gap-10"><SkipBack className="size-7 fill-current" /><motion.button whileTap={{ scale: 0.85 }} onClick={() => (haptic("medium"), setPlaying((p) => !p))} aria-label={playing ? "Pause" : "Play"} className="grid size-16 place-items-center rounded-full bg-white text-black">{playing ? <Pause className="size-7 fill-current" /> : <Play className="ml-1 size-7 fill-current" />}</motion.button><SkipForward className="size-7 fill-current" /></div>
            </motion.div>
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
import { FlowMusicPlayer } from "@/components/kinetik/flow-music-player";
export default function Demo({ initialStep }: { initialStep?: number }) { return <Phone dark><FlowMusicPlayer initialStep={initialStep} /></Phone>; }
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
