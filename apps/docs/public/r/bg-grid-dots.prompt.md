You are given a task to integrate a component from the **kinetik** motion library into this codebase.

# Grid & Dot Pattern (`bg-grid-dots`)

Dot or line grid backgrounds with a radial vignette mask and optional slow pan — the dev-tool aesthetic.

## What it should do
Create a background pattern component: dots via `radial-gradient(circle at 1px 1px, color 1px, transparent 0)` or grid via two 1px linear-gradients, sized by a `size` prop, with color derived from the foreground (`color-mix(... 12%, transparent)`), an optional radial vignette mask, and an optional pan keyframe that shifts background-position by one cell.

## Project requirements
- React 19 + TypeScript, Tailwind CSS v4, shadcn/ui-style CSS variables (`background`, `foreground`, `muted`, `muted-foreground`, `border`, `card`, `primary`, `ring`). If the project lacks shadcn, set it up first (`npx shadcn@latest init`).
- Animation engine: **css**.
- No runtime dependencies (CSS only).
- Put the component at `components/kinetik/bg-grid-dots.tsx`.
- `cn` lives at `lib/kinetik/utils.ts` (source below).

## Non-negotiables
- **Accessibility:** aria-hidden. Pan pauses under reduced motion.
- **Performance:** Two CSS gradients; panning animates background-position (one paint layer).
- Respect `prefers-reduced-motion` (replace movement with opacity or an instant change).
- Animate only transform / opacity / filter / clip-path. No hard-coded theme colors — use CSS variables so it works in light and dark.

## Source — components/kinetik/bg-grid-dots.tsx
```tsx
import type { ReactNode } from "react";
import { cn } from "@/lib/kinetik/utils";

export interface BgGridDotsProps {
  children?: ReactNode;
  variant?: "dots" | "grid";
  size?: number;
  /** Fade the pattern toward the edges with a radial mask. */
  vignette?: boolean;
  /** Slowly pan the pattern. */
  animate?: boolean;
  className?: string;
}

const css = `
@keyframes k-grid-pan{to{background-position:var(--k-gs) var(--k-gs)}}
.k-grid-pan{animation:k-grid-pan 3s linear infinite}
@media (prefers-reduced-motion:reduce){.k-grid-pan{animation:none}}
[data-reduce-motion] .k-grid-pan{animation:none}`;

export function BgGridDots({ children, variant = "dots", size = 24, vignette = true, animate = false, className }: BgGridDotsProps) {
  const line = "color-mix(in oklab, var(--color-foreground, currentColor) 18%, transparent)";
  const bg =
    variant === "dots"
      ? `radial-gradient(circle at 1px 1px, ${line} 1px, transparent 0)`
      : `linear-gradient(${line} 1px, transparent 1px), linear-gradient(90deg, ${line} 1px, transparent 1px)`;
  return (
    <div className={cn("relative isolate", className)}>
      <style href="k-grid" precedence="kinetik">{css}</style>
      <div
        aria-hidden
        className={cn("absolute inset-0 -z-10", animate && "k-grid-pan")}
        style={
          {
            backgroundImage: bg,
            backgroundSize: `${size}px ${size}px`,
            "--k-gs": `${size}px`,
            maskImage: vignette ? "radial-gradient(ellipse at center, #000 30%, transparent 75%)" : undefined,
            WebkitMaskImage: vignette ? "radial-gradient(ellipse at center, #000 30%, transparent 75%)" : undefined,
          } as React.CSSProperties
        }
      />
      {children}
    </div>
  );
}
```

## Usage example
```tsx
import { BgGridDots } from "@/components/kinetik/bg-grid-dots";

export default function Demo() {
  return (
    <div className="grid h-full w-full grid-cols-2">
      <BgGridDots className="grid place-items-center border-r border-border p-6">
        <span className="rounded-full border border-border bg-background px-3 py-1 text-xs">dots · vignette</span>
      </BgGridDots>
      <BgGridDots variant="grid" size={32} animate className="grid place-items-center p-6">
        <span className="rounded-full border border-border bg-background px-3 py-1 text-xs">grid · panning</span>
      </BgGridDots>
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
