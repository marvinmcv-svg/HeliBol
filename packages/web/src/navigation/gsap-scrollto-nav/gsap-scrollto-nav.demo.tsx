"use client";
import { DemoScroller, useDemoScroller } from "../../_demo";
import { GsapScrollToNav } from "./gsap-scrollto-nav";

const lorem = "Motion should explain, not decorate. Every transition answers a question: where did this come from, where did it go, what changed? Keep durations short and let springs settle naturally.";
const sections = ["Introduction", "Installation", "Tokens", "Reduced motion", "Engines", "FAQ"].map((label, i) => ({
  id: `kn-sto-${i}`,
  label,
  content: (
    <>
      <h3 className="text-xl font-semibold tracking-tight">{label}</h3>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{lorem}</p>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{lorem}</p>
    </>
  ),
}));

function Inner() {
  const s = useDemoScroller() ?? undefined;
  return <GsapScrollToNav scroller={s} sections={sections} className="p-6" />;
}

export default function Demo() {
  return (
    <DemoScroller hint={false}>
      <Inner />
    </DemoScroller>
  );
}
