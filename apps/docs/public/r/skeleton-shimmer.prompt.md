You are given a task to integrate a component from the **kinetik** motion library into this codebase.

# Skeleton Shimmer (`skeleton-shimmer`)

Theme-aware skeleton blocks with a soft sweeping highlight. Shape them with Tailwind classes to match your layout.

## What it should do
Create a Skeleton block: background = foreground at 8% (color-mix, theme-aware), and an ::after highlight gradient that translates from -100% to 100% every 1.6s. Demo a card that toggles between skeleton and loaded content with matching shapes. Static under reduced motion.

## Project requirements
- React 19 + TypeScript, Tailwind CSS v4, shadcn/ui-style CSS variables (`background`, `foreground`, `muted`, `muted-foreground`, `border`, `card`, `primary`, `ring`). If the project lacks shadcn, set it up first (`npx shadcn@latest init`).
- Animation engine: **css**.
- No runtime dependencies (CSS only).
- Put the component at `components/kinetik/skeleton-shimmer.tsx`.
- `cn` lives at `lib/kinetik/utils.ts` (source below).

## Non-negotiables
- **Accessibility:** Skeletons are aria-hidden; put aria-busy on the loading container. Reduced motion: static blocks.
- **Performance:** translate on a pseudo-element; 0 KB JS.
- Respect `prefers-reduced-motion` (replace movement with opacity or an instant change).
- Animate only transform / opacity / filter / clip-path. No hard-coded theme colors — use CSS variables so it works in light and dark.

## Source — components/kinetik/skeleton-shimmer.tsx
```tsx
import type { HTMLAttributes } from "react";
import { cn } from "@/lib/kinetik/utils";

const css = `
.k-skel{position:relative;overflow:hidden;background:color-mix(in oklab,var(--color-foreground,#888) 8%,transparent)}
.k-skel::after{content:"";position:absolute;inset:0;translate:-100% 0;background:linear-gradient(90deg,transparent,color-mix(in oklab,var(--color-foreground,#888) 9%,transparent),transparent);animation:k-skel 1.6s cubic-bezier(.4,0,.2,1) infinite}
@keyframes k-skel{to{translate:100% 0}}
@media (prefers-reduced-motion:reduce){.k-skel::after{animation:none;display:none}}
[data-reduce-motion] .k-skel::after{display:none}`;

/** Skeleton block with a sweeping highlight. Size it with Tailwind classes. */
export function Skeleton({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <>
      <style href="k-skel" precedence="kinetik">{css}</style>
      <div aria-hidden className={cn("k-skel rounded-md", className)} {...props} />
    </>
  );
}
```

## Usage example
```tsx
"use client";
import { useEffect, useState } from "react";
import { Skeleton } from "@/components/kinetik/skeleton-shimmer";

export default function Demo() {
  const [loaded, setLoaded] = useState(false);
  useEffect(() => {
    const id = setInterval(() => setLoaded((l) => !l), 2600);
    return () => clearInterval(id);
  }, []);
  return (
    <div className="flex h-full w-full items-center justify-center p-6">
      <div className="w-80 rounded-2xl border border-border bg-card p-4" aria-busy={!loaded}>
        {loaded ? (
          <div>
            <img src="/demo/photo-4.jpg" alt="" className="aspect-video w-full rounded-xl object-cover" />
            <div className="mt-3 flex items-center gap-3">
              <img src="/demo/photo-8.jpg" alt="" className="size-10 rounded-full object-cover" />
              <div><p className="text-sm font-semibold">Canopy at dawn</p><p className="text-xs text-muted-foreground">Ava Lin · 4 min read</p></div>
            </div>
          </div>
        ) : (
          <div>
            <Skeleton className="aspect-video w-full rounded-xl" />
            <div className="mt-3 flex items-center gap-3">
              <Skeleton className="size-10 rounded-full" />
              <div className="flex-1 space-y-2"><Skeleton className="h-3 w-3/4" /><Skeleton className="h-3 w-1/2" /></div>
            </div>
          </div>
        )}
      </div>
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
