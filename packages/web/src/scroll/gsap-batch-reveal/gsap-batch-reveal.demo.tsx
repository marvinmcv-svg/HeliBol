"use client";
import { DemoScroller, photoAlt, photos, useDemoScroller } from "../../_demo";
import { GsapBatchReveal } from "./gsap-batch-reveal";

const prices = ["$48", "$64", "$32", "$90", "$56", "$72", "$40", "$84"];

function Inner() {
  const s = useDemoScroller() ?? undefined;
  return (
    <div className="px-5 pb-16 pt-8">
      <h3 className="mb-6 text-3xl font-semibold tracking-tight">Print shop</h3>
      <GsapBatchReveal scroller={s} className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {Array.from({ length: 24 }, (_, i) => (
          <article key={i} data-batch className="overflow-hidden rounded-xl border border-border bg-card">
            <img src={photos[i % 8]} alt="" className="aspect-square w-full object-cover" />
            <div className="flex items-center justify-between p-2.5 text-xs">
              <span className="truncate">{photoAlt[i % 8]}</span>
              <span className="font-semibold">{prices[i % 8]}</span>
            </div>
          </article>
        ))}
      </GsapBatchReveal>
    </div>
  );
}

export default function Demo() {
  return (
    <DemoScroller thumbAt={0.06}>
      <Inner />
    </DemoScroller>
  );
}
