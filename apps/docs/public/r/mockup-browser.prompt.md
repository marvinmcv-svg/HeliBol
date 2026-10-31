You are given a task to integrate a component from the **kinetik** motion library into this codebase.

# Browser Mockup (`mockup-browser`)

Safari-style window chrome — traffic lights and a centered URL bar with lock — around any content.

## What it should do
Create a browser window mockup: rounded card with a toolbar (three traffic-light dots, centered URL pill with a lock icon) and a content slot.

## Project requirements
- React 19 + TypeScript, Tailwind CSS v4, shadcn/ui-style CSS variables (`background`, `foreground`, `muted`, `muted-foreground`, `border`, `card`, `primary`, `ring`). If the project lacks shadcn, set it up first (`npx shadcn@latest init`).
- Animation engine: **css**.
- No runtime dependencies (CSS only).
- Put the component at `components/kinetik/mockup-browser.tsx`.
- `cn` lives at `lib/kinetik/utils.ts` (source below).

## Non-negotiables
- **Accessibility:** Presentational chrome; content keeps its own semantics.
- **Performance:** Plain markup; 0 KB JS.
- Respect `prefers-reduced-motion` (replace movement with opacity or an instant change).
- Animate only transform / opacity / filter / clip-path. No hard-coded theme colors — use CSS variables so it works in light and dark.

## Source — components/kinetik/mockup-browser.tsx
```tsx
import type { ReactNode } from "react";
import { cn } from "@/lib/kinetik/utils";

/** Safari-style browser window chrome with traffic lights, tabs-less URL bar and lock icon around any content. */
export function MockupBrowser({ url = "kinetik.dev", children, className }: { url?: string; children: ReactNode; className?: string }) {
  return (
    <div className={cn("overflow-hidden rounded-xl border border-border bg-card shadow-2xl", className)}>
      <div className="flex items-center gap-3 border-b border-border bg-muted/60 px-3 py-2">
        <div className="flex gap-1.5"><span className="size-3 rounded-full bg-[#ff5f57]" /><span className="size-3 rounded-full bg-[#febc2e]" /><span className="size-3 rounded-full bg-[#28c840]" /></div>
        <div className="mx-auto flex h-6 w-1/2 min-w-40 items-center justify-center gap-1.5 rounded-md bg-background text-[11px] text-muted-foreground">
          <svg viewBox="0 0 12 12" className="size-2.5" fill="currentColor"><path d="M3 5V4a3 3 0 0 1 6 0v1h.5A1 1 0 0 1 10.5 6v4a1 1 0 0 1-1 1h-7a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1zm1.5 0h3V4a1.5 1.5 0 0 0-3 0z" /></svg>
          {url}
        </div>
        <span className="w-12" />
      </div>
      <div className="relative">{children}</div>
    </div>
  );
}
```

## Usage example
```tsx
import { MockupBrowser } from "@/components/kinetik/mockup-browser";
export default function Demo() {
  return (
    <div className="flex h-full w-full items-center justify-center p-6">
      <MockupBrowser url="marvzkineticlibrary.vercel.app" className="w-full max-w-xl">
        <div className="relative aspect-[16/9] overflow-hidden"><img src="/demo/photo-1.jpg" alt="" className="absolute inset-0 h-full w-full object-cover" /><div className="absolute inset-0 grid place-items-center bg-black/30 text-center text-white"><div><p className="text-3xl font-semibold">Your product, framed.</p><p className="text-sm opacity-80">Drop any screenshot inside</p></div></div></div>
      </MockupBrowser>
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
