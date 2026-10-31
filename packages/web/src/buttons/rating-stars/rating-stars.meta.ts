import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  id: "rating-stars",
  name: "Rating Stars",
  description: "Star rating built as a real radio group: hovering previews, choosing pops the stars in sequence.",
  category: "buttons",
  platforms: ["web"],
  engine: "motion",
  dependencies: ["motion"],
  registryDependencies: ["kinetik-core"],
  tags: ["rating","stars","review","form","feedback"],
  pageTypes: ["ecommerce","social"],
  inspiration: ["App Store rating sheet"],
  a11y: "Native radio inputs (arrow keys work), labelled per star, visible focus ring.",
  perf: "Per-star transform keyframes on change only.",
  status: "stable",
  priority: "P2",
  previewHeight: 260,
  props: [
    { name: "value / defaultValue", type: "number", description: "Rating." },
    { name: "onChange", type: "(v) => void", description: "Change callback." },
    { name: "max", type: "number", default: "5", description: "Stars." },
  ],
};
