You are given a task to integrate a component from the **kinetik** motion library into this codebase.

# Glitch Text (`text-glitch`)

Cyan/red channel-split glitch bursts with sliced clip-paths, pure CSS, spaced out to stay epilepsy-safe.

## What it should do
Create a CSS glitch: `::before`/`::after` duplicate the text via `content: attr(data-text)`, colored cyan and red, idle with `clip-path: inset(0 0 100% 0)`; in the last 12% of a cycle (steps(1)) jump through 3 random slices with ±3px translations. Faster on hover. Hidden under reduced motion.

## Project requirements
- React 19 + TypeScript, Tailwind CSS v4, shadcn/ui-style CSS variables (`background`, `foreground`, `muted`, `muted-foreground`, `border`, `card`, `primary`, `ring`). If the project lacks shadcn, set it up first (`npx shadcn@latest init`).
- Animation engine: **css**.
- No runtime dependencies (CSS only).
- Put the component at `components/kinetik/text-glitch.tsx`.
- `cn` lives at `lib/kinetik/utils.ts` (source below).

## Non-negotiables
- **Accessibility:** Bursts occupy ~10% of a ≥2s cycle — well under WCAG 2.3.1's 3 flashes/s. Pseudo layers hidden under reduced motion.
- **Performance:** Two pseudo-elements, stepped keyframes; 0 KB JS.
- Respect `prefers-reduced-motion` (replace movement with opacity or an instant change).
- Animate only transform / opacity / filter / clip-path. No hard-coded theme colors — use CSS variables so it works in light and dark.

## Source — components/kinetik/text-glitch.tsx
```tsx
import type { ElementType } from "react";
import { cn } from "@/lib/kinetik/utils";

export interface TextGlitchProps {
  children: string;
  as?: ElementType;
  /** Seconds between glitch bursts (≥ 2 keeps it well under WCAG flash limits). */
  every?: number;
  className?: string;
}

const css = `
.k-glitch{position:relative;display:inline-block}
.k-glitch::before,.k-glitch::after{content:attr(data-text);position:absolute;inset:0;pointer-events:none}
.k-glitch::before{color:#22d3ee;animation:k-glitch-a var(--k-gl-every) steps(1) infinite;clip-path:inset(0 0 0 0)}
.k-glitch::after{color:#f43f5e;animation:k-glitch-b var(--k-gl-every) steps(1) infinite;clip-path:inset(0 0 0 0)}
@keyframes k-glitch-a{0%,88%,100%{transform:none;clip-path:inset(0 0 100% 0)}90%{transform:translate(-3px,1px);clip-path:inset(12% 0 55% 0)}93%{transform:translate(3px,-1px);clip-path:inset(60% 0 8% 0)}96%{transform:translate(-2px,0);clip-path:inset(35% 0 40% 0)}}
@keyframes k-glitch-b{0%,88%,100%{transform:none;clip-path:inset(0 0 100% 0)}91%{transform:translate(3px,0);clip-path:inset(50% 0 20% 0)}94%{transform:translate(-3px,1px);clip-path:inset(5% 0 70% 0)}97%{transform:translate(2px,-1px);clip-path:inset(75% 0 2% 0)}}
.k-glitch:hover::before,.k-glitch:hover::after{animation-duration:1.2s}
@media (prefers-reduced-motion:reduce){.k-glitch::before,.k-glitch::after{display:none}}
[data-reduce-motion] .k-glitch::before,[data-reduce-motion] .k-glitch::after{display:none}`;

/** RGB-split glitch in short, infrequent bursts (pure CSS). */
export function TextGlitch({ children, as: Tag = "span", every = 3, className }: TextGlitchProps) {
  return (
    <>
      <style href="k-glitch" precedence="kinetik">{css}</style>
      <Tag data-text={children} className={cn("k-glitch", className)} style={{ "--k-gl-every": `${every}s` } as React.CSSProperties}>
        {children}
      </Tag>
    </>
  );
}
```

## Usage example
```tsx
import { TextGlitch } from "@/components/kinetik/text-glitch";

export default function Demo() {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-3 bg-black p-8 font-mono text-white">
      <TextGlitch as="h2" className="text-6xl font-black tracking-tight">SYSTEM_FAILURE</TextGlitch>
      <TextGlitch every={4} className="text-sm text-white/60">hover to destabilize</TextGlitch>
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
