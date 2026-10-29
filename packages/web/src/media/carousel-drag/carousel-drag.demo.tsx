"use client";
import { photoAlt, photos } from "../../_demo";
import { CarouselDrag } from "./carousel-drag";

export default function Demo() {
  return (
    <div className="flex h-full w-full items-center p-6">
      <CarouselDrag
        className="w-full"
        slideWidth={0.7}
        items={photos.map((p, i) => (
          <figure key={p} className="relative overflow-hidden rounded-3xl">
            <img src={p} alt={photoAlt[i]} draggable={false} className="aspect-[16/9] w-full object-cover" />
            <figcaption className="absolute bottom-3 left-3 rounded-full bg-black/40 px-3 py-1 text-xs text-white backdrop-blur">{photoAlt[i]}</figcaption>
          </figure>
        ))}
      />
    </div>
  );
}
