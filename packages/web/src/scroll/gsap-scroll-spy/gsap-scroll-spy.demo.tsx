"use client";
import { DemoScroller, photos, useDemoScroller } from "../../_demo";
import { GsapScrollSpy } from "./gsap-scroll-spy";

const chapters = [
  ["intro", "Introduction", "Why motion matters", 0],
  ["timing", "Timing", "Durations that feel right", 1],
  ["easing", "Easing", "Curves with personality", 2],
  ["choreo", "Choreography", "Stagger, overlap, sequence", 4],
  ["a11y", "Accessibility", "Reduced motion is a feature", 6],
] as const;

function Inner() {
  const s = useDemoScroller() ?? undefined;
  return (
    <div className="px-6 pb-[60cqh] pt-6">
      <GsapScrollSpy
        scroller={s}
        sections={chapters.map(([id, label, title, img]) => ({
          id,
          label,
          content: (
            <article>
              <h3 className="text-2xl font-semibold tracking-tight">{title}</h3>
              <img src={photos[img]} alt="" className="my-3 aspect-[16/7] w-full rounded-xl object-cover" />
              <p className="text-sm leading-relaxed text-muted-foreground">
                Good motion explains what changed, where things went and what you can do next. Each chapter here is tracked by its own ScrollTrigger; the rail on the left fills as you read and every label scrolls you straight to its chapter.
              </p>
            </article>
          ),
        }))}
      />
    </div>
  );
}

export default function Demo() {
  return (
    <DemoScroller hint={false}>
      <Inner />
    </DemoScroller>
  );
}
