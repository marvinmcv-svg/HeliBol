"use client";
import { ArrowRight } from "lucide-react";
import { BgAurora } from "@web/backgrounds/bg-aurora/bg-aurora";
import { BgNoise } from "@web/backgrounds/bg-noise/bg-noise";
import { ButtonBorderBeam } from "@web/buttons/button-border-beam/button-border-beam";
import { ButtonShimmer } from "@web/buttons/button-shimmer/button-shimmer";
import { ButtonPress } from "@web/buttons/button-press/button-press";
import { TextSplitReveal } from "@web/text/text-split-reveal/text-split-reveal";
import { TextBlurIn } from "@web/text/text-blur-in/text-blur-in";
import { ScrollReveal } from "@web/scroll/scroll-reveal/scroll-reveal";

export function HeroSplitText() {
  return (
    <BgNoise opacity={0.12} className="h-full">
      <BgAurora className="flex min-h-full flex-col items-center justify-center px-6 py-20 text-center">
        <ScrollReveal variant="blur">
          <ButtonBorderBeam className="h-8 px-4 text-xs">✦ kinetik 1.0 — 70+ components</ButtonBorderBeam>
        </ScrollReveal>
        <TextSplitReveal as="h1" by="words" trigger="mount" delay={0.15} className="mt-6 max-w-3xl text-5xl font-semibold leading-[1.02] tracking-tight sm:text-7xl">
          Interfaces that feel alive.
        </TextSplitReveal>
        <TextBlurIn delay={0.7} className="mt-5 max-w-xl text-base text-muted-foreground sm:text-lg">
          Copy-paste motion components for React and React Native — with live previews, accessible fallbacks and an AI prompt for every piece.
        </TextBlurIn>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <ButtonShimmer>Browse components <ArrowRight className="size-4" /></ButtonShimmer>
          <ButtonPress variant="secondary" className="h-11 rounded-full px-6">Read the docs</ButtonPress>
        </div>
      </BgAurora>
    </BgNoise>
  );
}
