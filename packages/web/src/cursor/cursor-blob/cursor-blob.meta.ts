import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  id: "cursor-blob",
  name: "Liquid Cursor Blob",
  description: "Three blobs chase the cursor at different lags and fuse into one liquid shape through an SVG goo filter.",
  category: "cursor",
  platforms: ["web"],
  engine: "motion",
  dependencies: ["motion"],
  registryDependencies: ["kinetik-core"],
  tags: ["blob","gooey","cursor","liquid"],
  pageTypes: ["portfolio","landing"],
  inspiration: ["React Bits Blob Cursor"],
  a11y: "Decorative layer behind content; disabled on touch and reduced motion.",
  perf: "Three springs; filter on one layer.",
  status: "stable",
  priority: "P2",
  previewHeight: 320,
  props: [
    { name: "color", type: "string", default: "\"#8b5cf6\"", description: "Blob color." },
  ],
};
