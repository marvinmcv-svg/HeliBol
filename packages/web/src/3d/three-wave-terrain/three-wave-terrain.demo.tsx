"use client";
import { ThreeWaveTerrain } from "./three-wave-terrain";

export default function Demo() {
  return (
    <div className="relative h-full w-full bg-[#020617] text-white">
      <ThreeWaveTerrain />
      <div className="pointer-events-none absolute inset-x-0 top-8 text-center">
        <p className="text-[10px] uppercase tracking-[0.35em] text-teal-300/80">Signal field</p>
        <h3 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">Data that breathes.</h3>
        <p className="mt-1 text-sm text-white/50">Move to ripple · press to amplify</p>
      </div>
    </div>
  );
}
