import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  id: "chart-bar-grow",
  name: "Bar Chart Grow",
  description: "Bars spring up from the baseline in a left-to-right wave when the chart scrolls into view; hover reveals values.",
  category: "data",
  platforms: ["web"],
  engine: "motion",
  dependencies: ["motion"],
  registryDependencies: ["kinetik-core"],
  tags: ["chart", "bar", "analytics", "spring"],
  pageTypes: ["dashboard", "landing", "pricing"],
  inspiration: ["Vercel analytics", "Linear insights"],
  a11y: "role=img with a text summary of all values.",
  perf: "scaleY from a bottom origin (no height animation).",
  status: "stable",
  priority: "P2",
  previewHeight: 300,
  props: [
    { name: "data", type: "{ label, value, highlight? }[]", description: "Bars." },
    { name: "height", type: "number", default: "200", description: "Chart height (px)." },
  ],
};
