import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  id: "marquee-vertical",
  name: "Vertical Marquee",
  description: "Columns of cards scrolling endlessly up and down in alternating directions, masked to fade at the edges — the testimonial wall, in pure CSS.",
  category: "media",
  platforms: ["web"],
  engine: "css",
  dependencies: [],
  registryDependencies: ["kinetik-core"],
  tags: ["marquee","testimonials","social proof","wall"],
  pageTypes: ["landing"],
  inspiration: ["unlumen UI — Vertical Marquee"],
  a11y: "Duplicated items are aria-hidden; hover/focus pauses; reduced motion shows a still wall.",
  perf: "CSS transform animation only, zero JS; Server Component friendly.",
  status: "stable",
  priority: "P2",
  previewHeight: 380,
  props: [
    { name: "columns", type: "ReactNode[][]", description: "Items per column." },
    { name: "duration", type: "number", default: "40", description: "Seconds per loop (first column)." },
  ],
};
