"use client";
import { DemoScroller, photoAlt, photos } from "../../_demo";
import { ImageRevealMask } from "./image-reveal-mask";

export default function Demo() {
  const dirs = ["up", "left", "center", "up"] as const;
  return (
    <DemoScroller>
      <div className="grid grid-cols-2 gap-4 p-6 pt-2 pb-24">
        {photos.slice(0, 8).map((p, i) => (
          <ImageRevealMask key={p} src={p} alt={photoAlt[i]} direction={dirs[i % 4]} delay={(i % 2) * 0.12} className={`rounded-2xl ${i % 3 === 0 ? "aspect-[3/4]" : "aspect-square"}`} />
        ))}
      </div>
    </DemoScroller>
  );
}
