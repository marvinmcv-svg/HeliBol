"use client";
import { DemoScroller, photoAlt, photos } from "../../_demo";
import { ScrollReveal, type RevealVariant } from "./scroll-reveal";

const variants: RevealVariant[] = ["fade-up", "scale", "blur", "slide-left", "slide-right", "fade"];

export default function Demo() {
  return (
    <DemoScroller>
      <div className="mx-auto max-w-2xl space-y-16 px-6 pt-4 pb-24">
        <header className="space-y-1 pb-4"><p className="text-xs uppercase tracking-widest text-muted-foreground">Scroll-driven</p><h3 className="text-2xl font-semibold tracking-tight">Six reveal variants, scrubbed by scroll</h3></header>
        {variants.map((v, i) => (
          <ScrollReveal key={v} variant={v} className="overflow-hidden rounded-2xl border border-border bg-card">
            <img src={photos[i]} alt="" className="aspect-[16/8] w-full object-cover" />
            <div className="flex items-center justify-between p-4">
              <p className="font-medium">{photoAlt[i]}</p>
              <code className="rounded bg-muted px-2 py-0.5 text-xs">variant=&quot;{v}&quot;</code>
            </div>
          </ScrollReveal>
        ))}
      </div>
    </DemoScroller>
  );
}
