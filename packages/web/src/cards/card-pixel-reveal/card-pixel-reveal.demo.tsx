"use client";
import { CardPixelReveal } from "./card-pixel-reveal";
export default function Demo() {
  return (
    <div className="flex h-full w-full items-center justify-center gap-5 p-8">
      <CardPixelReveal image="/demo/photo-3.jpg" alt="Neon city" className="aspect-[4/3] w-64" />
      <CardPixelReveal image="/demo/photo-7.jpg" alt="Ocean" cols={8} rows={6} color="#7c3aed" className="aspect-[4/3] w-64" />
    </div>
  );
}
