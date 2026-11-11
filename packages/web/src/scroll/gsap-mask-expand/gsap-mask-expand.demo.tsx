"use client";
import { DemoScroller, photos, useDemoScroller } from "../../_demo";
import { GsapMaskExpand } from "./gsap-mask-expand";

function Inner() {
  const s = useDemoScroller() ?? undefined;
  return (
    <>
      <GsapMaskExpand scroller={s} image={photos[3]} words={["Into", "the wild"]}>
        <p className="text-[10px] uppercase tracking-[0.3em] opacity-70">Field notes · 04</p>
        <h3 className="text-3xl font-semibold tracking-tight">Emerald canopy, 06:12</h3>
      </GsapMaskExpand>
      <div className="grid h-[40cqh] place-items-center text-sm text-muted-foreground">↑ scroll back to close the window</div>
    </>
  );
}

export default function Demo() {
  return (
    <DemoScroller>
      <Inner />
    </DemoScroller>
  );
}
