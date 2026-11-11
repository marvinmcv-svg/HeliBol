"use client";
import { photoAlt, photos } from "../../_demo";
import { GsapFlipModal } from "./gsap-flip-modal";

export default function Demo() {
  return (
    <div className="h-full w-full p-6">
      <p className="mb-3 text-xs uppercase tracking-[0.25em] text-muted-foreground">Gallery — click any print</p>
      <GsapFlipModal
        className="h-[calc(100%-2rem)]"
        items={photos.map((p, i) => ({ id: `m${i}`, image: p, title: photoAlt[i], body: "Giclée print on 310gsm cotton rag. The same image node flies from the grid into this dialog — and back home when you close it." }))}
      />
    </div>
  );
}
