"use client";
import { BgSilkLines } from "./bg-silk-lines";

export default function Demo() {
  return (
    <div className="relative grid h-full place-items-center overflow-hidden bg-[#0a0612] text-white">
      <BgSilkLines />
      <div className="relative text-center">
        <h3 className="text-4xl font-semibold tracking-tight sm:text-5xl">Woven in motion</h3>
        <p className="mt-2 text-sm text-white/60">Move your cursor to bend the silk</p>
      </div>
    </div>
  );
}
