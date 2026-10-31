You are given a task to integrate a block from the **kinetik** motion library into this codebase.

# Blog Grid — Filterable (`blog-grid`)

Journal index: category tabs filter the grid with FLIP reshuffling; cards reveal excerpts on hover.

## What it should do
Create a filterable blog grid: title + pill tabs; selecting a category filters posts with AnimatePresence popLayout + layout so remaining cards slide into place and removed ones scale out; each post is an image card that reveals its excerpt on hover.

## Project requirements
- React 19 + TypeScript, Tailwind CSS v4, shadcn/ui-style CSS variables (`background`, `foreground`, `muted`, `muted-foreground`, `border`, `card`, `primary`, `ring`). If the project lacks shadcn, set it up first (`npx shadcn@latest init`).
- Animation engine: **motion**.
- Install dependencies: `npm i motion`
- Put the component at `components/kinetik/blog-grid.tsx`.

## Built from these kinetik components
Install them first (each also has its own prompt at `https://marvzkineticlibrary.vercel.app/r/<id>.prompt.md`):
```bash
npx shadcn@latest add https://marvzkineticlibrary.vercel.app/r/animated-tabs.json https://marvzkineticlibrary.vercel.app/r/card-hover-reveal.json
```

## Non-negotiables
- **Accessibility:** Tabs pattern for filters; cards focusable with the same reveal.
- **Performance:** Layout animations on ≤ 12 cards.
- Respect `prefers-reduced-motion` (replace movement with opacity or an instant change).
- Animate only transform / opacity / filter / clip-path. No hard-coded theme colors — use CSS variables so it works in light and dark.

## Source — components/kinetik/blog-grid.tsx
```tsx
"use client";
import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { AnimatedTabs } from "@/components/kinetik/animated-tabs";
import { CardHoverReveal } from "@/components/kinetik/card-hover-reveal";

const posts = [
  { t: "Why springs beat durations", c: "Engineering", i: 1 }, { t: "Designing for reduced motion", c: "Accessibility", i: 4 }, { t: "The anatomy of a great hover", c: "Design", i: 3 },
  { t: "Porting web motion to Expo", c: "Engineering", i: 7 }, { t: "Scroll-driven animations in 2026", c: "Engineering", i: 2 }, { t: "Color, contrast and glow", c: "Design", i: 6 },
];

export function BlogGrid() {
  const [cat, setCat] = useState("All");
  const shown = posts.filter((p) => cat === "All" || p.c === cat);
  return (
    <section className="mx-auto max-w-5xl px-6 py-10">
      <div className="flex flex-wrap items-end justify-between gap-4"><h2 className="text-3xl font-semibold tracking-tight">Journal</h2><AnimatedTabs className="w-auto" onChange={setCat} tabs={["All", "Design", "Engineering", "Accessibility"].map((x) => ({ id: x, label: x }))} /></div>
      <motion.div layout className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <AnimatePresence mode="popLayout">
          {shown.map((p) => (
            <motion.div key={p.t} layout initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} transition={{ type: "spring", stiffness: 260, damping: 30 }}>
              <CardHoverReveal image={`/demo/photo-${p.i}.jpg`} title={p.t} subtitle={p.c} className="aspect-[4/5]">Read the full article — 6 min →</CardHoverReveal>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
    </section>
  );
}
```

## Usage example
```tsx
"use client";
import { BlogGrid } from "@/components/kinetik/blog-grid";
export default function Demo() { return <div className="h-full overflow-auto"><BlogGrid /></div>; }
```

## Steps
1. Install the dependencies above.
2. Create the files exactly as given, fixing import aliases if the project doesn't use `@/`.
3. Drop the usage example into a page and adapt copy/colors to the project's design system.
4. Verify: toggle "Reduce motion" in OS settings — the component must still be fully usable.
