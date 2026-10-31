You are given a task to integrate a component from the **kinetik** motion library into this codebase.

# Rainbow Border Button (`button-rainbow`)

Dark pill with a rotating rainbow conic border and a blurred rainbow glow pooling underneath.

## What it should do
Create a rainbow-border button: register `@property --k-rb-a` (<angle>), paint the background as `linear-gradient(fg,fg) padding-box, conic-gradient(from var(--k-rb-a), rose, amber, lime, cyan, violet, rose) border-box` with a 2px transparent border, plus a blurred ::after glow using the same conic gradient under the button; animate the angle to 360deg in 3s linear.

## Project requirements
- React 19 + TypeScript, Tailwind CSS v4, shadcn/ui-style CSS variables (`background`, `foreground`, `muted`, `muted-foreground`, `border`, `card`, `primary`, `ring`). If the project lacks shadcn, set it up first (`npx shadcn@latest init`).
- Animation engine: **css**.
- No runtime dependencies (CSS only).
- Put the component at `components/kinetik/button-rainbow.tsx`.
- `cn` lives at `lib/kinetik/utils.ts` (source below).

## Non-negotiables
- **Accessibility:** Native button; decorative motion stops under reduced motion.
- **Performance:** One registered @property angle animation; 0 KB JS.
- Respect `prefers-reduced-motion` (replace movement with opacity or an instant change).
- Animate only transform / opacity / filter / clip-path. No hard-coded theme colors — use CSS variables so it works in light and dark.

## Source — components/kinetik/button-rainbow.tsx
```tsx
import type { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/kinetik/utils";

const css = `
@property --k-rb-a{syntax:"<angle>";initial-value:0deg;inherits:false}
.k-rainbow{position:relative;isolation:isolate;background:linear-gradient(var(--color-foreground,#111),var(--color-foreground,#111)) padding-box,conic-gradient(from var(--k-rb-a),#f43f5e,#f59e0b,#84cc16,#06b6d4,#8b5cf6,#f43f5e) border-box;border:2px solid transparent;animation:k-rb 3s linear infinite}
.k-rainbow::after{content:"";position:absolute;inset:auto 12% -14px;height:60%;z-index:-1;background:conic-gradient(from var(--k-rb-a),#f43f5e,#f59e0b,#84cc16,#06b6d4,#8b5cf6,#f43f5e);filter:blur(16px);opacity:.7;animation:k-rb 3s linear infinite}
@keyframes k-rb{to{--k-rb-a:360deg}}
@media (prefers-reduced-motion:reduce){.k-rainbow,.k-rainbow::after{animation:none}}
[data-reduce-motion] .k-rainbow,[data-reduce-motion] .k-rainbow::after{animation:none}`;

/** Dark pill with a rotating rainbow border and a soft rainbow glow underneath. */
export function ButtonRainbow({ className, ...props }: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <>
      <style href="k-rainbow" precedence="kinetik">{css}</style>
      <button className={cn("k-rainbow inline-flex h-11 items-center gap-2 rounded-xl px-6 text-sm font-semibold text-background outline-none transition-transform active:scale-[0.97] focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background", className)} {...props} />
    </>
  );
}
```

## Usage example
```tsx
import { ButtonRainbow } from "@/components/kinetik/button-rainbow";
export default function Demo() {
  return <div className="flex h-full w-full items-center justify-center p-8"><ButtonRainbow>✦ Get unlimited access</ButtonRainbow></div>;
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
