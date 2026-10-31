You are given a task to integrate a component from the **kinetik** motion library into this codebase.

# Light Through Blinds (`bg-blinds`)

A shifting warm gradient seen through diagonal glass slats — golden-hour editorial backgrounds.

## What it should do
Build 'light through blinds': a layer with a repeating 100° stripe gradient (white/7%) over a 300%-sized 3-color gradient whose position animates 0%→100% alternating over 14s with a slight translateX.

## Project requirements
- React 19 + TypeScript, Tailwind CSS v4, shadcn/ui-style CSS variables (`background`, `foreground`, `muted`, `muted-foreground`, `border`, `card`, `primary`, `ring`). If the project lacks shadcn, set it up first (`npx shadcn@latest init`).
- Animation engine: **css**.
- No runtime dependencies (CSS only).
- Put the component at `components/kinetik/bg-blinds.tsx`.
- `cn` lives at `lib/kinetik/utils.ts` (source below).

## Non-negotiables
- **Accessibility:** Decorative; static under reduced motion.
- **Performance:** background-position animation on one layer.
- Respect `prefers-reduced-motion` (replace movement with opacity or an instant change).
- Animate only transform / opacity / filter / clip-path. No hard-coded theme colors — use CSS variables so it works in light and dark.

## Source — components/kinetik/bg-blinds.tsx
```tsx
import type { ReactNode } from "react";
import { cn } from "@/lib/kinetik/utils";

const css = `
.k-blinds{position:absolute;inset:-20%;background:repeating-linear-gradient(100deg,transparent 0 6%,rgb(255 255 255/.07) 7% 9%,transparent 10% 14%),linear-gradient(120deg,var(--k-b1),var(--k-b2),var(--k-b3),var(--k-b1));background-size:100% 100%,300% 300%;animation:k-blinds 14s ease-in-out infinite alternate;filter:saturate(1.2)}
@keyframes k-blinds{0%{background-position:0 0,0% 50%}100%{background-position:0 0,100% 50%;transform:translateX(4%)}}
@media (prefers-reduced-motion:reduce){.k-blinds{animation:none}}
[data-reduce-motion] .k-blinds{animation:none}`;

/** Slatted light: a moving gradient seen through diagonal glass blinds. CSS only. */
export function BgBlinds({ children, colors = ["#4f46e5", "#db2777", "#f59e0b"], className }: { children?: ReactNode; colors?: [string, string, string]; className?: string }) {
  return (
    <div className={cn("relative isolate overflow-hidden", className)}>
      <style href="k-blinds" precedence="kinetik">{css}</style>
      <div aria-hidden className="k-blinds -z-10" style={{ "--k-b1": colors[0], "--k-b2": colors[1], "--k-b3": colors[2] } as React.CSSProperties} />
      {children}
    </div>
  );
}
```

## Usage example
```tsx
import { BgBlinds } from "@/components/kinetik/bg-blinds";
export default function Demo() {
  return (
    <BgBlinds className="flex h-full w-full items-end p-8 text-white">
      <div><p className="text-xs uppercase tracking-widest opacity-75">Golden hour</p><h2 className="text-4xl font-semibold tracking-tight">Light through the blinds</h2></div>
    </BgBlinds>
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
