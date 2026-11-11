"use client";
import { ThreeOrbitSphere } from "./three-orbit-sphere";

export default function Demo() {
  return (
    <div className="relative h-full w-full bg-[radial-gradient(circle_at_50%_50%,#1c1917,#0a0a0a_70%)] text-white">
      <ThreeOrbitSphere />
      <div className="pointer-events-none absolute left-6 top-6 space-y-1">
        <p className="text-[10px] uppercase tracking-[0.3em] text-orange-400">Live coverage</p>
        <p className="text-4xl font-semibold tabular-nums tracking-tight">312<span className="text-white/40"> nodes</span></p>
      </div>
    </div>
  );
}
