"use client";
import { SliderElastic } from "./slider-elastic";
export default function Demo() {
  return <div className="flex h-full w-full flex-col items-center justify-center gap-8 p-6"><SliderElastic /><SliderElastic label="Brightness" defaultValue={72} /><p className="text-xs text-muted-foreground">Drag past either end ↔</p></div>;
}
