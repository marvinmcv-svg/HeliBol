You are given a task to integrate a component from the **kinetik** motion library into this codebase.

# Button — 3D Key (`button-3d-key`)

Chunky mechanical-key button with a real edge: the cap lifts on hover and sinks to the base on press, with a soft shadow that shrinks and grows. Colour and depth are CSS variables.

## What it should do
Layer three spans in a button: a blurred shadow, a darker edge, and the cap; translate the cap up by --d on rest, further on hover, and to 2px on :active; shrink the shadow as the cap sinks.

## Project requirements
- React 19 + TypeScript, Tailwind CSS v4, shadcn/ui-style CSS variables (`background`, `foreground`, `muted`, `muted-foreground`, `border`, `card`, `primary`, `ring`). If the project lacks shadcn, set it up first (`npx shadcn@latest init`).
- Animation engine: **css**.
- No runtime dependencies (CSS only).
- Put the component at `components/kinetik/button-3d-key.tsx`.
- `cn` lives at `lib/kinetik/utils.ts` (source below).

## Non-negotiables
- **Accessibility:** Native button; visible focus ring; reduced motion removes the transitions but keeps the pressed state.
- **Performance:** Pure CSS transforms on three span layers.
- Respect `prefers-reduced-motion` (replace movement with opacity or an instant change).
- Animate only transform / opacity / filter / clip-path. No hard-coded theme colors — use CSS variables so it works in light and dark.

## Source — components/kinetik/button-3d-key.tsx
```tsx
import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/kinetik/utils";

export interface Button3DKeyProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  /** Key cap colour (any CSS colour). */
  color?: string;
  /** Depth of the key in px. */
  depth?: number;
}

const css = `
.kn-key { position: relative; background: transparent; border: 0; padding: 0; cursor: pointer; }
.kn-key > span { position: absolute; inset: 0; border-radius: inherit; }
.kn-key .kn-key-shadow { background: rgb(0 0 0 / .3); filter: blur(5px); transform: translateY(calc(var(--d) + 3px)); }
.kn-key .kn-key-edge { background: linear-gradient(to left, color-mix(in oklab, var(--kc) 45%, black), color-mix(in oklab, var(--kc) 65%, black) 10%, color-mix(in oklab, var(--kc) 65%, black) 90%, color-mix(in oklab, var(--kc) 45%, black)); }
.kn-key .kn-key-cap { position: relative; display: flex; align-items: center; justify-content: center; gap: .5rem; height: 100%; padding: 0 1.75rem; background: var(--kc); transform: translateY(calc(var(--d) * -1)); box-shadow: inset 0 1px 0 rgb(255 255 255 / .35); }
.kn-key .kn-key-cap, .kn-key .kn-key-shadow { transition: transform .5s cubic-bezier(.3,.7,.4,1), filter .5s; }
.kn-key:hover .kn-key-cap { transform: translateY(calc(var(--d) * -1.35)); transition-duration: .25s; transition-timing-function: cubic-bezier(.3,.7,.4,1.5); }
.kn-key:hover .kn-key-shadow { transform: translateY(calc(var(--d) + 6px)); filter: blur(8px); transition-duration: .25s; }
.kn-key:active .kn-key-cap { transform: translateY(-2px); transition-duration: .04s; }
.kn-key:active .kn-key-shadow { transform: translateY(2px); filter: blur(3px); transition-duration: .04s; }
@media (prefers-reduced-motion: reduce) { .kn-key .kn-key-cap, .kn-key .kn-key-shadow { transition: none; } }
[data-reduce-motion] .kn-key .kn-key-cap, [data-reduce-motion] .kn-key .kn-key-shadow { transition: none; }
`;

/**
 * A tactile 3D key: a raised cap over a darker edge with a soft drop shadow. Hover lifts it with a
 * small overshoot, press sinks it almost flush, release springs back slowly — the classic
 * "pushable" button, mechanical and satisfying. Pure CSS; any colour via color-mix.
 */
export function Button3DKey({ children, color = "#f43f5e", depth = 6, className, style, ...rest }: Button3DKeyProps) {
  return (
    <>
      <style href="kn-button-3d-key" precedence="kinetik">{css}</style>
      <button
        {...rest}
        className={cn("kn-key inline-block h-14 rounded-2xl text-base font-bold text-white outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-4", className)}
        style={{ ...style, ["--kc" as string]: color, ["--d" as string]: `${depth}px`, marginTop: depth }}
      >
        <span aria-hidden className="kn-key-shadow" />
        <span aria-hidden className="kn-key-edge" />
        <span className="kn-key-cap">{children}</span>
      </button>
    </>
  );
}
```

## Usage example
```tsx
import { DemoCenter } from "@/components/kinetik/demo-helpers" /* or inline */;
import { Button3DKey } from "@/components/kinetik/button-3d-key";

export default function Demo() {
  return (
    <DemoCenter className="flex-col gap-8">
      <div className="flex flex-wrap items-center justify-center gap-4">
        <Button3DKey>Play now</Button3DKey>
        <Button3DKey color="#22c55e">Continue</Button3DKey>
        <Button3DKey color="#3b82f6" depth={6} className="h-12 text-sm [&_.kn-key-cap]:px-5">Skip</Button3DKey>
      </div>
      <div className="flex gap-2">
        {["⌘", "K"].map((k) => <Button3DKey key={k} color="#27272a" depth={5} className="size-12 text-lg [&_.kn-key-cap]:px-0">{k}</Button3DKey>)}
      </div>
      <p className="text-xs text-muted-foreground">Hover to lift · press to sink</p>
    </DemoCenter>
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
