"use client";
import { CardHolo } from "./card-holo";
export default function Demo() {
  return (
    <div className="flex h-full w-full items-center justify-center p-8">
      <CardHolo className="w-60 bg-zinc-900 p-2 shadow-2xl">
        <img src="/demo/photo-6.jpg" alt="" className="aspect-[3/4] w-full rounded-xl object-cover" />
        <div className="flex items-center justify-between px-2 py-3 text-white"><div><p className="text-[10px] tracking-widest opacity-60">RARE · FOIL</p><p className="font-semibold">Violet Aurora</p></div><span className="font-mono text-xs opacity-70">#07/50</span></div>
      </CardHolo>
    </div>
  );
}
