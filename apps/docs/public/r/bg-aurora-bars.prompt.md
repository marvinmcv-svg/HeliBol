You are given a task to integrate a component from the **kinetik** motion library into this codebase.

# Aurora Bars (`bg-aurora-bars`)

Soft vertical light bars rising from the bottom edge, each breathing at its own pace — an aurora curtain built from scaleY-only CSS keyframes.

## What it should do
Build aurora bars: a flex row of N blurred, rounded-top bars at the bottom of a container with a gradient (base→mid→tip). Each bar animates transform: scaleY between two per-bar values (taller in the middle), with its own duration (4–9 s) and negative delay, transform-origin bottom. Mask the top with a gradient. Use deterministic pseudo-random values for SSR.

## Project requirements
- React 19 + TypeScript, Tailwind CSS v4, shadcn/ui-style CSS variables (`background`, `foreground`, `muted`, `muted-foreground`, `border`, `card`, `primary`, `ring`). If the project lacks shadcn, set it up first (`npx shadcn@latest init`).
- Animation engine: **css**.
- No runtime dependencies (CSS only).
- Put the component at `components/kinetik/bg-aurora-bars.tsx`.
- `cn` lives at `lib/kinetik/utils.ts` (source below).

## Non-negotiables
- **Accessibility:** aria-hidden decoration; reduced motion freezes bars mid-height.
- **Performance:** Pure CSS transforms; deterministic per-bar values so SSR matches.
- Respect `prefers-reduced-motion` (replace movement with opacity or an instant change).
- Animate only transform / opacity / filter / clip-path. No hard-coded theme colors — use CSS variables so it works in light and dark.

## Source — components/kinetik/bg-aurora-bars.tsx
```tsx
import { cn } from "@/lib/kinetik/utils";

export interface BgAuroraBarsProps {
  /** Number of vertical bars. */
  bars?: number;
  /** Gradient stops from base to tip. */
  colors?: [string, string, string];
  className?: string;
}

const css = `
@keyframes kn-aurora-bar { 0%,100% { transform: scaleY(var(--lo)); } 50% { transform: scaleY(var(--hi)); } }
.kn-abar { transform-origin: bottom; animation: kn-aurora-bar var(--d) ease-in-out var(--delay) infinite; transform: scaleY(var(--mid)); }
@media (prefers-reduced-motion: reduce) { .kn-abar { animation: none; } }
[data-reduce-motion] .kn-abar { animation: none; }
`;

/**
 * Soft vertical light bars rising from the bottom edge, each breathing at its own pace — an aurora
 * curtain built from scaleY-only CSS keyframes, blurred into one glow.
 */
export function BgAuroraBars({ bars = 28, colors = ["#4c1d95", "#db2777", "#fde68a"], className }: BgAuroraBarsProps) {
  return (
    <div aria-hidden className={cn("pointer-events-none absolute inset-0 flex items-end gap-[0.6%] overflow-hidden px-[2%] [mask-image:linear-gradient(to_top,black_40%,transparent)]", className)}>
      <style href="kn-aurora-bars" precedence="kinetik">{css}</style>
      {Array.from({ length: bars }, (_, i) => {
        // deterministic pseudo-random per bar so SSR and client agree
        const r = (k: number) => ((Math.sin(i * 12.9898 + k * 78.233) * 43758.5453) % 1 + 1) % 1;
        const centre = 1 - Math.abs(i / (bars - 1) - 0.5) * 1.3; // taller in the middle
        const lo = 0.25 + r(1) * 0.25 * centre, hi = 0.55 + r(2) * 0.45 * centre;
        return (
          <span
            key={i}
            className="kn-abar h-full flex-1 rounded-t-full blur-[6px]"
            style={{
              background: `linear-gradient(to top, ${colors[0]}, ${colors[1]} 55%, ${colors[2]})`,
              opacity: 0.55 + r(3) * 0.4,
              ["--lo" as string]: lo,
              ["--hi" as string]: hi,
              ["--mid" as string]: (lo + hi) / 2,
              ["--d" as string]: `${4 + r(4) * 5}s`,
              ["--delay" as string]: `${-r(5) * 6}s`,
            }}
          />
        );
      })}
    </div>
  );
}
```

## Usage example
```tsx
import { BgAuroraBars } from "@/components/kinetik/bg-aurora-bars";

export default function Demo() {
  return (
    <div className="relative grid h-full place-items-center overflow-hidden bg-[#07040f] text-white">
      <BgAuroraBars />
      <div className="relative text-center">
        <p className="text-[10px] uppercase tracking-[0.35em] text-pink-200/80">Now in beta</p>
        <h3 className="mt-2 text-4xl font-semibold tracking-tight sm:text-5xl">Light up the launch.</h3>
      </div>
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
