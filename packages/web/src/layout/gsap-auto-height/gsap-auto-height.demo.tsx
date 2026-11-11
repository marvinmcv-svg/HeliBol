"use client";
import { GsapAutoHeight } from "./gsap-auto-height";

const items = [
  { title: "What does “auto height” mean here?", content: "GSAP measures the panel's natural height and tweens to it, so content of any length opens smoothly — no max-height hacks." },
  { title: "Why one timeline per panel?", content: "Play opens, reverse closes. Click twice quickly and the animation turns around mid-flight from wherever it is." },
  { title: "Is it accessible?", content: <>Buttons expose <code>aria-expanded</code> and control a labelled region; closed panels are <code>inert</code> so their links can't be tabbed into.</> },
  { title: "Reduced motion?", content: "Durations drop to zero — panels open instantly." },
];

export default function Demo() {
  return (
    <div className="grid h-full place-items-center p-6">
      <GsapAutoHeight items={items} className="max-w-md" />
    </div>
  );
}
