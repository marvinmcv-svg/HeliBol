You are given a task to integrate a block from the **kinetik** motion library into this codebase.

# Template — SaaS Launch Page (`template-saas`)

A complete SaaS launch page assembled from kinetik blocks in conversion order: announcement bar, floating expandable nav, split-text hero, logo marquee, animated bento features, integrations orbit, stats, testimonials wall, pricing toggle with plan comparison, FAQ, spotlight CTA and footer reveal.

## What it should do
Build a full SaaS launch page in this order: dismissible announcement bar; sticky floating pill nav that expands into a menu; hero with split-text headline over an aurora; logo marquee; bento features; integrations orbit; impact stats; testimonials wall; pricing with monthly/yearly toggle followed by a plan comparison table; FAQ accordion; spotlight CTA; footer that reveals on scroll. Reuse one motion-token set across sections and keep every section's reduced-motion fallback.

## Project requirements
- React 19 + TypeScript, Tailwind CSS v4, shadcn/ui-style CSS variables (`background`, `foreground`, `muted`, `muted-foreground`, `border`, `card`, `primary`, `ring`). If the project lacks shadcn, set it up first (`npx shadcn@latest init`).
- Animation engine: **motion**.
- Install dependencies: `npm i motion gsap @gsap/react lucide-react`
- Put the component at `components/kinetik/template-saas.tsx`.

## Built from these kinetik components
Install them first (each also has its own prompt at `https://marvzkineticlibrary.vercel.app/r/<id>.prompt.md`):
```bash
npx shadcn@latest add https://marvzkineticlibrary.vercel.app/r/banner-announcement.json https://marvzkineticlibrary.vercel.app/r/nav-expandable.json https://marvzkineticlibrary.vercel.app/r/comparison-table.json https://marvzkineticlibrary.vercel.app/r/hero-split-text.json https://marvzkineticlibrary.vercel.app/r/social-proof-marquee.json https://marvzkineticlibrary.vercel.app/r/features-bento.json https://marvzkineticlibrary.vercel.app/r/integrations-orbit.json https://marvzkineticlibrary.vercel.app/r/stats-impact.json https://marvzkineticlibrary.vercel.app/r/testimonials-wall.json https://marvzkineticlibrary.vercel.app/r/pricing-toggle.json https://marvzkineticlibrary.vercel.app/r/faq-section.json https://marvzkineticlibrary.vercel.app/r/cta-spotlight.json https://marvzkineticlibrary.vercel.app/r/footer-reveal.json
```

## Non-negotiables
- **Accessibility:** Landmarks per section, one H1 (the hero), real links and buttons throughout; every composed block keeps its own reduced-motion fallback.
- **Performance:** Heavy sections (three.js, canvas) are client components that pause off-screen; previews and thumbnails mount lazily.
- Respect `prefers-reduced-motion` (replace movement with opacity or an instant change).
- Animate only transform / opacity / filter / clip-path. No hard-coded theme colors — use CSS variables so it works in light and dark.

## Source — components/kinetik/template-saas.tsx
```tsx
"use client";
import { BannerAnnouncement } from "@/components/kinetik/banner-announcement";
import { NavExpandable } from "@/components/kinetik/nav-expandable";
import { ComparisonTable } from "@/components/kinetik/comparison-table";
import { HeroSplitText } from "@/components/kinetik/hero-split-text";
import { SocialProofMarquee } from "@/components/kinetik/social-proof-marquee";
import { FeaturesBento } from "@/components/kinetik/features-bento";
import { IntegrationsOrbit } from "@/components/kinetik/integrations-orbit";
import { StatsImpact } from "@/components/kinetik/stats-impact";
import { TestimonialsWall } from "@/components/kinetik/testimonials-wall";
import { PricingToggle } from "@/components/kinetik/pricing-toggle";
import { FaqSection } from "@/components/kinetik/faq-section";
import { CtaSpotlight } from "@/components/kinetik/cta-spotlight";
import { FooterReveal } from "@/components/kinetik/footer-reveal";

/**
 * Full SaaS launch page assembled from kinetik blocks, in conversion order:
 * announcement → floating nav → hero → logos → features → integrations → proof (stats,
 * testimonials) → pricing + comparison → FAQ → CTA → footer reveal.
 */
export function TemplateSaas() {
  return (
    <div className="relative bg-background text-foreground">
      <BannerAnnouncement items={[{ label: "New", text: "Launch week — 30% off annual plans", href: "#pricing" }, { text: "SOC 2 Type II certified", href: "#security" }]} />
      <div className="sticky top-3 z-40 flex justify-center px-4">
        <NavExpandable brand="◆ Northwind" links={[{ label: "Product", href: "#features", description: "Everything in one workspace" }, { label: "Integrations", href: "#integrations" }, { label: "Pricing", href: "#pricing", description: "Free for small teams" }, { label: "Docs", href: "#docs" }]} cta={<a href="#pricing" className="block rounded-2xl bg-primary px-4 py-3 text-center text-sm font-medium text-primary-foreground">Start free</a>} />
      </div>
      <div className="-mt-14 min-h-[560px]"><HeroSplitText /></div>
      <SocialProofMarquee />
      <div id="features"><FeaturesBento /></div>
      <div id="integrations"><IntegrationsOrbit /></div>
      <StatsImpact />
      <TestimonialsWall />
      <div id="pricing"><PricingToggle /></div>
      <section className="mx-auto max-w-5xl px-6 pb-14">
        <ComparisonTable
          plans={[{ id: "free", name: "Free", price: "$0" }, { id: "pro", name: "Pro", price: "$12/mo", highlight: true }, { id: "team", name: "Team", price: "$40/mo" }]}
          rows={[
            { group: "Workspace", feature: "Members", values: { free: "3", pro: "Unlimited", team: "Unlimited" } },
            { feature: "Automations", values: { free: false, pro: true, team: true } },
            { group: "Security", feature: "SSO / SAML", values: { free: false, pro: false, team: true } },
            { feature: "Audit log", values: { free: false, pro: true, team: true } },
          ]}
        />
      </section>
      <FaqSection />
      <CtaSpotlight />
      <FooterReveal />
    </div>
  );
}
```

## Usage example
```tsx
"use client";
import { DemoScroller } from "@web/_demo";
import { TemplateSaas } from "@/components/kinetik/template-saas";

export default function Demo() {
  return (
    <DemoScroller thumbAt={0}>
      <TemplateSaas />
    </DemoScroller>
  );
}
```

## Steps
1. Install the dependencies above.
2. Create the files exactly as given, fixing import aliases if the project doesn't use `@/`.
3. Drop the usage example into a page and adapt copy/colors to the project's design system.
4. Verify: toggle "Reduce motion" in OS settings — the component must still be fully usable.
