You are given a task to integrate a component from the **kinetik** motion library into this codebase.

# Animated Mesh Gradient (`bg-gradient-mesh`)

Three radial color fields whose anchor points wander via animated @property percentages — a buttery mesh gradient in pure CSS.

## What it should do
Create a pure-CSS animated mesh gradient: register six `@property` percentages (x/y for three anchors), layer three `radial-gradient(at x y, color, transparent 55%)` over a base color, and animate the properties through 3 keyframe stops with `ease-in-out infinite alternate`. Colors and speed via CSS variables; paused under reduced motion.

## Project requirements
- React 19 + TypeScript, Tailwind CSS v4, shadcn/ui-style CSS variables (`background`, `foreground`, `muted`, `muted-foreground`, `border`, `card`, `primary`, `ring`). If the project lacks shadcn, set it up first (`npx shadcn@latest init`).
- Animation engine: **css**.
- No runtime dependencies (CSS only).
- Put the component at `components/kinetik/bg-gradient-mesh.tsx`.
- `cn` lives at `lib/kinetik/utils.ts` (source below).

## Non-negotiables
- **Accessibility:** Decorative; pauses under reduced motion. Ensure text contrast on all colors.
- **Performance:** Animating registered custom properties repaints the gradient; keep it to hero-sized areas.
- Respect `prefers-reduced-motion` (replace movement with opacity or an instant change).
- Animate only transform / opacity / filter / clip-path. No hard-coded theme colors — use CSS variables so it works in light and dark.

## Source — components/kinetik/bg-gradient-mesh.tsx
```tsx
import type { ReactNode } from "react";
import { cn } from "@/lib/kinetik/utils";

export interface BgGradientMeshProps {
  children?: ReactNode;
  colors?: [string, string, string, string];
  speed?: number;
  className?: string;
}

const css = `
@property --k-m1x{syntax:"<percentage>";initial-value:20%;inherits:false}
@property --k-m1y{syntax:"<percentage>";initial-value:20%;inherits:false}
@property --k-m2x{syntax:"<percentage>";initial-value:80%;inherits:false}
@property --k-m2y{syntax:"<percentage>";initial-value:30%;inherits:false}
@property --k-m3x{syntax:"<percentage>";initial-value:60%;inherits:false}
@property --k-m3y{syntax:"<percentage>";initial-value:85%;inherits:false}
.k-mesh{background:
 radial-gradient(at var(--k-m1x) var(--k-m1y),var(--k-c1) 0,transparent 55%),
 radial-gradient(at var(--k-m2x) var(--k-m2y),var(--k-c2) 0,transparent 55%),
 radial-gradient(at var(--k-m3x) var(--k-m3y),var(--k-c3) 0,transparent 55%),var(--k-c4);
 animation:k-mesh var(--k-mesh-speed) ease-in-out infinite alternate}
@keyframes k-mesh{
 33%{--k-m1x:70%;--k-m1y:30%;--k-m2x:30%;--k-m2y:70%;--k-m3x:80%;--k-m3y:60%}
 66%{--k-m1x:40%;--k-m1y:80%;--k-m2x:75%;--k-m2y:15%;--k-m3x:15%;--k-m3y:40%}
 100%{--k-m1x:15%;--k-m1y:55%;--k-m2x:85%;--k-m2y:75%;--k-m3x:50%;--k-m3y:10%}}
@media (prefers-reduced-motion:reduce){.k-mesh{animation:none}}
[data-reduce-motion] .k-mesh{animation:none}`;

export function BgGradientMesh({ children, colors = ["#f472b6", "#818cf8", "#fbbf24", "#1e1b4b"], speed = 12, className }: BgGradientMeshProps) {
  return (
    <div
      className={cn("k-mesh relative isolate", className)}
      style={{ "--k-c1": colors[0], "--k-c2": colors[1], "--k-c3": colors[2], "--k-c4": colors[3], "--k-mesh-speed": `${speed}s` } as React.CSSProperties}
    >
      <style href="k-mesh" precedence="kinetik">{css}</style>
      {children}
    </div>
  );
}
```

## Usage example
```tsx
import { BgGradientMesh } from "@/components/kinetik/bg-gradient-mesh";

export default function Demo() {
  return (
    <div className="grid h-full w-full grid-cols-1 gap-3 p-4 sm:grid-cols-[1.4fr_1fr]">
      <BgGradientMesh className="flex items-end rounded-3xl p-6 text-white">
        <div>
          <p className="text-xs opacity-70">Mesh gradient · @property</p>
          <p className="text-2xl font-semibold">Living color</p>
        </div>
      </BgGradientMesh>
      <BgGradientMesh colors={["#22d3ee", "#a3e635", "#38bdf8", "#064e3b"]} speed={8} className="grid place-items-center rounded-3xl text-sm font-medium text-white">
        Custom palette
      </BgGradientMesh>
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
