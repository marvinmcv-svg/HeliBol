"use client";
import { BgGravityStars } from "./bg-gravity-stars";

export default function Demo() {
  return (
    <div className="relative grid h-full place-items-center overflow-hidden bg-[radial-gradient(ellipse_at_bottom,#1e1b4b,#020617_70%)] text-white">
      <BgGravityStars />
      <div className="pointer-events-none relative text-center">
        <h3 className="text-4xl font-semibold tracking-tight">Pull the night sky</h3>
        <p className="mt-2 text-sm text-white/60">Move your cursor through the stars</p>
      </div>
    </div>
  );
}
