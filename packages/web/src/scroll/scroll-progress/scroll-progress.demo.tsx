"use client";
import { DemoScroller, useDemoScroller } from "../../_demo";
import { ScrollProgress } from "./scroll-progress";

function Article() {
  const scroller = useDemoScroller();
  return (
    <>
      <div className="sticky top-0 z-10 border-b border-border bg-background/80 backdrop-blur">
        <div className="flex items-center justify-between px-6 py-2 text-sm">
          <span className="font-semibold">The physics of delight</span>
          <ScrollProgress variant="circle" container={scroller ?? undefined} className="size-7" />
        </div>
        <ScrollProgress container={scroller ?? undefined} />
      </div>
      <article className="mx-auto max-w-xl space-y-4 px-6 py-8 text-sm leading-relaxed text-muted-foreground">
        {Array.from({ length: 9 }, (_, i) => (
          <p key={i}>
            {i === 0 && <span className="mb-3 block text-2xl font-semibold tracking-tight text-foreground">Why springs feel alive</span>}
            Springs don&apos;t have a duration — they have stiffness, damping and mass. That&apos;s why interrupted spring animations never jump: velocity carries over, the way objects behave in the real world. Paragraph {i + 1} of 9.
          </p>
        ))}
      </article>
    </>
  );
}

export default function Demo() {
  return (
    <DemoScroller hint={false}>
      <Article />
    </DemoScroller>
  );
}
