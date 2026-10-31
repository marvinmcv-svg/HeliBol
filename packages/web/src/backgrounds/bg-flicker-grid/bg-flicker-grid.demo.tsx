"use client";
import { BgFlickerGrid } from "./bg-flicker-grid";
export default function Demo() {
  return (
    <BgFlickerGrid className="flex h-full w-full flex-col items-center justify-center p-8 text-center">
      <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Status: operational</p>
      <h2 className="mt-2 text-4xl font-semibold tracking-tight">Infrastructure that hums.</h2>
    </BgFlickerGrid>
  );
}
