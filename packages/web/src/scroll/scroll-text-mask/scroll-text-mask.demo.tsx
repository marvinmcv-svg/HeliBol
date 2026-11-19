"use client";
import { DemoScroller, photos, useDemoScroller } from "../../_demo";
import { ScrollTextMask } from "./scroll-text-mask";

function Inner() {
  const s = useDemoScroller() ?? undefined;
  return (
    <ScrollTextMask container={s} text="WILD" image={photos[3]}>
      <div>
        <p className="text-[10px] uppercase tracking-[0.35em] opacity-80">Field guide · Vol. 2</p>
        <h3 className="mt-2 text-4xl font-semibold tracking-tight">Into the canopy</h3>
      </div>
    </ScrollTextMask>
  );
}

export default function Demo() {
  return (
    <DemoScroller thumbAt={0.08}>
      <Inner />
    </DemoScroller>
  );
}
