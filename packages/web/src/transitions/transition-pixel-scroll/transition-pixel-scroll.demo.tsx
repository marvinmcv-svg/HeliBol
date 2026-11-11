"use client";
import { DemoScroller, photos, useDemoScroller } from "../../_demo";
import { TransitionPixelScroll } from "./transition-pixel-scroll";

function Inner() {
  const s = useDemoScroller() ?? undefined;
  return (
    <TransitionPixelScroll
      scroller={s}
      color="#0a0a0a"
      from={
        <div className="relative grid size-full place-items-center bg-[#f5f1ea] text-zinc-900">
          <h3 className="text-5xl font-black tracking-tighter">Chapter one</h3>
        </div>
      }
      to={
        <div className="relative grid size-full place-items-center text-white">
          <img src={photos[2]} alt="" className="absolute inset-0 size-full object-cover" />
          <h3 className="relative text-5xl font-black tracking-tighter">Chapter two</h3>
        </div>
      }
    />
  );
}

export default function Demo() {
  return (
    <DemoScroller thumbAt={0.3}>
      <Inner />
    </DemoScroller>
  );
}
