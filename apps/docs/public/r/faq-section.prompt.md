You are given a task to integrate a block from the **kinetik** motion library into this codebase.

# FAQ Section (`faq-section`)

Two-column FAQ: highlighted heading on the left, smooth height-auto accordion on the right.

## What it should do
Build a two-column FAQ section: left column H2 with one word getting a marker highlight on view plus a help line; right column a smooth accordion (height auto, rotating plus icon) with five Q&As, first one open.

## Project requirements
- React 19 + TypeScript, Tailwind CSS v4, shadcn/ui-style CSS variables (`background`, `foreground`, `muted`, `muted-foreground`, `border`, `card`, `primary`, `ring`). If the project lacks shadcn, set it up first (`npx shadcn@latest init`).
- Animation engine: **motion**.
- Install dependencies: `npm i motion`
- Put the component at `components/kinetik/faq-section.tsx`.

## Built from these kinetik components
Install them first (each also has its own prompt at `https://marvzkineticlibrary.vercel.app/r/<id>.prompt.md`):
```bash
npx shadcn@latest add https://marvzkineticlibrary.vercel.app/r/accordion-smooth.json https://marvzkineticlibrary.vercel.app/r/text-highlighter.json
```

## Non-negotiables
- **Accessibility:** Disclosure pattern; heading hierarchy preserved.
- **Performance:** Only the opening panel animates.
- Respect `prefers-reduced-motion` (replace movement with opacity or an instant change).
- Animate only transform / opacity / filter / clip-path. No hard-coded theme colors — use CSS variables so it works in light and dark.

## Source — components/kinetik/faq-section.tsx
```tsx
"use client";
import { AccordionSmooth } from "@/components/kinetik/accordion-smooth";
import { TextHighlighter } from "@/components/kinetik/text-highlighter";

export function FaqSection() {
  return (
    <section className="mx-auto grid max-w-5xl gap-10 px-6 py-14 md:grid-cols-[1fr_1.4fr]">
      <div>
        <h2 className="text-3xl font-semibold tracking-tight">Questions, <TextHighlighter>answered</TextHighlighter>.</h2>
        <p className="mt-3 text-sm text-muted-foreground">Can&apos;t find what you need? Ask in our community — we reply within a day.</p>
      </div>
      <AccordionSmooth
        defaultOpen={["a"]}
        items={[
          { id: "a", title: "Is kinetik really free?", content: "Yes — MIT licensed. Components are source code in your repo, not a dependency you rent." },
          { id: "b", title: "Which frameworks are supported?", content: "React 19 / Next.js on the web, and Expo / React Native (Reanimated 4) for mobile flows." },
          { id: "c", title: "Will it bloat my bundle?", content: "Most components are CSS-only. Motion components can use LazyMotion (~4.6 KB). 3D is always lazy-loaded." },
          { id: "d", title: "How do AI prompts work?", content: "Each page has a Copy AI prompt button with intent, constraints, source and helpers — paste it into your coding agent." },
          { id: "e", title: "Accessibility?", content: "Every component honours prefers-reduced-motion and has keyboard parity for hover/drag interactions." },
        ]}
      />
    </section>
  );
}
```

## Usage example
```tsx
"use client";
import { FaqSection } from "@/components/kinetik/faq-section";
export default function Demo() {
  return <div className="h-full overflow-auto"><FaqSection /></div>;
}
```

## Steps
1. Install the dependencies above.
2. Create the files exactly as given, fixing import aliases if the project doesn't use `@/`.
3. Drop the usage example into a page and adapt copy/colors to the project's design system.
4. Verify: toggle "Reduce motion" in OS settings — the component must still be fully usable.
