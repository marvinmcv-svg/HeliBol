"use client";
import { DemoScroller, useDemoScroller } from "../../_demo";
import { TextVelocityMarquee } from "./text-velocity-marquee";

function Inner() {
  const c = useDemoScroller() ?? undefined;
  return (
    <div className="flex min-h-[220cqh] flex-col justify-start gap-4 pt-[14cqh]">
      <TextVelocityMarquee container={c} text="Kinetik ✦ Motion ✦" className="text-7xl font-black tracking-tighter uppercase" />
      <TextVelocityMarquee container={c} baseVelocity={-3} text="Scroll faster ✦ skew harder ✦" className="text-5xl font-semibold tracking-tight text-muted-foreground" />
    </div>
  );
}

export default function Demo() {
  return <DemoScroller><Inner /></DemoScroller>;
}
