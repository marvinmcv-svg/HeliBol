You are given a task to integrate a component from the **kinetik** motion library into this codebase.

# Comet Ring Loader (`loader-comet-ring`)

A comet chasing its tail: a conic-gradient ring masked to a thin band whose start angle is an animatable @property, plus a blurred glow copy, gently breathing. Zero JS.

## What it should do
Build a comet ring loader in CSS: register --angle with @property, animate it 0→360deg; ring background = conic-gradient(from var(--angle), transparent, tail colour → head colour → white tip), masked with a radial-gradient to a band of `thickness`; add a blurred duplicate for glow and a subtle scale breathe.

## Project requirements
- React 19 + TypeScript, Tailwind CSS v4, shadcn/ui-style CSS variables (`background`, `foreground`, `muted`, `muted-foreground`, `border`, `card`, `primary`, `ring`). If the project lacks shadcn, set it up first (`npx shadcn@latest init`).
- Animation engine: **css**.
- No runtime dependencies (CSS only).
- Put the component at `components/kinetik/loader-comet-ring.tsx`.
- `cn` lives at `lib/kinetik/utils.ts` (source below).

## Non-negotiables
- **Accessibility:** role=status with label. Reduced motion slows to a calm 4 s turn (loaders must still show activity).
- **Performance:** Single @property animation on two elements; no JS.
- Respect `prefers-reduced-motion` (replace movement with opacity or an instant change).
- Animate only transform / opacity / filter / clip-path. No hard-coded theme colors — use CSS variables so it works in light and dark.

## Source — components/kinetik/loader-comet-ring.tsx
```tsx
import { cn } from "@/lib/kinetik/utils";

export interface LoaderCometRingProps {
  size?: number;
  /** Ring thickness in px. */
  thickness?: number;
  colors?: [string, string];
  label?: string;
  className?: string;
}

const css = `
@property --kn-comet { syntax: "<angle>"; inherits: false; initial-value: 0deg; }
@keyframes kn-comet-spin { to { --kn-comet: 360deg; } }
@keyframes kn-comet-breathe { 50% { transform: scale(.92); } }
.kn-comet { animation: kn-comet-spin 1.1s linear infinite, kn-comet-breathe 2.2s ease-in-out infinite; }
.kn-comet-glow { animation: kn-comet-spin 1.1s linear infinite; }
@media (prefers-reduced-motion: reduce) { .kn-comet, .kn-comet-glow { animation: kn-comet-spin 4s linear infinite; } }
[data-reduce-motion] .kn-comet, [data-reduce-motion] .kn-comet-glow { animation: kn-comet-spin 4s linear infinite; }
`;

/**
 * A comet chasing its tail: a conic-gradient ring masked to a thin band whose start angle is an
 * animatable @property, so the bright head and fading tail rotate smoothly; a blurred copy adds glow
 * and the ring gently breathes. Zero JS. Reduced motion slows it to a calm 4 s turn (a loader must
 * still show activity).
 */
export function LoaderCometRing({ size = 64, thickness = 5, colors = ["#22d3ee", "#a855f7"], label = "Loading", className }: LoaderCometRingProps) {
  const ring = {
    background: `conic-gradient(from var(--kn-comet), transparent 0deg, ${colors[1]}22 90deg, ${colors[1]} 260deg, ${colors[0]} 340deg, #fff 352deg, transparent 360deg)`,
    WebkitMask: `radial-gradient(farthest-side, transparent calc(100% - ${thickness}px), #000 calc(100% - ${thickness}px + 1px))`,
    mask: `radial-gradient(farthest-side, transparent calc(100% - ${thickness}px), #000 calc(100% - ${thickness}px + 1px))`,
  } as const;
  return (
    <span role="status" aria-label={label} className={cn("relative inline-block", className)} style={{ width: size, height: size }}>
      <style href="kn-loader-comet-ring" precedence="kinetik">{css}</style>
      <span aria-hidden className="kn-comet-glow absolute inset-0 rounded-full opacity-70 blur-md" style={ring} />
      <span aria-hidden className="kn-comet absolute inset-0 rounded-full" style={ring} />
      <span className="sr-only">{label}…</span>
    </span>
  );
}
```

## Usage example
```tsx
import { LoaderCometRing } from "@/components/kinetik/loader-comet-ring";

export default function Demo() {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-8 bg-[#07070c] p-6 text-white">
      <div className="flex items-center gap-10">
        <LoaderCometRing size={88} thickness={6} />
        <LoaderCometRing size={56} colors={["#fde047", "#f97316"]} />
        <LoaderCometRing size={36} thickness={3} colors={["#86efac", "#14b8a6"]} />
      </div>
      <p className="text-sm text-white/60">Rendering your video…</p>
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
