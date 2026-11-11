"use client";
import { photoAlt, photos } from "../../_demo";
import { GsapFlipFilter } from "./gsap-flip-filter";

const tagsFor = ["Warm", "Cool", "Night", "Green", "Warm", "Night", "Cool", "Warm"];

export default function Demo() {
  const items = [...photos, ...photos.slice(0, 4)].map((p, i) => ({
    id: `p${i}`,
    tags: [tagsFor[i % 8], i % 3 === 0 ? "Featured" : "Archive"],
    node: (
      <figure className="overflow-hidden rounded-xl border border-border bg-card">
        <img src={p} alt={photoAlt[i % 8]} className="aspect-square w-full object-cover" />
        <figcaption className="truncate px-2 py-1.5 text-[11px] text-muted-foreground">{tagsFor[i % 8]} · {photoAlt[i % 8]}</figcaption>
      </figure>
    ),
  }));
  return (
    <div className="h-full w-full overflow-auto p-6">
      <GsapFlipFilter items={items} filters={["Warm", "Cool", "Night", "Green", "Featured"]} />
    </div>
  );
}
