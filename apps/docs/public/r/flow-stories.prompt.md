You are given a task to integrate a flow from the **kinetik** motion library into this codebase.

# Stories Viewer (`flow-stories`)

Instagram-style stories: segmented progress bars fill in real time, tap left/right to navigate, press and hold to pause, slow Ken Burns zoom.

## What it should do
Build a stories viewer: full-bleed image with a slow Ken Burns scale (1.05→1.12 over the 4s duration); top segmented progress bars where past segments are full, the current one fills linearly over 4s and future ones are empty; tap the left third to go back, the rest to advance (light haptic); press-and-hold pauses (progress freezes, "Paused" hint); auto-advance on completion. Header with avatar/handle/time, footer reply field.

## Project requirements
- React 19 + TypeScript, Tailwind CSS v4, shadcn/ui-style CSS variables (`background`, `foreground`, `muted`, `muted-foreground`, `border`, `card`, `primary`, `ring`). If the project lacks shadcn, set it up first (`npx shadcn@latest init`).
- Animation engine: **motion**.
- Install dependencies: `npm i motion lucide-react`
- Put the component at `components/kinetik/flow-stories.tsx`.

## Target platform: React Native (Expo)
The source below is the **web prototype** of this flow. Build the real thing natively:
- Expo SDK 55+, Expo Router, React Native New Architecture.
- `react-native-reanimated` 4 (+ `react-native-worklets`) for all animation; `react-native-gesture-handler` for pans/drags; `expo-haptics` wherever the prototype calls `haptic()` (light → ImpactFeedbackStyle.Light, medium → Medium, success/error → NotificationFeedbackType).
- Use these exact spring presets with `withSpring` (same physics as web): snappy {stiffness:500,damping:35}, smooth {260,30}, gentle {120,20}, bouncy {400,15}, heavy {200,40,mass:1.5}.
- Gesture- and scroll-driven values must run on the UI thread (shared values, `useAnimatedStyle`, `useAnimatedScrollHandler`). State-driven transitions can use Reanimated's CSS-style API or layout animations (`entering`/`exiting`/`layout`).
- Respect `useReducedMotion()` / `ReduceMotion.System`: swap movement for fades.
- Screens: Story 1 → Story 2 → Story 3.

## Non-negotiables
- **Accessibility:** Labelled previous/next tap zones; pause on hold; on native expose accessibilityActions for next/previous.
- **Performance:** One image transition + one progress tween at a time.
- Respect `prefers-reduced-motion` (replace movement with opacity or an instant change).
- Animate only transform / opacity / filter / clip-path. No hard-coded theme colors — use CSS variables so it works in light and dark.

## Source — components/kinetik/flow-stories.tsx
```tsx
"use client";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { X } from "lucide-react";
import { haptic } from "@/components/kinetik/phone" /* demo frame + haptic() stand-in */;

const stories = [3, 6, 1, 7];

export function FlowStories({ initialStep = 0 }: { initialStep?: number }) {
  const [i, setI] = useState(initialStep);
  const [paused, setPaused] = useState(false);
  const [k, setK] = useState(0);
  useEffect(() => {
    if (paused) return;
    const t = setTimeout(() => (setI((n) => (n + 1) % stories.length), setK((x) => x + 1)), 4000);
    return () => clearTimeout(t);
  }, [i, paused, k]);
  const go = (d: number) => (haptic(), setI((n) => Math.max(0, Math.min(stories.length - 1, n + d))), setK((x) => x + 1));
  return (
    <div className="relative h-full overflow-hidden bg-black text-white" onPointerDown={() => setPaused(true)} onPointerUp={() => setPaused(false)}>
      <AnimatePresence initial={false}>
        <motion.img key={i} src={`/demo/photo-${stories[i]}.jpg`} alt="" className="absolute inset-0 h-full w-full object-cover" initial={{ opacity: 0, scale: 1.05 }} animate={{ opacity: 1, scale: paused ? 1.02 : 1.12 }} exit={{ opacity: 0 }} transition={{ opacity: { duration: 0.3 }, scale: { duration: 4, ease: "linear" } }} />
      </AnimatePresence>
      <div className="absolute inset-x-0 top-0 bg-gradient-to-b from-black/50 to-transparent px-3 pt-12 pb-8">
        <div className="flex gap-1">{stories.map((_, n) => <div key={n} className="h-0.5 flex-1 overflow-hidden rounded-full bg-white/30"><motion.div key={`${k}-${n}`} className="h-full bg-white" initial={{ width: n < i ? "100%" : "0%" }} animate={{ width: n < i ? "100%" : n === i ? (paused ? undefined : "100%") : "0%" }} transition={{ duration: n === i ? 4 : 0, ease: "linear" }} /></div>)}</div>
        <div className="mt-3 flex items-center gap-2 text-sm"><img src="/demo/photo-8.jpg" alt="" className="size-8 rounded-full border-2 border-white object-cover" /><span className="font-semibold">avamotion</span><span className="text-white/60">2h</span><X className="ml-auto size-5" /></div>
      </div>
      <button aria-label="Previous story" onClick={() => go(-1)} className="absolute inset-y-0 left-0 w-1/3" />
      <button aria-label="Next story" onClick={() => go(1)} className="absolute inset-y-0 right-0 w-2/3" />
      <AnimatePresence>{paused && <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="pointer-events-none absolute inset-x-0 bottom-24 text-center text-xs text-white/70">Paused</motion.p>}</AnimatePresence>
      <div className="absolute inset-x-3 bottom-8 flex items-center gap-2"><div className="h-10 flex-1 rounded-full border border-white/50 px-4 text-sm leading-10 text-white/70">Send message</div><span className="text-2xl">❤️</span></div>
    </div>
  );
}
```

## Usage example
```tsx
"use client";
import { Phone } from "@/components/kinetik/phone" /* demo frame + haptic() stand-in */;
import { FlowStories } from "@/components/kinetik/flow-stories";
export default function Demo({ initialStep }: { initialStep?: number }) { return <Phone dark><FlowStories initialStep={initialStep} /></Phone>; }
```

## Steps
1. Install the dependencies above.
2. Create the files exactly as given, fixing import aliases if the project doesn't use `@/`.
3. Drop the usage example into a page and adapt copy/colors to the project's design system.
4. Verify: toggle "Reduce motion" in OS settings — the component must still be fully usable.
