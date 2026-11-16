import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  id: "hero-story-rail",
  name: "Hero — Story Rail",
  description: "Customer-story hero: centered headline over an endless rail of tall photo cards with brand marks; hover pauses the rail and zooms the card.",
  category: "heroes",
  platforms: ["web"],
  engine: "css",
  dependencies: [],
  registryDependencies: ["kinetik-core"],
  tags: ["hero","customer stories","marquee","cards","dark","logos"],
  pageTypes: ["landing"],
  inspiration: ["Mobbin — Framer hero (mobbin.com/sites/sections/da1010c9-012b-4eab-b45a-01019e33f955)"],
  a11y: "Duplicate rail items are aria-hidden and removed from tab order; hover pauses motion; reduced motion turns the rail into a static, scrollable row.",
  perf: "Single translateX loop on one list; image zoom only on hover.",
  status: "stable",
  priority: "P2",
  previewHeight: 520,
  props: [
    { name: "className", type: "string", description: "Size/position the section." },
  ],
};
