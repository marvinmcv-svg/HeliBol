"use client";
import { photoAlt, photos } from "../../_demo";
import { CardExpandGallery } from "./card-expand-gallery";
export default function Demo() {
  return <div className="flex h-full w-full items-center p-6"><CardExpandGallery panels={photos.slice(0, 5).map((image, i) => ({ id: String(i), image, title: photoAlt[i], caption: "Procedural landscape · 2026" }))} /></div>;
}
