You are given a task to integrate a component from the **kinetik** motion library into this codebase.

# Vertical Marquee (`marquee-vertical`)

Columns of cards scrolling endlessly up and down in alternating directions, masked to fade at the edges — the testimonial wall, in pure CSS.

## What it should do
Build a vertical marquee in pure CSS: a grid of columns, each a flex column containing its items twice (second copy aria-hidden) animated with translateY(0 → −50%) linear infinite; alternate columns reverse and vary duration by 15%. Mask top/bottom with a linear-gradient mask-image. Pause on hover/focus-within; no animation under reduced motion.

## Project requirements
- React 19 + TypeScript, Tailwind CSS v4, shadcn/ui-style CSS variables (`background`, `foreground`, `muted`, `muted-foreground`, `border`, `card`, `primary`, `ring`). If the project lacks shadcn, set it up first (`npx shadcn@latest init`).
- Animation engine: **css**.
- No runtime dependencies (CSS only).
- Put the component at `components/kinetik/marquee-vertical.tsx`.
- `cn` lives at `lib/kinetik/utils.ts` (source below).

## Non-negotiables
- **Accessibility:** Duplicated items are aria-hidden; hover/focus pauses; reduced motion shows a still wall.
- **Performance:** CSS transform animation only, zero JS; Server Component friendly.
- Respect `prefers-reduced-motion` (replace movement with opacity or an instant change).
- Animate only transform / opacity / filter / clip-path. No hard-coded theme colors — use CSS variables so it works in light and dark.

## Source — components/kinetik/marquee-vertical.tsx
```tsx
import type { ReactNode } from "react";
import { cn } from "@/lib/kinetik/utils";

export interface MarqueeVerticalProps {
  /** One array of items per column. */
  columns: ReactNode[][];
  /** Seconds for one loop of the first column; others vary slightly so they drift apart. */
  duration?: number;
  className?: string;
}

const css = `
@keyframes kn-vmarquee { to { transform: translateY(-50%); } }
.kn-vcol { animation: kn-vmarquee var(--kn-dur) linear infinite; }
.kn-vcol[data-reverse] { animation-direction: reverse; }
.kn-vwrap:hover .kn-vcol, .kn-vwrap:focus-within .kn-vcol { animation-play-state: paused; }
@media (prefers-reduced-motion: reduce) { .kn-vcol { animation: none; } }
[data-reduce-motion] .kn-vcol { animation: none; }
`;

/**
 * Columns of cards scrolling endlessly up and down in alternating directions (pure CSS), masked to
 * fade at the edges. Hover or focus pauses; reduced motion shows a still wall.
 */
export function MarqueeVertical({ columns, duration = 40, className }: MarqueeVerticalProps) {
  return (
    <div className={cn("kn-vwrap relative grid h-full gap-4 overflow-hidden [mask-image:linear-gradient(to_bottom,transparent,black_15%,black_85%,transparent)]", className)} style={{ gridTemplateColumns: `repeat(${columns.length}, minmax(0, 1fr))` }}>
      <style href="kn-marquee-vertical" precedence="kinetik">{css}</style>
      {columns.map((items, c) => (
        <div key={c} className="kn-vcol flex flex-col gap-4" data-reverse={c % 2 ? "" : undefined} style={{ ["--kn-dur" as string]: `${duration * (1 + c * 0.15)}s` }}>
          {items.map((it, i) => <div key={i}>{it}</div>)}
          {/* duplicate for a seamless loop — hidden from assistive tech */}
          {items.map((it, i) => <div key={`d${i}`} aria-hidden>{it}</div>)}
        </div>
      ))}
    </div>
  );
}
```

## Usage example
```tsx
import { photos } from "@/components/kinetik/demo-helpers" /* or inline */;
import { MarqueeVertical } from "@/components/kinetik/marquee-vertical";

const quotes = [
  ["Shipped our launch page in an afternoon.", "Ava, Design lead"],
  ["The reduced-motion fallbacks sold our accessibility team.", "Leo, Engineering"],
  ["Finally, GSAP and Motion pieces that agree on timing.", "Noor, Motion"],
  ["The AI prompts are scarily good.", "Kai, Product"],
  ["Our conversion went up after the new hero.", "Sam, Growth"],
  ["Copy, paste, tweak tokens, done.", "Mia, Freelance"],
];

const card = (q: string[], i: number) => (
  <figure className="rounded-2xl border border-border bg-card p-4 text-sm shadow-sm">
    <blockquote className="text-card-foreground">“{q[0]}”</blockquote>
    <figcaption className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
      <img src={photos[i % photos.length]} alt="" className="size-6 rounded-full object-cover" />
      {q[1]}
    </figcaption>
  </figure>
);

const rotate = (n: number) => [...quotes.slice(n), ...quotes.slice(0, n)].map((q, i) => card(q, i + n));

export default function Demo() {
  return (
    <div className="h-full p-4">
      <MarqueeVertical columns={[rotate(0), rotate(2), rotate(4)]} className="mx-auto max-w-3xl" />
    </div>
  );
}
```

## lib/kinetik/utils.ts
```ts
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/** Server-safe class merger (same as shadcn's `cn`). */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

## Steps
1. Install the dependencies above.
2. Create the files exactly as given, fixing import aliases if the project doesn't use `@/`.
3. Drop the usage example into a page and adapt copy/colors to the project's design system.
4. Verify: toggle "Reduce motion" in OS settings — the component must still be fully usable.
