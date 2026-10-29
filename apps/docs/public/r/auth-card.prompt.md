You are given a task to integrate a block from the **kinetik** motion library into this codebase.

# Auth — Magic Code Sign-in (`auth-card`)

Email → OTP → success in one morphing card: stateful button, shaking OTP on wrong codes, animated success mark.

## What it should do
Build a passwordless sign-in card over a dot-grid background: step 1 floating-label email + async stateful button ("Code sent"); step 2 six-digit OTP that shakes and clears on a wrong code; step 3 animated success check. The card animates its height with Motion `layout` and steps slide horizontally with AnimatePresence popLayout.

## Project requirements
- React 19 + TypeScript, Tailwind CSS v4, shadcn/ui-style CSS variables (`background`, `foreground`, `muted`, `muted-foreground`, `border`, `card`, `primary`, `ring`). If the project lacks shadcn, set it up first (`npx shadcn@latest init`).
- Animation engine: **motion**.
- Install dependencies: `npm i motion lucide-react`
- Put the component at `components/kinetik/auth-card.tsx`.
- Motion tokens go at `lib/kinetik/tokens.ts` (source below). Use tokens instead of magic numbers.

## Built from these kinetik components
Install them first (each also has its own prompt at `https://kinetik.dev/r/<id>.prompt.md`):
```bash
npx shadcn@latest add https://kinetik.dev/r/input-floating-label.json https://kinetik.dev/r/button-stateful.json https://kinetik.dev/r/otp-input.json https://kinetik.dev/r/success-check.json https://kinetik.dev/r/bg-grid-dots.json
```

## Non-negotiables
- **Accessibility:** Real inputs/labels; OTP supports paste + SMS autofill; status changes announced via aria-live in the button.
- **Performance:** Card height animates with layout; steps swap with popLayout.
- Respect `prefers-reduced-motion` (replace movement with opacity or an instant change).
- Animate only transform / opacity / filter / clip-path. No hard-coded theme colors — use CSS variables so it works in light and dark.

## Source — components/kinetik/auth-card.tsx
```tsx
"use client";
import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { spring } from "@/lib/kinetik/tokens";
import { BgGridDots } from "@/components/kinetik/bg-grid-dots";
import { ButtonStateful } from "@/components/kinetik/button-stateful";
import { InputFloatingLabel } from "@/components/kinetik/input-floating-label";
import { OtpInput } from "@/components/kinetik/otp-input";
import { SuccessCheck } from "@/components/kinetik/success-check";

const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));

export function AuthCard() {
  const [step, setStep] = useState<"email" | "code" | "done">("email");
  const [email, setEmail] = useState("ava@kinetik.dev");
  return (
    <BgGridDots className="grid h-full place-items-center p-6">
      <motion.div layout transition={spring.smooth} className="w-full max-w-sm overflow-hidden rounded-3xl border border-border bg-card/90 p-7 shadow-2xl backdrop-blur">
        <AnimatePresence mode="popLayout" initial={false}>
          {step === "email" && (
            <motion.div key="email" initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} transition={spring.smooth} className="space-y-5">
              <div><h2 className="text-xl font-semibold">Sign in to kinetik</h2><p className="text-sm text-muted-foreground">We&apos;ll email you a magic code.</p></div>
              <InputFloatingLabel label="Work email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
              <ButtonStateful className="w-full" successLabel="Code sent" onAction={async () => { await wait(900); setTimeout(() => setStep("code"), 600); }}>Continue with email</ButtonStateful>
            </motion.div>
          )}
          {step === "code" && (
            <motion.div key="code" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} transition={spring.smooth} className="space-y-5 text-center">
              <div><h2 className="text-xl font-semibold">Check your inbox</h2><p className="text-sm text-muted-foreground">Code sent to {email}. Try <b className="font-mono text-foreground">424242</b>.</p></div>
              <OtpInput onComplete={(c) => { const ok = c === "424242"; if (ok) setTimeout(() => setStep("done"), 500); return ok; }} />
              <button onClick={() => setStep("email")} className="text-xs text-muted-foreground hover:text-foreground">← Use a different email</button>
            </motion.div>
          )}
          {step === "done" && (
            <motion.div key="done" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={spring.smooth} className="flex flex-col items-center gap-3 py-4 text-center">
              <SuccessCheck status="success" />
              <h2 className="text-xl font-semibold">You&apos;re in</h2>
              <button onClick={() => setStep("email")} className="text-xs text-muted-foreground hover:text-foreground">Restart demo</button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </BgGridDots>
  );
}
```

## Usage example
```tsx
"use client";
import { AuthCard } from "@/components/kinetik/auth-card";
export default function Demo() {
  return <AuthCard />;
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
