import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  id: "cursor-smoke-trail",
  name: "Smoke Trail Cursor",
  description: "A soft glowing smoke trail: the pointer emits puffs that inherit its velocity, rise, swirl on a noise field, expand and fade; additive blending makes overlaps bloom.",
  category: "cursor",
  platforms: ["web"],
  engine: "canvas",
  dependencies: [],
  registryDependencies: ["kinetik-core"],
  tags: ["premium","cursor","smoke","trail","canvas","glow"],
  pageTypes: ["landing","portfolio"],
  inspiration: ["kinetik Premium collection"],
  a11y: "Decorative and contained to its area; pointer-only. Reduced motion: no trail.",
  perf: "Puffs capped at 420; paused off-screen.",
  status: "stable",
  priority: "P1",
  previewHeight: 380,
  props: [
    { name: "colors", type: "string[]", default: "violet, cyan, pink", description: "Puff colours (6-digit hex)." },
  ],
};
