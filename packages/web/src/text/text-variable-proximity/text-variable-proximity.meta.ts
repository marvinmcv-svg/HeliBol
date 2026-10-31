import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  id: "text-variable-proximity",
  name: "Variable Weight Proximity",
  description: "Letters thicken through a variable font's weight axis and lift slightly as the cursor approaches them.",
  category: "text",
  platforms: ["web"],
  engine: "js",
  dependencies: [],
  registryDependencies: ["kinetik-core"],
  tags: ["variable font","cursor","typography","proximity"],
  pageTypes: ["portfolio","landing"],
  inspiration: ["React Bits Variable Proximity","Fancy variable-font cursor proximity"],
  a11y: "Text stays real (aria-label); effect off on touch and reduced motion.",
  perf: "One rAF loop reading rects of letters; keep to headlines.",
  status: "stable",
  priority: "P2",
  previewHeight: 260,
  props: [
    { name: "radius", type: "number", default: "140", description: "Influence radius (px)." },
    { name: "minWeight / maxWeight", type: "number", default: "200 / 900", description: "Weight range." },
  ],
};
