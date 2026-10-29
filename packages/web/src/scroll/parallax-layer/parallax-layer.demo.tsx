"use client";
import { DemoScroller, photos, useDemoScroller } from "../../_demo";
import { ParallaxLayer } from "./parallax-layer";

function Scene() {
  const c = useDemoScroller() ?? undefined;
  return (
    <div className="relative px-6 pt-6 pb-[60cqh]">
      <div className="relative mx-auto h-[520px] max-w-3xl">
        <ParallaxLayer container={c} speed={80} className="absolute top-0 left-0 w-[46%]">
          <img src={photos[1]} alt="" className="aspect-[3/4] rounded-2xl object-cover shadow-2xl" />
        </ParallaxLayer>
        <ParallaxLayer container={c} speed={260} className="absolute top-24 right-0 w-[40%]">
          <img src={photos[5]} alt="" className="aspect-[3/4] rounded-2xl object-cover shadow-2xl" />
        </ParallaxLayer>
        <ParallaxLayer container={c} speed={-160} className="absolute top-[45%] left-[30%] z-10 w-[36%]">
          <div className="rounded-2xl border border-border bg-card/80 p-5 shadow-2xl backdrop-blur">
            <p className="text-xs uppercase tracking-widest text-muted-foreground">Depth</p>
            <p className="mt-1 text-xl font-semibold">Three layers, three speeds.</p>
          </div>
        </ParallaxLayer>
      </div>
    </div>
  );
}

export default function Demo() {
  return (
    <DemoScroller>
      <Scene />
    </DemoScroller>
  );
}
