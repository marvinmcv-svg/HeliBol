"use client";
import { DemoCenter } from "../../_demo";
import { TextGravityHover } from "./text-gravity-hover";

export default function Demo() {
  return (
    <DemoCenter className="flex-col gap-2 pb-24 text-center">
      <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Hover the letters</p>
      <TextGravityHover text="Loose Type" className="text-6xl font-black tracking-tight" />
    </DemoCenter>
  );
}
