You are given a task to integrate a component from the **kinetik** motion library into this codebase.

# Progress Bar (`progress-bar-animated`)

Determinate (springy expo-out fill, optional moving stripes) and indeterminate progress, colored with currentColor.

## What it should do
Build a progress bar: determinate fill uses `scale: value/100 1` from a left origin with a 600ms expo-out transition (never animate width); optional 45° stripes moving via background-position; indeterminate mode slides a 40% segment from -100% to 250% on loop. role=progressbar with aria values; color = currentColor.

## Project requirements
- React 19 + TypeScript, Tailwind CSS v4, shadcn/ui-style CSS variables (`background`, `foreground`, `muted`, `muted-foreground`, `border`, `card`, `primary`, `ring`). If the project lacks shadcn, set it up first (`npx shadcn@latest init`).
- Animation engine: **css**.
- No runtime dependencies (CSS only).
- Put the component at `components/kinetik/progress-bar-animated.tsx`.
- `cn` lives at `lib/kinetik/utils.ts` (source below).

## Non-negotiables
- **Accessibility:** role=progressbar with aria-valuenow (omitted when indeterminate) and a label.
- **Performance:** Fill uses the `scale` property — no width/layout animation.
- Respect `prefers-reduced-motion` (replace movement with opacity or an instant change).
- Animate only transform / opacity / filter / clip-path. No hard-coded theme colors — use CSS variables so it works in light and dark.

## Source — components/kinetik/progress-bar-animated.tsx
```tsx
import { cn } from "@/lib/kinetik/utils";

export interface ProgressBarAnimatedProps {
  /** 0–100. Omit for indeterminate. */
  value?: number;
  label?: string;
  striped?: boolean;
  className?: string;
}

const css = `
.k-pb-fill{transition:scale .6s cubic-bezier(.16,1,.3,1);transform-origin:left}
.k-pb-indet{position:absolute;inset:0;width:40%;border-radius:inherit;background:currentColor;animation:k-pb-indet 1.4s cubic-bezier(.65,0,.35,1) infinite}
@keyframes k-pb-indet{from{translate:-100% 0}to{translate:250% 0}}
.k-pb-stripes{background-image:linear-gradient(45deg,rgb(255 255 255/.25) 25%,transparent 25% 50%,rgb(255 255 255/.25) 50% 75%,transparent 75%);background-size:16px 16px;animation:k-pb-stripes .8s linear infinite}
@keyframes k-pb-stripes{to{background-position:16px 0}}
@media (prefers-reduced-motion:reduce){.k-pb-stripes{animation:none}.k-pb-indet{animation-duration:3s}}`;

export function ProgressBarAnimated({ value, label = "Progress", striped = false, className }: ProgressBarAnimatedProps) {
  const indeterminate = value === undefined;
  return (
    <>
      <style href="k-pb" precedence="kinetik">{css}</style>
      <div
        role="progressbar"
        aria-label={label}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={indeterminate ? undefined : Math.round(value)}
        className={cn("relative h-2 w-full overflow-hidden rounded-full bg-muted text-foreground", className)}
      >
        {indeterminate ? (
          <div className="k-pb-indet" />
        ) : (
          <div className={cn("k-pb-fill h-full rounded-full bg-current", striped && "k-pb-stripes")} style={{ scale: `${Math.max(0, Math.min(100, value)) / 100} 1` }} />
        )}
      </div>
    </>
  );
}
```

## Usage example
```tsx
"use client";
import { useEffect, useState } from "react";
import { ProgressBarAnimated } from "@/components/kinetik/progress-bar-animated";

export default function Demo() {
  const [v, setV] = useState(12);
  useEffect(() => {
    const id = setInterval(() => setV((x) => (x >= 100 ? 8 : Math.min(100, x + Math.random() * 22))), 900);
    return () => clearInterval(id);
  }, []);
  return (
    <div className="flex h-full w-full flex-col justify-center gap-6 p-8">
      <div className="space-y-2"><div className="flex justify-between text-xs"><span>Uploading assets</span><span className="tabular-nums text-muted-foreground">{Math.round(v)}%</span></div><ProgressBarAnimated value={v} className="text-violet-500" /></div>
      <div className="space-y-2"><p className="text-xs">Striped</p><ProgressBarAnimated value={v} striped className="h-3 text-emerald-500" /></div>
      <div className="space-y-2"><p className="text-xs">Indeterminate</p><ProgressBarAnimated className="text-sky-500" /></div>
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
