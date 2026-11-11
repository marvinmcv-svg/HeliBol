"use client";
import { DemoScroller, useDemoScroller } from "../../_demo";
import { GsapShaderScroll } from "./gsap-shader-scroll";

const panel = (k: string, t: string) => (
  <div>
    <p className="text-[10px] uppercase tracking-[0.35em] opacity-70">{k}</p>
    <h3 className="mt-2 text-4xl font-semibold tracking-tight [text-shadow:0_2px_30px_rgb(0_0_0/.4)]">{t}</h3>
  </div>
);

function Inner() {
  const s = useDemoScroller() ?? undefined;
  return <GsapShaderScroll scroller={s} panels={[panel("01 · Dream", "Ideas start as noise."), panel("02 · Shape", "Give them direction."), panel("03 · Ship", "Turn heat into product."), panel("04 · Repeat", "Then do it again.")]} />;
}

export default function Demo() {
  return (
    <DemoScroller thumbAt={0.35}>
      <Inner />
    </DemoScroller>
  );
}
