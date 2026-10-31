import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  id: "bg-lamp",
  name: "Lamp Header",
  description: "Two conic light cones switch on from a glowing bar and illuminate the section heading — the Linear-style lamp.",
  category: "backgrounds",
  platforms: ["web"],
  engine: "motion",
  dependencies: ["motion"],
  registryDependencies: ["kinetik-core"],
  tags: ["lamp","light","section header","dark"],
  pageTypes: ["landing"],
  inspiration: ["Aceternity Lamp","Linear"],
  a11y: "Decorative layers; the heading is plain text. Reduced motion: lit immediately.",
  perf: "A few blurred layers widening once on view.",
  status: "stable",
  priority: "P2",
  previewHeight: 380,
  props: [
    { name: "color", type: "string", default: "\"#22d3ee\"", description: "Light color." },
  ],
};
