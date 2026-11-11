"use client";
import { DemoScroller, useDemoScroller } from "../../_demo";
import { GsapHorizontalText } from "./gsap-horizontal-text";

function Inner() {
  const s = useDemoScroller() ?? undefined;
  return (
    <>
      <div className="flex h-[50cqh] flex-col items-center justify-end pb-6">
        <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Keep scrolling</p>
      </div>
      <GsapHorizontalText scroller={s} text="Make it move ✦ make it matter" />
      <div className="grid h-[50cqh] place-items-center text-sm text-muted-foreground">fin.</div>
    </>
  );
}

export default function Demo() {
  return (
    <DemoScroller thumbAt={0.45}>
      <Inner />
    </DemoScroller>
  );
}
