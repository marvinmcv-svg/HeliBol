You are given a task to integrate a component from the **kinetik** motion library into this codebase.

# Press Button (`button-press`)

The foundation button: 2px hover lift, 0.97 press squash, layered shadow and a crisp focus ring. CSS only.

## What it should do
Create a base button with premium tactile feedback in pure CSS/Tailwind: translateY(-2px) + stronger shadow on hover, scale(0.97) on :active with a faster 100ms duration, `cubic-bezier(.2,0,0,1)` easing, focus-visible ring with offset, three variants and three sizes. Reduced motion removes the lift and squash.

## Project requirements
- React 19 + TypeScript, Tailwind CSS v4, shadcn/ui-style CSS variables (`background`, `foreground`, `muted`, `muted-foreground`, `border`, `card`, `primary`, `ring`). If the project lacks shadcn, set it up first (`npx shadcn@latest init`).
- Animation engine: **css**.
- No runtime dependencies (CSS only).
- Put the component at `components/kinetik/button-press.tsx`.
- `cn` lives at `lib/kinetik/utils.ts` (source below).

## Non-negotiables
- **Accessibility:** Native <button>; focus-visible ring with offset; disabled state removes pointer events. Reduced motion: no lift or squash.
- **Performance:** transform + box-shadow transitions only; 0 KB JS.
- Respect `prefers-reduced-motion` (replace movement with opacity or an instant change).
- Animate only transform / opacity / filter / clip-path. No hard-coded theme colors — use CSS variables so it works in light and dark.

## Source — components/kinetik/button-press.tsx
```tsx
import type { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/kinetik/utils";

export interface ButtonPressProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost";
  size?: "sm" | "md" | "lg";
}

/** The base button every kinetik button builds on: hover lift, press squash, crisp focus ring. */
export function ButtonPress({ variant = "primary", size = "md", className, ...props }: ButtonPressProps) {
  return (
    <button
      className={cn(
        "inline-flex select-none items-center justify-center gap-2 rounded-xl font-medium outline-none",
        "transition-[translate,scale,box-shadow,background-color] duration-150 ease-[cubic-bezier(.2,0,0,1)]",
        "hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.97] active:duration-100",
        "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        "disabled:pointer-events-none disabled:opacity-50 motion-reduce:hover:translate-y-0 motion-reduce:active:scale-100",
        variant === "primary" && "bg-primary text-primary-foreground shadow-[0_1px_2px_rgb(0_0_0/.2),inset_0_1px_0_rgb(255_255_255/.12)] hover:shadow-lg hover:shadow-primary/20",
        variant === "secondary" && "border border-border bg-card text-foreground shadow-sm hover:shadow-md",
        variant === "ghost" && "text-foreground hover:bg-accent",
        size === "sm" && "h-8 px-3 text-xs",
        size === "md" && "h-10 px-4 text-sm",
        size === "lg" && "h-12 px-6 text-base",
        className,
      )}
      {...props}
    />
  );
}
```

## Usage example
```tsx
import { ButtonPress } from "@/components/kinetik/button-press";

export default function Demo() {
  return (
    <div className="flex h-full w-full flex-wrap items-center justify-center gap-3 p-8">
      <ButtonPress>Get started</ButtonPress>
      <ButtonPress variant="secondary">Book a demo</ButtonPress>
      <ButtonPress variant="ghost">Learn more →</ButtonPress>
      <ButtonPress size="lg">Large primary</ButtonPress>
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
