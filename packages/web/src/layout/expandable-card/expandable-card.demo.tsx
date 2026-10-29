"use client";
import { photoAlt, photos } from "../../_demo";
import { ExpandableCards } from "./expandable-card";

const items = [0, 2, 5, 6].map((i) => ({
  id: String(i),
  title: photoAlt[i],
  subtitle: ["Lumen Studio", "Night Drive", "Polar Lab", "Tidal"][i % 4],
  image: photos[i],
  content: "The card's image, title and subtitle travel into the dialog with shared layout animations, while the body fades in after the morph. Esc, the close button or the backdrop dismiss it and focus returns to the card you opened.",
}));

export default function Demo() {
  return (
    <div className="flex h-full w-full items-center justify-center p-6">
      <ExpandableCards items={items} className="w-full max-w-sm" />
    </div>
  );
}
