You are given a task to integrate a component from the **kinetik** motion library into this codebase.

# Neon Gradient Card (`card-neon`)

A two-tone neon gradient border that slowly rotates, with a matching bloom glowing behind the card.

## What it should do
Build a neon card: a 2px-padded wrapper painted with conic-gradient(from var(--angle), c1, c2, c1) rotating via @property, a ::before copy blurred 24px at .65 opacity behind it, and the card body inside.

## Project requirements
- React 19 + TypeScript, Tailwind CSS v4, shadcn/ui-style CSS variables (`background`, `foreground`, `muted`, `muted-foreground`, `border`, `card`, `primary`, `ring`). If the project lacks shadcn, set it up first (`npx shadcn@latest init`).
- Animation engine: **css**.
- No runtime dependencies (CSS only).
- Put the component at `components/kinetik/card-neon.tsx`.
- `cn` lives at `lib/kinetik/utils.ts` (source below).

## Non-negotiables
- **Accessibility:** Decorative; animation stops under reduced motion.
- **Performance:** Registered @property angle; blur on a pseudo-element.
- Respect `prefers-reduced-motion` (replace movement with opacity or an instant change).
- Animate only transform / opacity / filter / clip-path. No hard-coded theme colors — use CSS variables so it works in light and dark.

## Source — components/kinetik/card-neon.tsx
```tsx
import type { ReactNode } from "react";
import { cn } from "@/lib/kinetik/utils";

const css = `
@property --k-neon-a{syntax:"<angle>";initial-value:0deg;inherits:false}
.k-neon{position:relative;border-radius:1.5rem;padding:2px;background:conic-gradient(from var(--k-neon-a),var(--k-n1),var(--k-n2),var(--k-n1));animation:k-neon 5s linear infinite}
.k-neon::before{content:"";position:absolute;inset:0;border-radius:inherit;background:inherit;filter:blur(24px);opacity:.65;z-index:-1}
@keyframes k-neon{to{--k-neon-a:360deg}}
@media (prefers-reduced-motion:reduce){.k-neon{animation:none}}
[data-reduce-motion] .k-neon{animation:none}`;

/** Card with a living two-tone neon gradient border and a matching bloom behind it. */
export function CardNeon({ children, from = "#ff2975", to = "#00d4ff", className }: { children: ReactNode; from?: string; to?: string; className?: string }) {
  return (
    <>
      <style href="k-neon" precedence="kinetik">{css}</style>
      <div className="relative isolate">
        <div className="k-neon" style={{ "--k-n1": from, "--k-n2": to } as React.CSSProperties}>
          <div className={cn("relative rounded-[calc(1.5rem-2px)] bg-card", className)}>{children}</div>
        </div>
      </div>
    </>
  );
}
```

## Usage example
```tsx
import { CardNeon } from "@/components/kinetik/card-neon";
export default function Demo() {
  return (
    <div className="flex h-full w-full items-center justify-center bg-zinc-950 p-8">
      <CardNeon className="w-72 p-6 text-white">
        <p className="text-xs tracking-widest text-white/50 uppercase">Night mode</p>
        <h3 className="mt-1 text-2xl font-semibold">Neon Pro</h3>
        <p className="mt-2 text-sm text-white/60">Glow-in-the-dark dashboards for your 2am deploys.</p>
      </CardNeon>
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
