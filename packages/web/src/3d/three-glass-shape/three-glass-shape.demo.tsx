"use client";
import { useState } from "react";
import { ThreeGlassShape, type GlassGeometry } from "./three-glass-shape";

const shapes: GlassGeometry[] = ["icosahedron", "knot", "torus", "octahedron"];

export default function Demo() {
  const [shape, setShape] = useState<GlassGeometry>("icosahedron");
  const [faceted, setFaceted] = useState(true);
  return (
    <div className="relative h-full w-full bg-[#0b0a12] text-white">
      <ThreeGlassShape geometry={shape} faceted={faceted} />
      <div className="absolute inset-x-0 bottom-4 flex flex-wrap justify-center gap-1.5 px-4 text-xs">
        {shapes.map((s) => (
          <button key={s} onClick={() => setShape(s)} className={`rounded-full border px-3 py-1 capitalize backdrop-blur ${s === shape ? "border-white bg-white text-black" : "border-white/20 bg-white/5"}`}>{s}</button>
        ))}
        <button onClick={() => setFaceted((f) => !f)} aria-pressed={faceted} className="rounded-full border border-white/20 bg-white/5 px-3 py-1 backdrop-blur">{faceted ? "Faceted" : "Smooth"}</button>
      </div>
    </div>
  );
}
