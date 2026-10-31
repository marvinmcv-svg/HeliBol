import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  id: "text-glitch",
  name: "Glitch Text",
  description: "Cyan/red channel-split glitch bursts with sliced clip-paths, pure CSS, spaced out to stay epilepsy-safe.",
  category: "text",
  platforms: ["web"],
  engine: "css",
  dependencies: [],
  registryDependencies: ["kinetik-core"],
  tags: ["glitch","cyberpunk","error","css-only"],
  pageTypes: ["landing","portfolio"],
  inspiration: ["React Bits Glitch Text","Codrops glitch effects"],
  a11y: "Bursts occupy ~10% of a ≥2s cycle — well under WCAG 2.3.1's 3 flashes/s. Pseudo layers hidden under reduced motion.",
  perf: "Two pseudo-elements, stepped keyframes; 0 KB JS.",
  status: "stable",
  priority: "P3",
  previewHeight: 240,
  props: [
    { name: "every", type: "number", default: "3", description: "Seconds between bursts." },
  ],
};
