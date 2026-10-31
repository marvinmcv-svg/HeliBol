"use client";
import { BgDotGlow } from "./bg-dot-glow";
export default function Demo() {
  return (
    <BgDotGlow className="flex h-full w-full flex-col items-center justify-center p-8 text-center">
      <h2 className="text-4xl font-semibold tracking-tight">Signal in the noise.</h2>
      <p className="mt-2 text-sm text-muted-foreground">Hover the dot matrix.</p>
    </BgDotGlow>
  );
}
