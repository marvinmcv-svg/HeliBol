"use client";
import { DemoScroller, useDemoScroller } from "../../_demo";
import { HeroScrollTilt } from "./hero-scroll-tilt";
function Inner() {
  const c = useDemoScroller() ?? undefined;
  return (
    <HeroScrollTilt container={c} title={<><p className="text-sm text-muted-foreground">Unleash the power of</p><h1 className="text-5xl font-bold tracking-tight">Scroll Animations</h1></>}>
      <img src="/demo/photo-1.jpg" alt="Product screenshot" className="aspect-[16/9] w-full object-cover" />
    </HeroScrollTilt>
  );
}
export default function Demo() {
  return <DemoScroller><Inner /></DemoScroller>;
}
