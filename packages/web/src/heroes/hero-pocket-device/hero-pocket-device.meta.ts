import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  id: "hero-pocket-device",
  name: "Hero — Pocket Device",
  description: "Hardware hero: split card with a serif two-liner; a handheld terminal swings upright and its screen counts up a sale while contactless rings pulse.",
  category: "heroes",
  platforms: ["web"],
  engine: "motion",
  dependencies: ["motion"],
  registryDependencies: ["kinetik-core"],
  tags: ["hero","hardware","device","payments","serif","count up"],
  pageTypes: ["landing","ecommerce"],
  inspiration: ["Mobbin — Square hero (mobbin.com/sites/sections/394464f3-29b7-4d8c-8ebc-06b1b4315db0)"],
  a11y: "Real h1 and links; device aria-hidden; reduced motion shows the final total and no ring pulse.",
  perf: "One Motion spring, one rAF count-up that stops at the target.",
  status: "stable",
  priority: "P2",
  previewHeight: 520,
  props: [
    { name: "className", type: "string", description: "Size/position the section." },
  ],
};
