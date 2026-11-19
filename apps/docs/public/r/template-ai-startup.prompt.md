You are given a task to integrate a block from the **kinetik** motion library into this codebase.

# Template — AI Startup (`template-ai-startup`)

An AI-product landing page in the MotionSites style: a particle-brain hero with a typing prompt box, logo marquee, a live working chat UI as the product shot, capability bento, a waitlist with suggested prompts, FAQ and footer reveal.

## What it should do
Build an AI startup landing page: dark particle-morph hero (three.js) with headline word that smart-animates between capabilities and a prompt box with typing placeholder; logo marquee; a real interactive chat UI inside a browser-frame mockup as the product shot; capability bento; waitlist section with suggestion chips and an email pill that morphs into a success state with place-in-line; FAQ; footer reveal.

## Project requirements
- React 19 + TypeScript, Tailwind CSS v4, shadcn/ui-style CSS variables (`background`, `foreground`, `muted`, `muted-foreground`, `border`, `card`, `primary`, `ring`). If the project lacks shadcn, set it up first (`npx shadcn@latest init`).
- Animation engine: **r3f**.
- Install dependencies: `npm i three @react-three/fiber @react-three/drei motion gsap @gsap/react lucide-react`
- Put the component at `components/kinetik/template-ai-startup.tsx`.

## Built from these kinetik components
Install them first (each also has its own prompt at `https://marvzkineticlibrary.vercel.app/r/<id>.prompt.md`):
```bash
npx shadcn@latest add https://marvzkineticlibrary.vercel.app/r/waitlist-form.json https://marvzkineticlibrary.vercel.app/r/ai-suggestions.json https://marvzkineticlibrary.vercel.app/r/hero-ai-particles.json https://marvzkineticlibrary.vercel.app/r/social-proof-marquee.json https://marvzkineticlibrary.vercel.app/r/ai-chat-app.json https://marvzkineticlibrary.vercel.app/r/features-bento.json https://marvzkineticlibrary.vercel.app/r/faq-section.json https://marvzkineticlibrary.vercel.app/r/footer-reveal.json
```

## Non-negotiables
- **Accessibility:** Landmarks per section, one H1 (the hero), real links and buttons throughout; every composed block keeps its own reduced-motion fallback.
- **Performance:** Heavy sections (three.js, canvas) are client components that pause off-screen; previews and thumbnails mount lazily.
- Respect `prefers-reduced-motion` (replace movement with opacity or an instant change).
- Animate only transform / opacity / filter / clip-path. No hard-coded theme colors — use CSS variables so it works in light and dark.

## Source — components/kinetik/template-ai-startup.tsx
```tsx
"use client";
import { WaitlistForm } from "@/components/kinetik/waitlist-form";
import { AiSuggestions } from "@/components/kinetik/ai-suggestions";
import { HeroAiParticles } from "@/components/kinetik/hero-ai-particles";
import { SocialProofMarquee } from "@/components/kinetik/social-proof-marquee";
import { AiChatApp } from "@/components/kinetik/ai-chat-app";
import { FeaturesBento } from "@/components/kinetik/features-bento";
import { FaqSection } from "@/components/kinetik/faq-section";
import { FooterReveal } from "@/components/kinetik/footer-reveal";

/**
 * AI startup page (MotionSites "AI product" pattern): particle-brain hero → logos → live product
 * shot (a working chat UI in a browser frame) → capabilities → waitlist → FAQ → footer.
 */
export function TemplateAiStartup() {
  return (
    <div className="relative bg-[#030014] text-white">
      <div className="p-3"><HeroAiParticles /></div>
      <div className="dark text-foreground"><SocialProofMarquee /></div>
      <section className="mx-auto max-w-5xl px-6 py-14">
        <p className="text-center text-xs uppercase tracking-[0.3em] text-violet-300">The product</p>
        <h2 className="mt-2 text-center text-3xl font-semibold tracking-tight sm:text-4xl">It&apos;s not a demo. Try it.</h2>
        <div className="mx-auto mt-8 h-[460px] overflow-hidden rounded-2xl border border-white/10 bg-zinc-950 shadow-[0_40px_120px_-40px_rgb(124_58_237/.6)]">
          <div className="flex h-9 items-center gap-1.5 border-b border-white/10 px-3">{["#ff5f57", "#febc2e", "#28c840"].map((c) => <span key={c} className="size-2.5 rounded-full" style={{ background: c }} />)}</div>
          <div className="dark h-[calc(100%-2.25rem)] bg-background text-foreground"><AiChatApp /></div>
        </div>
      </section>
      <div className="dark bg-background text-foreground">
        <FeaturesBento />
        <section className="mx-auto flex max-w-xl flex-col items-center gap-5 px-6 py-16 text-center">
          <h2 className="text-3xl font-semibold tracking-tight">Be first in line</h2>
          <p className="text-muted-foreground">We&apos;re onboarding teams weekly. Ask it anything while you wait:</p>
          <AiSuggestions items={[{ icon: "🗓️", label: "Plan my launch week" }, { icon: "📨", label: "Draft replies to my inbox" }, { icon: "📊", label: "Summarise Q3 metrics" }]} />
          <WaitlistForm count={12840} avatars={["/demo/photo-1.jpg", "/demo/photo-2.jpg", "/demo/photo-3.jpg"]} />
        </section>
        <FaqSection />
        <FooterReveal />
      </div>
    </div>
  );
}
```

## Usage example
```tsx
"use client";
import { DemoScroller } from "@web/_demo";
import { TemplateAiStartup } from "@/components/kinetik/template-ai-startup";

export default function Demo() {
  return (
    <DemoScroller thumbAt={0}>
      <TemplateAiStartup />
    </DemoScroller>
  );
}
```

## Steps
1. Install the dependencies above.
2. Create the files exactly as given, fixing import aliases if the project doesn't use `@/`.
3. Drop the usage example into a page and adapt copy/colors to the project's design system.
4. Verify: toggle "Reduce motion" in OS settings — the component must still be fully usable.
