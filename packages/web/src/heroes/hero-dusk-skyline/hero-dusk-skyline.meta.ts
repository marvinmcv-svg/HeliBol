import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  id: "hero-dusk-skyline",
  name: "Hero — Dusk Skyline",
  description: "Corporate hero: thin oversized type over a dusk city skyline that slowly pans while lit windows flicker on and off.",
  category: "heroes",
  platforms: ["web"],
  engine: "css",
  dependencies: [],
  registryDependencies: ["kinetik-core"],
  tags: ["hero","corporate","skyline","city","twinkle","thin type"],
  pageTypes: ["landing"],
  inspiration: ["Mobbin — Okta hero (mobbin.com/sites/sections/5e71206c-b8c4-4e6d-a122-a8bb332a11fd)"],
  a11y: "Real h1 + paragraph; skyline SVG is aria-hidden; reduced motion stops the pan, sky shift and twinkle.",
  perf: "SVG rects with opacity step animations; one slow transform pan.",
  status: "stable",
  priority: "P2",
  previewHeight: 520,
  props: [
    { name: "className", type: "string", description: "Size/position the section." },
  ],
};
