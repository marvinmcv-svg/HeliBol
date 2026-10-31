"use client";
import { TextVariableProximity } from "./text-variable-proximity";

export default function Demo() {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-3 p-8 text-center">
      <TextVariableProximity className="text-6xl tracking-tight sm:text-7xl">Variable weight</TextVariableProximity>
      <p className="text-xs text-muted-foreground">Move your cursor across the letters (uses Geist&apos;s variable weight axis)</p>
    </div>
  );
}
