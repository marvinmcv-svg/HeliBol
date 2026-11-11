"use client";
import { ThreeInstancedGrid } from "./three-instanced-grid";

export default function Demo() {
  return (
    <div className="relative h-full w-full bg-[#09090b] text-white">
      <ThreeInstancedGrid />
      <div className="pointer-events-none absolute left-6 top-6">
        <p className="text-[10px] uppercase tracking-[0.3em] text-lime-300">1,296 pillars · 1 draw call</p>
        <h3 className="mt-1 text-2xl font-semibold tracking-tight">Hover the field</h3>
      </div>
    </div>
  );
}
