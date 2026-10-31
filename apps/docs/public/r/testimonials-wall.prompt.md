You are given a task to integrate a block from the **kinetik** motion library into this codebase.

# Testimonials Wall (`testimonials-wall`)

Masonry wall of testimonials with a star-rating header; cards rise and unblur column by column and lift on hover.

## What it should do
Build a testimonials wall: centered star rating + headline, then CSS-column masonry of quote cards (every 4th larger) that enter with y 30 + blur 6 on view, staggered by column, and lift 4px on hover.

## Project requirements
- React 19 + TypeScript, Tailwind CSS v4, shadcn/ui-style CSS variables (`background`, `foreground`, `muted`, `muted-foreground`, `border`, `card`, `primary`, `ring`). If the project lacks shadcn, set it up first (`npx shadcn@latest init`).
- Animation engine: **motion**.
- Install dependencies: `npm i motion`
- Put the component at `components/kinetik/testimonials-wall.tsx`.

## Built from these kinetik components
Install them first (each also has its own prompt at `https://marvzkineticlibrary.vercel.app/r/<id>.prompt.md`):
```bash
npx shadcn@latest add https://marvzkineticlibrary.vercel.app/r/rating-stars.json
```

## Non-negotiables
- **Accessibility:** Semantic figure/blockquote/figcaption; stars are a real radio group.
- **Performance:** whileInView once per card; CSS columns.
- Respect `prefers-reduced-motion` (replace movement with opacity or an instant change).
- Animate only transform / opacity / filter / clip-path. No hard-coded theme colors — use CSS variables so it works in light and dark.

## Source — components/kinetik/testimonials-wall.tsx
```tsx
"use client";
import { motion } from "motion/react";
import { RatingStars } from "@/components/kinetik/rating-stars";

const quotes = [
  ["Ava Lin", "Design Eng · Northwind", "The AI prompts alone saved us a sprint. We paste, tweak tokens, ship.", 8],
  ["Kai Moreno", "Founder · Hooli", "Reduced motion that's designed, not bolted on. Our a11y audit flew by.", 3],
  ["Noor Haddad", "CTO · Globex", "Our landing page finally feels expensive. Conversion is up 18%.", 6],
  ["Leo Park", "Mobile lead · Acme", "Same springs on web and iOS. Nobody can tell which is which.", 2],
  ["Mila Rossi", "PM · Initech", "We replaced three animation libraries with one folder of source.", 5],
  ["Ezra Cole", "Indie hacker", "Shipped a paywall flow in an afternoon. It converts better than the old one.", 1],
] as const;

export function TestimonialsWall() {
  return (
    <section className="mx-auto max-w-5xl px-6 py-14">
      <div className="text-center">
        <RatingStars defaultValue={5} label="Average rating" className="justify-center [&_svg]:size-5" />
        <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">4.9 from 2,000+ teams</h2>
      </div>
      <div className="mt-10 gap-4 [column-fill:_balance] sm:columns-2 lg:columns-3">
        {quotes.map(([n, r, q, img], i) => (
          <motion.figure key={n} initial={{ opacity: 0, y: 30, filter: "blur(6px)" }} whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }} viewport={{ once: true, amount: 0.3 }} transition={{ delay: (i % 3) * 0.1, duration: 0.7, ease: [0.16, 1, 0.3, 1] }} whileHover={{ y: -4 }} className="mb-4 break-inside-avoid rounded-2xl border border-border bg-card p-5 shadow-sm">
            <blockquote className={i % 4 === 0 ? "text-lg leading-snug font-medium" : "text-sm leading-relaxed"}>“{q}”</blockquote>
            <figcaption className="mt-4 flex items-center gap-3"><img src={`/demo/photo-${img}.jpg`} alt="" className="size-9 rounded-full object-cover" /><div><p className="text-sm font-semibold">{n}</p><p className="text-xs text-muted-foreground">{r}</p></div></figcaption>
          </motion.figure>
        ))}
      </div>
    </section>
  );
}
```

## Usage example
```tsx
"use client";
import { TestimonialsWall } from "@/components/kinetik/testimonials-wall";
export default function Demo() { return <div className="h-full overflow-auto"><TestimonialsWall /></div>; }
```

## Steps
1. Install the dependencies above.
2. Create the files exactly as given, fixing import aliases if the project doesn't use `@/`.
3. Drop the usage example into a page and adapt copy/colors to the project's design system.
4. Verify: toggle "Reduce motion" in OS settings — the component must still be fully usable.
