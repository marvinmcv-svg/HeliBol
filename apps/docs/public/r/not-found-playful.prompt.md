You are given a task to integrate a block from the **kinetik** motion library into this codebase.

# 404 — Drifting Orb (`not-found-playful`)

A playful 404: the zero floats as a glowing orb, the message decodes itself, and the CTA is magnetic.

## What it should do
Create a playful 404 page over a dot grid: giant mono "4 0 4" where the 0 is a glowing violet→cyan gradient orb floating and wobbling on a 4s loop, a "PAGE NOT FOUND" line that decodes with a scramble effect, a friendly subline, and a magnetic "Take me home" button.

## Project requirements
- React 19 + TypeScript, Tailwind CSS v4, shadcn/ui-style CSS variables (`background`, `foreground`, `muted`, `muted-foreground`, `border`, `card`, `primary`, `ring`). If the project lacks shadcn, set it up first (`npx shadcn@latest init`).
- Animation engine: **motion**.
- Install dependencies: `npm i motion gsap @gsap/react`
- Put the component at `components/kinetik/not-found-playful.tsx`.

## Built from these kinetik components
Install them first (each also has its own prompt at `https://kinetik.dev/r/<id>.prompt.md`):
```bash
npx shadcn@latest add https://kinetik.dev/r/text-scramble.json https://kinetik.dev/r/button-magnetic.json https://kinetik.dev/r/bg-grid-dots.json
```

## Non-negotiables
- **Accessibility:** The heading reads “404” plus readable message; the orb loop is slow and stops under reduced motion (MotionConfig).
- **Performance:** One looping transform.
- Respect `prefers-reduced-motion` (replace movement with opacity or an instant change).
- Animate only transform / opacity / filter / clip-path. No hard-coded theme colors — use CSS variables so it works in light and dark.

## Source — components/kinetik/not-found-playful.tsx
```tsx
"use client";
import { motion } from "motion/react";
import { TextScramble } from "@/components/kinetik/text-scramble";
import { ButtonMagnetic } from "@/components/kinetik/button-magnetic";
import { BgGridDots } from "@/components/kinetik/bg-grid-dots";

export function NotFoundPlayful() {
  return (
    <BgGridDots className="grid h-full place-items-center overflow-hidden p-6 text-center">
      <div className="flex flex-col items-center">
        <div className="relative flex items-center font-mono text-[9rem] leading-none font-bold tracking-tighter sm:text-[12rem]">
          <span>4</span>
          <motion.span
            className="mx-2 inline-grid size-[0.8em] place-items-center rounded-full bg-gradient-to-br from-violet-500 to-cyan-400 text-transparent shadow-[0_0_80px_rgb(139_92_246/.5)]"
            animate={{ y: [0, -18, 0], rotate: [0, 8, -8, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          >
            0
          </motion.span>
          <span>4</span>
        </div>
        <TextScramble as="p" className="font-mono text-lg">PAGE NOT FOUND</TextScramble>
        <p className="mt-2 max-w-xs text-sm text-muted-foreground">This page drifted out of orbit. Let&apos;s get you back to solid ground.</p>
        <div className="mt-8"><ButtonMagnetic onClick={() => (window.location.href = "/")}>Take me home</ButtonMagnetic></div>
      </div>
    </BgGridDots>
  );
}
```

## Usage example
```tsx
"use client";
import { NotFoundPlayful } from "@/components/kinetik/not-found-playful";
export default function Demo() {
  return <NotFoundPlayful />;
}
```

## Steps
1. Install the dependencies above.
2. Create the files exactly as given, fixing import aliases if the project doesn't use `@/`.
3. Drop the usage example into a page and adapt copy/colors to the project's design system.
4. Verify: toggle "Reduce motion" in OS settings — the component must still be fully usable.
