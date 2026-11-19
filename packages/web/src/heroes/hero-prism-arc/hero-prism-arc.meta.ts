import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  id: "hero-prism-arc",
  name: "Hero — Prism Arc",
  description: "Creative-AI hero on soft grey: minimal nav, a light two-line headline, copy with bold keywords and a big pill CTA, above a half-dome window of rotating prismatic crystal light.",
  category: "heroes",
  platforms: ["web"],
  engine: "css",
  dependencies: [],
  registryDependencies: ["kinetik-core"],
  tags: ["hero","ai","prism","iridescent","dome","creative"],
  pageTypes: ["ai-app","landing"],
  inspiration: ["Mobbin — Luma AI hero (mobbin.com/sites/sections/01659bf8-ecc3-4aba-92d1-89f8e3c78668)"],
  a11y: "Real h1 and CTA; dome aria-hidden; reduced motion freezes rotation and facets.",
  perf: "Conic gradient animating an @property angle; four overlay facets.",
  status: "stable",
  priority: "P2",
  previewHeight: 520,
  props: [
    { name: "className", type: "string", description: "Size/position the section." },
  ],
};
