You are given a task to integrate a block from the **kinetik** motion library into this codebase.

# Portfolio — 3D Ribbon (`portfolio-ribbon`)

Portfolio opener: a giant name behind a spinning 3D ribbon of selected work, an expandable floating nav on top and a rotating discipline word.

## What it should do
Compose a portfolio hero: warm off-white background, a huge two-line uppercase name centred, ThreeImageRibbon spinning in front of it with the work images, NavExpandable floating at the top, and a bottom row with a TextSmartAnimate discipline word and a 'drag or scroll' hint.

## Project requirements
- React 19 + TypeScript, Tailwind CSS v4, shadcn/ui-style CSS variables (`background`, `foreground`, `muted`, `muted-foreground`, `border`, `card`, `primary`, `ring`). If the project lacks shadcn, set it up first (`npx shadcn@latest init`).
- Animation engine: **r3f**.
- Install dependencies: `npm i three @react-three/fiber @react-three/drei motion`
- Put the component at `components/kinetik/portfolio-ribbon.tsx`.

## Built from these kinetik components
Install them first (each also has its own prompt at `https://marvzkineticlibrary.vercel.app/r/<id>.prompt.md`):
```bash
npx shadcn@latest add https://marvzkineticlibrary.vercel.app/r/three-image-ribbon.json https://marvzkineticlibrary.vercel.app/r/nav-expandable.json https://marvzkineticlibrary.vercel.app/r/text-smart-animate.json
```

## Non-negotiables
- **Accessibility:** Name is a real H1; the ribbon is decorative so list projects in HTML elsewhere. Reduced motion: ribbon still, words crossfade.
- **Performance:** One R3F canvas with 8 textured cylinder slices.
- Respect `prefers-reduced-motion` (replace movement with opacity or an instant change).
- Animate only transform / opacity / filter / clip-path. No hard-coded theme colors — use CSS variables so it works in light and dark.

## Source — components/kinetik/portfolio-ribbon.tsx
```tsx
"use client";
import { ThreeImageRibbon } from "@/components/kinetik/three-image-ribbon";
import { NavExpandable } from "@/components/kinetik/nav-expandable";
import { TextSmartAnimate } from "@/components/kinetik/text-smart-animate";

const work = ["/demo/photo-1.jpg", "/demo/photo-3.jpg", "/demo/photo-5.jpg", "/demo/photo-7.jpg", "/demo/photo-2.jpg", "/demo/photo-8.jpg", "/demo/photo-4.jpg", "/demo/photo-6.jpg"];

/** Portfolio opener: an expandable floating nav over a giant name, with selected work wrapped on a spinning 3D ribbon in front of it. */
export function PortfolioRibbon() {
  return (
    <section className="relative h-full min-h-[560px] overflow-hidden rounded-[2rem] bg-[#ece8df] text-zinc-900">
      <div className="absolute inset-x-0 top-4 z-20 flex justify-center">
        <NavExpandable
          brand="Mara Lind"
          links={[{ label: "Work", href: "#work", description: "34 projects" }, { label: "About", href: "#about" }, { label: "Contact", href: "#contact", description: "Available from March" }]}
        />
      </div>
      <div className="pointer-events-none absolute inset-0 grid place-items-center">
        <h1 className="text-center text-[clamp(3.5rem,14vw,11rem)] font-black uppercase leading-[0.8] tracking-tighter">Mara<br />Lind</h1>
      </div>
      <div className="absolute inset-0"><ThreeImageRibbon images={work} radius={2.6} height={1.05} /></div>
      <div className="pointer-events-none absolute inset-x-0 bottom-6 flex items-end justify-between px-8 text-sm">
        <p className="max-w-[14rem] text-zinc-600">Independent art director working on <TextSmartAnimate words={["brands", "books", "films", "spaces"]} className="font-semibold text-zinc-900" /></p>
        <p className="text-zinc-500">Drag or scroll the ribbon</p>
      </div>
    </section>
  );
}
```

## Usage example
```tsx
"use client";
import { PortfolioRibbon } from "@/components/kinetik/portfolio-ribbon";
export default function Demo() {
  return <div className="h-full p-3"><PortfolioRibbon /></div>;
}
```

## Steps
1. Install the dependencies above.
2. Create the files exactly as given, fixing import aliases if the project doesn't use `@/`.
3. Drop the usage example into a page and adapt copy/colors to the project's design system.
4. Verify: toggle "Reduce motion" in OS settings — the component must still be fully usable.
