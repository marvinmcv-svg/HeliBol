"use client";
import { BgMeteors } from "./bg-meteors";

export default function Demo() {
  return (
    <div className="h-full w-full bg-[radial-gradient(ellipse_at_top,#1e1b4b,#020617_70%)] p-6">
      <BgMeteors className="flex h-full flex-col items-center justify-center gap-2 rounded-3xl border border-white/10 text-center text-white">
        <p className="text-xs uppercase tracking-[0.3em] text-white/50">Launch week</p>
        <h2 className="text-3xl font-semibold">Something is coming.</h2>
      </BgMeteors>
    </div>
  );
}
