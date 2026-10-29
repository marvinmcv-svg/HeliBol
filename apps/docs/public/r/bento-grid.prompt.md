You are given a task to integrate a component from the **kinetik** motion library into this codebase.

# Bento Grid (`bento-grid`)

Apple-style bento layout where each tile's visual lifts and a CTA slides in on hover or keyboard focus.

## What it should do
Create a bento grid (3 columns, 11rem rows, col-span variants) with tiles that have a visual layer and bottom-aligned copy. On hover or focus-within: the visual lifts -8px and scales 1.02, the copy rises 24px, and a "Learn more →" CTA slides up and fades in, all with a 500ms expo-out ease. Visuals fade out toward the bottom with a mask.

## Project requirements
- React 19 + TypeScript, Tailwind CSS v4, shadcn/ui-style CSS variables (`background`, `foreground`, `muted`, `muted-foreground`, `border`, `card`, `primary`, `ring`). If the project lacks shadcn, set it up first (`npx shadcn@latest init`).
- Animation engine: **css**.
- No runtime dependencies (CSS only).
- Put the component at `components/kinetik/bento-grid.tsx`.
- `cn` lives at `lib/kinetik/utils.ts` (source below).

## Non-negotiables
- **Accessibility:** Tiles are focusable and reveal the same content on focus-within as on hover.
- **Performance:** CSS transitions only; put any heavier per-tile animation behind in-view.
- Respect `prefers-reduced-motion` (replace movement with opacity or an instant change).
- Animate only transform / opacity / filter / clip-path. No hard-coded theme colors — use CSS variables so it works in light and dark.

## Source — components/kinetik/bento-grid.tsx
```tsx
import type { ReactNode } from "react";
import { cn } from "@/lib/kinetik/utils";

export function BentoGrid({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn("grid auto-rows-[11rem] grid-cols-1 gap-3 sm:grid-cols-3", className)}>{children}</div>;
}

export interface BentoTileProps {
  title: string;
  description?: string;
  /** Visual area — put a micro-animation here. */
  visual?: ReactNode;
  className?: string;
}

/** A tile that lifts its visual and reveals a CTA on hover/focus-within. */
export function BentoTile({ title, description, visual, className }: BentoTileProps) {
  return (
    <div
      tabIndex={0}
      className={cn(
        "group relative flex flex-col justify-end overflow-hidden rounded-3xl border border-border bg-card p-5 outline-none transition-shadow duration-300 hover:shadow-xl focus-visible:ring-2 focus-visible:ring-ring",
        className,
      )}
    >
      <div className="absolute inset-0 transition-transform duration-500 ease-[cubic-bezier(.16,1,.3,1)] group-hover:-translate-y-2 group-hover:scale-[1.02] group-focus-within:-translate-y-2 motion-reduce:transform-none">
        {visual}
      </div>
      <div className="relative transition-transform duration-500 ease-[cubic-bezier(.16,1,.3,1)] group-hover:-translate-y-6 group-focus-within:-translate-y-6 motion-reduce:transform-none">
        <h3 className="font-semibold">{title}</h3>
        {description && <p className="mt-1 max-w-xs text-sm text-muted-foreground">{description}</p>}
      </div>
      <span className="absolute bottom-4 left-5 translate-y-6 text-xs font-medium text-brand opacity-0 transition-all duration-500 ease-[cubic-bezier(.16,1,.3,1)] group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:translate-y-0 group-focus-within:opacity-100">
        Learn more →
      </span>
    </div>
  );
}
```

## Usage example
```tsx
import { BentoGrid, BentoTile } from "@/components/kinetik/bento-grid";

const fade = "[mask-image:linear-gradient(to_bottom,#000_40%,transparent)]";

export default function Demo() {
  return (
    <div className="h-full w-full overflow-auto p-4">
      <BentoGrid>
        <BentoTile
          className="sm:col-span-2"
          title="Live previews"
          description="Every component renders live — replay it, resize it, reduce it."
          visual={
            <div className={`flex gap-2 p-4 ${fade}`}>
              {[1, 3, 6, 7].map((n, i) => (
                <img key={n} src={`/demo/photo-${n}.jpg`} alt="" className="h-28 w-36 rounded-xl object-cover shadow-lg" style={{ rotate: `${(i - 1.5) * 4}deg` }} />
              ))}
            </div>
          }
        />
        <BentoTile
          title="Tokens"
          description="One motion language."
          visual={<div className={`space-y-2 p-5 font-mono text-[11px] text-muted-foreground ${fade}`}>{["spring.snappy 500/35", "ease.expoOut", "duration.base 220ms", "stagger.base 50ms"].map((t) => <div key={t} className="rounded-md border border-border bg-background px-2 py-1">{t}</div>)}</div>}
        />
        <BentoTile
          title="Search"
          description="⌘K over everything."
          visual={<div className={`p-5 ${fade}`}><div className="rounded-xl border border-border bg-background px-3 py-2 text-xs text-muted-foreground">Search “scroll”…<span className="ml-0.5 inline-block h-3 w-px animate-pulse bg-foreground align-middle" /></div></div>}
        />
        <BentoTile
          className="sm:col-span-2"
          title="Web + mobile"
          description="Same springs on React and React Native."
          visual={<div className={`grid h-full place-items-center bg-gradient-to-br from-violet-500/20 via-transparent to-cyan-500/20 ${fade}`}><div className="flex gap-3"><div className="h-24 w-40 rounded-xl border border-border bg-background shadow-lg" /><div className="h-28 w-14 rounded-2xl border-2 border-foreground/70 bg-background shadow-lg" /></div></div>}
        />
      </BentoGrid>
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
