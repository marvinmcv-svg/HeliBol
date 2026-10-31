import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  id: "text-flip-words",
  name: "3D Flip Words",
  description: "The next word's letters flip down into place in 3D, staggered left-to-right, while the old word blurs away.",
  category: "text",
  platforms: ["web"],
  engine: "motion",
  dependencies: ["motion"],
  registryDependencies: ["kinetik-core"],
  tags: ["rotating","3d","headline","hero"],
  pageTypes: ["landing"],
  inspiration: ["Aceternity Flip Words"],
  a11y: "sr-only list of all words; animated letters aria-hidden. Reduced motion: fade.",
  perf: "Per-letter transforms, one word mounted at a time.",
  status: "stable",
  priority: "P2",
  previewHeight: 260,
  props: [
    { name: "words", type: "string[]", description: "Words to cycle." },
    { name: "interval", type: "number", default: "2600", description: "ms per word." },
  ],
};
