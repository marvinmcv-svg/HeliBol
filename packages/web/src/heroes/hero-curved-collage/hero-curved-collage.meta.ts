import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  id: "hero-curved-collage",
  name: "Hero — Curved Collage",
  description: "About/story hero: centered statement with a photo collage whose side tiles are cut by big sweeping curves and drift in on load.",
  category: "heroes",
  platforms: ["web"],
  engine: "motion",
  dependencies: ["motion"],
  registryDependencies: ["kinetik-core"],
  tags: ["hero","about","story","collage","curved mask","photos"],
  pageTypes: ["landing","portfolio"],
  inspiration: ["Mobbin — Maze hero (mobbin.com/sites/sections/c41293fe-5b7a-4a8a-981c-8ca4ef5f8c05)"],
  a11y: "Real h1 and paragraph; collage tiles are decorative and aria-hidden; without reduced motion they slide in, otherwise they render in place.",
  perf: "Four background-image tiles animated once with Motion transforms.",
  status: "stable",
  priority: "P2",
  previewHeight: 520,
  props: [
    { name: "className", type: "string", description: "Size/position the section." },
  ],
};
