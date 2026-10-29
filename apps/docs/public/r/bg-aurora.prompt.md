You are given a task to integrate a component from the **kinetik** motion library into this codebase.

# Aurora Background (`bg-aurora`)

Three heavily blurred color blobs drift on out-of-phase loops behind your hero. Pure CSS, theme-friendly.

## What it should do
Create an aurora background: three absolutely positioned rounded blobs (violet, cyan, pink) with `filter: blur(64px)` and opacity .55, each looping a translate/scale/rotate keyframe with different durations (speed, ×1.3, ×0.8) and alternate directions. Children render on top. Pause under reduced motion.

## Project requirements
- React 19 + TypeScript, Tailwind CSS v4, shadcn/ui-style CSS variables (`background`, `foreground`, `muted`, `muted-foreground`, `border`, `card`, `primary`, `ring`). If the project lacks shadcn, set it up first (`npx shadcn@latest init`).
- Animation engine: **css**.
- No runtime dependencies (CSS only).
- Put the component at `components/kinetik/bg-aurora.tsx`.
- `cn` lives at `lib/kinetik/utils.ts` (source below).

## Non-negotiables
- **Accessibility:** aria-hidden decoration. Slow, low-contrast motion; paused under reduced motion. Check text contrast over the brightest blob.
- **Performance:** Transforms on 3 blurred layers. For long pages, unmount when off-screen.
- Respect `prefers-reduced-motion` (replace movement with opacity or an instant change).
- Animate only transform / opacity / filter / clip-path. No hard-coded theme colors — use CSS variables so it works in light and dark.

## Source — components/kinetik/bg-aurora.tsx
```tsx
import type { ReactNode } from "react";
import { cn } from "@/lib/kinetik/utils";

export interface BgAuroraProps {
  children?: ReactNode;
  colors?: [string, string, string];
  /** Seconds per drift cycle. */
  speed?: number;
  className?: string;
}

const css = `
.k-aurora-blob{position:absolute;border-radius:9999px;filter:blur(64px);opacity:.55;mix-blend-mode:var(--k-aurora-blend,normal);animation:k-aurora var(--k-aurora-speed) ease-in-out infinite alternate}
.k-aurora-blob:nth-child(2){animation-duration:calc(var(--k-aurora-speed) * 1.3);animation-direction:alternate-reverse}
.k-aurora-blob:nth-child(3){animation-duration:calc(var(--k-aurora-speed) * 0.8)}
@keyframes k-aurora{0%{transform:translate(0,0) scale(1) rotate(0)}50%{transform:translate(12%,-8%) scale(1.15) rotate(20deg)}100%{transform:translate(-10%,10%) scale(.9) rotate(-10deg)}}
@media (prefers-reduced-motion:reduce){.k-aurora-blob{animation:none}}
[data-reduce-motion] .k-aurora-blob{animation:none}`;

export function BgAurora({ children, colors = ["#7c3aed", "#06b6d4", "#ec4899"], speed = 14, className }: BgAuroraProps) {
  return (
    <div className={cn("relative isolate overflow-hidden", className)}>
      <style href="k-aurora" precedence="kinetik">{css}</style>
      <div aria-hidden className="absolute inset-0 -z-10" style={{ "--k-aurora-speed": `${speed}s` } as React.CSSProperties}>
        <div className="k-aurora-blob" style={{ background: colors[0], width: "55%", height: "60%", top: "-15%", left: "-10%" }} />
        <div className="k-aurora-blob" style={{ background: colors[1], width: "50%", height: "55%", top: "10%", right: "-12%" }} />
        <div className="k-aurora-blob" style={{ background: colors[2], width: "45%", height: "50%", bottom: "-20%", left: "25%" }} />
      </div>
      {children}
    </div>
  );
}
```

## Usage example
```tsx
import { BgAurora } from "@/components/kinetik/bg-aurora";

export default function Demo() {
  return (
    <BgAurora className="flex h-full w-full flex-col items-center justify-center gap-3 p-8 text-center">
      <p className="rounded-full border border-white/20 bg-background/40 px-3 py-1 text-xs backdrop-blur">New · v2.0</p>
      <h2 className="max-w-lg text-4xl font-semibold tracking-tight sm:text-5xl">Build in the northern lights.</h2>
      <p className="max-w-sm text-sm text-muted-foreground">Three blurred gradient blobs drift on independent loops. Pure CSS.</p>
    </BgAurora>
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
