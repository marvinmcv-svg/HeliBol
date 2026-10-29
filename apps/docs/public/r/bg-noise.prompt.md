You are given a task to integrate a component from the **kinetik** motion library into this codebase.

# Film Grain (`bg-noise`)

An SVG feTurbulence grain overlay that jitters in steps like film — instantly makes flat gradients feel tactile and kills banding.

## What it should do
Create a grain overlay: an inline SVG data URI using `feTurbulence type="fractalNoise" baseFrequency=".85" numOctaves="3"` tiled as a background on an oversized (-20% inset) aria-hidden layer with mix-blend overlay; animate it with `steps(1)` translate keyframes at 0.6s for a film jitter. Pause under reduced motion.

## Project requirements
- React 19 + TypeScript, Tailwind CSS v4, shadcn/ui-style CSS variables (`background`, `foreground`, `muted`, `muted-foreground`, `border`, `card`, `primary`, `ring`). If the project lacks shadcn, set it up first (`npx shadcn@latest init`).
- Animation engine: **css**.
- No runtime dependencies (CSS only).
- Put the component at `components/kinetik/bg-noise.tsx`.
- `cn` lives at `lib/kinetik/utils.ts` (source below).

## Non-negotiables
- **Accessibility:** aria-hidden; stepped animation stops under reduced motion. Low opacity — doesn't affect legibility.
- **Performance:** Static data-URI SVG tile; the jitter is a stepped transform (no repaint of the noise).
- Respect `prefers-reduced-motion` (replace movement with opacity or an instant change).
- Animate only transform / opacity / filter / clip-path. No hard-coded theme colors — use CSS variables so it works in light and dark.

## Source — components/kinetik/bg-noise.tsx
```tsx
import type { ReactNode } from "react";
import { cn } from "@/lib/kinetik/utils";

export interface BgNoiseProps {
  children?: ReactNode;
  opacity?: number;
  /** Animate the grain like film (steps, not smooth). */
  animated?: boolean;
  className?: string;
}

const noise = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='220' height='220'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='3' stitchTiles='stitch'/%3E%3CfeColorMatrix values='0 0 0 0 0.5 0 0 0 0 0.5 0 0 0 0 0.5 0 0 0 1.2 -0.2'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`;

const css = `
@keyframes k-grain{0%,100%{transform:translate(0,0)}20%{transform:translate(-5%,3%)}40%{transform:translate(4%,-6%)}60%{transform:translate(-3%,7%)}80%{transform:translate(6%,2%)}}
.k-grain{animation:k-grain .6s steps(1) infinite}
@media (prefers-reduced-motion:reduce){.k-grain{animation:none}}
[data-reduce-motion] .k-grain{animation:none}`;

export function BgNoise({ children, opacity = 0.18, animated = true, className }: BgNoiseProps) {
  return (
    <div className={cn("relative isolate overflow-hidden", className)}>
      <style href="k-grain" precedence="kinetik">{css}</style>
      {children}
      <div aria-hidden className={cn("pointer-events-none absolute -inset-[20%] mix-blend-overlay", animated && "k-grain")} style={{ backgroundImage: noise, opacity }} />
    </div>
  );
}
```

## Usage example
```tsx
import { BgNoise } from "@/components/kinetik/bg-noise";

export default function Demo() {
  return (
    <div className="grid h-full w-full grid-cols-2 gap-3 p-4">
      <div className="grid place-items-center rounded-3xl bg-gradient-to-br from-orange-500 via-rose-500 to-violet-700 text-sm font-medium text-white">Without grain</div>
      <BgNoise opacity={0.35} className="rounded-3xl">
        <div className="grid h-full place-items-center bg-gradient-to-br from-orange-500 via-rose-500 to-violet-700 text-sm font-medium text-white">With film grain</div>
      </BgNoise>
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
