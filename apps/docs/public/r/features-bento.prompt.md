You are given a task to integrate a block from the **kinetik** motion library into this codebase.

# Features — Animated Bento (`features-bento`)

Feature section with a bento grid whose tiles each carry a live micro-animation: beams, tickers, shimmer.

## What it should do
Build a features section: centered eyebrow + H2 that reveal on scroll, then a 3-column bento grid with four tiles — (1, wide) an animated-beam diagram code → AI → agent, (2) a big number ticker "71+", (3) engine pills, (4, wide) a shimmer status pill "prefers-reduced-motion: handled". Tiles lift their visual and reveal "Learn more" on hover/focus.

## Project requirements
- React 19 + TypeScript, Tailwind CSS v4, shadcn/ui-style CSS variables (`background`, `foreground`, `muted`, `muted-foreground`, `border`, `card`, `primary`, `ring`). If the project lacks shadcn, set it up first (`npx shadcn@latest init`).
- Animation engine: **motion**.
- Install dependencies: `npm i motion lucide-react`
- Put the component at `components/kinetik/features-bento.tsx`.

## Built from these kinetik components
Install them first (each also has its own prompt at `https://marvzkineticlibrary.vercel.app/r/<id>.prompt.md`):
```bash
npx shadcn@latest add https://marvzkineticlibrary.vercel.app/r/bento-grid.json https://marvzkineticlibrary.vercel.app/r/animated-beam.json https://marvzkineticlibrary.vercel.app/r/number-ticker.json https://marvzkineticlibrary.vercel.app/r/text-shimmer.json https://marvzkineticlibrary.vercel.app/r/scroll-reveal.json
```

## Non-negotiables
- **Accessibility:** Tiles focusable; all decorative motion aria-hidden or reduced-motion aware.
- **Performance:** Tile animations only start in view.
- Respect `prefers-reduced-motion` (replace movement with opacity or an instant change).
- Animate only transform / opacity / filter / clip-path. No hard-coded theme colors — use CSS variables so it works in light and dark.

## Source — components/kinetik/features-bento.tsx
```tsx
"use client";
import { useRef } from "react";
import { Bot, Code2, Layers, Sparkles } from "lucide-react";
import { AnimatedBeam } from "@/components/kinetik/animated-beam";
import { BentoGrid, BentoTile } from "@/components/kinetik/bento-grid";
import { NumberTicker } from "@/components/kinetik/number-ticker";
import { TextShimmer } from "@/components/kinetik/text-shimmer";
import { ScrollReveal } from "@/components/kinetik/scroll-reveal";

function BeamVisual() {
  const c = useRef<HTMLDivElement>(null);
  const a = useRef<HTMLDivElement>(null);
  const b = useRef<HTMLDivElement>(null);
  const d = useRef<HTMLDivElement>(null);
  const node = "z-10 grid size-11 place-items-center rounded-full border border-border bg-background shadow";
  return (
    <div ref={c} className="relative flex h-full items-start justify-between px-10 pt-8 text-muted-foreground">
      <div ref={a} className={node}><Code2 className="size-5" /></div>
      <div ref={b} className={`${node} size-14`}><Sparkles className="size-6 text-brand" /></div>
      <div ref={d} className={node}><Bot className="size-5" /></div>
      <AnimatedBeam container={c} from={a} to={b} curvature={-30} />
      <AnimatedBeam container={c} from={b} to={d} curvature={-30} delay={1.2} />
    </div>
  );
}

export function FeaturesBento() {
  return (
    <section className="mx-auto max-w-5xl px-6 py-14">
      <ScrollReveal className="mb-8 text-center">
        <p className="text-sm font-medium text-brand">Why kinetik</p>
        <h2 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">Everything motion, nothing to maintain.</h2>
      </ScrollReveal>
      <BentoGrid>
        <BentoTile className="sm:col-span-2" title="From registry to your agent" description="Install with shadcn, or paste the AI prompt into Claude Code, Cursor or v0." visual={<BeamVisual />} />
        <BentoTile title="Components" description="And counting." visual={<div className="grid h-full place-items-center pb-10 text-6xl font-semibold tracking-tight"><NumberTicker value={71} suffix="+" /></div>} />
        <BentoTile title="Engines" description="CSS, Motion, GSAP, Lenis, R3F." visual={<div className="flex flex-wrap gap-1.5 p-5">{["CSS", "Motion", "GSAP", "Lenis", "R3F", "View Transitions"].map((e) => <span key={e} className="rounded-full border border-border bg-background px-2.5 py-1 text-xs">{e}</span>)}</div>} />
        <BentoTile className="sm:col-span-2" title="Accessible by default" description="Every animation ships a tested reduced-motion fallback." visual={<div className="grid h-full place-items-center pb-12"><div className="flex items-center gap-2 rounded-full border border-border bg-background px-4 py-2 text-sm"><Layers className="size-4 text-brand" /><TextShimmer>prefers-reduced-motion: handled</TextShimmer></div></div>} />
      </BentoGrid>
    </section>
  );
}
```

## Usage example
```tsx
"use client";
import { FeaturesBento } from "@/components/kinetik/features-bento";
export default function Demo() {
  return <div className="h-full overflow-auto"><FeaturesBento /></div>;
}
```

## Steps
1. Install the dependencies above.
2. Create the files exactly as given, fixing import aliases if the project doesn't use `@/`.
3. Drop the usage example into a page and adapt copy/colors to the project's design system.
4. Verify: toggle "Reduce motion" in OS settings — the component must still be fully usable.
