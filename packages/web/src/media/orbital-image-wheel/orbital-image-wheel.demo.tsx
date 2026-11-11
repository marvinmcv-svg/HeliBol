"use client";
import { photoAlt, photos } from "../../_demo";
import { OrbitalImageWheel } from "./orbital-image-wheel";

const items = [...photos, ...photos.slice(0, 4)].map((image, i) => ({ image, title: photoAlt[i % photoAlt.length] }));

export default function Demo() {
  return <OrbitalImageWheel items={items} />;
}
