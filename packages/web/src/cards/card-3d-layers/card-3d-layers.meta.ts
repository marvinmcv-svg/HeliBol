import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  id: "card-3d-layers",
  name: "3D Layered Card",
  description: "The card tilts toward the pointer and its child layers lift out to different depths with translateZ.",
  category: "cards",
  platforms: ["web"],
  engine: "motion",
  dependencies: ["motion"],
  registryDependencies: ["kinetik-core"],
  tags: ["3d","parallax","tilt","depth"],
  pageTypes: ["landing","portfolio"],
  inspiration: ["Aceternity 3D Card Effect"],
  a11y: "Decorative depth only; off on touch and reduced motion.",
  perf: "Springs for rotation and a shared hover value; transforms only.",
  status: "stable",
  priority: "P2",
  previewHeight: 440,
  props: [
    { name: "Card3D", type: "component", description: "Tilting container." },
    { name: "Card3DLayer.depth", type: "number", default: "40", description: "translateZ on hover (px)." },
  ],
};
