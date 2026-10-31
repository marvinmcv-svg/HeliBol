You are given a task to integrate a block from the **kinetik** motion library into this codebase.

# Changelog Timeline (`changelog`)

Release timeline whose rail draws down as you arrive and version dots pop onto it with each entry.

## What it should do
Build a changelog timeline: an ordered list with a vertical gradient rail that scales Y 0→1 on view; each entry slides in from x −12 (staggered) and its dot pops onto the rail with a bouncy spring; version, date and tag pill above the title.

## Project requirements
- React 19 + TypeScript, Tailwind CSS v4, shadcn/ui-style CSS variables (`background`, `foreground`, `muted`, `muted-foreground`, `border`, `card`, `primary`, `ring`). If the project lacks shadcn, set it up first (`npx shadcn@latest init`).
- Animation engine: **motion**.
- Install dependencies: `npm i motion`
- Put the component at `components/kinetik/changelog.tsx`.

## Non-negotiables
- **Accessibility:** Ordered list with dates and versions as text.
- **Performance:** whileInView once per entry.
- Respect `prefers-reduced-motion` (replace movement with opacity or an instant change).
- Animate only transform / opacity / filter / clip-path. No hard-coded theme colors — use CSS variables so it works in light and dark.

## Source — components/kinetik/changelog.tsx
```tsx
"use client";
import { motion } from "motion/react";

const entries = [
  { v: "2.0", d: "Oct 31, 2026", t: "123 new components", b: "Heroes, AI interfaces, widgets, device mockups and REA-captured thumbnails.", tag: "Major" },
  { v: "1.4", d: "Oct 12, 2026", t: "Mobile flows", b: "Paywall, onboarding and checkout flows with Expo prompts.", tag: "Feature" },
  { v: "1.3", d: "Sep 28, 2026", t: "Reduced-motion toggle", b: "Preview every fallback from the docs header.", tag: "A11y" },
  { v: "1.0", d: "Sep 1, 2026", t: "Hello, world", b: "71 components, tokens and the registry.", tag: "Launch" },
];

/** Changelog timeline: a progress line draws down as entries enter, each version pops onto the rail. */
export function Changelog() {
  return (
    <section className="mx-auto max-w-2xl px-6 py-12">
      <h2 className="text-3xl font-semibold tracking-tight">Changelog</h2>
      <ol className="relative mt-10 space-y-10 pl-8">
        <motion.span aria-hidden className="absolute top-2 bottom-2 left-[7px] w-px origin-top bg-gradient-to-b from-brand to-border" initial={{ scaleY: 0 }} whileInView={{ scaleY: 1 }} viewport={{ once: true }} transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }} />
        {entries.map((e, i) => (
          <motion.li key={e.v} className="relative" initial={{ opacity: 0, x: -12 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, amount: 0.5 }} transition={{ delay: i * 0.12, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}>
            <motion.span aria-hidden className="absolute top-1.5 -left-8 size-[15px] rounded-full border-2 border-brand bg-background" initial={{ scale: 0 }} whileInView={{ scale: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.12 + 0.1, type: "spring", stiffness: 400, damping: 15 }} />
            <p className="flex items-center gap-2 text-xs text-muted-foreground"><span className="font-mono font-semibold text-foreground">v{e.v}</span>· {e.d}<span className="rounded-full bg-brand/15 px-2 py-0.5 text-[10px] font-semibold text-brand">{e.tag}</span></p>
            <h3 className="mt-1 text-lg font-semibold">{e.t}</h3>
            <p className="mt-1 text-sm text-muted-foreground">{e.b}</p>
          </motion.li>
        ))}
      </ol>
    </section>
  );
}
```

## Usage example
```tsx
"use client";
import { Changelog } from "@/components/kinetik/changelog";
export default function Demo() { return <div className="h-full overflow-auto"><Changelog /></div>; }
```

## Steps
1. Install the dependencies above.
2. Create the files exactly as given, fixing import aliases if the project doesn't use `@/`.
3. Drop the usage example into a page and adapt copy/colors to the project's design system.
4. Verify: toggle "Reduce motion" in OS settings — the component must still be fully usable.
