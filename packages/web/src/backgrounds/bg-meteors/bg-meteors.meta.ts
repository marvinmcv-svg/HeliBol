import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  id: "bg-meteors",
  name: "Meteor Shower",
  description: "Shooting stars streak diagonally across a card or hero with randomized timing — deterministic so SSR matches.",
  category: "backgrounds",
  platforms: ["web"],
  engine: "css",
  dependencies: [],
  registryDependencies: ["kinetik-core"],
  tags: ["meteors", "stars", "space", "launch", "background"],
  pageTypes: ["landing"],
  inspiration: ["Magic UI Meteors", "Aceternity Meteors"],
  a11y: "aria-hidden; hidden entirely under reduced motion.",
  perf: "N spans with transform keyframes; keep count ≤ 30.",
  status: "stable",
  priority: "P2",
  previewHeight: 320,
  props: [
    { name: "count", type: "number", default: "18", description: "Number of meteors." },
    { name: "angle", type: "number", default: "145", description: "Travel direction (deg)." },
  ],
};
