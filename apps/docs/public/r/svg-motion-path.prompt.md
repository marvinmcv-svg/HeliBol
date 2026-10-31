You are given a task to integrate a component from the **kinetik** motion library into this codebase.

# CSS Motion Path (`svg-motion-path`)

Objects travel along an SVG path using CSS offset-path, auto-rotating to the curve — zero JavaScript.

## What it should do
Make CSS motion-path travellers: draw the path as a dashed SVG; each item has `offset-path: path("…")`, `offset-rotate: auto` and animates offset-distance 0→100% with negative delays to space them evenly. Container size should match the viewBox.

## Project requirements
- React 19 + TypeScript, Tailwind CSS v4, shadcn/ui-style CSS variables (`background`, `foreground`, `muted`, `muted-foreground`, `border`, `card`, `primary`, `ring`). If the project lacks shadcn, set it up first (`npx shadcn@latest init`).
- Animation engine: **css**.
- No runtime dependencies (CSS only).
- Put the component at `components/kinetik/svg-motion-path.tsx`.
- `cn` lives at `lib/kinetik/utils.ts` (source below).

## Non-negotiables
- **Accessibility:** Decorative; travellers sit at the midpoint under reduced motion.
- **Performance:** Compositor-friendly offset-distance animation.
- Respect `prefers-reduced-motion` (replace movement with opacity or an instant change).
- Animate only transform / opacity / filter / clip-path. No hard-coded theme colors — use CSS variables so it works in light and dark.

## Source — components/kinetik/svg-motion-path.tsx
```tsx
import type { ReactNode } from "react";
import { cn } from "@/lib/kinetik/utils";

const css = `
.k-mpath{offset-path:var(--k-path);offset-rotate:auto;animation:k-mpath var(--k-mp-d) cubic-bezier(.45,0,.55,1) infinite;animation-delay:var(--k-mp-delay)}
@keyframes k-mpath{from{offset-distance:0%}to{offset-distance:100%}}
@media (prefers-reduced-motion:reduce){.k-mpath{animation:none;offset-distance:50%}}
[data-reduce-motion] .k-mpath{animation:none;offset-distance:50%}`;

/** Objects travel along an SVG path with CSS motion paths (offset-path), auto-rotating to the path's tangent. No JS. */
export function SvgMotionPath({ path, viewBox = "0 0 400 200", items, duration = 6, className }: { path: string; viewBox?: string; items: ReactNode[]; duration?: number; className?: string }) {
  const [, , w, h] = viewBox.split(" ").map(Number);
  return (
    <div className={cn("relative", className)} style={{ aspectRatio: `${w}/${h}` }}>
      <style href="k-mpath" precedence="kinetik">{css}</style>
      <svg viewBox={viewBox} className="absolute inset-0 h-full w-full" aria-hidden><path d={path} fill="none" stroke="currentColor" strokeOpacity=".2" strokeWidth="2" strokeDasharray="6 8" /></svg>
      <div className="absolute inset-0" style={{ transform: `scale(var(--k-s, 1))` }}>
        {items.map((it, i) => (
          <span key={i} aria-hidden className="k-mpath absolute top-0 left-0" style={{ "--k-path": `path("${path}")`, "--k-mp-d": `${duration}s`, "--k-mp-delay": `${(-duration / items.length) * i}s` } as React.CSSProperties}>
            {it}
          </span>
        ))}
      </div>
    </div>
  );
}
```

## Usage example
```tsx
import { SvgMotionPath } from "@/components/kinetik/svg-motion-path";
export default function Demo() {
  return (
    <div className="flex h-full w-full items-center justify-center p-6">
      <SvgMotionPath className="w-[400px] text-foreground" path="M20,160 C80,20 160,20 200,100 S320,180 380,40" items={["✈️", "📦", "🚚"].map((e) => <span key={e} className="block -translate-1/2 text-2xl">{e}</span>)} />
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
