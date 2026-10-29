"use client";
import { TextSplitReveal } from "./text-split-reveal";

export default function Demo() {
  return (
    <div className="flex h-full w-full flex-col justify-center gap-4 p-8 sm:p-12">
      <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">Chapter 01</p>
      <TextSplitReveal as="h2" by="lines" trigger="mount" className="max-w-2xl text-4xl font-semibold leading-[1.05] tracking-tight sm:text-5xl">
        Motion is the language your interface speaks before anyone reads a word.
      </TextSplitReveal>
      <TextSplitReveal as="p" by="words" trigger="mount" delay={0.5} className="max-w-lg text-muted-foreground">
        Lines rise from a mask with an expo-out ease, staggered just enough to feel written in real time.
      </TextSplitReveal>
    </div>
  );
}
