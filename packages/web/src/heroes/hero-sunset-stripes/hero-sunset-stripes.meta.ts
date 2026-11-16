import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  id: "hero-sunset-stripes",
  name: "Hero — Sunset Stripes",
  description: "Closing/CTA-style hero: plain centered statement with underlined text links, sitting on stacked sunset stripes that sweep in from alternating sides while a pixel cat strolls along.",
  category: "heroes",
  platforms: ["web"],
  engine: "css",
  dependencies: [],
  registryDependencies: ["kinetik-core"],
  tags: ["hero","cta","stripes","pixel art","sunset","minimal"],
  pageTypes: ["landing","ai-app"],
  inspiration: ["Mobbin — Mistral AI hero (mobbin.com/sites/sections/4138dfbe-7a6d-4659-9b80-f02e84406cdf)"],
  a11y: "Real h1 and links; stripes and cat aria-hidden; reduced motion stops the sweep and walk.",
  perf: "Six stripe transforms once; one tiny sprite loop.",
  status: "stable",
  priority: "P2",
  previewHeight: 520,
  props: [
    { name: "className", type: "string", description: "Size/position the section." },
  ],
};
