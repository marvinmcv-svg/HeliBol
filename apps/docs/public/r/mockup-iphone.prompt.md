You are given a task to integrate a component from the **kinetik** motion library into this codebase.

# iPhone Mockup (`mockup-iphone`)

Pure-CSS iPhone frame — titanium bezel, Dynamic Island and side buttons — that wraps any screen or screenshot.

## What it should do
Build a CSS iPhone mockup: 9:19.5 aspect, titanium gradient outer bezel with drop shadow, side buttons as small bars, black inner bezel, rounded screen that clips children, and a pill-shaped Dynamic Island overlay.

## Project requirements
- React 19 + TypeScript, Tailwind CSS v4, shadcn/ui-style CSS variables (`background`, `foreground`, `muted`, `muted-foreground`, `border`, `card`, `primary`, `ring`). If the project lacks shadcn, set it up first (`npx shadcn@latest init`).
- Animation engine: **css**.
- No runtime dependencies (CSS only).
- Put the component at `components/kinetik/mockup-iphone.tsx`.
- `cn` lives at `lib/kinetik/utils.ts` (source below).

## Non-negotiables
- **Accessibility:** Frame is presentational; give screenshots meaningful alt text.
- **Performance:** No images for the frame; 0 KB JS.
- Respect `prefers-reduced-motion` (replace movement with opacity or an instant change).
- Animate only transform / opacity / filter / clip-path. No hard-coded theme colors — use CSS variables so it works in light and dark.

## Source — components/kinetik/mockup-iphone.tsx
```tsx
import type { ReactNode } from "react";
import { cn } from "@/lib/kinetik/utils";

/** CSS iPhone frame (titanium bezel, Dynamic Island, side buttons) that wraps any screen content or image. */
export function MockupIphone({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className={cn("relative aspect-[9/19.5] w-64 rounded-[3rem] bg-gradient-to-b from-zinc-600 via-zinc-800 to-zinc-700 p-[3px] shadow-[0_40px_80px_-24px_rgb(0_0_0/.55)]", className)}>
      <span className="absolute top-24 -left-[3px] h-8 w-[3px] rounded-l bg-zinc-600" />
      <span className="absolute top-36 -left-[3px] h-14 w-[3px] rounded-l bg-zinc-600" />
      <span className="absolute top-32 -right-[3px] h-20 w-[3px] rounded-r bg-zinc-600" />
      <div className="relative h-full w-full overflow-hidden rounded-[2.8rem] bg-black p-[10px]">
        <div className="relative h-full w-full overflow-hidden rounded-[2.2rem] bg-background">
          {children}
          <span className="pointer-events-none absolute top-2.5 left-1/2 h-7 w-24 -translate-x-1/2 rounded-full bg-black" />
        </div>
      </div>
    </div>
  );
}
```

## Usage example
```tsx
import { MockupIphone } from "@/components/kinetik/mockup-iphone";
export default function Demo() {
  return (
    <div className="flex h-full w-full items-center justify-center gap-6 p-6">
      <MockupIphone className="w-48 -rotate-6"><img src="/demo/photo-2.jpg" alt="App screenshot" className="h-full w-full object-cover" /></MockupIphone>
      <MockupIphone className="w-48 rotate-3">
        <div className="flex h-full flex-col bg-gradient-to-b from-violet-600 to-fuchsia-600 p-4 pt-14 text-white"><p className="text-2xl font-semibold">Good morning</p><p className="text-sm opacity-80">3 habits left today</p><div className="mt-auto rounded-2xl bg-white/15 p-3 text-sm backdrop-blur">🔥 12-day streak</div></div>
      </MockupIphone>
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
