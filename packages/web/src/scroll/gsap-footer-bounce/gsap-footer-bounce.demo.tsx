"use client";
import { DemoScroller, useDemoScroller } from "../../_demo";
import { GsapFooterBounce } from "./gsap-footer-bounce";

function Inner() {
  const s = useDemoScroller() ?? undefined;
  return (
    <>
      <div className="space-y-4 px-6 pb-32 pt-8">
        <h3 className="text-3xl font-semibold tracking-tight">Fling it to the bottom ↓</h3>
        {Array.from({ length: 6 }, (_, i) => (
          <div key={i} className="h-24 rounded-xl border border-border bg-card" />
        ))}
      </div>
      <GsapFooterBounce scroller={s} color="#8b5cf6">
        <div className="grid gap-6 px-6 py-10 text-white sm:grid-cols-3">
          <div>
            <p className="text-2xl font-semibold tracking-tight">kinetik</p>
            <p className="mt-1 text-sm opacity-80">Motion for every surface.</p>
          </div>
          <ul className="space-y-1 text-sm opacity-90"><li>Components</li><li>Blocks</li><li>Flows</li></ul>
          <ul className="space-y-1 text-sm opacity-90"><li>GitHub</li><li>Changelog</li><li>Contact</li></ul>
        </div>
      </GsapFooterBounce>
    </>
  );
}

export default function Demo() {
  return (
    <DemoScroller thumbAt={1}>
      <Inner />
    </DemoScroller>
  );
}
