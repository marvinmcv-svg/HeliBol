You are given a task to integrate a component from the **kinetik** motion library into this codebase.

# Border Beam Button (`button-border-beam`)

A comet of light orbits the button's border with a soft glow trail — powered by an animated @property conic gradient.

## What it should do
Create a button with a light beam travelling around its border: register `@property --k-beam-angle` (<angle>), paint a conic-gradient (transparent for 70%, then colorFrom → colorTo) on a `::before` with 1.5px padding masked to a ring via `mask-composite: exclude`, plus a blurred `::after` glow using the same angle, and animate the angle 0→360deg linearly. Reduced motion: static.

## Project requirements
- React 19 + TypeScript, Tailwind CSS v4, shadcn/ui-style CSS variables (`background`, `foreground`, `muted`, `muted-foreground`, `border`, `card`, `primary`, `ring`). If the project lacks shadcn, set it up first (`npx shadcn@latest init`).
- Animation engine: **css**.
- No runtime dependencies (CSS only).
- Put the component at `components/kinetik/button-border-beam.tsx`.
- `cn` lives at `lib/kinetik/utils.ts` (source below).

## Non-negotiables
- **Accessibility:** Decorative only; native button semantics. Reduced motion: static border.
- **Performance:** Animates a registered custom property (--k-beam-angle) — compositor-friendly, 0 KB JS.
- Respect `prefers-reduced-motion` (replace movement with opacity or an instant change).
- Animate only transform / opacity / filter / clip-path. No hard-coded theme colors — use CSS variables so it works in light and dark.

## Source — components/kinetik/button-border-beam.tsx
```tsx
import type { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/kinetik/utils";

export interface ButtonBorderBeamProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  duration?: number;
  colorFrom?: string;
  colorTo?: string;
}

const css = `
@property --k-beam-angle{syntax:"<angle>";initial-value:0deg;inherits:false}
.k-beam{position:relative;isolation:isolate}
.k-beam::before{content:"";position:absolute;inset:0;padding:1.5px;border-radius:inherit;background:conic-gradient(from var(--k-beam-angle),transparent 0 70%,var(--k-beam-from) 80%,var(--k-beam-to) 90%,transparent 100%);-webkit-mask:linear-gradient(#000 0 0) content-box exclude,linear-gradient(#000 0 0);mask:linear-gradient(#000 0 0) content-box exclude,linear-gradient(#000 0 0);animation:k-beam-spin var(--k-beam-d) linear infinite;z-index:-1}
.k-beam::after{content:"";position:absolute;inset:-6px;border-radius:inherit;background:conic-gradient(from var(--k-beam-angle),transparent 0 75%,var(--k-beam-to) 90%,transparent 100%);filter:blur(12px);opacity:.45;animation:k-beam-spin var(--k-beam-d) linear infinite;z-index:-2}
@keyframes k-beam-spin{to{--k-beam-angle:360deg}}
@media (prefers-reduced-motion:reduce){.k-beam::before,.k-beam::after{animation:none}}
[data-reduce-motion] .k-beam::before,[data-reduce-motion] .k-beam::after{animation:none}`;

export function ButtonBorderBeam({ duration = 3, colorFrom = "#a855f7", colorTo = "#22d3ee", className, style, ...props }: ButtonBorderBeamProps) {
  return (
    <>
      <style href="k-beam" precedence="kinetik">{css}</style>
      <button
        className={cn(
          "k-beam inline-flex h-11 items-center justify-center gap-2 rounded-full border border-border bg-card px-6 text-sm font-medium text-foreground outline-none transition-[scale] duration-150 active:scale-[0.97] focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
          className,
        )}
        style={{ "--k-beam-d": `${duration}s`, "--k-beam-from": colorFrom, "--k-beam-to": colorTo, ...style } as React.CSSProperties}
        {...props}
      />
    </>
  );
}
```

## Usage example
```tsx
import { ButtonBorderBeam } from "@/components/kinetik/button-border-beam";

export default function Demo() {
  return (
    <div className="flex h-full w-full flex-wrap items-center justify-center gap-5 p-8">
      <ButtonBorderBeam>✦ Introducing kinetik 1.0</ButtonBorderBeam>
      <ButtonBorderBeam colorFrom="#f97316" colorTo="#facc15" duration={2.2} className="rounded-xl">
        Join the waitlist
      </ButtonBorderBeam>
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
