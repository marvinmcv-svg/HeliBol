"use client";
import { DemoScroller, useDemoScroller } from "../../_demo";
import { GsapLinesScroll } from "./gsap-lines-scroll";

function Inner() {
  const s = useDemoScroller() ?? undefined;
  return (
    <div className="mx-auto max-w-2xl px-6 pb-[45cqh] pt-[30cqh]">
      <p className="mb-6 text-xs uppercase tracking-[0.3em] text-muted-foreground">Manifesto</p>
      <GsapLinesScroll scroller={s} as="h3" className="text-3xl font-semibold leading-[1.15] tracking-tight sm:text-4xl">
        We believe interfaces should feel alive. Every transition is a sentence, every ease a tone of voice, and every pause gives people a moment to understand what just happened.
      </GsapLinesScroll>
      <GsapLinesScroll scroller={s} className="mt-8 text-lg leading-relaxed text-muted-foreground">
        Lines are split from the real layout, so they re-flow perfectly when the window resizes — then each one rises out of its own mask as you scroll.
      </GsapLinesScroll>
    </div>
  );
}

export default function Demo() {
  return (
    <DemoScroller>
      <Inner />
    </DemoScroller>
  );
}
