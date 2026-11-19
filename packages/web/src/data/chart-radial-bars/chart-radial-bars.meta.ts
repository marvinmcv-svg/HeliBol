import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  id: "chart-radial-bars",
  name: "Radial Bar Chart",
  description: "Concentric gauge-shaped radial bars: rings sweep in one after another when visible; hovering or focusing a ring brightens it, dims the others and swaps the centre readout.",
  category: "data",
  platforms: ["web"],
  engine: "motion",
  dependencies: ["motion"],
  registryDependencies: ["kinetik-core"],
  tags: ["premium","chart","radial","gauge","rings","kpi"],
  pageTypes: ["dashboard"],
  inspiration: ["kinetik Premium collection"],
  a11y: "A legend of buttons doubles as the accessible value list and focus target. Reduced motion: static rings.",
  perf: "pathLength per ring; hover only toggles opacity/stroke.",
  status: "stable",
  priority: "P1",
  previewHeight: 360,
  props: [
    { name: "data", type: "{ label, value, color }[]", description: "Rings, outer first." },
    { name: "max", type: "number", default: "100", description: "Value for a full sweep." },
    { name: "size", type: "number", default: "240", description: "Size px." },
    { name: "centerLabel", type: "string", default: "'Total'", description: "Centre caption." },
  ],
};
