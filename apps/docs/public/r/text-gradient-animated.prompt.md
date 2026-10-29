You are given a task to integrate a component from the **kinetik** motion library into this codebase.

# Animated Gradient Text (`text-gradient-animated`)

A looping multi-stop gradient flows through the letters. Zero JavaScript.

## What it should do
Create CSS-only animated gradient text: a multi-stop linear gradient at `background-size: 300%` clipped to the text, looping `background-position` linearly.

Keep: colors/speed passed as CSS custom properties, the first color repeated at the end for a seamless loop, and the animation disabled under `prefers-reduced-motion`.

## Project requirements
- React 19 + TypeScript, Tailwind CSS v4, shadcn/ui-style CSS variables (`background`, `foreground`, `muted`, `muted-foreground`, `border`, `card`, `primary`, `ring`). If the project lacks shadcn, set it up first (`npx shadcn@latest init`).
- Animation engine: **css**.
- No runtime dependencies (CSS only).
- Put the component at `components/kinetik/text-gradient-animated.tsx`.
- `cn` lives at `lib/kinetik/utils.ts` (source below).

## Non-negotiables
- **Accessibility:** Real text with color: transparent + background-clip; keep contrast of every stop ≥ 4.5:1 on your background. Reduced motion: static gradient.
- **Performance:** background-position animation on a single text node; 0 KB JS.
- Respect `prefers-reduced-motion` (replace movement with opacity or an instant change).
- Animate only transform / opacity / filter / clip-path. No hard-coded theme colors — use CSS variables so it works in light and dark.

## Source — components/kinetik/text-gradient-animated.tsx
```tsx
import type { ElementType, ReactNode } from "react";
import { cn } from "@/lib/kinetik/utils";

export interface TextGradientAnimatedProps {
  children: ReactNode;
  as?: ElementType;
  /** CSS colors for the gradient stops. */
  colors?: string[];
  /** Seconds per loop. */
  speed?: number;
  className?: string;
}

const css = `
.k-text-gradient{background-image:linear-gradient(90deg,var(--k-tg-colors));background-size:300% 100%;-webkit-background-clip:text;background-clip:text;color:transparent;animation:k-text-gradient var(--k-tg-speed) linear infinite}
@keyframes k-text-gradient{to{background-position:300% 0}}
@media (prefers-reduced-motion:reduce){.k-text-gradient{animation:none}}
[data-reduce-motion] .k-text-gradient{animation:none}`;

export function TextGradientAnimated({
  children,
  as: Tag = "span",
  colors = ["#8b5cf6", "#ec4899", "#f59e0b", "#06b6d4", "#8b5cf6"],
  speed = 6,
  className,
}: TextGradientAnimatedProps) {
  return (
    <>
      <style href="k-text-gradient" precedence="kinetik">{css}</style>
      <Tag
        className={cn("k-text-gradient", className)}
        style={{ "--k-tg-colors": colors.join(","), "--k-tg-speed": `${speed}s` } as React.CSSProperties}
      >
        {children}
      </Tag>
    </>
  );
}
```

## Usage example
```tsx
import { TextGradientAnimated } from "@/components/kinetik/text-gradient-animated";

export default function Demo() {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-2 p-8 text-center">
      <h2 className="text-4xl font-bold tracking-tight sm:text-6xl">
        Make it <TextGradientAnimated>unforgettable</TextGradientAnimated>
      </h2>
      <TextGradientAnimated colors={["#22c55e", "#06b6d4", "#3b82f6", "#22c55e"]} speed={4} className="text-sm font-medium">
        Zero JavaScript · pure CSS
      </TextGradientAnimated>
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
