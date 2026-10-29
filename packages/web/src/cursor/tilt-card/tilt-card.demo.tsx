"use client";
import { TiltCard } from "./tilt-card";

export default function Demo() {
  return (
    <div className="flex h-full w-full items-center justify-center p-8">
      <TiltCard className="w-64 rounded-3xl">
        <div className="overflow-hidden rounded-3xl bg-gradient-to-br from-zinc-900 to-zinc-700 p-1 shadow-2xl">
          <img src="/demo/photo-3.jpg" alt="" className="aspect-[4/5] w-full rounded-[1.3rem] object-cover" />
          <div className="flex items-center justify-between px-3 py-3 text-white [transform:translateZ(30px)]">
            <div><p className="text-xs opacity-60">Edition 03</p><p className="text-sm font-semibold">Neon City</p></div>
            <span className="rounded-full bg-white/15 px-2.5 py-1 text-xs">#042</span>
          </div>
        </div>
      </TiltCard>
    </div>
  );
}
