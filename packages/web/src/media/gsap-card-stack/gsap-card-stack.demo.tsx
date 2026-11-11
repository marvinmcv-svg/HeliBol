"use client";
import { photoAlt, photos } from "../../_demo";
import { GsapCardStack } from "./gsap-card-stack";

export default function Demo() {
  return (
    <div className="grid h-full w-full place-items-center p-6 pt-14">
      <GsapCardStack
        cards={photos.slice(0, 6).map((p, i) => (
          <figure key={p} className="h-full overflow-hidden rounded-3xl border border-white/10 bg-card shadow-2xl">
            <img src={p} alt={photoAlt[i]} draggable={false} className="h-[78%] w-full object-cover" />
            <figcaption className="p-3">
              <p className="text-sm font-semibold">{photoAlt[i]}</p>
              <p className="text-xs text-muted-foreground">Print · 30×40 cm</p>
            </figcaption>
          </figure>
        ))}
      />
    </div>
  );
}
