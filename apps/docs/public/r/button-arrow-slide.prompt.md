You are given a task to integrate a component from the **kinetik** motion library into this codebase.

# Arrow Slide Button (`button-arrow-slide`)

Hover sweeps a fill in from the left, nudges the label and swaps the arrow out to the right as a new one slides in.

## What it should do
Create an arrow-slide CTA: outlined pill with label + circular arrow badge. On hover/focus a full-width fill scales X 0→1 from the left (500ms cubic-bezier(.76,0,.24,1)), the label shifts 4px and inverts color, and inside the badge the arrow translates out to +32px while a duplicate enters from −32px.

## Project requirements
- React 19 + TypeScript, Tailwind CSS v4, shadcn/ui-style CSS variables (`background`, `foreground`, `muted`, `muted-foreground`, `border`, `card`, `primary`, `ring`). If the project lacks shadcn, set it up first (`npx shadcn@latest init`).
- Animation engine: **css**.
- No runtime dependencies (CSS only).
- Put the component at `components/kinetik/button-arrow-slide.tsx`.
- `cn` lives at `lib/kinetik/utils.ts` (source below).

## Non-negotiables
- **Accessibility:** Native button; same effect on focus-visible; transitions off under reduced motion.
- **Performance:** Transforms only, 0 KB JS.
- Respect `prefers-reduced-motion` (replace movement with opacity or an instant change).
- Animate only transform / opacity / filter / clip-path. No hard-coded theme colors — use CSS variables so it works in light and dark.

## Source — components/kinetik/button-arrow-slide.tsx
```tsx
import type { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/kinetik/utils";

/** On hover a fill sweeps in from the left, the label nudges and the arrow exits right as a new one enters. CSS only. */
export function ButtonArrowSlide({ className, children, ...props }: ButtonHTMLAttributes<HTMLButtonElement>) {
  const arrow = <svg viewBox="0 0 16 16" className="size-4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M3 8h10M9 4l4 4-4 4" /></svg>;
  return (
    <button
      className={cn(
        "group relative inline-flex h-12 items-center gap-3 overflow-hidden rounded-full border border-foreground/15 bg-background pr-2 pl-6 text-sm font-medium outline-none focus-visible:ring-2 focus-visible:ring-ring",
        className,
      )}
      {...props}
    >
      <span aria-hidden className="absolute inset-0 origin-left scale-x-0 rounded-full bg-foreground transition-transform duration-500 ease-[cubic-bezier(.76,0,.24,1)] group-hover:scale-x-100 group-focus-visible:scale-x-100 motion-reduce:transition-none" />
      <span className="relative transition-[color,translate] duration-500 ease-[cubic-bezier(.76,0,.24,1)] group-hover:translate-x-1 group-hover:text-background group-focus-visible:text-background">{children}</span>
      <span className="relative grid size-8 place-items-center overflow-hidden rounded-full bg-foreground text-background transition-colors duration-500 group-hover:bg-background group-hover:text-foreground">
        <span className="transition-transform duration-500 ease-[cubic-bezier(.76,0,.24,1)] group-hover:translate-x-8 motion-reduce:transition-none">{arrow}</span>
        <span className="absolute -translate-x-8 transition-transform duration-500 ease-[cubic-bezier(.76,0,.24,1)] group-hover:translate-x-0 motion-reduce:transition-none">{arrow}</span>
      </span>
    </button>
  );
}
```

## Usage example
```tsx
import { ButtonArrowSlide } from "@/components/kinetik/button-arrow-slide";
export default function Demo() {
  return <div className="flex h-full w-full items-center justify-center p-8"><ButtonArrowSlide>Start a project</ButtonArrowSlide></div>;
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
