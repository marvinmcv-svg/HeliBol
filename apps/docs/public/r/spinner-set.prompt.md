You are given a task to integrate a component from the **kinetik** motion library into this codebase.

# Spinner Set (`spinner-set`)

Eight pure-CSS loaders — ring, dots, bars, orbit, pulse, wave, morphing square, bounce — that inherit currentColor.

## What it should do
Create a Spinner component with 8 CSS-only variants (ring, dots, bars, orbit, pulse, wave, morphing square, bounce) sharing one stylesheet; children are empty <i> elements; color = currentColor so Tailwind text-* sets it; size via width/height; role=status + aria-label. Under reduced motion slow them to 3s instead of stopping.

## Project requirements
- React 19 + TypeScript, Tailwind CSS v4, shadcn/ui-style CSS variables (`background`, `foreground`, `muted`, `muted-foreground`, `border`, `card`, `primary`, `ring`). If the project lacks shadcn, set it up first (`npx shadcn@latest init`).
- Animation engine: **css**.
- No runtime dependencies (CSS only).
- Put the component at `components/kinetik/spinner-set.tsx`.
- `cn` lives at `lib/kinetik/utils.ts` (source below).

## Non-negotiables
- **Accessibility:** role=status with an aria-label. Reduced motion slows animation to 3s rather than removing the busy signal.
- **Performance:** Individual transform properties only; one shared stylesheet for all variants.
- Respect `prefers-reduced-motion` (replace movement with opacity or an instant change).
- Animate only transform / opacity / filter / clip-path. No hard-coded theme colors — use CSS variables so it works in light and dark.

## Source — components/kinetik/spinner-set.tsx
```tsx
import { cn } from "@/lib/kinetik/utils";

export type SpinnerVariant = "ring" | "dots" | "bars" | "orbit" | "pulse" | "wave" | "square" | "bounce";

const css = `
.k-sp{color:currentColor;display:inline-block;position:relative}
.k-sp-ring{border-radius:9999px;border:2.5px solid color-mix(in oklab,currentColor 20%,transparent);border-top-color:currentColor;animation:k-spin .8s linear infinite}
@keyframes k-spin{to{rotate:360deg}}
.k-sp-dots{display:inline-flex;gap:15%;align-items:center}.k-sp-dots i{width:22%;aspect-ratio:1;border-radius:9999px;background:currentColor;animation:k-fade 1s ease-in-out infinite}
.k-sp-dots i:nth-child(2){animation-delay:.15s}.k-sp-dots i:nth-child(3){animation-delay:.3s}
@keyframes k-fade{0%,100%{opacity:.2;scale:.8}50%{opacity:1;scale:1}}
.k-sp-bars{display:inline-flex;gap:12%;align-items:center}.k-sp-bars i{width:14%;height:100%;border-radius:2px;background:currentColor;animation:k-bar 1s ease-in-out infinite}
.k-sp-bars i:nth-child(2){animation-delay:.1s}.k-sp-bars i:nth-child(3){animation-delay:.2s}.k-sp-bars i:nth-child(4){animation-delay:.3s}
@keyframes k-bar{0%,100%{scale:1 .35}50%{scale:1 1}}
.k-sp-orbit{animation:k-spin 1.2s cubic-bezier(.5,.1,.5,.9) infinite}.k-sp-orbit i{position:absolute;width:24%;aspect-ratio:1;border-radius:9999px;background:currentColor;top:0;left:38%}.k-sp-orbit i:nth-child(2){top:auto;bottom:0;opacity:.4}
.k-sp-pulse i{position:absolute;inset:0;border-radius:9999px;background:currentColor;animation:k-pulse 1.4s cubic-bezier(0,0,.2,1) infinite}.k-sp-pulse i:nth-child(2){animation-delay:.7s}
@keyframes k-pulse{0%{scale:0;opacity:.8}100%{scale:1;opacity:0}}
.k-sp-wave{display:inline-flex;gap:10%;align-items:center}.k-sp-wave i{width:18%;aspect-ratio:1;border-radius:9999px;background:currentColor;animation:k-wave .9s ease-in-out infinite}
.k-sp-wave i:nth-child(2){animation-delay:.1s}.k-sp-wave i:nth-child(3){animation-delay:.2s}.k-sp-wave i:nth-child(4){animation-delay:.3s}
@keyframes k-wave{0%,100%{translate:0 35%}50%{translate:0 -35%}}
.k-sp-square{border:2.5px solid currentColor;border-radius:20%;animation:k-sq 1.6s cubic-bezier(.7,0,.3,1) infinite}
@keyframes k-sq{0%{rotate:0deg;border-radius:20%}50%{rotate:180deg;border-radius:50%}100%{rotate:360deg;border-radius:20%}}
.k-sp-bounce i{position:absolute;inset:auto 30% 0;aspect-ratio:1;border-radius:9999px;background:currentColor;animation:k-bounce .6s cubic-bezier(.3,0,.7,1) infinite alternate}
@keyframes k-bounce{from{translate:0 0;scale:1.15 .85}to{translate:0 -160%;scale:1}}
@media (prefers-reduced-motion:reduce){.k-sp,.k-sp i{animation-duration:3s!important}}`;

export function Spinner({ variant = "ring", size = 28, className, label = "Loading" }: { variant?: SpinnerVariant; size?: number; className?: string; label?: string }) {
  const children = { ring: 0, dots: 3, bars: 4, orbit: 2, pulse: 2, wave: 4, square: 0, bounce: 1 }[variant];
  return (
    <>
      <style href="k-spinners" precedence="kinetik">{css}</style>
      <span role="status" aria-label={label} className={cn("k-sp", `k-sp-${variant}`, className)} style={{ width: size, height: size }}>
        {Array.from({ length: children }, (_, i) => <i key={i} />)}
      </span>
    </>
  );
}
```

## Usage example
```tsx
import { Spinner, type SpinnerVariant } from "@/components/kinetik/spinner-set";

const all: SpinnerVariant[] = ["ring", "dots", "bars", "orbit", "pulse", "wave", "square", "bounce"];

export default function Demo() {
  return (
    <div className="grid h-full w-full grid-cols-4 place-items-center gap-4 p-6">
      {all.map((v, i) => (
        <div key={v} className="flex flex-col items-center gap-3">
          <Spinner variant={v} className={["text-foreground", "text-violet-500", "text-sky-500", "text-emerald-500", "text-rose-500", "text-amber-500", "text-foreground", "text-fuchsia-500"][i]} />
          <span className="text-[11px] text-muted-foreground">{v}</span>
        </div>
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
