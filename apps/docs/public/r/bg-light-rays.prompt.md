You are given a task to integrate a component from the **kinetik** motion library into this codebase.

# Rotating Light Rays (`bg-light-rays`)

Slowly rotating god-rays fan out from above — celebratory 'achievement unlocked' energy.

## What it should do
Create rotating rays: an oversized layer with repeating-conic-gradient(from var(--angle), color 0 4deg, transparent 4deg 16deg) masked by a radial fade, rotating the registered angle 360° over 40s.

## Project requirements
- React 19 + TypeScript, Tailwind CSS v4, shadcn/ui-style CSS variables (`background`, `foreground`, `muted`, `muted-foreground`, `border`, `card`, `primary`, `ring`). If the project lacks shadcn, set it up first (`npx shadcn@latest init`).
- Animation engine: **css**.
- No runtime dependencies (CSS only).
- Put the component at `components/kinetik/bg-light-rays.tsx`.
- `cn` lives at `lib/kinetik/utils.ts` (source below).

## Non-negotiables
- **Accessibility:** Decorative; static under reduced motion.
- **Performance:** One repeating-conic-gradient with an animated @property angle.
- Respect `prefers-reduced-motion` (replace movement with opacity or an instant change).
- Animate only transform / opacity / filter / clip-path. No hard-coded theme colors — use CSS variables so it works in light and dark.

## Source — components/kinetik/bg-light-rays.tsx
```tsx
import type { ReactNode } from "react";
import { cn } from "@/lib/kinetik/utils";

const css = `
@property --k-ray-a{syntax:"<angle>";initial-value:0deg;inherits:false}
.k-rays{position:absolute;left:50%;top:-40%;width:160%;aspect-ratio:1;translate:-50% 0;background:repeating-conic-gradient(from var(--k-ray-a) at 50% 50%,var(--k-ray) 0deg 4deg,transparent 4deg 16deg);mask-image:radial-gradient(circle at 50% 50%,#000 0%,transparent 55%);animation:k-rays 40s linear infinite;opacity:.55}
@keyframes k-rays{to{--k-ray-a:360deg}}
@media (prefers-reduced-motion:reduce){.k-rays{animation:none}}
[data-reduce-motion] .k-rays{animation:none}`;

/** Slowly rotating god-rays fanning from above — celebratory, 'achievement unlocked' energy. CSS only. */
export function BgLightRays({ children, color = "rgb(250 204 21 / .35)", className }: { children?: ReactNode; color?: string; className?: string }) {
  return (
    <div className={cn("relative isolate overflow-hidden", className)}>
      <style href="k-rays" precedence="kinetik">{css}</style>
      <div aria-hidden className="k-rays -z-10" style={{ "--k-ray": color } as React.CSSProperties} />
      {children}
    </div>
  );
}
```

## Usage example
```tsx
import { BgLightRays } from "@/components/kinetik/bg-light-rays";
export default function Demo() {
  return (
    <BgLightRays className="flex h-full w-full flex-col items-center justify-center p-8 text-center">
      <span className="text-6xl">🏆</span>
      <h2 className="mt-3 text-3xl font-semibold tracking-tight">Achievement unlocked</h2>
      <p className="text-sm text-muted-foreground">100 components shipped</p>
    </BgLightRays>
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
