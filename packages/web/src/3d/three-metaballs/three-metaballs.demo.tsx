"use client";
import { ThreeMetaballs } from "./three-metaballs";

export default function Demo() {
  return (
    <div className="relative h-full w-full bg-[radial-gradient(circle_at_50%_45%,#1f1235,#07040d_70%)] text-white">
      <ThreeMetaballs />
      <div className="pointer-events-none absolute inset-x-0 bottom-6 text-center">
        <h3 className="text-2xl font-semibold tracking-tight">Liquid by nature</h3>
        <p className="text-sm text-white/55">Move your cursor to pull the blobs</p>
      </div>
    </div>
  );
}
