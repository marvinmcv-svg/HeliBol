You are given a task to integrate a component from the **kinetik** motion library into this codebase.

# Shimmer Button (`button-shimmer`)

A glossy light sweep crosses the CTA every few seconds, pulling the eye without being noisy.

## What it should do
Create a pill CTA with a periodic shimmer: a `::before` pseudo-element holding a 110° transparent→white(35%)→transparent gradient at 250% width animates its background-position across the button during the first 60% of each cycle, then rests. Dark gradient fill, inset hairline, soft drop shadow, press squash. Reduced motion: no sweep.

## Project requirements
- React 19 + TypeScript, Tailwind CSS v4, shadcn/ui-style CSS variables (`background`, `foreground`, `muted`, `muted-foreground`, `border`, `card`, `primary`, `ring`). If the project lacks shadcn, set it up first (`npx shadcn@latest init`).
- Animation engine: **css**.
- No runtime dependencies (CSS only).
- Put the component at `components/kinetik/button-shimmer.tsx`.
- `cn` lives at `lib/kinetik/utils.ts` (source below).

## Non-negotiables
- **Accessibility:** Native button; animation is decorative. Reduced motion: no sweep.
- **Performance:** One background-position keyframe on a pseudo-element; 0 KB JS.
- Respect `prefers-reduced-motion` (replace movement with opacity or an instant change).
- Animate only transform / opacity / filter / clip-path. No hard-coded theme colors — use CSS variables so it works in light and dark.

## Source — components/kinetik/button-shimmer.tsx
```tsx
import type { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/kinetik/utils";

export interface ButtonShimmerProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** Seconds between sweeps. */
  duration?: number;
  shimmerColor?: string;
  /** Render as a link instead of a button. */
  href?: string;
}

const css = `
.k-shimmer-btn{position:relative;overflow:hidden;isolation:isolate}
.k-shimmer-btn::before{content:"";position:absolute;inset:0;z-index:-1;background:linear-gradient(110deg,transparent 35%,var(--k-shimmer-color) 50%,transparent 65%);background-size:250% 100%;animation:k-shimmer var(--k-shimmer-d) cubic-bezier(.4,0,.2,1) infinite}
@keyframes k-shimmer{0%{background-position:150% 0}60%,100%{background-position:-100% 0}}
@media (prefers-reduced-motion:reduce){.k-shimmer-btn::before{animation:none}}
[data-reduce-motion] .k-shimmer-btn::before{animation:none}`;

export function ButtonShimmer({ duration = 2.6, shimmerColor = "rgb(255 255 255 / .35)", href, className, style, ...props }: ButtonShimmerProps) {
  const Tag = (href ? "a" : "button") as "button";
  return (
    <>
      <style href="k-shimmer-btn" precedence="kinetik">{css}</style>
      <Tag
        {...(href ? { href } : {})}
        className={cn(
          "k-shimmer-btn inline-flex h-11 items-center justify-center gap-2 rounded-full bg-[linear-gradient(135deg,#18181b,#3f3f46)] px-6 text-sm font-medium text-white shadow-[0_0_0_1px_rgb(255_255_255/.08)_inset,0_8px_24px_-8px_rgb(0_0_0/.5)] outline-none transition-[scale,box-shadow] duration-150 active:scale-[0.97] focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
          className,
        )}
        style={{ "--k-shimmer-d": `${duration}s`, "--k-shimmer-color": shimmerColor, ...style } as React.CSSProperties}
        {...props}
      />
    </>
  );
}
```

## Usage example
```tsx
import { ButtonShimmer } from "@/components/kinetik/button-shimmer";

export default function Demo() {
  return (
    <div className="flex h-full w-full flex-wrap items-center justify-center gap-4 p-8">
      <ButtonShimmer>Start free trial →</ButtonShimmer>
      <ButtonShimmer className="bg-[linear-gradient(135deg,#7c3aed,#db2777)]" duration={2}>
        ✦ Upgrade to Pro
      </ButtonShimmer>
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
