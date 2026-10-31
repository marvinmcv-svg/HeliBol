You are given a task to integrate a component from the **kinetik** motion library into this codebase.

# Hover Reveal Card (`card-hover-reveal`)

Image card: on hover or focus the photo zooms and dims while a details panel slides up from the bottom.

## What it should do
Make a hover-reveal image card: image scales 1.1 and drops to brightness .5 over 700ms expo-out; the bottom text block lifts 4px and an extra details row expands with grid-template-rows 0fr→1fr then fades in. Same on :focus-visible.

## Project requirements
- React 19 + TypeScript, Tailwind CSS v4, shadcn/ui-style CSS variables (`background`, `foreground`, `muted`, `muted-foreground`, `border`, `card`, `primary`, `ring`). If the project lacks shadcn, set it up first (`npx shadcn@latest init`).
- Animation engine: **css**.
- No runtime dependencies (CSS only).
- Put the component at `components/kinetik/card-hover-reveal.tsx`.
- `cn` lives at `lib/kinetik/utils.ts` (source below).

## Non-negotiables
- **Accessibility:** Focusable article; identical reveal on focus-visible; text is in the DOM from the start.
- **Performance:** scale/filter + grid-rows transitions; 0 KB JS.
- Respect `prefers-reduced-motion` (replace movement with opacity or an instant change).
- Animate only transform / opacity / filter / clip-path. No hard-coded theme colors — use CSS variables so it works in light and dark.

## Source — components/kinetik/card-hover-reveal.tsx
```tsx
import type { ReactNode } from "react";
import { cn } from "@/lib/kinetik/utils";

/** Image card: on hover/focus the photo zooms and darkens while a details panel slides up from the bottom. CSS only. */
export function CardHoverReveal({ image, title, subtitle, children, className }: { image: string; title: string; subtitle?: string; children?: ReactNode; className?: string }) {
  return (
    <article tabIndex={0} className={cn("group relative overflow-hidden rounded-3xl outline-none focus-visible:ring-2 focus-visible:ring-ring", className)}>
      <img src={image} alt="" className="h-full w-full object-cover transition-[scale,filter] duration-700 ease-[cubic-bezier(.16,1,.3,1)] group-hover:scale-110 group-hover:brightness-50 group-focus-visible:scale-110 group-focus-visible:brightness-50 motion-reduce:transition-none" />
      <div className="absolute inset-x-0 bottom-0 p-5 text-white">
        <h3 className="text-lg font-semibold transition-transform duration-500 ease-[cubic-bezier(.16,1,.3,1)] group-hover:-translate-y-1">{title}</h3>
        {subtitle && <p className="text-sm text-white/70">{subtitle}</p>}
        <div className="grid grid-rows-[0fr] transition-[grid-template-rows] duration-500 ease-[cubic-bezier(.16,1,.3,1)] group-hover:grid-rows-[1fr] group-focus-visible:grid-rows-[1fr]">
          <div className="overflow-hidden">
            <div className="pt-3 text-sm text-white/85 opacity-0 transition-opacity delay-100 duration-300 group-hover:opacity-100 group-focus-visible:opacity-100">{children}</div>
          </div>
        </div>
      </div>
    </article>
  );
}
```

## Usage example
```tsx
import { CardHoverReveal } from "@/components/kinetik/card-hover-reveal";
export default function Demo() {
  return (
    <div className="grid h-full w-full grid-cols-2 gap-4 p-6">
      <CardHoverReveal image="/demo/photo-4.jpg" title="Emerald Canopy" subtitle="Field notes · 6 min" className="h-full">
        Walk through a forest rendered entirely in code. Every tree is a sine wave with opinions. <span className="underline">Read story →</span>
      </CardHoverReveal>
      <CardHoverReveal image="/demo/photo-5.jpg" title="Amber Road" subtitle="Travel · 4 min" className="h-full">
        A road trip with no destination and perfectly eased curves. <span className="underline">Read story →</span>
      </CardHoverReveal>
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
