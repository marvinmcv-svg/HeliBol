You are given a task to integrate a flow from the **kinetik** motion library into this codebase.

# Food Order — Fly to Cart (`flow-food-order`)

Delivery menu where tapping + launches the dish thumbnail along an arc into the bag, which bumps and counts up; a 'View bag' bar slides in.

## What it should do
Build a food-ordering menu with a fly-to-cart effect: on "+" (medium haptic) clone the dish thumbnail at the button and animate it along an arc (up and back, then to the bag icon) while scaling 1→1.4→.3 over 650ms; when it lands, increment the badge (bouncy pop), wiggle the bag (scale [1,1.3,1], rotate [0,−12,0]) and slide up a "View bag" bar. On native use Reanimated with measured layout positions.

## Project requirements
- React 19 + TypeScript, Tailwind CSS v4, shadcn/ui-style CSS variables (`background`, `foreground`, `muted`, `muted-foreground`, `border`, `card`, `primary`, `ring`). If the project lacks shadcn, set it up first (`npx shadcn@latest init`).
- Animation engine: **motion**.
- Install dependencies: `npm i motion lucide-react`
- Put the component at `components/kinetik/flow-food-order.tsx`.
- Motion tokens go at `lib/kinetik/tokens.ts` (source below). Use tokens instead of magic numbers.

## Target platform: React Native (Expo)
The source below is the **web prototype** of this flow. Build the real thing natively:
- Expo SDK 55+, Expo Router, React Native New Architecture.
- `react-native-reanimated` 4 (+ `react-native-worklets`) for all animation; `react-native-gesture-handler` for pans/drags; `expo-haptics` wherever the prototype calls `haptic()` (light → ImpactFeedbackStyle.Light, medium → Medium, success/error → NotificationFeedbackType).
- Use these exact spring presets with `withSpring` (same physics as web): snappy {stiffness:500,damping:35}, smooth {260,30}, gentle {120,20}, bouncy {400,15}, heavy {200,40,mass:1.5}.
- Gesture- and scroll-driven values must run on the UI thread (shared values, `useAnimatedStyle`, `useAnimatedScrollHandler`). State-driven transitions can use Reanimated's CSS-style API or layout animations (`entering`/`exiting`/`layout`).
- Respect `useReducedMotion()` / `ReduceMotion.System`: swap movement for fades.
- Screens: Menu → Items added.

## Non-negotiables
- **Accessibility:** Add buttons are labelled with the dish; the count badge updates as text.
- **Performance:** One short-lived flying image per add.
- Respect `prefers-reduced-motion` (replace movement with opacity or an instant change).
- Animate only transform / opacity / filter / clip-path. No hard-coded theme colors — use CSS variables so it works in light and dark.

## Source — components/kinetik/flow-food-order.tsx
```tsx
"use client";
import { useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ShoppingBag } from "lucide-react";
import { spring } from "@/lib/kinetik/tokens";
import { haptic } from "@/components/kinetik/phone" /* demo frame + haptic() stand-in */;

const menu = [["Neon Ramen", "$14", 3], ["Aurora Bowl", "$12", 6], ["Dune Tacos", "$11", 1], ["Ocean Poke", "$16", 7]] as const;

export function FlowFoodOrder({ initialStep = 0 }: { initialStep?: number }) {
  const [count, setCount] = useState(initialStep >= 1 ? 2 : 0);
  const [flyers, setFlyers] = useState<{ id: number; x: number; y: number; img: number }[]>([]);
  const [bump, setBump] = useState(0);
  const bag = useRef<HTMLDivElement>(null);
  const root = useRef<HTMLDivElement>(null);
  const add = (e: React.MouseEvent, img: number) => {
    haptic("medium");
    const r = root.current!.getBoundingClientRect();
    const s = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const id = Date.now();
    setFlyers((f) => [...f, { id, x: (s.left - r.left) / (r.width / 320), y: (s.top - r.top) / (r.height / 660), img }]);
    setTimeout(() => (setFlyers((f) => f.filter((x) => x.id !== id)), setCount((c) => c + 1), setBump((b) => b + 1), haptic("light")), 650);
  };
  return (
    <div ref={root} className="relative h-full overflow-hidden bg-orange-50 text-zinc-900">
      <header className="flex items-center justify-between px-5 pt-14 pb-3"><div><p className="text-xs text-orange-600">Delivering to</p><p className="font-semibold">221B Baker St</p></div>
        <motion.div ref={bag} key={bump} animate={bump ? { scale: [1, 1.3, 1], rotate: [0, -12, 0] } : {}} transition={{ duration: 0.4 }} className="relative grid size-11 place-items-center rounded-full bg-zinc-900 text-white"><ShoppingBag className="size-5" />
          <AnimatePresence>{count > 0 && <motion.span key={count} initial={{ scale: 0 }} animate={{ scale: 1 }} transition={spring.bouncy} className="absolute -top-1 -right-1 grid size-5 place-items-center rounded-full bg-orange-500 text-[11px] font-bold">{count}</motion.span>}</AnimatePresence>
        </motion.div>
      </header>
      <div className="grid grid-cols-2 gap-3 px-4">
        {menu.map(([n, p, img]) => (
          <div key={n} className="overflow-hidden rounded-2xl bg-white shadow-sm"><img src={`/demo/photo-${img}.jpg`} alt="" className="aspect-square w-full object-cover" />
            <div className="flex items-center justify-between p-2.5"><div><p className="text-sm font-semibold">{n}</p><p className="text-xs text-zinc-500">{p}</p></div><motion.button whileTap={{ scale: 0.85 }} onClick={(e) => add(e, img)} aria-label={`Add ${n}`} className="grid size-8 place-items-center rounded-full bg-orange-500 text-lg font-bold text-white">+</motion.button></div>
          </div>
        ))}
      </div>
      <AnimatePresence>
        {flyers.map((f) => (
          <motion.img key={f.id} src={`/demo/photo-${f.img}.jpg`} alt="" className="pointer-events-none absolute size-10 rounded-full object-cover shadow-lg" initial={{ left: f.x, top: f.y, scale: 1, opacity: 1 }} animate={{ left: [f.x, f.x - 40, 262], top: [f.y, f.y - 120, 62], scale: [1, 1.4, 0.3], opacity: [1, 1, 0.6] }} transition={{ duration: 0.65, ease: [0.4, 0, 0.2, 1], times: [0, 0.35, 1] }} />
        ))}
      </AnimatePresence>
      <AnimatePresence>{count > 0 && <motion.button initial={{ y: 100 }} animate={{ y: 0 }} exit={{ y: 100 }} transition={spring.smooth} className="absolute inset-x-4 bottom-6 flex h-14 items-center justify-between rounded-2xl bg-zinc-900 px-5 text-white"><span className="font-semibold">View bag</span><span className="text-sm text-white/70">{count} items</span></motion.button>}</AnimatePresence>
    </div>
  );
}
```

## Usage example
```tsx
"use client";
import { Phone } from "@/components/kinetik/phone" /* demo frame + haptic() stand-in */;
import { FlowFoodOrder } from "@/components/kinetik/flow-food-order";
export default function Demo({ initialStep }: { initialStep?: number }) { return <Phone><FlowFoodOrder initialStep={initialStep} /></Phone>; }
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
