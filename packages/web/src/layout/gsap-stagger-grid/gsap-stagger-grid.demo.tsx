"use client";
import { GsapStaggerGrid } from "./gsap-stagger-grid";

export default function Demo() {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-4 p-6">
      <GsapStaggerGrid className="w-full max-w-lg" />
      <p className="text-xs text-muted-foreground">Click any dot to send a ripple</p>
    </div>
  );
}
