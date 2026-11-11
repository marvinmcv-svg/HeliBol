"use client";
import { photos } from "../../_demo";
import { ThreeImageRibbon } from "./three-image-ribbon";

export default function Demo() {
  return (
    <div className="relative h-full w-full bg-[#f5f1ea] text-zinc-900">
      <div className="pointer-events-none absolute inset-0 grid place-items-center">
        <h3 className="text-[clamp(3rem,12vw,8rem)] font-black uppercase leading-none tracking-tighter opacity-90">Selected</h3>
      </div>
      <ThreeImageRibbon images={photos} />
      <p className="pointer-events-none absolute inset-x-0 bottom-4 text-center text-xs text-zinc-500">Scroll or drag to spin</p>
    </div>
  );
}
