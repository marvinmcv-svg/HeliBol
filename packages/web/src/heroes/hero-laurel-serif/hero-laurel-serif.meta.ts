import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  id: "hero-laurel-serif",
  name: "Hero — Laurel Serif",
  description: "Quiet agency hero: a single serif line types itself in, laurel-wrapped awards pop in a grid, and a neon slab rises from the fold.",
  category: "heroes",
  platforms: ["web"],
  engine: "css",
  dependencies: [],
  registryDependencies: ["kinetik-core"],
  tags: ["hero","minimal","serif","awards","agency","neon"],
  pageTypes: ["portfolio","landing"],
  inspiration: ["Mobbin — COLLINS hero (mobbin.com/sites/sections/502039fb-c2b0-4f44-9d7e-2cd8b67c05ca)"],
  a11y: "h1 carries aria-label with letters aria-hidden; awards are a list; reduced motion shows everything at rest.",
  perf: "Per-character CSS reveal; one slab transform.",
  status: "stable",
  priority: "P2",
  previewHeight: 520,
  props: [
    { name: "className", type: "string", description: "Size/position the section." },
  ],
};
