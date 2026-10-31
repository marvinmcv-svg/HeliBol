"use client";
import { DemoScroller, photoAlt, photos } from "../../_demo";
import { MasonryReveal } from "./masonry-reveal";
const ratios = [0.8, 1.2, 0.75, 1, 1.4, 0.9, 1.1, 0.7, 1.3, 0.85, 1, 1.25];
export default function Demo() {
  return <DemoScroller hint={false}><MasonryReveal className="p-4" items={ratios.map((r, i) => ({ src: photos[i % 8], alt: photoAlt[i % 8], ratio: r }))} /></DemoScroller>;
}
