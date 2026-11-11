"use client";
import { DemoCenter } from "../../_demo";
import { TextSmartAnimate } from "./text-smart-animate";

export default function Demo() {
  return (
    <DemoCenter className="flex-col gap-6">
      <TextSmartAnimate words={["Design", "Signed", "Deigns", "Singed"]} className="text-5xl font-semibold tracking-tight sm:text-6xl" />
      <p className="text-lg text-muted-foreground">
        Pay <TextSmartAnimate words={["$34.44", "$43.34", "$344.3"]} className="font-mono font-semibold text-foreground" interval={1800} /> today
      </p>
    </DemoCenter>
  );
}
