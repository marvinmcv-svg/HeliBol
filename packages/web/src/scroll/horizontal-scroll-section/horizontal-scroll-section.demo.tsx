"use client";
import { DemoScroller, photoAlt, photos, useDemoScroller } from "../../_demo";
import { HorizontalScrollSection } from "./horizontal-scroll-section";

function Inner() {
  const s = useDemoScroller() ?? undefined;
  return (
    <div>
      <div className="flex h-[60cqh] flex-col justify-end px-6 pb-6">
        <p className="text-xs uppercase tracking-widest text-muted-foreground">Selected work</p>
        <h3 className="text-3xl font-semibold tracking-tight">Scroll down, move sideways →</h3>
      </div>
      <HorizontalScrollSection scroller={s} length={3}>
        {photos.map((p, i) => (
          <figure key={p} className="w-[62vw] max-w-[360px] shrink-0">
            <img src={p} alt="" className="aspect-[4/5] w-full rounded-2xl object-cover shadow-xl" />
            <figcaption className="mt-2 flex justify-between text-sm"><span>{photoAlt[i]}</span><span className="text-muted-foreground">0{i + 1}</span></figcaption>
          </figure>
        ))}
      </HorizontalScrollSection>
      <div className="grid h-[60cqh] place-items-center text-sm text-muted-foreground">The end.</div>
    </div>
  );
}

export default function Demo() {
  return (
    <DemoScroller>
      <Inner />
    </DemoScroller>
  );
}
