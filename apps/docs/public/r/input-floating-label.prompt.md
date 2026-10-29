You are given a task to integrate a component from the **kinetik** motion library into this codebase.

# Floating Label Input (`input-floating-label`)

Material-style floating label driven entirely by CSS (:focus and :placeholder-shown) with a center-out focus underline.

## What it should do
Create a floating-label input in pure Tailwind: input has `placeholder=" "` and class `peer`; the label is centered and moves to top 10px with scale .8 and brand color on `peer-focus` or `peer-[:not(:placeholder-shown)]`. A bottom underline scales from 0 to 1 from the center on focus (300ms expo-out). Error text via aria-describedby.

## Project requirements
- React 19 + TypeScript, Tailwind CSS v4, shadcn/ui-style CSS variables (`background`, `foreground`, `muted`, `muted-foreground`, `border`, `card`, `primary`, `ring`). If the project lacks shadcn, set it up first (`npx shadcn@latest init`).
- Animation engine: **css**.
- No runtime dependencies (CSS only).
- Put the component at `components/kinetik/input-floating-label.tsx`.
- `cn` lives at `lib/kinetik/utils.ts` (source below).

## Non-negotiables
- **Accessibility:** Real <label for>; errors linked via aria-describedby and aria-invalid.
- **Performance:** Pure CSS peer selectors; server-component safe.
- Respect `prefers-reduced-motion` (replace movement with opacity or an instant change).
- Animate only transform / opacity / filter / clip-path. No hard-coded theme colors — use CSS variables so it works in light and dark.

## Source — components/kinetik/input-floating-label.tsx
```tsx
import { useId, type InputHTMLAttributes } from "react";
import { cn } from "@/lib/kinetik/utils";

export interface InputFloatingLabelProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "placeholder"> {
  label: string;
  error?: string;
}

/** Label floats up on focus or when filled (CSS :placeholder-shown), with an underline that grows from the center. */
export function InputFloatingLabel({ label, error, className, id, ...props }: InputFloatingLabelProps) {
  const auto = useId();
  const inputId = id ?? auto;
  return (
    <div className={cn("relative", className)}>
      <input
        id={inputId}
        placeholder=" "
        aria-invalid={!!error || undefined}
        aria-describedby={error ? `${inputId}-err` : undefined}
        className="peer h-14 w-full rounded-xl border border-input bg-card px-4 pt-5 pb-1.5 text-sm outline-none transition-colors focus:border-transparent aria-invalid:border-destructive"
        {...props}
      />
      <label
        htmlFor={inputId}
        className="pointer-events-none absolute top-1/2 left-4 origin-left -translate-y-1/2 text-sm text-muted-foreground transition-all duration-200 ease-[cubic-bezier(.2,0,0,1)] peer-focus:top-2.5 peer-focus:translate-y-0 peer-focus:scale-[0.8] peer-focus:text-brand peer-[:not(:placeholder-shown)]:top-2.5 peer-[:not(:placeholder-shown)]:translate-y-0 peer-[:not(:placeholder-shown)]:scale-[0.8] motion-reduce:transition-none"
      >
        {label}
      </label>
      <span aria-hidden className="pointer-events-none absolute inset-0 rounded-xl ring-2 ring-brand/0 transition-[box-shadow] duration-200 peer-focus:ring-brand/70" />
      <span aria-hidden className="absolute inset-x-4 bottom-0 h-0.5 origin-center scale-x-0 rounded-full bg-brand transition-transform duration-300 ease-[cubic-bezier(.16,1,.3,1)] peer-focus:scale-x-100 motion-reduce:transition-none" />
      {error && <p id={`${inputId}-err`} className="mt-1.5 text-xs text-destructive">{error}</p>}
    </div>
  );
}
```

## Usage example
```tsx
import { InputFloatingLabel } from "@/components/kinetik/input-floating-label";

export default function Demo() {
  return (
    <div className="flex h-full w-full items-center justify-center p-6">
      <form className="w-full max-w-xs space-y-3">
        <InputFloatingLabel label="Full name" />
        <InputFloatingLabel label="Email address" type="email" defaultValue="ava@kinetik.dev" />
        <InputFloatingLabel label="Company" error="Company is required" />
      </form>
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
