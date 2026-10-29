You are given a task to integrate a flow from the **kinetik** motion library into this codebase.

# Profile & Settings (`flow-profile-settings`)

iOS-style profile: the avatar shrinks and the large title hands off to a compact blurred header as you scroll; spring toggles with haptics.

## What it should do
Build an iOS-style profile & settings screen with a collapsing header.

Layout: large centered avatar, name + subtitle, grouped "Preferences" list with colored icon tiles and switches (Notifications, Haptics, Dark mode, Reduce motion), grouped "Account" list with chevrons.

Motion spec (all derived from scrollY on the UI thread — Reanimated `useAnimatedScrollHandler` + `interpolate`):
- Avatar: scale 1 → 0.4 and translateY 0 → -30 over 0–120pt.
- Large title fades out over 40–110pt; compact header title fades in over 90–130pt while the header background goes from transparent to 90% with blur.
- Switches: spring thumb (500/35) + light haptic. Rows highlight on press.

## Project requirements
- React 19 + TypeScript, Tailwind CSS v4, shadcn/ui-style CSS variables (`background`, `foreground`, `muted`, `muted-foreground`, `border`, `card`, `primary`, `ring`). If the project lacks shadcn, set it up first (`npx shadcn@latest init`).
- Animation engine: **motion**.
- Install dependencies: `npm i motion lucide-react`
- Put the component at `components/kinetik/flow-profile-settings.tsx`.
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
- Screens: Profile → Dark mode on.

## Non-negotiables
- **Accessibility:** Switches use role=switch + aria-checked; header title is always present for screen readers.
- **Performance:** All scroll-linked values derive from one scroll motion value (on native: useAnimatedScrollHandler on the UI thread).
- Respect `prefers-reduced-motion` (replace movement with opacity or an instant change).
- Animate only transform / opacity / filter / clip-path. No hard-coded theme colors — use CSS variables so it works in light and dark.

## Source — components/kinetik/flow-profile-settings.tsx
```tsx
"use client";
import { useRef, useState } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { Bell, ChevronRight, Lock, Moon, Sparkles, Vibrate } from "lucide-react";
import { cn } from "@/lib/kinetik/core";
import { spring } from "@/lib/kinetik/tokens";
import { haptic } from "@/components/kinetik/phone" /* demo frame + haptic() stand-in */;

function Toggle({ on, onChange }: { on: boolean; onChange: () => void }) {
  return (
    <button role="switch" aria-checked={on} onClick={() => { haptic(); onChange(); }} className={cn("flex h-[30px] w-[50px] rounded-full p-0.5 transition-colors", on ? "justify-end bg-emerald-500" : "justify-start bg-zinc-300")}>
      <motion.span layout transition={spring.snappy} className="size-[26px] rounded-full bg-white shadow" />
    </button>
  );
}

export function FlowProfileSettings({ initialStep = 0 }: { initialStep?: number }) {
  const scroller = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll({ container: scroller });
  const avatar = useTransform(scrollY, [0, 120], [1, 0.4]);
  const avatarY = useTransform(scrollY, [0, 120], [0, -30]);
  const bigTitle = useTransform(scrollY, [40, 110], [1, 0]);
  const smallTitle = useTransform(scrollY, [90, 130], [0, 1]);
  const headerBg = useTransform(scrollY, [90, 130], ["rgb(244 244 245 / 0)", "rgb(244 244 245 / .9)"]);
  const [prefs, setPrefs] = useState({ notif: true, haptics: true, dark: initialStep === 1, reduce: false });
  const flip = (k: keyof typeof prefs) => setPrefs((p) => ({ ...p, [k]: !p[k] }));

  const rows: [keyof typeof prefs, string, typeof Bell, string][] = [
    ["notif", "Notifications", Bell, "#ef4444"],
    ["haptics", "Haptics", Vibrate, "#8b5cf6"],
    ["dark", "Dark mode", Moon, "#0ea5e9"],
    ["reduce", "Reduce motion", Sparkles, "#f59e0b"],
  ];

  return (
    <div className="relative h-full bg-zinc-100 text-zinc-900">
      <motion.div style={{ backgroundColor: headerBg }} className="absolute inset-x-0 top-0 z-20 flex h-[88px] items-end justify-center pb-2.5 backdrop-blur">
        <motion.span style={{ opacity: smallTitle }} className="text-[15px] font-semibold">Ava Lin</motion.span>
      </motion.div>
      <div ref={scroller} className="h-full overflow-y-auto pt-16 pb-10">
        <div className="flex flex-col items-center pt-4">
          <motion.img src="/demo/photo-8.jpg" alt="" style={{ scale: avatar, y: avatarY }} className="size-24 rounded-full object-cover ring-4 ring-white" />
          <motion.div style={{ opacity: bigTitle }} className="mt-3 text-center">
            <h2 className="text-2xl font-semibold">Ava Lin</h2>
            <p className="text-sm text-zinc-500">Design Engineer · Pro</p>
          </motion.div>
        </div>
        <p className="mt-6 px-8 text-xs font-medium tracking-wide text-zinc-500 uppercase">Preferences</p>
        <div className="mx-4 mt-2 divide-y divide-zinc-200 overflow-hidden rounded-2xl bg-white">
          {rows.map(([k, label, Icon, color]) => (
            <div key={k} className="flex items-center gap-3 px-3.5 py-2.5">
              <span className="grid size-8 place-items-center rounded-lg text-white" style={{ background: color }}><Icon className="size-4" /></span>
              <span className="flex-1 text-[15px]">{label}</span>
              <Toggle on={prefs[k]} onChange={() => flip(k)} />
            </div>
          ))}
        </div>
        <p className="mt-6 px-8 text-xs font-medium tracking-wide text-zinc-500 uppercase">Account</p>
        <div className="mx-4 mt-2 divide-y divide-zinc-200 overflow-hidden rounded-2xl bg-white">
          {["Subscription", "Privacy & data", "Connected apps", "Export motion tokens", "Help center", "About"].map((l) => (
            <motion.button key={l} whileTap={{ backgroundColor: "rgb(228 228 231)" }} className="flex w-full items-center gap-3 px-3.5 py-3.5 text-left text-[15px]">
              <span className="grid size-8 place-items-center rounded-lg bg-zinc-200"><Lock className="size-4 text-zinc-600" /></span>
              <span className="flex-1">{l}</span>
              <ChevronRight className="size-4 text-zinc-400" />
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  );
}
```

## Usage example
```tsx
"use client";
import { Phone } from "@/components/kinetik/phone" /* demo frame + haptic() stand-in */;
import { FlowProfileSettings } from "@/components/kinetik/flow-profile-settings";

export default function Demo({ initialStep }: { initialStep?: number }) {
  return <Phone><FlowProfileSettings initialStep={initialStep} /></Phone>;
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
