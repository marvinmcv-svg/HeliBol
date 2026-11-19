"use client";
import { DemoScroller, photos, useDemoScroller } from "../../_demo";
import { ScrollZoomParallax } from "./scroll-zoom-parallax";

function Inner() {
  const s = useDemoScroller() ?? undefined;
  return (
    <>
      <ScrollZoomParallax container={s} images={[photos[5], photos[0], photos[2], photos[3], photos[6], photos[1], photos[7]]} />
      <div className="grid h-[60cqh] place-items-center text-sm text-muted-foreground">The centre photo became the page.</div>
    </>
  );
}

export default function Demo() {
  return (
    <DemoScroller thumbAt={0.18}>
      <Inner />
    </DemoScroller>
  );
}
