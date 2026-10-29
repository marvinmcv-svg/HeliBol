import Link from "next/link";
import { ArrowRight, Boxes, Smartphone, Sparkles, Terminal } from "lucide-react";
import { BgAurora } from "@web/backgrounds/bg-aurora/bg-aurora";
import { BgNoise } from "@web/backgrounds/bg-noise/bg-noise";
import { BgGridDots } from "@web/backgrounds/bg-grid-dots/bg-grid-dots";
import { ButtonBorderBeam } from "@web/buttons/button-border-beam/button-border-beam";
import { ButtonShimmer } from "@web/buttons/button-shimmer/button-shimmer";
import { TextSplitReveal } from "@web/text/text-split-reveal/text-split-reveal";
import { TextBlurIn } from "@web/text/text-blur-in/text-blur-in";
import { TextRotate } from "@web/text/text-rotate/text-rotate";
import { NumberTicker } from "@web/text/number-ticker/number-ticker";
import { Marquee } from "@web/media/marquee/marquee";
import { ScrollReveal } from "@web/scroll/scroll-reveal/scroll-reveal";
import { SpotlightBorderCard, SpotlightBorderGrid } from "@web/cards/card-spotlight-border/card-spotlight-border";
import { CtaSpotlight } from "@/blocks/landing/cta-spotlight/cta-spotlight";
import { ComponentCard } from "@/components/component-card";
import { CopyButton } from "@/components/copy-button";
import { EngineBadge } from "@/components/engine-badge";
import { blocks, components, flows } from "@/lib/registry.generated";
import { categories, engines } from "@/lib/taxonomy";

const featured = ["text-split-reveal", "like-burst", "dynamic-island", "card-spotlight-border", "toast-stack", "tilt-card"];
const featuredBlocks = ["pricing-toggle", "auth-card"];
const featuredFlows = ["flow-onboarding", "flow-paywall", "flow-habit-check-in"];

export default function Home() {
  const pick = <T extends { id: string }>(list: T[], ids: string[]) => ids.map((id) => list.find((m) => m.id === id)!).filter(Boolean);
  const usedEngines = Array.from(new Set([...components, ...blocks].map((c) => c.engine)));

  return (
    <main>
      {/* HERO */}
      <BgNoise opacity={0.1}>
        <BgAurora className="border-b border-border/60" colors={["#7c3aed", "#0891b2", "#db2777"]}>
          <section className="mx-auto flex max-w-5xl flex-col items-center px-6 pt-24 pb-20 text-center sm:pt-32">
            <ButtonBorderBeam className="h-8 px-4 text-xs">
              ✦ {components.length} components · {blocks.length} blocks · {flows.length} mobile flows
            </ButtonBorderBeam>
            <TextSplitReveal as="h1" by="words" trigger="mount" delay={0.1} className="mt-7 max-w-4xl text-5xl leading-[1.02] font-semibold tracking-tighter sm:text-7xl">
              The motion library for web &amp; mobile.
            </TextSplitReveal>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-x-2 text-lg text-muted-foreground sm:text-xl">
              <TextBlurIn delay={0.6}>Copy-paste animations for</TextBlurIn>
              <TextRotate words={["React", "Next.js", "React Native", "Expo", "your AI agent"]} className="rounded-lg bg-foreground/90 px-2 py-0.5 font-medium text-background" />
            </div>
            <TextBlurIn delay={0.9} className="mt-3 max-w-xl text-sm text-muted-foreground sm:text-base">
              Every piece ships with a live preview, source, a one-line shadcn install and an AI prompt — organized like Refero and Mobbin, built for production.
            </TextBlurIn>
            <div className="mt-9 flex flex-wrap justify-center gap-3">
              <ButtonShimmer href="/components">
                Browse components <ArrowRight className="size-4" />
              </ButtonShimmer>
              <Link href="/flows" className="inline-flex h-11 items-center gap-2 rounded-full border border-border bg-background/60 px-6 text-sm font-medium backdrop-blur transition-[translate,background-color] hover:-translate-y-0.5 hover:bg-background">
                <Smartphone className="size-4" /> Mobile flows
              </Link>
            </div>
            <dl className="mt-14 grid w-full max-w-3xl grid-cols-2 gap-6 sm:grid-cols-4">
              {[
                { v: components.length, l: "Components" },
                { v: blocks.length, l: "Page blocks" },
                { v: flows.length, l: "Mobile flows" },
                { v: usedEngines.length, l: "Motion engines" },
              ].map((s) => (
                <div key={s.l}>
                  <dd className="text-3xl font-semibold tracking-tight sm:text-4xl"><NumberTicker value={s.v} /></dd>
                  <dt className="mt-1 text-xs text-muted-foreground">{s.l}</dt>
                </div>
              ))}
            </dl>
          </section>
        </BgAurora>
      </BgNoise>

      {/* ENGINE MARQUEE */}
      <div className="border-b border-border/60 py-5">
        <Marquee duration={40}>
          {[...categories.map((c) => c.name), ...usedEngines.map((e) => engines[e].name)].map((t, i) => (
            <span key={`${t}-${i}`} className="text-sm font-medium whitespace-nowrap text-muted-foreground">
              {t} <span className="ml-6 text-border">✦</span>
            </span>
          ))}
        </Marquee>
      </div>

      {/* FEATURED */}
      <section className="mx-auto max-w-[1280px] px-4 py-20 sm:px-8">
        <ScrollReveal className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-brand">Live, not screenshots</p>
            <h2 className="mt-1 text-3xl font-semibold tracking-tight sm:text-4xl">Touch every preview.</h2>
          </div>
          <Link href="/components" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
            All {components.length} components <ArrowRight className="size-3.5" />
          </Link>
        </ScrollReveal>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {pick(components, featured).map((m) => (
            <ComponentCard key={m.id} meta={m} href={`/components/${m.category}/${m.id}`} />
          ))}
        </div>
      </section>

      {/* CATEGORIES */}
      <section className="border-y border-border/60 bg-card/30">
        <div className="mx-auto max-w-[1280px] px-4 py-20 sm:px-8">
          <ScrollReveal className="mb-8">
            <p className="text-sm font-medium text-brand">Organized like Refero</p>
            <h2 className="mt-1 text-3xl font-semibold tracking-tight sm:text-4xl">Browse by category, engine or page type.</h2>
          </ScrollReveal>
          <SpotlightBorderGrid className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {categories.map((c) => {
              const items = components.filter((m) => m.category === c.id);
              if (!items.length) return null;
              return (
                <Link key={c.id} href={`/components/${c.id}`} className="rounded-2xl outline-none focus-visible:ring-2 focus-visible:ring-ring">
                  <SpotlightBorderCard className="h-full">
                    <div className="flex h-full flex-col p-5">
                      <div className="flex items-center justify-between">
                        <p className="font-semibold">{c.name}</p>
                        <span className="rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground tabular-nums">{items.length}</span>
                      </div>
                      <p className="mt-1 text-sm text-muted-foreground">{c.blurb}</p>
                      <div className="mt-4 flex flex-wrap gap-1">
                        {Array.from(new Set(items.map((i) => i.engine))).map((e) => <EngineBadge key={e} engine={e} />)}
                      </div>
                    </div>
                  </SpotlightBorderCard>
                </Link>
              );
            })}
          </SpotlightBorderGrid>
        </div>
      </section>

      {/* BLOCKS */}
      <section className="mx-auto max-w-[1280px] px-4 py-20 sm:px-8">
        <ScrollReveal className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-brand">Blocks</p>
            <h2 className="mt-1 text-3xl font-semibold tracking-tight sm:text-4xl">Whole sections, already choreographed.</h2>
          </div>
          <Link href="/blocks" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
            All blocks <ArrowRight className="size-3.5" />
          </Link>
        </ScrollReveal>
        <div className="grid gap-5 lg:grid-cols-2">
          {pick(blocks, featuredBlocks).map((m) => <ComponentCard key={m.id} meta={m} href={`/blocks/${m.id}`} size="lg" />)}
        </div>
      </section>

      {/* FLOWS */}
      <section className="border-y border-border/60 bg-card/30">
        <div className="mx-auto max-w-[1280px] px-4 py-20 sm:px-8">
          <ScrollReveal className="mb-8 flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-sm font-medium text-brand">Mobile flows, Mobbin-style</p>
              <h2 className="mt-1 text-3xl font-semibold tracking-tight sm:text-4xl">Prototype on the web. Ship on Expo.</h2>
              <p className="mt-2 max-w-xl text-sm text-muted-foreground">Each flow is interactive here, and its prompt rebuilds it natively with Reanimated 4, Gesture Handler and haptics — using the same spring physics.</p>
            </div>
            <Link href="/flows" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
              All flows <ArrowRight className="size-3.5" />
            </Link>
          </ScrollReveal>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {pick(flows, featuredFlows).map((m) => <ComponentCard key={m.id} meta={m} href={`/flows/${m.id}`} size="phone" />)}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <BgGridDots className="border-b border-border/60">
        <section className="mx-auto max-w-5xl px-6 py-20">
          <ScrollReveal className="mb-10 text-center">
            <p className="text-sm font-medium text-brand">Three ways in</p>
            <h2 className="mt-1 text-3xl font-semibold tracking-tight sm:text-4xl">Your code. Your repo. Your agent.</h2>
          </ScrollReveal>
          <div className="grid gap-4 md:grid-cols-3">
            {[
              { icon: Boxes, t: "1 · Browse", d: "Filter by category, engine or page type. Replay previews, flip reduced motion, resize to mobile." },
              { icon: Terminal, t: "2 · Install", d: "One shadcn command drops source + motion tokens into your project.", code: "npx shadcn@latest add marvzkineticlibrary.vercel.app/r/like-burst.json" },
              { icon: Sparkles, t: "3 · Prompt", d: "Or copy the AI prompt — intent, constraints, full source — into Claude Code, Cursor, v0 or Lovable." },
            ].map((s, i) => (
              <ScrollReveal key={s.t} index={i} className="rounded-2xl border border-border bg-card p-6">
                <s.icon className="size-5 text-brand" />
                <p className="mt-4 font-semibold">{s.t}</p>
                <p className="mt-1 text-sm text-muted-foreground">{s.d}</p>
                {s.code && (
                  <div className="mt-4 flex items-center gap-2 rounded-lg border border-border bg-background py-1 pr-1 pl-3 font-mono text-[11px]">
                    <span className="truncate">{s.code}</span>
                    <CopyButton text={`npx shadcn@latest add https://${s.code.split(" ").pop()}`} className="ml-auto" />
                  </div>
                )}
              </ScrollReveal>
            ))}
          </div>
        </section>
      </BgGridDots>

      <div className="mx-auto max-w-[1280px] py-10">
        <CtaSpotlight />
      </div>

      <footer className="border-t border-border/60">
        <div className="mx-auto flex max-w-[1280px] flex-wrap items-center justify-between gap-4 px-6 py-8 text-sm text-muted-foreground">
          <p>kinetik · MIT licensed · Built with its own components.</p>
          <nav className="flex gap-5">
            <Link href="/components" className="hover:text-foreground">Components</Link>
            <Link href="/blocks" className="hover:text-foreground">Blocks</Link>
            <Link href="/flows" className="hover:text-foreground">Flows</Link>
            <Link href="/playground" className="hover:text-foreground">Playground</Link>
            <Link href="/docs" className="hover:text-foreground">Docs</Link>
          </nav>
        </div>
      </footer>
    </main>
  );
}
