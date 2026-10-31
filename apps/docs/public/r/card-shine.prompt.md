You are given a task to integrate a component from the **kinetik** motion library into this codebase.

# Shine Sweep Card (`card-shine`)

A specular highlight sweeps diagonally across the card on hover — perfect for premium tiers and product tiles.

## What it should do
Make a shine card: an overflow-hidden card with a skewed (−12°) half-width white/40 gradient strip parked at left −100%, transitioning to 150% over 700ms on hover/focus.

## Project requirements
- React 19 + TypeScript, Tailwind CSS v4, shadcn/ui-style CSS variables (`background`, `foreground`, `muted`, `muted-foreground`, `border`, `card`, `primary`, `ring`). If the project lacks shadcn, set it up first (`npx shadcn@latest init`).
- Animation engine: **css**.
- No runtime dependencies (CSS only).
- Put the component at `components/kinetik/card-shine.tsx`.
- `cn` lives at `lib/kinetik/utils.ts` (source below).

## Non-negotiables
- **Accessibility:** Focusable, same sweep on focus-visible; highlight hidden under reduced motion.
- **Performance:** One skewed gradient span moving via `left`.
- Respect `prefers-reduced-motion` (replace movement with opacity or an instant change).
- Animate only transform / opacity / filter / clip-path. No hard-coded theme colors — use CSS variables so it works in light and dark.

## Source — components/kinetik/card-shine.tsx
```tsx
import type { ReactNode } from "react";
import { cn } from "@/lib/kinetik/utils";

/** A specular highlight sweeps diagonally across the card on hover/focus — product tiles, pricing cards. CSS only. */
export function CardShine({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div tabIndex={0} className={cn("group relative overflow-hidden rounded-2xl outline-none focus-visible:ring-2 focus-visible:ring-ring", className)}>
      {children}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-y-0 -left-full w-1/2 -skew-x-12 bg-gradient-to-r from-transparent via-white/40 to-transparent transition-[left] duration-700 ease-[cubic-bezier(.4,0,.2,1)] group-hover:left-[150%] group-focus-visible:left-[150%] motion-reduce:hidden"
      />
    </div>
  );
}
```

## Usage example
```tsx
import { CardShine } from "@/components/kinetik/card-shine";
export default function Demo() {
  return (
    <div className="flex h-full w-full items-center justify-center gap-5 p-8">
      {[["Starter", "$9", "from-zinc-700 to-zinc-900"], ["Gold", "$29", "from-amber-400 to-orange-600"], ["Platinum", "$99", "from-slate-300 to-slate-500"]].map(([n, p, g]) => (
        <CardShine key={n} className={`h-48 w-40 bg-gradient-to-br ${g} p-4 text-white shadow-xl`}>
          <p className="text-xs opacity-80">{n}</p><p className="mt-auto pt-20 text-3xl font-bold">{p}</p>
        </CardShine>
      ))}
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
