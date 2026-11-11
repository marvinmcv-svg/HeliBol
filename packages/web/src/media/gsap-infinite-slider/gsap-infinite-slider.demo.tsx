"use client";
import { photoAlt, photos } from "../../_demo";
import { GsapInfiniteSlider } from "./gsap-infinite-slider";

export default function Demo() {
  return (
    <GsapInfiniteSlider
      itemWidth={220}
      autoplay={3}
      slides={photos.map((p, i) => (
        <figure key={p} className="overflow-hidden rounded-2xl border border-border bg-card shadow-xl">
          <img src={p} alt={photoAlt[i]} draggable={false} className="aspect-[4/5] w-full object-cover" />
          <figcaption className="flex justify-between px-3 py-2 text-xs">
            <span>{photoAlt[i]}</span>
            <span className="text-muted-foreground">0{i + 1}</span>
          </figcaption>
        </figure>
      ))}
    />
  );
}
