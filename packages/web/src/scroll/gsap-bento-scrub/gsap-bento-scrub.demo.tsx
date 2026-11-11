"use client";
import { DemoScroller, photos, useDemoScroller } from "../../_demo";
import { GsapBentoScrub } from "./gsap-bento-scrub";

function Inner() {
  const s = useDemoScroller() ?? undefined;
  return (
    <>
      <GsapBentoScrub scroller={s} images={[photos[5], photos[0], photos[1], photos[2], photos[3], photos[4], photos[6]]} />
      <div className="grid h-[50cqh] place-items-center text-sm text-muted-foreground">Scroll back up to rewind.</div>
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
