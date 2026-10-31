You are given a task to integrate a component from the **kinetik** motion library into this codebase.

# Laptop Mockup (`mockup-laptop`)

CSS laptop — lid with notch, 16:10 screen, hinge and base — for hero shots of web apps.

## What it should do
Build a laptop mockup in CSS: dark lid with notch around a 16:10 screen slot, and a wider gradient base with a thumb notch and soft shadow.

## Project requirements
- React 19 + TypeScript, Tailwind CSS v4, shadcn/ui-style CSS variables (`background`, `foreground`, `muted`, `muted-foreground`, `border`, `card`, `primary`, `ring`). If the project lacks shadcn, set it up first (`npx shadcn@latest init`).
- Animation engine: **css**.
- No runtime dependencies (CSS only).
- Put the component at `components/kinetik/mockup-laptop.tsx`.
- `cn` lives at `lib/kinetik/utils.ts` (source below).

## Non-negotiables
- **Accessibility:** Presentational frame.
- **Performance:** Pure CSS frame; 0 KB JS.
- Respect `prefers-reduced-motion` (replace movement with opacity or an instant change).
- Animate only transform / opacity / filter / clip-path. No hard-coded theme colors — use CSS variables so it works in light and dark.

## Source — components/kinetik/mockup-laptop.tsx
```tsx
import type { ReactNode } from "react";
import { cn } from "@/lib/kinetik/utils";

/** CSS laptop (lid, notch, hinge and base) for hero shots of web apps. */
export function MockupLaptop({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className={cn("w-full max-w-2xl", className)}>
      <div className="relative mx-auto w-[86%] rounded-t-2xl bg-zinc-800 p-[2.2%] pb-[1.5%] shadow-2xl">
        <span className="absolute top-0 left-1/2 h-[3%] w-[14%] -translate-x-1/2 rounded-b-lg bg-black" />
        <div className="relative aspect-[16/10] overflow-hidden rounded-md bg-background">{children}</div>
      </div>
      <div className="relative h-3 rounded-b-xl bg-gradient-to-b from-zinc-400 to-zinc-600 shadow-[0_18px_30px_-10px_rgb(0_0_0/.5)] dark:from-zinc-600 dark:to-zinc-800">
        <span className="absolute top-0 left-1/2 h-1.5 w-[16%] -translate-x-1/2 rounded-b-md bg-zinc-500/80" />
      </div>
    </div>
  );
}
```

## Usage example
```tsx
import { MockupLaptop } from "@/components/kinetik/mockup-laptop";
export default function Demo() {
  return (
    <div className="flex h-full w-full items-center justify-center p-6">
      <MockupLaptop>
        <div className="flex h-full"><div className="w-1/5 border-r border-border bg-muted/50 p-2 space-y-1.5">{Array.from({ length: 6 }, (_, i) => <div key={i} className="h-2 rounded bg-muted-foreground/20" />)}</div><div className="flex-1 p-3"><div className="grid grid-cols-3 gap-2">{[1, 4, 7].map((n) => <img key={n} src={`/demo/photo-${n}.jpg`} alt="" className="aspect-video rounded object-cover" />)}</div><div className="mt-2 h-20 rounded bg-gradient-to-r from-violet-500/30 to-cyan-500/30" /></div></div>
      </MockupLaptop>
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
