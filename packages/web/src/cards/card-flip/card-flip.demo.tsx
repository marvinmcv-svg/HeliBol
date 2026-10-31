"use client";
import { CardFlip } from "./card-flip";
export default function Demo() {
  return (
    <div className="flex h-full w-full items-center justify-center gap-6 p-8">
      <CardFlip
        className="h-72 w-52"
        front={<div className="relative h-full"><img src="/demo/photo-2.jpg" alt="" className="h-full w-full object-cover" /><p className="absolute bottom-3 left-3 rounded-full bg-black/40 px-3 py-1 text-xs text-white backdrop-blur">Tap to flip ↻</p></div>}
        back={<div className="flex h-full flex-col justify-between bg-gradient-to-br from-indigo-600 to-violet-700 p-5 text-white"><p className="text-xs opacity-70">Indigo Ridge</p><p className="text-lg leading-snug font-semibold">“The mountains are calling, and the springs are tuned to 260/30.”</p><p className="text-xs opacity-70">Edition 02</p></div>}
      />
    </div>
  );
}
