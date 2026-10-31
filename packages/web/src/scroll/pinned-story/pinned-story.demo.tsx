"use client";
import { DemoScroller, photos, useDemoScroller } from "../../_demo";
import { PinnedStory } from "./pinned-story";
function Inner() {
  const c = useDemoScroller() ?? undefined;
  const v = (n: number) => <img src={photos[n]} alt="" className="h-full w-full object-cover" />;
  return (
    <div className="py-[15cqh]">
      <PinnedStory container={c} steps={[
        { title: "Design once", body: "Define springs and easings as tokens.", visual: v(0) },
        { title: "Animate anywhere", body: "The same physics on web and native.", visual: v(5) },
        { title: "Ship with confidence", body: "Reduced-motion fallbacks are built in.", visual: v(3) },
      ]} />
    </div>
  );
}
export default function Demo() {
  return <DemoScroller><Inner /></DemoScroller>;
}
