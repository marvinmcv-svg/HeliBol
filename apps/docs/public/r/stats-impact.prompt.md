You are given a task to integrate a block from the **kinetik** motion library into this codebase.

# Stats — Live Impact (`stats-impact`)

Impact section: a live odometer counter, KPI grid and a bar chart that grows on view.

## What it should do
Build a live impact section: left — eyebrow, H2, a large odometer counter ticking up every 1.5s, and a 2×2 KPI grid; right — a card with a bar chart whose bars spring up on view (last bar highlighted).

## Project requirements
- React 19 + TypeScript, Tailwind CSS v4, shadcn/ui-style CSS variables (`background`, `foreground`, `muted`, `muted-foreground`, `border`, `card`, `primary`, `ring`). If the project lacks shadcn, set it up first (`npx shadcn@latest init`).
- Animation engine: **motion**.
- Install dependencies: `npm i motion`
- Put the component at `components/kinetik/stats-impact.tsx`.

## Built from these kinetik components
Install them first (each also has its own prompt at `https://marvzkineticlibrary.vercel.app/r/<id>.prompt.md`):
```bash
npx shadcn@latest add https://marvzkineticlibrary.vercel.app/r/text-odometer.json https://marvzkineticlibrary.vercel.app/r/chart-bar-grow.json
```

## Non-negotiables
- **Accessibility:** Numbers exposed as text; chart has a text summary.
- **Performance:** Odometer reels + one chart.
- Respect `prefers-reduced-motion` (replace movement with opacity or an instant change).
- Animate only transform / opacity / filter / clip-path. No hard-coded theme colors — use CSS variables so it works in light and dark.

## Source — components/kinetik/stats-impact.tsx
```tsx
"use client";
import { TextOdometer } from "@/components/kinetik/text-odometer";
import { ChartBarGrow } from "@/components/kinetik/chart-bar-grow";
import { useEffect, useState } from "react";

export function StatsImpact() {
  const [live, setLive] = useState(2489120);
  useEffect(() => {
    const t = setInterval(() => setLive((v) => v + Math.floor(Math.random() * 900)), 1500);
    return () => clearInterval(t);
  }, []);
  return (
    <section className="mx-auto max-w-5xl px-6 py-12">
      <div className="grid gap-8 md:grid-cols-[1fr_1.2fr]">
        <div>
          <p className="text-sm font-medium text-brand">Impact</p>
          <h2 className="mt-2 text-3xl font-semibold tracking-tight">Animations served, live</h2>
          <TextOdometer value={live} className="mt-4 text-5xl font-semibold tracking-tight" />
          <dl className="mt-8 grid grid-cols-2 gap-6">
            {[["194", "Components"], ["99.98%", "Uptime"], ["38", "Edge regions"], ["4.6 KB", "Min. runtime"]].map(([v, l]) => <div key={l}><dd className="text-2xl font-semibold">{v}</dd><dt className="text-xs text-muted-foreground">{l}</dt></div>)}
          </dl>
        </div>
        <div className="rounded-3xl border border-border bg-card p-6">
          <p className="mb-4 text-sm font-semibold">Monthly installs (k)</p>
          <ChartBarGrow height={240} data={["J", "F", "M", "A", "M", "J", "J", "A", "S", "O"].map((label, i) => ({ label, value: [12, 18, 22, 31, 29, 44, 52, 61, 78, 96][i], highlight: i === 9 }))} />
        </div>
      </div>
    </section>
  );
}
```

## Usage example
```tsx
"use client";
import { StatsImpact } from "@/components/kinetik/stats-impact";
export default function Demo() { return <div className="flex h-full items-center overflow-auto"><StatsImpact /></div>; }
```

## Steps
1. Install the dependencies above.
2. Create the files exactly as given, fixing import aliases if the project doesn't use `@/`.
3. Drop the usage example into a page and adapt copy/colors to the project's design system.
4. Verify: toggle "Reduce motion" in OS settings — the component must still be fully usable.
