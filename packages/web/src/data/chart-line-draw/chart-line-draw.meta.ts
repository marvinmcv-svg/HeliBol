import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  id: "chart-line-draw",
  name: "Line Chart Draw",
  description: "A smooth bezier line draws itself on view, the gradient area fades in after, and hover springs a marker with a tooltip.",
  category: "data",
  platforms: ["web"],
  engine: "svg",
  dependencies: ["motion"],
  registryDependencies: ["kinetik-core"],
  tags: ["chart", "line", "analytics", "svg", "hover"],
  pageTypes: ["dashboard", "landing"],
  inspiration: ["Stripe & Robinhood charts"],
  a11y: "role=img with a full text summary of the data in aria-label; tooltip is supplementary.",
  perf: "Single path draw + per-point hit areas; no chart library.",
  status: "stable",
  priority: "P2",
  previewHeight: 320,
  props: [
    { name: "data", type: "{ label, value }[]", description: "Series." },
    { name: "color", type: "string", default: '"#8b5cf6"', description: "Line color." },
    { name: "format", type: "(v) => string", description: "Value formatter." },
  ],
};
