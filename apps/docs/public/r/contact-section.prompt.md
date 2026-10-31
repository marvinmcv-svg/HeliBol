You are given a task to integrate a block from the **kinetik** motion library into this codebase.

# Contact Section (`contact-section`)

Contact block over a glowing dot matrix: floating-label fields, an animated select and a paper-plane send button.

## What it should do
Build a contact section on a glowing dot-matrix canvas: left headline + bullet services; right a glass card form with floating-label name/email, an animated budget select, a textarea and a paper-plane send button.

## Project requirements
- React 19 + TypeScript, Tailwind CSS v4, shadcn/ui-style CSS variables (`background`, `foreground`, `muted`, `muted-foreground`, `border`, `card`, `primary`, `ring`). If the project lacks shadcn, set it up first (`npx shadcn@latest init`).
- Animation engine: **motion**.
- Install dependencies: `npm i motion lucide-react`
- Put the component at `components/kinetik/contact-section.tsx`.

## Built from these kinetik components
Install them first (each also has its own prompt at `https://marvzkineticlibrary.vercel.app/r/<id>.prompt.md`):
```bash
npx shadcn@latest add https://marvzkineticlibrary.vercel.app/r/bg-dot-glow.json https://marvzkineticlibrary.vercel.app/r/input-floating-label.json https://marvzkineticlibrary.vercel.app/r/select-animated.json https://marvzkineticlibrary.vercel.app/r/button-send.json
```

## Non-negotiables
- **Accessibility:** Labelled fields, listbox select, live-region send state.
- **Performance:** One canvas background.
- Respect `prefers-reduced-motion` (replace movement with opacity or an instant change).
- Animate only transform / opacity / filter / clip-path. No hard-coded theme colors — use CSS variables so it works in light and dark.

## Source — components/kinetik/contact-section.tsx
```tsx
"use client";
import { BgDotGlow } from "@/components/kinetik/bg-dot-glow";
import { InputFloatingLabel } from "@/components/kinetik/input-floating-label";
import { SelectAnimated } from "@/components/kinetik/select-animated";
import { ButtonSend } from "@/components/kinetik/button-send";

export function ContactSection() {
  return (
    <BgDotGlow className="h-full">
      <section className="mx-auto grid max-w-5xl gap-10 px-6 py-14 md:grid-cols-2">
        <div>
          <h2 className="text-4xl font-semibold tracking-tight">Let&apos;s make something move.</h2>
          <p className="mt-3 text-muted-foreground">Tell us about your project — we reply within one business day.</p>
          <ul className="mt-6 space-y-2 text-sm text-muted-foreground"><li>✦ Motion audits</li><li>✦ Design-system tokens</li><li>✦ Native + web parity</li></ul>
        </div>
        <form onSubmit={(e) => e.preventDefault()} className="space-y-3 rounded-3xl border border-border bg-card/90 p-6 shadow-xl backdrop-blur">
          <InputFloatingLabel label="Name" />
          <InputFloatingLabel label="Work email" type="email" />
          <SelectAnimated label="Budget" className="w-full" options={[{ value: "s", label: "$5k – $15k" }, { value: "m", label: "$15k – $50k" }, { value: "l", label: "$50k+" }]} />
          <textarea rows={3} placeholder="Project details" className="w-full resize-none rounded-xl border border-input bg-card p-3 text-sm outline-none focus:ring-2 focus:ring-ring/40" />
          <div className="flex justify-end"><ButtonSend label="Send inquiry" /></div>
        </form>
      </section>
    </BgDotGlow>
  );
}
```

## Usage example
```tsx
"use client";
import { ContactSection } from "@/components/kinetik/contact-section";
export default function Demo() { return <div className="h-full overflow-auto"><ContactSection /></div>; }
```

## Steps
1. Install the dependencies above.
2. Create the files exactly as given, fixing import aliases if the project doesn't use `@/`.
3. Drop the usage example into a page and adapt copy/colors to the project's design system.
4. Verify: toggle "Reduce motion" in OS settings — the component must still be fully usable.
