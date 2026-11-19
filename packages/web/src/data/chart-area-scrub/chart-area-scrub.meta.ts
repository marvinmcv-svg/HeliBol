import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  id: "chart-area-scrub",
  name: "Scrubbable Area Chart",
  description: "Stock-app area chart: the line draws in when visible, the gradient fill fades up, and scrubbing snaps a crosshair to the nearest point while the headline value rolls and the delta updates.",
  category: "data",
  platforms: ["web"],
  engine: "motion",
  dependencies: ["motion"],
  registryDependencies: ["kinetik-core"],
  tags: ["premium","chart","finance","area","scrub","dashboard"],
  pageTypes: ["dashboard","ecommerce"],
  inspiration: ["kinetik Premium collection"],
  a11y: "The plot is a keyboard slider (arrow keys) with value text; values are real text. Reduced motion: no draw-in or rolling.",
  perf: "Precomputed smooth path; one clip rect animates on scrub.",
  status: "stable",
  priority: "P1",
  previewHeight: 360,
  props: [
    { name: "data", type: "{ label, value }[]", description: "Series." },
    { name: "format", type: "(v) => string", default: "toLocaleString", description: "Readout format." },
    { name: "color", type: "string", default: "'#22c55e'", description: "Line colour." },
    { name: "title", type: "string", default: "'Revenue'", description: "Label." },
  ],
};
