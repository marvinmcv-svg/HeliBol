import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  id: "bg-retro-grid",
  name: "Retro Perspective Grid",
  description: "Synthwave floor grid in 3D perspective scrolling endlessly toward the horizon.",
  category: "backgrounds",
  platforms: ["web"],
  engine: "css",
  dependencies: [],
  registryDependencies: ["kinetik-core"],
  tags: ["retro","synthwave","grid","perspective","css-only"],
  pageTypes: ["landing","portfolio"],
  inspiration: ["Magic UI Retro Grid","Outrun aesthetics"],
  a11y: "Decorative; static under reduced motion.",
  perf: "One transformed layer, background-image lines.",
  status: "stable",
  priority: "P2",
  previewHeight: 320,
  props: [
    { name: "color", type: "string", description: "Line color." },
  ],
};
