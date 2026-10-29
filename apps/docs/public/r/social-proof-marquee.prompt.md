You are given a task to integrate a block from the **kinetik** motion library into this codebase.

# Logo Cloud + Testimonial Wall (`social-proof-marquee`)

Logo marquee with a pause control, then two opposite-direction testimonial marquees with faded edges.

## What it should do
Build a social proof section: an uppercase eyebrow, a slow logo marquee with a pause button, then two testimonial-card marquees running in opposite directions (avatar, quote, name, role), all with faded edges and pause on hover.

## Project requirements
- React 19 + TypeScript, Tailwind CSS v4, shadcn/ui-style CSS variables (`background`, `foreground`, `muted`, `muted-foreground`, `border`, `card`, `primary`, `ring`). If the project lacks shadcn, set it up first (`npx shadcn@latest init`).
- Animation engine: **css**.
- Install dependencies: `npm i lucide-react`
- Put the component at `components/kinetik/social-proof-marquee.tsx`.

## Built from these kinetik components
Install them first (each also has its own prompt at `https://marvzkineticlibrary.vercel.app/r/<id>.prompt.md`):
```bash
npx shadcn@latest add https://marvzkineticlibrary.vercel.app/r/marquee.json
```

## Non-negotiables
- **Accessibility:** Pause control (WCAG 2.2.2); duplicate tracks aria-hidden; paused under reduced motion.
- **Performance:** Pure CSS transforms.
- Respect `prefers-reduced-motion` (replace movement with opacity or an instant change).
- Animate only transform / opacity / filter / clip-path. No hard-coded theme colors — use CSS variables so it works in light and dark.

## Source — components/kinetik/social-proof-marquee.tsx
```tsx
"use client";
import { Marquee } from "@/components/kinetik/marquee";

const logos = ["Northwind", "Acme", "Globex", "Initech", "Umbrella", "Hooli", "Stark", "Wayne", "Tyrell"];
const quotes = [
  ["Ava Lin", "Design Eng, Northwind", "The AI prompts alone saved us a sprint."],
  ["Kai Moreno", "Founder, Hooli", "Reduced motion that's actually designed, not bolted on."],
  ["Noor Haddad", "CTO, Globex", "Our landing page finally feels expensive."],
  ["Leo Park", "Mobile lead, Acme", "Same springs on web and native. Chef's kiss."],
  ["Mila Rossi", "PM, Initech", "We replaced three animation libraries with one folder."],
  ["Ezra Cole", "Indie hacker", "Shipped a paywall flow in an afternoon."],
];

function Quote({ q, i }: { q: string[]; i: number }) {
  return (
    <figure className="w-72 shrink-0 rounded-2xl border border-border bg-card p-5">
      <blockquote className="text-sm leading-relaxed">“{q[2]}”</blockquote>
      <figcaption className="mt-4 flex items-center gap-3">
        <img src={`/demo/photo-${(i % 8) + 1}.jpg`} alt="" className="size-8 rounded-full object-cover" />
        <div><p className="text-sm font-medium">{q[0]}</p><p className="text-xs text-muted-foreground">{q[1]}</p></div>
      </figcaption>
    </figure>
  );
}

export function SocialProofMarquee() {
  return (
    <section className="space-y-10 py-14">
      <div className="space-y-4">
        <p className="text-center text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">Trusted by teams who sweat the details</p>
        <Marquee duration={35} controls>
          {logos.map((l) => <span key={l} className="text-2xl font-semibold tracking-tight text-muted-foreground/60">{l}</span>)}
        </Marquee>
      </div>
      <div className="space-y-4">
        <Marquee duration={50} gap="1rem">{quotes.map((q, i) => <Quote key={q[0]} q={q} i={i} />)}</Marquee>
        <Marquee duration={50} gap="1rem" reverse>{[...quotes].reverse().map((q, i) => <Quote key={q[0]} q={q} i={i + 3} />)}</Marquee>
      </div>
    </section>
  );
}
```

## Usage example
```tsx
"use client";
import { SocialProofMarquee } from "@/components/kinetik/social-proof-marquee";
export default function Demo() {
  return <div className="flex h-full items-center"><SocialProofMarquee /></div>;
}
```

## Steps
1. Install the dependencies above.
2. Create the files exactly as given, fixing import aliases if the project doesn't use `@/`.
3. Drop the usage example into a page and adapt copy/colors to the project's design system.
4. Verify: toggle "Reduce motion" in OS settings — the component must still be fully usable.
