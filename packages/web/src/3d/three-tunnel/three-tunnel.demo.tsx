"use client";
import { ThreeTunnel } from "./three-tunnel";

export default function Demo() {
  return (
    <div className="relative h-full w-full bg-black text-white">
      <ThreeTunnel />
      <div className="pointer-events-none absolute inset-0 grid place-items-center text-center">
        <div>
          <p className="text-[10px] uppercase tracking-[0.4em] text-fuchsia-300">Entering</p>
          <h3 className="text-4xl font-black uppercase tracking-tight sm:text-6xl">Hyperspace</h3>
        </div>
      </div>
    </div>
  );
}
