"use client";
import { BgBoxes } from "./bg-boxes";
export default function Demo() {
  return (
    <BgBoxes className="flex h-full w-full flex-col items-center justify-center p-8 text-center">
      <h2 className="text-4xl font-semibold tracking-tight">Paint with your cursor</h2>
      <p className="mt-2 text-sm text-muted-foreground">Sweep across the grid.</p>
    </BgBoxes>
  );
}
