You are given a task to integrate a component from the **kinetik** motion library into this codebase.

# Pulse CTA (`button-pulse`)

Primary action that emits two staggered sonar rings — 'go live', 'join call', unread attention.

## What it should do
Make a pulse button: ::before and ::after copy the background and scale to (1.6, 2) while fading out over 2.2s, the second delayed 1.1s; isolated stacking context so rings sit behind the button.

## Project requirements
- React 19 + TypeScript, Tailwind CSS v4, shadcn/ui-style CSS variables (`background`, `foreground`, `muted`, `muted-foreground`, `border`, `card`, `primary`, `ring`). If the project lacks shadcn, set it up first (`npx shadcn@latest init`).
- Animation engine: **css**.
- No runtime dependencies (CSS only).
- Put the component at `components/kinetik/button-pulse.tsx`.
- `cn` lives at `lib/kinetik/utils.ts` (source below).

## Non-negotiables
- **Accessibility:** Use for one primary action only; rings hidden under reduced motion.
- **Performance:** Two pseudo-elements with transform/opacity keyframes.
- Respect `prefers-reduced-motion` (replace movement with opacity or an instant change).
- Animate only transform / opacity / filter / clip-path. No hard-coded theme colors — use CSS variables so it works in light and dark.

## Source — components/kinetik/button-pulse.tsx
```tsx
import type { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/kinetik/utils";

const css = `
.k-pulse{position:relative}
.k-pulse::before,.k-pulse::after{content:"";position:absolute;inset:0;border-radius:inherit;background:inherit;z-index:-1;animation:k-pulse 2.2s cubic-bezier(0,0,.2,1) infinite}
.k-pulse::after{animation-delay:1.1s}
@keyframes k-pulse{0%{transform:scale(1);opacity:.55}100%{transform:scale(1.6,2);opacity:0}}
@media (prefers-reduced-motion:reduce){.k-pulse::before,.k-pulse::after{animation:none;opacity:0}}
[data-reduce-motion] .k-pulse::before,[data-reduce-motion] .k-pulse::after{animation:none;opacity:0}`;

/** CTA that emits two staggered sonar rings — draws attention to one primary action (use sparingly). */
export function ButtonPulse({ className, ...props }: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <>
      <style href="k-pulse" precedence="kinetik">{css}</style>
      <span className="relative isolate inline-flex">
        <button className={cn("k-pulse inline-flex h-11 items-center gap-2 rounded-full bg-rose-500 px-6 text-sm font-semibold text-white outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background", className)} {...props} />
      </span>
    </>
  );
}
```

## Usage example
```tsx
import { ButtonPulse } from "@/components/kinetik/button-pulse";
export default function Demo() {
  return <div className="flex h-full w-full items-center justify-center gap-6 p-8"><ButtonPulse>● Go live</ButtonPulse><ButtonPulse className="bg-emerald-500">Join call</ButtonPulse></div>;
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
