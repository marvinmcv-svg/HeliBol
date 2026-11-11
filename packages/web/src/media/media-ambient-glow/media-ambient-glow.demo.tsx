"use client";
import { useState } from "react";
import { photoAlt, photos } from "../../_demo";
import { MediaAmbientGlow } from "./media-ambient-glow";

export default function Demo() {
  const [i, setI] = useState(5);
  return (
    <div className="flex h-full flex-col items-center justify-center gap-6 bg-zinc-950 p-8 text-white">
      <MediaAmbientGlow key={i} src={photos[i]} className="aspect-video w-full max-w-md" />
      <div className="flex gap-2" role="group" aria-label="Choose image">
        {photos.map((p, n) => (
          <button key={p} onClick={() => setI(n)} aria-label={photoAlt[n]} aria-pressed={n === i} className={`size-9 overflow-hidden rounded-lg ring-2 transition ${n === i ? "ring-white" : "ring-transparent opacity-60 hover:opacity-100"}`}>
            <img src={p} alt="" className="size-full object-cover" />
          </button>
        ))}
      </div>
    </div>
  );
}
