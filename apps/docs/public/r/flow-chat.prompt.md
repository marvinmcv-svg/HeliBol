You are given a task to integrate a flow from the **kinetik** motion library into this codebase.

# Messaging (`flow-chat`)

iMessage-style thread: bubbles spring in from their side, a typing indicator precedes replies, double-tap reacts with a popping heart.

## What it should do
Build a messaging screen: header with avatar and live "typing…" status; bubbles (mine right/blue, theirs left/gray) enter from y 14 + scale .9 anchored to their side (spring 260/30); after sending, show a three-dot typing indicator then the reply; double-tap a bubble to toggle a ❤️ reaction that pops in with a bouncy spring; send button scales up when there's text. Light haptic on send/receive, medium on react.

## Project requirements
- React 19 + TypeScript, Tailwind CSS v4, shadcn/ui-style CSS variables (`background`, `foreground`, `muted`, `muted-foreground`, `border`, `card`, `primary`, `ring`). If the project lacks shadcn, set it up first (`npx shadcn@latest init`).
- Animation engine: **motion**.
- Install dependencies: `npm i motion lucide-react`
- Put the component at `components/kinetik/flow-chat.tsx`.
- Motion tokens go at `lib/kinetik/tokens.ts` (source below). Use tokens instead of magic numbers.

## Target platform: React Native (Expo)
The source below is the **web prototype** of this flow. Build the real thing natively:
- Expo SDK 55+, Expo Router, React Native New Architecture.
- `react-native-reanimated` 4 (+ `react-native-worklets`) for all animation; `react-native-gesture-handler` for pans/drags; `expo-haptics` wherever the prototype calls `haptic()` (light → ImpactFeedbackStyle.Light, medium → Medium, success/error → NotificationFeedbackType).
- Use these exact spring presets with `withSpring` (same physics as web): snappy {stiffness:500,damping:35}, smooth {260,30}, gentle {120,20}, bouncy {400,15}, heavy {200,40,mass:1.5}.
- Gesture- and scroll-driven values must run on the UI thread (shared values, `useAnimatedStyle`, `useAnimatedScrollHandler`). State-driven transitions can use Reanimated's CSS-style API or layout animations (`entering`/`exiting`/`layout`).
- Respect `useReducedMotion()` / `ReduceMotion.System`: swap movement for fades.
- Screens: Thread → New message → Reacted.

## Non-negotiables
- **Accessibility:** Labelled composer and send; reactions also available via long-press menu on native.
- **Performance:** Layout springs per new message.
- Respect `prefers-reduced-motion` (replace movement with opacity or an instant change).
- Animate only transform / opacity / filter / clip-path. No hard-coded theme colors — use CSS variables so it works in light and dark.

## Source — components/kinetik/flow-chat.tsx
```tsx
"use client";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ArrowUp, ChevronLeft } from "lucide-react";
import { spring } from "@/lib/kinetik/tokens";
import { haptic } from "@/components/kinetik/phone" /* demo frame + haptic() stand-in */;

type M = { id: number; me: boolean; text: string; react?: string };
const replies = ["haha yes 😂", "on my way!", "send me the link", "that spring feels perfect"];

export function FlowChat({ initialStep = 0 }: { initialStep?: number }) {
  const [msgs, setMsgs] = useState<M[]>([{ id: 1, me: false, text: "did you ship the paywall?" }, { id: 2, me: true, text: "just now 🚀" }, ...(initialStep >= 1 ? [{ id: 3, me: false, text: "it looks amazing", react: initialStep >= 2 ? "❤️" : undefined }] : [])]);
  const [text, setText] = useState("");
  const [typing, setTyping] = useState(false);
  const end = useRef<HTMLDivElement>(null);
  useEffect(() => end.current?.scrollIntoView({ block: "end" }), [msgs, typing]);
  const send = () => {
    if (!text.trim()) return;
    haptic("light");
    setMsgs((m) => [...m, { id: Date.now(), me: true, text }]);
    setText("");
    setTimeout(() => setTyping(true), 500);
    setTimeout(() => (setTyping(false), setMsgs((m) => [...m, { id: Date.now(), me: false, text: replies[m.length % replies.length] }]), haptic("light")), 1800);
  };
  const react = (id: number) => (haptic("medium"), setMsgs((m) => m.map((x) => (x.id === id ? { ...x, react: x.react ? undefined : "❤️" } : x))));
  return (
    <div className="flex h-full flex-col bg-white text-zinc-900">
      <header className="flex items-center gap-2 border-b border-zinc-100 px-3 pt-12 pb-2"><ChevronLeft className="size-5 text-sky-500" /><img src="/demo/photo-8.jpg" alt="" className="size-8 rounded-full object-cover" /><div className="text-sm"><p className="font-semibold">Ava</p><p className="text-[11px] text-zinc-400">{typing ? "typing…" : "online"}</p></div></header>
      <div className="flex-1 space-y-1.5 overflow-y-auto px-3 py-3">
        <AnimatePresence initial={false}>
          {msgs.map((m) => (
            <motion.div key={m.id} layout initial={{ opacity: 0, y: 14, scale: 0.9, originX: m.me ? 1 : 0 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={spring.smooth} className={`flex ${m.me ? "justify-end" : ""}`}>
              <button onDoubleClick={() => react(m.id)} className={`relative max-w-[75%] rounded-2xl px-3 py-1.5 text-left text-[14px] ${m.me ? "rounded-br-sm bg-sky-500 text-white" : "rounded-bl-sm bg-zinc-100"}`}>
                {m.text}
                <AnimatePresence>{m.react && <motion.span initial={{ scale: 0, rotate: -30 }} animate={{ scale: 1, rotate: 0 }} exit={{ scale: 0 }} transition={spring.bouncy} className={`absolute -bottom-3 ${m.me ? "left-0" : "right-0"} rounded-full bg-white px-1 text-xs shadow`}>{m.react}</motion.span>}</AnimatePresence>
              </button>
            </motion.div>
          ))}
          {typing && <motion.div key="t" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="flex w-14 gap-1 rounded-2xl bg-zinc-100 px-3 py-2.5">{[0, 1, 2].map((i) => <motion.span key={i} className="size-1.5 rounded-full bg-zinc-400" animate={{ y: [0, -3, 0] }} transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.15 }} />)}</motion.div>}
        </AnimatePresence>
        <div ref={end} />
      </div>
      <p className="pb-1 text-center text-[10px] text-zinc-400">Double-tap a bubble to ❤️</p>
      <form onSubmit={(e) => (e.preventDefault(), send())} className="flex items-center gap-2 border-t border-zinc-100 p-2 pb-6">
        <input value={text} onChange={(e) => setText(e.target.value)} placeholder="Message" aria-label="Message" className="h-9 flex-1 rounded-full border border-zinc-200 px-3 text-sm outline-none" />
        <motion.button whileTap={{ scale: 0.85 }} animate={{ scale: text ? 1 : 0.7, opacity: text ? 1 : 0.4 }} aria-label="Send" className="grid size-9 place-items-center rounded-full bg-sky-500 text-white"><ArrowUp className="size-4" /></motion.button>
      </form>
    </div>
  );
}
```

## Usage example
```tsx
"use client";
import { Phone } from "@/components/kinetik/phone" /* demo frame + haptic() stand-in */;
import { FlowChat } from "@/components/kinetik/flow-chat";
export default function Demo({ initialStep }: { initialStep?: number }) { return <Phone><FlowChat initialStep={initialStep} /></Phone>; }
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
