import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  id: "card-glass",
  name: "Glass Parallax Card",
  description: "Frosted glass card over a colorful backdrop; the backdrop and the card drift in opposite directions with the pointer.",
  category: "cards",
  platforms: ["web"],
  engine: "motion",
  dependencies: ["motion"],
  registryDependencies: ["kinetik-core"],
  tags: ["glassmorphism","parallax","fintech","card"],
  pageTypes: ["landing","dashboard"],
  inspiration: ["Apple visionOS materials"],
  a11y: "Ensure text contrast on the frosted surface; motion off on touch/reduced motion.",
  perf: "Two spring motion values; backdrop-filter on one element.",
  status: "stable",
  priority: "P2",
  previewHeight: 360,
  props: [
    { name: "children", type: "ReactNode", description: "Card content." },
  ],
};
