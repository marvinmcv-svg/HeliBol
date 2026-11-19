You are given a task to integrate a block from the **kinetik** motion library into this codebase.

# Template — Creative Portfolio (`template-portfolio`)

An independent creative's portfolio: a 3D image-ribbon opener behind a giant name, an about section with a smart-animate discipline word, a selected-work grid, a vertical marquee of kind words, a contact section and a footer reveal.

## What it should do
Build a creative portfolio: warm paper background; opener with a huge two-line name and a spinning three.js image ribbon in front of it plus a floating expandable nav; an about paragraph with a word that smart-animates (brands/books/films/spaces); a work grid with filterable cards; a three-column vertical marquee of testimonials; a contact section; footer reveal.

## Project requirements
- React 19 + TypeScript, Tailwind CSS v4, shadcn/ui-style CSS variables (`background`, `foreground`, `muted`, `muted-foreground`, `border`, `card`, `primary`, `ring`). If the project lacks shadcn, set it up first (`npx shadcn@latest init`).
- Animation engine: **r3f**.
- Install dependencies: `npm i three @react-three/fiber @react-three/drei motion lucide-react`
- Put the component at `components/kinetik/template-portfolio.tsx`.

## Built from these kinetik components
Install them first (each also has its own prompt at `https://marvzkineticlibrary.vercel.app/r/<id>.prompt.md`):
```bash
npx shadcn@latest add https://marvzkineticlibrary.vercel.app/r/marquee-vertical.json https://marvzkineticlibrary.vercel.app/r/text-smart-animate.json https://marvzkineticlibrary.vercel.app/r/portfolio-ribbon.json https://marvzkineticlibrary.vercel.app/r/blog-grid.json https://marvzkineticlibrary.vercel.app/r/contact-section.json https://marvzkineticlibrary.vercel.app/r/footer-reveal.json
```

## Non-negotiables
- **Accessibility:** Landmarks per section, one H1 (the hero), real links and buttons throughout; every composed block keeps its own reduced-motion fallback.
- **Performance:** Heavy sections (three.js, canvas) are client components that pause off-screen; previews and thumbnails mount lazily.
- Respect `prefers-reduced-motion` (replace movement with opacity or an instant change).
- Animate only transform / opacity / filter / clip-path. No hard-coded theme colors — use CSS variables so it works in light and dark.

## Source — components/kinetik/template-portfolio.tsx
```tsx
"use client";
import { MarqueeVertical } from "@/components/kinetik/marquee-vertical";
import { TextSmartAnimate } from "@/components/kinetik/text-smart-animate";
import { PortfolioRibbon } from "@/components/kinetik/portfolio-ribbon";
import { BlogGrid } from "@/components/kinetik/blog-grid";
import { ContactSection } from "@/components/kinetik/contact-section";
import { FooterReveal } from "@/components/kinetik/footer-reveal";

const quotes = [
  ["Mara turned a brief into a brand our customers talk about.", "Head of Brand, Halo"],
  ["The fastest, calmest creative partner we've worked with.", "Founder, Orvo"],
  ["Every frame had a reason to exist.", "Creative Director, Field"],
  ["She made our book feel like an object, not a PDF.", "Editor, Saffron Press"],
];

/** Independent creative's portfolio: 3D ribbon opener → about → selected work grid → kind words → contact → footer reveal. */
export function TemplatePortfolio() {
  return (
    <div className="relative bg-[#ece8df] text-zinc-900">
      <div className="p-3"><PortfolioRibbon /></div>
      <section id="about" className="mx-auto grid max-w-5xl gap-8 px-6 py-16 md:grid-cols-[1fr_2fr]">
        <p className="text-xs uppercase tracking-[0.3em] text-zinc-500">About</p>
        <p className="text-2xl leading-snug tracking-tight sm:text-3xl">
          Art director for <TextSmartAnimate words={["brands", "books", "films", "spaces"]} className="font-semibold" /> that need to feel inevitable. Twelve years, four studios, one rule: motion must mean something.
        </p>
      </section>
      <div id="work" className="rounded-t-[2rem] bg-background text-foreground"><BlogGrid /></div>
      <section className="h-[420px] bg-background px-6 pb-10">
        <MarqueeVertical
          className="mx-auto h-full max-w-4xl"
          columns={[0, 1, 2].map((c) => quotes.map((_, i) => quotes[(i + c) % quotes.length]).map((q) => (
            <figure key={q[0]} className="rounded-2xl border border-border bg-card p-4 text-sm"><blockquote>“{q[0]}”</blockquote><figcaption className="mt-2 text-xs text-muted-foreground">{q[1]}</figcaption></figure>
          )))}
        />
      </section>
      <div id="contact" className="bg-background text-foreground"><ContactSection /></div>
      <FooterReveal />
    </div>
  );
}
```

## Usage example
```tsx
"use client";
import { DemoScroller } from "@web/_demo";
import { TemplatePortfolio } from "@/components/kinetik/template-portfolio";

export default function Demo() {
  return (
    <DemoScroller thumbAt={0}>
      <TemplatePortfolio />
    </DemoScroller>
  );
}
```

## Steps
1. Install the dependencies above.
2. Create the files exactly as given, fixing import aliases if the project doesn't use `@/`.
3. Drop the usage example into a page and adapt copy/colors to the project's design system.
4. Verify: toggle "Reduce motion" in OS settings — the component must still be fully usable.
