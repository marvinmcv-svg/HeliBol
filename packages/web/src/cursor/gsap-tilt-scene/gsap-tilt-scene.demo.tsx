"use client";
import { photos } from "../../_demo";
import { GsapTiltScene } from "./gsap-tilt-scene";

export default function Demo() {
  return (
    <div className="grid h-full w-full place-items-center p-6">
      <GsapTiltScene className="h-[300px] w-full max-w-[520px]">
        <div data-depth="0" className="absolute inset-0 overflow-hidden rounded-3xl border border-border bg-card shadow-2xl [transform-style:preserve-3d]">
          <img src={photos[5]} alt="" className="h-full w-full object-cover opacity-80" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
        </div>
        <div data-depth="2" className="absolute bottom-6 left-6 text-white">
          <p className="text-[10px] uppercase tracking-[0.3em] opacity-70">Expedition 07</p>
          <h3 className="text-3xl font-semibold tracking-tight">Aurora Borealis</h3>
        </div>
        <div data-depth="4" className="absolute right-5 top-5 rounded-full bg-white px-3 py-1 text-xs font-semibold text-black shadow-lg">Live now</div>
        <div data-depth="3" className="absolute -left-6 top-10 w-40 rounded-2xl border border-white/20 bg-black/50 p-3 text-xs text-white shadow-xl backdrop-blur">
          <p className="opacity-60">Kp-index</p>
          <p className="text-2xl font-semibold">6.3</p>
          <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/20"><div className="h-full w-3/4 rounded-full bg-emerald-400" /></div>
        </div>
        <div data-depth="5" className="absolute -right-4 bottom-10 size-16 rounded-2xl bg-gradient-to-br from-fuchsia-500 to-violet-600 shadow-xl" />
      </GsapTiltScene>
    </div>
  );
}
