You are given a task to integrate a block from the **kinetik** motion library into this codebase.

# Hero — Split Text + Aurora (`hero-split-text`)

Landing hero: border-beam announcement pill, words rising from masks, blur-in subhead, shimmer CTA over a grainy aurora.

## What it should do
Compose a landing hero: full-height section with an aurora background (3 drifting blurred blobs) under a subtle film-grain overlay; centered content = an announcement pill with a light beam orbiting its border, an H1 whose words rise from masks (GSAP SplitText, expo-out, staggered), a subhead that blurs in word by word, and two CTAs (dark shimmer pill + secondary press button).

## Project requirements
- React 19 + TypeScript, Tailwind CSS v4, shadcn/ui-style CSS variables (`background`, `foreground`, `muted`, `muted-foreground`, `border`, `card`, `primary`, `ring`). If the project lacks shadcn, set it up first (`npx shadcn@latest init`).
- Animation engine: **gsap**.
- Install dependencies: `npm i gsap @gsap/react motion lucide-react`
- Put the component at `components/kinetik/hero-split-text.tsx`.

## Built from these kinetik components
Install them first (each also has its own prompt at `https://kinetik.dev/r/<id>.prompt.md`):
```bash
npx shadcn@latest add https://kinetik.dev/r/text-split-reveal.json https://kinetik.dev/r/text-blur-in.json https://kinetik.dev/r/bg-aurora.json https://kinetik.dev/r/bg-noise.json https://kinetik.dev/r/button-shimmer.json https://kinetik.dev/r/button-border-beam.json https://kinetik.dev/r/button-press.json https://kinetik.dev/r/scroll-reveal.json
```

## Non-negotiables
- **Accessibility:** Real h1; all motion has reduced-motion fallbacks from the underlying components.
- **Performance:** CSS backgrounds; GSAP only for the headline split.
- Respect `prefers-reduced-motion` (replace movement with opacity or an instant change).
- Animate only transform / opacity / filter / clip-path. No hard-coded theme colors — use CSS variables so it works in light and dark.

## Source — components/kinetik/hero-split-text.tsx
```tsx
"use client";
import { ArrowRight } from "lucide-react";
import { BgAurora } from "@/components/kinetik/bg-aurora";
import { BgNoise } from "@/components/kinetik/bg-noise";
import { ButtonBorderBeam } from "@/components/kinetik/button-border-beam";
import { ButtonShimmer } from "@/components/kinetik/button-shimmer";
import { ButtonPress } from "@/components/kinetik/button-press";
import { TextSplitReveal } from "@/components/kinetik/text-split-reveal";
import { TextBlurIn } from "@/components/kinetik/text-blur-in";
import { ScrollReveal } from "@/components/kinetik/scroll-reveal";

export function HeroSplitText() {
  return (
    <BgNoise opacity={0.12} className="h-full">
      <BgAurora className="flex min-h-full flex-col items-center justify-center px-6 py-20 text-center">
        <ScrollReveal variant="blur">
          <ButtonBorderBeam className="h-8 px-4 text-xs">✦ kinetik 1.0 — 70+ components</ButtonBorderBeam>
        </ScrollReveal>
        <TextSplitReveal as="h1" by="words" trigger="mount" delay={0.15} className="mt-6 max-w-3xl text-5xl font-semibold leading-[1.02] tracking-tight sm:text-7xl">
          Interfaces that feel alive.
        </TextSplitReveal>
        <TextBlurIn delay={0.7} className="mt-5 max-w-xl text-base text-muted-foreground sm:text-lg">
          Copy-paste motion components for React and React Native — with live previews, accessible fallbacks and an AI prompt for every piece.
        </TextBlurIn>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <ButtonShimmer>Browse components <ArrowRight className="size-4" /></ButtonShimmer>
          <ButtonPress variant="secondary" className="h-11 rounded-full px-6">Read the docs</ButtonPress>
        </div>
      </BgAurora>
    </BgNoise>
  );
}
```

## Usage example
```tsx
"use client";
import { HeroSplitText } from "@/components/kinetik/hero-split-text";
export default function Demo() {
  return <HeroSplitText />;
}
```

## Steps
1. Install the dependencies above.
2. Create the files exactly as given, fixing import aliases if the project doesn't use `@/`.
3. Drop the usage example into a page and adapt copy/colors to the project's design system.
4. Verify: toggle "Reduce motion" in OS settings — the component must still be fully usable.
