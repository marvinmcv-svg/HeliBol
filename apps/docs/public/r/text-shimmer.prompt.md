You are given a task to integrate a component from the **kinetik** motion library into this codebase.

# Shimmer Text (`text-shimmer`)

A light band sweeps across text — the universal 'AI is working' / loading label. Inherits your text color.

## What it should do
Create a shimmer text effect for loading/"thinking" labels: text drawn at ~45% opacity of currentColor with a full-opacity band sweeping left→right on loop.

Keep: `background-clip: text` with a 250%-wide gradient, `color-mix(in oklab, currentColor 45%, transparent)` so it inherits any theme color, duration/spread as CSS variables, reduced motion = solid text.

## Project requirements
- React 19 + TypeScript, Tailwind CSS v4, shadcn/ui-style CSS variables (`background`, `foreground`, `muted`, `muted-foreground`, `border`, `card`, `primary`, `ring`). If the project lacks shadcn, set it up first (`npx shadcn@latest init`).
- Animation engine: **css**.
- No runtime dependencies (CSS only).
- Put the component at `components/kinetik/text-shimmer.tsx`.
- `cn` lives at `lib/kinetik/utils.ts` (source below).

## Non-negotiables
- **Accessibility:** Plain text; pair with aria-live / role=status when used as loading feedback. Reduced motion: static text.
- **Performance:** 0 KB JS, single background-position animation.
- Respect `prefers-reduced-motion` (replace movement with opacity or an instant change).
- Animate only transform / opacity / filter / clip-path. No hard-coded theme colors — use CSS variables so it works in light and dark.

## Source — components/kinetik/text-shimmer.tsx
```tsx
import type { ElementType, ReactNode } from "react";
import { cn } from "@/lib/kinetik/utils";

export interface TextShimmerProps {
  children: ReactNode;
  as?: ElementType;
  duration?: number;
  /** Width of the highlight band in px. */
  spread?: number;
  className?: string;
}

const css = `
.k-text-shimmer{--k-sh-base:color-mix(in oklab,currentColor 45%,transparent);background:linear-gradient(90deg,var(--k-sh-base) calc(50% - var(--k-sh-spread)),currentColor 50%,var(--k-sh-base) calc(50% + var(--k-sh-spread))) 0 0/250% 100% no-repeat,var(--k-sh-base);-webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent;animation:k-text-shimmer var(--k-sh-duration) linear infinite}
@keyframes k-text-shimmer{from{background-position:100% 0}to{background-position:0% 0}}
@media (prefers-reduced-motion:reduce){.k-text-shimmer{animation:none;-webkit-text-fill-color:currentColor}}
[data-reduce-motion] .k-text-shimmer{animation:none;-webkit-text-fill-color:currentColor}`;

export function TextShimmer({ children, as: Tag = "span", duration = 2, spread = 40, className }: TextShimmerProps) {
  return (
    <>
      <style href="k-text-shimmer" precedence="kinetik">{css}</style>
      <Tag
        className={cn("k-text-shimmer inline-block", className)}
        style={{ "--k-sh-duration": `${duration}s`, "--k-sh-spread": `${spread}px` } as React.CSSProperties}
      >
        {children}
      </Tag>
    </>
  );
}
```

## Usage example
```tsx
import { TextShimmer } from "@/components/kinetik/text-shimmer";

export default function Demo() {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-6 p-8">
      <div className="flex items-center gap-3 rounded-xl border border-border bg-card px-4 py-3 text-sm">
        <span className="size-2 animate-pulse rounded-full bg-emerald-500" />
        <TextShimmer>Claude is thinking…</TextShimmer>
      </div>
      <TextShimmer as="h2" duration={3} spread={60} className="text-4xl font-semibold tracking-tight">
        Generating your interface
      </TextShimmer>
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
