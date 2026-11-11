"use client";
import { ThreeGalaxy } from "./three-galaxy";

export default function Demo() {
  return (
    <div className="relative h-full w-full bg-black text-white">
      <ThreeGalaxy />
      <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-end pb-8 text-center">
        <h3 className="text-3xl font-semibold tracking-tight [text-shadow:0_2px_24px_rgb(0_0_0)]">40,000 stars, one draw call</h3>
        <p className="mt-1 text-sm text-white/60">Move your pointer to drift the camera.</p>
      </div>
    </div>
  );
}
