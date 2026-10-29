"use client";
import { useRef } from "react";
import { Bot, Code2, Layers, Sparkles } from "lucide-react";
import { AnimatedBeam } from "@web/cards/animated-beam/animated-beam";
import { BentoGrid, BentoTile } from "@web/cards/bento-grid/bento-grid";
import { NumberTicker } from "@web/text/number-ticker/number-ticker";
import { TextShimmer } from "@web/text/text-shimmer/text-shimmer";
import { ScrollReveal } from "@web/scroll/scroll-reveal/scroll-reveal";

function BeamVisual() {
  const c = useRef<HTMLDivElement>(null);
  const a = useRef<HTMLDivElement>(null);
  const b = useRef<HTMLDivElement>(null);
  const d = useRef<HTMLDivElement>(null);
  const node = "z-10 grid size-11 place-items-center rounded-full border border-border bg-background shadow";
  return (
    <div ref={c} className="relative flex h-full items-start justify-between px-10 pt-8 text-muted-foreground">
      <div ref={a} className={node}><Code2 className="size-5" /></div>
      <div ref={b} className={`${node} size-14`}><Sparkles className="size-6 text-brand" /></div>
      <div ref={d} className={node}><Bot className="size-5" /></div>
      <AnimatedBeam container={c} from={a} to={b} curvature={-30} />
      <AnimatedBeam container={c} from={b} to={d} curvature={-30} delay={1.2} />
    </div>
  );
}

export function FeaturesBento() {
  return (
    <section className="mx-auto max-w-5xl px-6 py-14">
      <ScrollReveal className="mb-8 text-center">
        <p className="text-sm font-medium text-brand">Why kinetik</p>
        <h2 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">Everything motion, nothing to maintain.</h2>
      </ScrollReveal>
      <BentoGrid>
        <BentoTile className="sm:col-span-2" title="From registry to your agent" description="Install with shadcn, or paste the AI prompt into Claude Code, Cursor or v0." visual={<BeamVisual />} />
        <BentoTile title="Components" description="And counting." visual={<div className="grid h-full place-items-center pb-10 text-6xl font-semibold tracking-tight"><NumberTicker value={71} suffix="+" /></div>} />
        <BentoTile title="Engines" description="CSS, Motion, GSAP, Lenis, R3F." visual={<div className="flex flex-wrap gap-1.5 p-5">{["CSS", "Motion", "GSAP", "Lenis", "R3F", "View Transitions"].map((e) => <span key={e} className="rounded-full border border-border bg-background px-2.5 py-1 text-xs">{e}</span>)}</div>} />
        <BentoTile className="sm:col-span-2" title="Accessible by default" description="Every animation ships a tested reduced-motion fallback." visual={<div className="grid h-full place-items-center pb-12"><div className="flex items-center gap-2 rounded-full border border-border bg-background px-4 py-2 text-sm"><Layers className="size-4 text-brand" /><TextShimmer>prefers-reduced-motion: handled</TextShimmer></div></div>} />
      </BentoGrid>
    </section>
  );
}
