import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  id: "svg-wave-divider",
  name: "Wave Divider",
  description: "Section divider of stacked ocean waves: each layer is a seamless wave tile drifting at its own speed and direction, back layers paler and slower, giving parallax depth between sections.",
  category: "svg",
  platforms: ["web"],
  engine: "svg",
  dependencies: [],
  registryDependencies: ["kinetik-core"],
  tags: ["premium","divider","waves","section","svg","ocean"],
  pageTypes: ["landing"],
  inspiration: ["kinetik Premium collection"],
  a11y: "aria-hidden decoration. Reduced motion: static waves.",
  perf: "SVG SMIL translate loops; no JS per frame.",
  status: "stable",
  priority: "P1",
  previewHeight: 320,
  props: [
    { name: "colors", type: "string[]", default: "violet ramp → background", description: "Layer colours, back to front." },
    { name: "height", type: "number", default: "120", description: "Height px." },
    { name: "flip", type: "boolean", default: "false", description: "Flip vertically." },
  ],
};
