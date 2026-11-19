"use client";
import { photos } from "../../_demo";
import { ImageAccordion } from "./image-accordion";

const items = [
  { image: photos[1], kicker: "01 · Alps", title: "Indigo ridge", body: "Six days above the clouds on the Haute Route." },
  { image: photos[3], kicker: "02 · Borneo", title: "Emerald canopy", body: "Walking the treetops before sunrise." },
  { image: photos[4], kicker: "03 · Utah", title: "Amber road", body: "Four hundred miles of nothing, in the best way." },
  { image: photos[5], kicker: "04 · Lofoten", title: "Violet sky", body: "Aurora season from a fisherman's cabin." },
  { image: photos[6], kicker: "05 · Azores", title: "Ocean glass", body: "Swimming with the morning light." },
];

export default function Demo() {
  return (
    <div className="h-full p-4">
      <ImageAccordion items={items} defaultIndex={1} />
    </div>
  );
}
