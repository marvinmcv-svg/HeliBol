import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  id: "text-ink-bleed",
  name: "Ink Bleed Headline",
  description: "A headline that bleeds onto the page like ink on wet paper: SVG turbulence displacement and blur decay to zero while words fade up in sequence, leaving perfectly crisp type.",
  category: "text",
  platforms: ["web"],
  engine: "motion",
  dependencies: ["motion"],
  registryDependencies: ["kinetik-core"],
  tags: ["premium","text","ink","editorial","svg filter","headline"],
  pageTypes: ["landing","blog","portfolio"],
  inspiration: ["kinetik Premium collection"],
  a11y: "The heading keeps its full text as aria-label; animated words are aria-hidden. Reduced motion: crisp text, no filter.",
  perf: "Filter attributes updated for ~2 s only; filter removed once settled.",
  status: "stable",
  priority: "P1",
  previewHeight: 380,
  props: [
    { name: "text", type: "string", description: "Headline." },
    { name: "as", type: "'h1' | 'h2' | 'h3' | 'p'", default: "'h2'", description: "Element." },
    { name: "duration", type: "number", default: "1.8", description: "Seconds to settle." },
  ],
};
