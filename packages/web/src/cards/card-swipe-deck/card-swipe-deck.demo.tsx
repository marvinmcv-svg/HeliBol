"use client";
import { photoAlt, photos } from "../../_demo";
import { CardSwipeDeck } from "./card-swipe-deck";
export default function Demo() {
  const cards = photos.slice(0, 6).map((p, i) => ({
    id: String(i),
    content: (
      <div className="relative h-full overflow-hidden rounded-3xl shadow-xl">
        <img src={p} alt="" draggable={false} className="h-full w-full object-cover" />
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 p-4 text-white"><p className="font-semibold">{photoAlt[i]}</p><p className="text-xs opacity-75">2 km away</p></div>
      </div>
    ),
  }));
  return <div className="flex h-full w-full items-center justify-center p-6"><CardSwipeDeck cards={cards} /></div>;
}
