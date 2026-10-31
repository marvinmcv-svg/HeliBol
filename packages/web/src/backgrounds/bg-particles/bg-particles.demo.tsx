"use client";
import { BgParticles } from "./bg-particles";
export default function Demo() {
  return (
    <BgParticles className="flex h-full w-full flex-col items-center justify-center p-8 text-center" color="167 139 250">
      <h2 className="text-4xl font-semibold tracking-tight">Everything is connected.</h2>
      <p className="mt-2 text-sm text-muted-foreground">Move your cursor through the network.</p>
    </BgParticles>
  );
}
