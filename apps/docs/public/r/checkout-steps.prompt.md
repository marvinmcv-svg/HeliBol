You are given a task to integrate a block from the **kinetik** motion library into this codebase.

# Checkout — Stepper + Confetti (`checkout-steps`)

Shipping → payment → review stepper beside an order summary, ending in a drawn success mark and a confetti burst.

## What it should do
Build a checkout: left card = 3-step form stepper (shipping, payment, review) with floating-label inputs; right = order summary with thumbnails. Finish swaps to a success view with a drawn checkmark and a 40-piece confetti burst (deterministic x spread, arc up then fall, spin, fade).

## Project requirements
- React 19 + TypeScript, Tailwind CSS v4, shadcn/ui-style CSS variables (`background`, `foreground`, `muted`, `muted-foreground`, `border`, `card`, `primary`, `ring`). If the project lacks shadcn, set it up first (`npx shadcn@latest init`).
- Animation engine: **motion**.
- Install dependencies: `npm i motion lucide-react`
- Put the component at `components/kinetik/checkout-steps.tsx`.
- Motion tokens go at `lib/kinetik/tokens.ts` (source below). Use tokens instead of magic numbers.

## Built from these kinetik components
Install them first (each also has its own prompt at `https://marvzkineticlibrary.vercel.app/r/<id>.prompt.md`):
```bash
npx shadcn@latest add https://marvzkineticlibrary.vercel.app/r/form-stepper.json https://marvzkineticlibrary.vercel.app/r/input-floating-label.json https://marvzkineticlibrary.vercel.app/r/success-check.json
```

## Non-negotiables
- **Accessibility:** Real form fields; confetti aria-hidden and hidden under reduced motion; success has text.
- **Performance:** 40 confetti pieces, transforms only, unmount after the success view leaves.
- Respect `prefers-reduced-motion` (replace movement with opacity or an instant change).
- Animate only transform / opacity / filter / clip-path. No hard-coded theme colors — use CSS variables so it works in light and dark.

## Source — components/kinetik/checkout-steps.tsx
```tsx
"use client";
import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { spring } from "@/lib/kinetik/tokens";
import { FormStepper } from "@/components/kinetik/form-stepper";
import { SuccessCheck } from "@/components/kinetik/success-check";
import { InputFloatingLabel } from "@/components/kinetik/input-floating-label";

function Confetti() {
  const colors = ["#8b5cf6", "#ec4899", "#f59e0b", "#10b981", "#06b6d4"];
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden motion-reduce:hidden">
      {Array.from({ length: 40 }, (_, i) => {
        const x = ((i * 37) % 100) - 50;
        return (
          <motion.span
            key={i}
            className="absolute top-1/3 left-1/2 h-2.5 w-1.5 rounded-sm"
            style={{ background: colors[i % colors.length] }}
            initial={{ x: 0, y: 0, rotate: 0, opacity: 1 }}
            animate={{ x: x * 6, y: [0, -140 - (i % 5) * 30, 320], rotate: (i % 2 ? 1 : -1) * 540, opacity: [1, 1, 0] }}
            transition={{ duration: 1.8 + (i % 4) * 0.2, ease: [0.2, 0.6, 0.4, 1] }}
          />
        );
      })}
    </div>
  );
}

export function CheckoutSteps() {
  const [done, setDone] = useState(false);
  return (
    <div className="relative grid h-full place-items-center overflow-hidden p-6">
      <AnimatePresence mode="wait">
        {done ? (
          <motion.div key="done" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={spring.smooth} className="flex flex-col items-center gap-3 text-center">
            <Confetti />
            <SuccessCheck status="success" size={88} />
            <h2 className="text-2xl font-semibold">Order confirmed</h2>
            <p className="text-sm text-muted-foreground">Receipt #KN-2048 sent to your email.</p>
            <button onClick={() => setDone(false)} className="mt-2 text-xs text-muted-foreground hover:text-foreground">Restart demo</button>
          </motion.div>
        ) : (
          <motion.div key="form" exit={{ opacity: 0, scale: 0.97 }} className="grid w-full max-w-3xl gap-6 md:grid-cols-[1.3fr_1fr]">
            <div className="rounded-3xl border border-border bg-card p-6">
              <FormStepper
                onFinish={() => setDone(true)}
                steps={[
                  { title: "Shipping", content: <div className="space-y-3"><InputFloatingLabel label="Full name" defaultValue="Ava Lin" /><InputFloatingLabel label="Address" defaultValue="221B Baker St" /></div> },
                  { title: "Payment", content: <div className="space-y-3"><InputFloatingLabel label="Card number" defaultValue="4242 4242 4242 4242" /><div className="grid grid-cols-2 gap-3"><InputFloatingLabel label="Expiry" defaultValue="12/29" /><InputFloatingLabel label="CVC" defaultValue="123" /></div></div> },
                  { title: "Review", content: <p className="text-sm text-muted-foreground">Everything look right? Press Finish to place your order.</p> },
                ]}
              />
            </div>
            <aside className="space-y-3 rounded-3xl border border-border bg-card/60 p-6 text-sm">
              <p className="font-semibold">Order summary</p>
              {[["Aurora Print", 64, 6], ["Neon City Print", 48, 3]].map(([n, p, img]) => (
                <div key={n as string} className="flex items-center gap-3"><img src={`/demo/photo-${img}.jpg`} alt="" className="size-12 rounded-lg object-cover" /><span className="flex-1">{n}</span><span className="tabular-nums">${p}</span></div>
              ))}
              <div className="flex justify-between border-t border-border pt-3 font-semibold"><span>Total</span><span>$112</span></div>
            </aside>
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
import { CheckoutSteps } from "@/components/kinetik/checkout-steps";
export default function Demo() {
  return <CheckoutSteps />;
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
