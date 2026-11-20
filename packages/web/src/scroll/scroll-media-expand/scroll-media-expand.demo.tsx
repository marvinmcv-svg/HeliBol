"use client";
import { DemoScroller, photos, useDemoScroller } from "../../_demo";
import { ScrollMediaExpand } from "./scroll-media-expand";

function Inner() {
  const s = useDemoScroller() ?? undefined;
  return (
    <ScrollMediaExpand container={s} image={photos[4]!} title={["Into", "the wild"]}>
      <p className="text-[10px] uppercase tracking-[0.3em] opacity-70">Episode 04</p>
      <p className="mt-1 text-2xl font-semibold">A season above the treeline</p>
    </ScrollMediaExpand>
  );
}

export default function Demo() {
  return (
    <DemoScroller thumbAt={0.18}>
      <Inner />
    </DemoScroller>
  );
}
