You are given a task to integrate a component from the **kinetik** motion library into this codebase.

# Expanding Icon Button (`button-expand-icon`)

Icon-only circles that widen to reveal a label on hover or focus — compact toolbars that still explain themselves.

## What it should do
Build an expanding icon button with the CSS grid trick: label wrapper is `display:grid; grid-template-columns: 0fr` transitioning to `1fr` on hover/focus-visible (300ms), inner overflow hidden, label fades in after 100ms.

## Project requirements
- React 19 + TypeScript, Tailwind CSS v4, shadcn/ui-style CSS variables (`background`, `foreground`, `muted`, `muted-foreground`, `border`, `card`, `primary`, `ring`). If the project lacks shadcn, set it up first (`npx shadcn@latest init`).
- Animation engine: **css**.
- No runtime dependencies (CSS only).
- Put the component at `components/kinetik/button-expand-icon.tsx`.
- `cn` lives at `lib/kinetik/utils.ts` (source below).

## Non-negotiables
- **Accessibility:** aria-label always present, so the label isn't required to understand the control; expands on focus-visible.
- **Performance:** grid-template-columns 0fr→1fr transition; 0 KB JS.
- Respect `prefers-reduced-motion` (replace movement with opacity or an instant change).
- Animate only transform / opacity / filter / clip-path. No hard-coded theme colors — use CSS variables so it works in light and dark.

## Source — components/kinetik/button-expand-icon.tsx
```tsx
import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/kinetik/utils";

export interface ButtonExpandIconProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  icon: ReactNode;
  label: string;
}

/** An icon-only circle that smoothly widens to reveal its label on hover/focus (grid 0fr→1fr trick, CSS only). */
export function ButtonExpandIcon({ icon, label, className, ...props }: ButtonExpandIconProps) {
  return (
    <button
      aria-label={label}
      className={cn("group inline-flex h-11 items-center rounded-full bg-foreground px-3 text-background outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background", className)}
      {...props}
    >
      <span className="grid size-5 shrink-0 place-items-center [&>svg]:size-5">{icon}</span>
      <span className="grid grid-cols-[0fr] transition-[grid-template-columns] duration-300 ease-[cubic-bezier(.2,0,0,1)] group-hover:grid-cols-[1fr] group-focus-visible:grid-cols-[1fr] motion-reduce:transition-none">
        <span className="overflow-hidden">
          <span className="block pl-2 pr-1 text-sm font-medium whitespace-nowrap opacity-0 transition-opacity duration-200 group-hover:opacity-100 group-hover:delay-100 group-focus-visible:opacity-100" aria-hidden>
            {label}
          </span>
        </span>
      </span>
    </button>
  );
}
```

## Usage example
```tsx
import { Download, Heart, Share2, Trash2 } from "lucide-react";
import { ButtonExpandIcon } from "@/components/kinetik/button-expand-icon";
export default function Demo() {
  return (
    <div className="flex h-full w-full flex-wrap items-center justify-center gap-3 p-8">
      <ButtonExpandIcon icon={<Heart />} label="Save to favorites" />
      <ButtonExpandIcon icon={<Share2 />} label="Share" className="bg-sky-600 text-white" />
      <ButtonExpandIcon icon={<Download />} label="Download PNG" className="bg-emerald-600 text-white" />
      <ButtonExpandIcon icon={<Trash2 />} label="Delete" className="bg-destructive text-white" />
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
