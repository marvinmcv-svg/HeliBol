"use client";
import { ThreeShaderBlob } from "./three-shader-blob";

export default function Demo() {
  return (
    <div className="relative grid h-full w-full grid-cols-1 bg-[#070510] text-white md:grid-cols-2">
      <div className="relative z-10 flex flex-col justify-center gap-3 p-8">
        <p className="text-[10px] uppercase tracking-[0.3em] text-pink-300/80">Neural engine</p>
        <h3 className="text-3xl font-semibold leading-tight tracking-tight sm:text-4xl">Thinks in<br />shapes.</h3>
        <p className="max-w-xs text-sm text-white/60">Hover the sphere — the noise amplitude follows your pointer.</p>
      </div>
      <div className="absolute inset-0 md:relative">
        <ThreeShaderBlob />
      </div>
    </div>
  );
}
