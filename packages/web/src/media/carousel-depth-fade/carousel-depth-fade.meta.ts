import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  id: "carousel-depth-fade",
  name: "Depth Fade Carousel",
  description: "A native scroll-snap carousel where each card's scale, tilt, blur and opacity depend on its distance from the centre — cards recede into depth as they slide away.",
  category: "media",
  platforms: ["web"],
  engine: "js",
  dependencies: [],
  registryDependencies: ["kinetik-core"],
  tags: ["carousel","scroll snap","depth","gallery"],
  pageTypes: ["landing","ecommerce","media"],
  inspiration: ["unlumen UI — Horizontal Depth Fade"],
  a11y: "Native scrolling (swipe, trackpad, keyboard when focused); cards labelled “n of total”. Reduced motion: opacity only.",
  perf: "rAF-throttled scroll handler writing transform/filter/opacity; zero layout reads per card except offsetLeft.",
  status: "stable",
  priority: "P2",
  previewHeight: 360,
  props: [
    { name: "items", type: "{ image, title, caption? }[]", description: "Cards." },
  ],
};
