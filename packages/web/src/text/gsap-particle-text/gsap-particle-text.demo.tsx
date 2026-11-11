"use client";
import { GsapParticleText } from "./gsap-particle-text";

export default function Demo() {
  return (
    <div className="relative h-full w-full bg-[radial-gradient(70%_60%_at_50%_50%,rgba(76,29,149,0.35),transparent)]">
      <GsapParticleText className="h-full w-full" words={["KINETIK", "MOTION", "GSAP", "PLAY"]} />
      <p className="pointer-events-none absolute bottom-4 left-0 right-0 text-center text-xs text-muted-foreground">Move your cursor through the letters</p>
    </div>
  );
}
