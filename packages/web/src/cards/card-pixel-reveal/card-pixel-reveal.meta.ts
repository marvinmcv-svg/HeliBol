import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  id: "card-pixel-reveal",
  name: "Pixel Dissolve Card",
  description: "A pixel mosaic covers the image and dissolves square by square in pseudo-random order on hover or focus.",
  category: "cards",
  platforms: ["web"],
  engine: "css",
  dependencies: [],
  registryDependencies: ["kinetik-core"],
  tags: ["pixel","dissolve","reveal","retro"],
  pageTypes: ["portfolio","landing"],
  inspiration: ["React Bits Pixel Card","8-bit transitions"],
  a11y: "Real <img> with alt underneath; focusable; reduced motion fades all cells at once.",
  perf: "cols×rows plain divs with opacity steps; no canvas.",
  status: "stable",
  priority: "P2",
  previewHeight: 300,
  props: [
    { name: "image / alt", type: "string", description: "Image." },
    { name: "cols / rows", type: "number", default: "12 / 8", description: "Grid size." },
    { name: "color", type: "string", description: "Cover color." },
  ],
};
