"use client";
import { useState } from "react";
import { ThreeHologram, type HologramShape } from "./three-hologram";

const shapes: HologramShape[] = ["knot", "head", "ring", "crystal"];

export default function Demo() {
  const [shape, setShape] = useState<HologramShape>("knot");
  return (
    <div className="relative h-full w-full bg-[radial-gradient(ellipse_at_bottom,#0c2b36,#020608_70%)] text-cyan-100">
      <ThreeHologram shape={shape} />
      <div className="absolute left-5 top-5 font-mono text-[11px] uppercase tracking-widest text-cyan-300/80">Projection · {shape}</div>
      <div className="absolute inset-x-0 bottom-4 flex justify-center gap-1.5">
        {shapes.map((s) => (
          <button key={s} onClick={() => setShape(s)} aria-pressed={s === shape} className={`rounded-full border px-3 py-1 font-mono text-xs capitalize ${s === shape ? "border-cyan-300 bg-cyan-300/15" : "border-cyan-300/20 text-cyan-100/60"}`}>{s}</button>
        ))}
      </div>
    </div>
  );
}
