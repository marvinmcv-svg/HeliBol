"use client";
import { ThreeFloatingShapes } from "./three-floating-shapes";

export default function Demo() {
  return (
    <div className="relative h-full w-full bg-[#fdf2f8] text-zinc-900">
      <ThreeFloatingShapes />
      <div className="pointer-events-none absolute inset-0 grid place-items-center text-center">
        <div className="rounded-3xl bg-white/60 px-6 py-4 backdrop-blur-md">
          <h3 className="text-3xl font-black tracking-tight sm:text-5xl">Make it playful.</h3>
          <p className="mt-1 text-sm text-zinc-600">Hover a shape · move to tilt the scene</p>
        </div>
      </div>
    </div>
  );
}
