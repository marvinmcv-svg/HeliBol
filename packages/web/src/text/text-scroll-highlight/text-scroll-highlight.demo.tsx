"use client";
import { DemoScroller, useDemoScroller } from "../../_demo";
import { TextScrollHighlight } from "./text-scroll-highlight";

function Inner() {
  const scroller = useDemoScroller();
  return (
    <div className="px-8 pt-[40cqh] pb-[60cqh] sm:px-14">
      <TextScrollHighlight container={scroller ?? undefined} className="text-2xl font-semibold leading-snug tracking-tight sm:text-4xl">
        Great motion is invisible. It guides the eye, explains what changed, and makes software feel like it respects your time. Every word here lights up exactly as you read it.
      </TextScrollHighlight>
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
