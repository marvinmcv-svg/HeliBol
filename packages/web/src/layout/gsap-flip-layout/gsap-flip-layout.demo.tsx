"use client";
import { photoAlt, photos } from "../../_demo";
import { GsapFlipLayout } from "./gsap-flip-layout";

export default function Demo() {
  return (
    <div className="h-full w-full overflow-auto p-6">
      <GsapFlipLayout items={photos.slice(0, 6).map((p, i) => ({ id: `i${i}`, image: p, title: photoAlt[i], meta: `${12 + i * 7} photos · updated ${i + 1}d ago` }))} />
    </div>
  );
}
