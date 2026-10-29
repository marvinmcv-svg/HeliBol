import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  id: "text-gradient-animated",
  name: "Animated Gradient Text",
  description: "A looping multi-stop gradient flows through the letters. Zero JavaScript.",
  category: "text",
  platforms: ["web"],
  engine: "css",
  dependencies: [],
  tags: ["gradient", "hero", "highlight", "css-only"],
  pageTypes: ["landing", "pricing"],
  inspiration: ["Magic UI Animated Gradient Text"],
  a11y: "Real text with color: transparent + background-clip; keep contrast of every stop ≥ 4.5:1 on your background. Reduced motion: static gradient.",
  perf: "background-position animation on a single text node; 0 KB JS.",
  status: "stable",
  priority: "P1",
  previewHeight: 240,
  props: [
    { name: "colors", type: "string[]", description: "Gradient stops; repeat the first at the end for a seamless loop." },
    { name: "speed", type: "number", default: "6", description: "Seconds per loop." },
    { name: "as", type: "ElementType", default: '"span"', description: "Element to render." },
  ],
};
