"use client";
import { DemoCenter } from "../../_demo";
import { GsapKeyframesLoader } from "./gsap-keyframes-loader";

export default function Demo() {
  return (
    <DemoCenter className="flex-col gap-6">
      <GsapKeyframesLoader size={22} />
      <p className="text-sm text-muted-foreground">Preparing your workspace…</p>
    </DemoCenter>
  );
}
