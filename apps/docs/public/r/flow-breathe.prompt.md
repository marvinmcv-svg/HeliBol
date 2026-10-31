You are given a task to integrate a flow from the **kinetik** motion library into this codebase.

# Guided Breathing (`flow-breathe`)

4-7-8 breathing coach: concentric rings and a glowing orb expand and contract in time with each phase, with haptic cues on every transition.

## What it should do
Build a guided 4-7-8 breathing screen: a glowing orb + three concentric rings scale to 1.0 over 4s (inhale), hold 7s, then shrink to .45 over 8s (exhale), easeInOut, rings lagging 150ms each; center shows the phase and a per-second countdown (aria-live); light haptic at each phase change, success haptic per completed cycle; Begin/Pause button. Use withTiming durations equal to the phase lengths on native.

## Project requirements
- React 19 + TypeScript, Tailwind CSS v4, shadcn/ui-style CSS variables (`background`, `foreground`, `muted`, `muted-foreground`, `border`, `card`, `primary`, `ring`). If the project lacks shadcn, set it up first (`npx shadcn@latest init`).
- Animation engine: **motion**.
- Install dependencies: `npm i motion`
- Put the component at `components/kinetik/flow-breathe.tsx`.

## Target platform: React Native (Expo)
The source below is the **web prototype** of this flow. Build the real thing natively:
- Expo SDK 55+, Expo Router, React Native New Architecture.
- `react-native-reanimated` 4 (+ `react-native-worklets`) for all animation; `react-native-gesture-handler` for pans/drags; `expo-haptics` wherever the prototype calls `haptic()` (light → ImpactFeedbackStyle.Light, medium → Medium, success/error → NotificationFeedbackType).
- Use these exact spring presets with `withSpring` (same physics as web): snappy {stiffness:500,damping:35}, smooth {260,30}, gentle {120,20}, bouncy {400,15}, heavy {200,40,mass:1.5}.
- Gesture- and scroll-driven values must run on the UI thread (shared values, `useAnimatedStyle`, `useAnimatedScrollHandler`). State-driven transitions can use Reanimated's CSS-style API or layout animations (`entering`/`exiting`/`layout`).
- Respect `useReducedMotion()` / `ReduceMotion.System`: swap movement for fades.
- Screens: Ready → Inhale → Exhale.

## Non-negotiables
- **Accessibility:** Phase name and countdown in an aria-live region; haptics give a non-visual cue; reduced motion keeps the countdown.
- **Performance:** Long, slow tweens on four elements.
- Respect `prefers-reduced-motion` (replace movement with opacity or an instant change).
- Animate only transform / opacity / filter / clip-path. No hard-coded theme colors — use CSS variables so it works in light and dark.

## Source — components/kinetik/flow-breathe.tsx
```tsx
"use client";
import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { haptic } from "@/components/kinetik/phone" /* demo frame + haptic() stand-in */;

const phases = [["Inhale", 4, 1.0], ["Hold", 7, 1.0], ["Exhale", 8, 0.45]] as const;

export function FlowBreathe({ initialStep = 0 }: { initialStep?: number }) {
  const [running, setRunning] = useState(initialStep > 0);
  const [p, setP] = useState(initialStep === 2 ? 2 : 0);
  const [left, setLeft] = useState<number>(phases[p][1]);
  const [cycles, setCycles] = useState(initialStep === 2 ? 2 : 0);
  useEffect(() => {
    if (!running) return;
    const t = setTimeout(() => {
      if (left > 1) return setLeft((l) => l - 1);
      const n = (p + 1) % phases.length;
      if (n === 0) setCycles((c) => c + 1);
      haptic(n === 0 ? "success" : "light");
      setP(n);
      setLeft(phases[n][1]);
    }, 1000);
    return () => clearTimeout(t);
  }, [running, left, p]);
  const [label, dur, scale] = phases[p];
  return (
    <div className="flex h-full flex-col items-center bg-gradient-to-b from-teal-900 via-cyan-950 to-slate-950 px-6 pt-16 pb-10 text-white">
      <p className="text-sm text-white/60">4 · 7 · 8 breathing</p>
      <div className="relative my-auto grid size-64 place-items-center">
        {[0, 1, 2].map((r) => <motion.span key={r} className="absolute rounded-full border border-teal-300/30" style={{ width: 256 - r * 30, height: 256 - r * 30 }} animate={{ scale: running ? scale : 0.6, opacity: running ? 0.9 - r * 0.25 : 0.4 }} transition={{ duration: running ? dur : 1, ease: "easeInOut", delay: r * 0.15 }} />)}
        <motion.span className="absolute size-40 rounded-full bg-gradient-to-br from-teal-300 to-cyan-500 shadow-[0_0_80px_rgb(45_212_191/.5)]" animate={{ scale: running ? scale : 0.6 }} transition={{ duration: running ? dur : 1, ease: "easeInOut" }} />
        <div className="relative text-center" aria-live="polite"><p className="text-2xl font-semibold">{running ? label : "Ready"}</p>{running && <p className="font-mono text-4xl tabular-nums">{left}</p>}</div>
      </div>
      <p className="mb-4 text-sm text-white/60">{cycles} cycle{cycles === 1 ? "" : "s"} complete</p>
      <motion.button whileTap={{ scale: 0.95 }} onClick={() => (haptic("medium"), setRunning((r) => !r))} className="h-14 w-full rounded-2xl bg-white/10 font-semibold backdrop-blur">{running ? "Pause" : "Begin"}</motion.button>
    </div>
  );
}
```

## Usage example
```tsx
"use client";
import { Phone } from "@/components/kinetik/phone" /* demo frame + haptic() stand-in */;
import { FlowBreathe } from "@/components/kinetik/flow-breathe";
export default function Demo({ initialStep }: { initialStep?: number }) { return <Phone dark><FlowBreathe initialStep={initialStep} /></Phone>; }
```

## Steps
1. Install the dependencies above.
2. Create the files exactly as given, fixing import aliases if the project doesn't use `@/`.
3. Drop the usage example into a page and adapt copy/colors to the project's design system.
4. Verify: toggle "Reduce motion" in OS settings — the component must still be fully usable.
