You are given a task to integrate a component from the **kinetik** motion library into this codebase.

# Ripple Rings (`bg-ripple-rings`)

Concentric rings that breathe around a centerpiece — behind avatars, logos, product icons or a CTA.

## What it should do
Build ripple rings: N centered circles with 1px foreground/18% borders and 3% fill, sizes base + i·step, opacity fading outward, each scaling 1→.92→1 over 3.6s with an 80ms stagger; top-to-bottom fade mask.

## Project requirements
- React 19 + TypeScript, Tailwind CSS v4, shadcn/ui-style CSS variables (`background`, `foreground`, `muted`, `muted-foreground`, `border`, `card`, `primary`, `ring`). If the project lacks shadcn, set it up first (`npx shadcn@latest init`).
- Animation engine: **css**.
- No runtime dependencies (CSS only).
- Put the component at `components/kinetik/bg-ripple-rings.tsx`.
- `cn` lives at `lib/kinetik/utils.ts` (source below).

## Non-negotiables
- **Accessibility:** Decorative; still under reduced motion.
- **Performance:** N absolutely positioned divs with a scale keyframe.
- Respect `prefers-reduced-motion` (replace movement with opacity or an instant change).
- Animate only transform / opacity / filter / clip-path. No hard-coded theme colors — use CSS variables so it works in light and dark.

## Source — components/kinetik/bg-ripple-rings.tsx
```tsx
import type { ReactNode } from "react";
import { cn } from "@/lib/kinetik/utils";

const css = `
.k-rings span{position:absolute;left:50%;top:50%;border-radius:9999px;border:1px solid color-mix(in oklab,var(--color-foreground,#888) 18%,transparent);background:color-mix(in oklab,var(--color-foreground,#888) 3%,transparent);translate:-50% -50%;animation:k-rings 3.6s ease-in-out infinite;animation-delay:var(--d)}
@keyframes k-rings{0%,100%{scale:1}50%{scale:.92}}
@media (prefers-reduced-motion:reduce){.k-rings span{animation:none}}
[data-reduce-motion] .k-rings span{animation:none}`;

/** Concentric rings that breathe outward from the center — behind avatars, logos or a CTA. CSS only. */
export function BgRippleRings({ children, count = 8, base = 140, step = 70, className }: { children?: ReactNode; count?: number; base?: number; step?: number; className?: string }) {
  return (
    <div className={cn("relative isolate grid place-items-center overflow-hidden", className)}>
      <style href="k-rings" precedence="kinetik">{css}</style>
      <div aria-hidden className="k-rings absolute inset-0 -z-10 [mask-image:linear-gradient(to_bottom,#fff,transparent)]">
        {Array.from({ length: count }, (_, i) => (
          <span key={i} style={{ width: base + i * step, height: base + i * step, opacity: 1 - i * (0.8 / count), "--d": `${i * 0.08}s` } as React.CSSProperties} />
        ))}
      </div>
      {children}
    </div>
  );
}
```

## Usage example
```tsx
import { BgRippleRings } from "@/components/kinetik/bg-ripple-rings";
export default function Demo() {
  return (
    <BgRippleRings className="h-full w-full">
      <div className="grid size-20 place-items-center rounded-2xl bg-foreground text-2xl font-bold text-background shadow-2xl">k</div>
    </BgRippleRings>
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
