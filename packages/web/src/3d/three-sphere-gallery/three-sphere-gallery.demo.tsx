"use client";
import { photos } from "../../_demo";
import { ThreeSphereGallery } from "./three-sphere-gallery";

export default function Demo() {
  return (
    <div className="relative h-full w-full bg-[#05050a] text-white">
      <ThreeSphereGallery images={photos} />
      <div className="pointer-events-none absolute inset-x-0 top-6 text-center">
        <p className="text-[10px] uppercase tracking-[0.3em] opacity-60">Archive · 48 frames</p>
        <h3 className="mt-1 text-2xl font-semibold tracking-tight">Drag the world</h3>
      </div>
    </div>
  );
}
