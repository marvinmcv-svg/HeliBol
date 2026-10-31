You are given a task to integrate a component from the **kinetik** motion library into this codebase.

# Retro Perspective Grid (`bg-retro-grid`)

Synthwave floor grid in 3D perspective scrolling endlessly toward the horizon.

## What it should do
Create a retro grid: perspective 220px container → rotateX(65deg) plane → oversized child with 60px line-grid background translating Y from −50% to 0 over 15s linear; gradient fade into the background at top and bottom.

## Project requirements
- React 19 + TypeScript, Tailwind CSS v4, shadcn/ui-style CSS variables (`background`, `foreground`, `muted`, `muted-foreground`, `border`, `card`, `primary`, `ring`). If the project lacks shadcn, set it up first (`npx shadcn@latest init`).
- Animation engine: **css**.
- No runtime dependencies (CSS only).
- Put the component at `components/kinetik/bg-retro-grid.tsx`.
- `cn` lives at `lib/kinetik/utils.ts` (source below).

## Non-negotiables
- **Accessibility:** Decorative; static under reduced motion.
- **Performance:** One transformed layer, background-image lines.
- Respect `prefers-reduced-motion` (replace movement with opacity or an instant change).
- Animate only transform / opacity / filter / clip-path. No hard-coded theme colors — use CSS variables so it works in light and dark.

## Source — components/kinetik/bg-retro-grid.tsx
```tsx
import type { ReactNode } from "react";
import { cn } from "@/lib/kinetik/utils";

const css = `
.k-retro{position:absolute;inset:0;overflow:hidden;perspective:220px;opacity:.6}
.k-retro>div{position:absolute;inset:0;transform:rotateX(65deg)}
.k-retro>div>div{position:absolute;inset:0 0 0 0;margin-left:-50%;width:600vw;height:300vh;background-image:linear-gradient(to right,var(--k-grid) 1px,transparent 0),linear-gradient(to bottom,var(--k-grid) 1px,transparent 0);background-size:60px 60px;background-repeat:repeat;transform-origin:100% 0 0;animation:k-retro 15s linear infinite}
@keyframes k-retro{0%{transform:translateY(-50%)}100%{transform:translateY(0)}}
@media (prefers-reduced-motion:reduce){.k-retro>div>div{animation:none}}
[data-reduce-motion] .k-retro>div>div{animation:none}`;

/** Synthwave perspective floor grid scrolling toward the horizon. CSS only. */
export function BgRetroGrid({ children, color = "rgb(236 72 153 / .5)", className }: { children?: ReactNode; color?: string; className?: string }) {
  return (
    <div className={cn("relative isolate overflow-hidden", className)}>
      <style href="k-retro" precedence="kinetik">{css}</style>
      <div aria-hidden className="k-retro -z-10" style={{ "--k-grid": color } as React.CSSProperties}><div><div /></div></div>
      <div aria-hidden className="absolute inset-0 -z-10 bg-gradient-to-t from-background via-transparent to-background/90" />
      {children}
    </div>
  );
}
```

## Usage example
```tsx
import { BgRetroGrid } from "@/components/kinetik/bg-retro-grid";
export default function Demo() {
  return (
    <BgRetroGrid className="flex h-full w-full items-start justify-center pt-16">
      <h2 className="bg-gradient-to-b from-amber-300 via-pink-500 to-violet-600 bg-clip-text text-6xl font-black tracking-tighter text-transparent italic">OUTRUN</h2>
    </BgRetroGrid>
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
