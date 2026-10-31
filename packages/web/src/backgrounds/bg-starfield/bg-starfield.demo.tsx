"use client";
import { useState } from "react";
import { BgStarfield } from "./bg-starfield";
export default function Demo() {
  const [boost, setBoost] = useState(false);
  return (
    <BgStarfield speed={boost ? 2.4 : 0.5} className="flex h-full w-full flex-col items-center justify-center gap-5 text-center text-white">
      <h2 className="text-4xl font-semibold tracking-tight">Lightspeed deploys</h2>
      <button onPointerEnter={() => setBoost(true)} onPointerLeave={() => setBoost(false)} onFocus={() => setBoost(true)} onBlur={() => setBoost(false)} className="rounded-full bg-white px-5 py-2 text-sm font-medium text-black">Hover to engage warp</button>
    </BgStarfield>
  );
}
