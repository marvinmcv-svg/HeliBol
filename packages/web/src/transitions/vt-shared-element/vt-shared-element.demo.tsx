"use client";
import { photoAlt, photos } from "../../_demo";
import { VtSharedElement } from "./vt-shared-element";

const items = photos.slice(0, 6).map((image, i) => ({
  id: String(i),
  title: photoAlt[i],
  subtitle: "Collection · 2026",
  image,
  body: "The thumbnail and title morph into the hero position using the browser's native View Transitions — no animation library, no layout measuring.",
}));

export default function Demo() {
  return <VtSharedElement items={items} className="h-full" />;
}
