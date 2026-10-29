You are given a task to integrate a block from the **kinetik** motion library into this codebase.

# CTA — Spotlight & Meteors (`cta-spotlight`)

Closing call-to-action panel with a cursor spotlight, meteor shower, animated gradient word and a magnetic button.

## What it should do
Create a dark rounded CTA panel (radial indigo→black) with a violet cursor spotlight, a subtle meteor shower, an H2 where one word has a flowing gradient, a muted subline and a white magnetic CTA button.

## Project requirements
- React 19 + TypeScript, Tailwind CSS v4, shadcn/ui-style CSS variables (`background`, `foreground`, `muted`, `muted-foreground`, `border`, `card`, `primary`, `ring`). If the project lacks shadcn, set it up first (`npx shadcn@latest init`).
- Animation engine: **motion**.
- Install dependencies: `npm i motion`
- Put the component at `components/kinetik/cta-spotlight.tsx`.

## Built from these kinetik components
Install them first (each also has its own prompt at `https://marvzkineticlibrary.vercel.app/r/<id>.prompt.md`):
```bash
npx shadcn@latest add https://marvzkineticlibrary.vercel.app/r/spotlight.json https://marvzkineticlibrary.vercel.app/r/bg-meteors.json https://marvzkineticlibrary.vercel.app/r/text-gradient-animated.json https://marvzkineticlibrary.vercel.app/r/button-magnetic.json
```

## Non-negotiables
- **Accessibility:** Decorative layers aria-hidden; pointer effects off on touch/reduced motion.
- **Performance:** CSS meteors + CSS-variable spotlight; one spring-driven button.
- Respect `prefers-reduced-motion` (replace movement with opacity or an instant change).
- Animate only transform / opacity / filter / clip-path. No hard-coded theme colors — use CSS variables so it works in light and dark.

## Source — components/kinetik/cta-spotlight.tsx
```tsx
"use client";
import { BgMeteors } from "@/components/kinetik/bg-meteors";
import { ButtonMagnetic } from "@/components/kinetik/button-magnetic";
import { Spotlight } from "@/components/kinetik/spotlight";
import { TextGradientAnimated } from "@/components/kinetik/text-gradient-animated";

export function CtaSpotlight() {
  return (
    <section className="p-6">
      <Spotlight color="rgb(139 92 246 / .35)" className="rounded-[2rem] border border-white/10 bg-[radial-gradient(ellipse_at_top,#1e1b4b,#09090b_70%)] text-white">
        <BgMeteors count={14} className="flex flex-col items-center px-6 py-20 text-center">
          <h2 className="max-w-2xl text-4xl font-semibold tracking-tight sm:text-5xl">
            Stop shipping <TextGradientAnimated>static</TextGradientAnimated> interfaces.
          </h2>
          <p className="mt-4 max-w-md text-white/60">Install your first component in 30 seconds. Free and open source.</p>
          <div className="mt-8">
            <ButtonMagnetic className="bg-white text-black">Get started — it&apos;s free</ButtonMagnetic>
          </div>
        </BgMeteors>
      </Spotlight>
    </section>
  );
}
```

## Usage example
```tsx
"use client";
import { CtaSpotlight } from "@/components/kinetik/cta-spotlight";
export default function Demo() {
  return <div className="flex h-full items-center"><div className="w-full"><CtaSpotlight /></div></div>;
}
```

## Steps
1. Install the dependencies above.
2. Create the files exactly as given, fixing import aliases if the project doesn't use `@/`.
3. Drop the usage example into a page and adapt copy/colors to the project's design system.
4. Verify: toggle "Reduce motion" in OS settings — the component must still be fully usable.
