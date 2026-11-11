"use client";
import { photos } from "../../_demo";
import { GsapHoverPreview } from "./gsap-hover-preview";

const items = [
  { title: "Northern Lights", meta: "Brand · 2026", image: photos[5] },
  { title: "Desert Road", meta: "Campaign · 2025", image: photos[4] },
  { title: "Glass Ocean", meta: "Web · 2025", image: photos[6] },
  { title: "Neon District", meta: "Motion · 2024", image: photos[2] },
];

export default function Demo() {
  return (
    <div className="flex h-full w-full flex-col justify-center p-8 sm:p-12">
      <p className="mb-4 text-xs uppercase tracking-[0.25em] text-muted-foreground">Selected work — hover a row</p>
      <GsapHoverPreview items={items} />
    </div>
  );
}
