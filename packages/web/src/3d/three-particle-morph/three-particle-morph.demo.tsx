"use client";
import { useState } from "react";
import { ThreeParticleMorph, type MorphShape } from "./three-particle-morph";

const shapes: MorphShape[] = ["sphere", "torus", "helix", "cube", "wave"];

export default function Demo() {
  const [i, setI] = useState(0);
  return (
    <div className="relative h-full w-full bg-[radial-gradient(circle_at_50%_45%,rgb(124_58_237/.25),#05010d_70%)] text-white">
      <ThreeParticleMorph shapes={shapes} onShapeChange={setI} />
      <div className="pointer-events-none absolute inset-x-0 bottom-5 flex justify-center gap-2 text-[11px] uppercase tracking-[0.2em]">
        {shapes.map((s, n) => (
          <span key={s} className={n === i ? "rounded-full bg-white px-2.5 py-1 text-black" : "px-2.5 py-1 opacity-50"}>{s}</span>
        ))}
      </div>
    </div>
  );
}
