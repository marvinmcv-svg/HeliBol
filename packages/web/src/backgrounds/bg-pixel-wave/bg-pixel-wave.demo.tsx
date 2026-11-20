"use client";
import { BgPixelWave } from "./bg-pixel-wave";

export default function Demo() {
  return (
    <BgPixelWave className="h-full">
      <div className="pointer-events-none grid h-full place-items-center p-6 text-center text-white">
        <div>
          <p className="text-[10px] uppercase tracking-[0.35em] text-white/60">Signal</p>
          <h3 className="mt-2 text-5xl font-semibold tracking-tight [text-shadow:0_2px_30px_rgb(0_0_0/.8)]">Every pixel listens</h3>
          <p className="mt-2 text-sm text-white/60">Click anywhere to drop a ripple</p>
        </div>
      </div>
    </BgPixelWave>
  );
}
