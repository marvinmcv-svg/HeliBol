You are given a task to integrate a block from the **kinetik** motion library into this codebase.

# Integrations Orbit (`integrations-orbit`)

Integrations section: flip-word headline on the left, icons orbiting the product logo on the right.

## What it should do
Build an integrations section: left column with eyebrow, H2 ending in 3D flip-words cycling integration names, copy and CTA; right column two orbits of integration icons (inner 3, outer 5, opposite directions) around a logo tile.

## Project requirements
- React 19 + TypeScript, Tailwind CSS v4, shadcn/ui-style CSS variables (`background`, `foreground`, `muted`, `muted-foreground`, `border`, `card`, `primary`, `ring`). If the project lacks shadcn, set it up first (`npx shadcn@latest init`).
- Animation engine: **motion**.
- Install dependencies: `npm i motion lucide-react`
- Put the component at `components/kinetik/integrations-orbit.tsx`.

## Built from these kinetik components
Install them first (each also has its own prompt at `https://marvzkineticlibrary.vercel.app/r/<id>.prompt.md`):
```bash
npx shadcn@latest add https://marvzkineticlibrary.vercel.app/r/orbit-icons.json https://marvzkineticlibrary.vercel.app/r/text-flip-words.json
```

## Non-negotiables
- **Accessibility:** Integrations are described in text; orbit is decorative and static under reduced motion.
- **Performance:** Two rotating rings.
- Respect `prefers-reduced-motion` (replace movement with opacity or an instant change).
- Animate only transform / opacity / filter / clip-path. No hard-coded theme colors — use CSS variables so it works in light and dark.

## Source — components/kinetik/integrations-orbit.tsx
```tsx
"use client";
import { Cloud, Code2, Database, GitBranch, Mail, MessageSquare, Shield, Zap } from "lucide-react";
import { OrbitIcons } from "@/components/kinetik/orbit-icons";
import { TextFlipWords } from "@/components/kinetik/text-flip-words";

export function IntegrationsOrbit() {
  return (
    <section className="mx-auto grid max-w-5xl items-center gap-10 px-6 py-12 md:grid-cols-2">
      <div>
        <p className="text-sm font-medium text-brand">Integrations</p>
        <h2 className="mt-2 text-4xl font-semibold tracking-tight">Plugs into <TextFlipWords words={["GitHub", "Slack", "Postgres", "your stack"]} className="text-brand" /></h2>
        <p className="mt-3 text-muted-foreground">80+ integrations, one motion language. Connect once and every surface animates the same way.</p>
        <a href="#" className="mt-6 inline-flex rounded-full bg-foreground px-5 py-2.5 text-sm font-medium text-background">Browse integrations →</a>
      </div>
      <div className="grid place-items-center overflow-hidden">
        <OrbitIcons center={<span className="text-2xl font-bold">k</span>} rings={[{ radius: 80, duration: 20, icons: [<Code2 key="1" />, <Zap key="2" />, <Mail key="3" />] }, { radius: 145, duration: 34, reverse: true, icons: [<Cloud key="4" />, <Database key="5" />, <GitBranch key="6" />, <MessageSquare key="7" />, <Shield key="8" />] }]} />
      </div>
    </section>
  );
}
```

## Usage example
```tsx
"use client";
import { IntegrationsOrbit } from "@/components/kinetik/integrations-orbit";
export default function Demo() { return <div className="flex h-full items-center overflow-auto"><IntegrationsOrbit /></div>; }
```

## Steps
1. Install the dependencies above.
2. Create the files exactly as given, fixing import aliases if the project doesn't use `@/`.
3. Drop the usage example into a page and adapt copy/colors to the project's design system.
4. Verify: toggle "Reduce motion" in OS settings — the component must still be fully usable.
