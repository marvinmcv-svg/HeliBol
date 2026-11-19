import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  id: "comparison-table",
  name: "Plan Comparison Table",
  description: "Plan comparison table: a highlight column glides to the plan you hover or focus (defaults to the recommended one), checkmarks draw in row by row when it scrolls into view, and the header stays sticky.",
  category: "data",
  platforms: ["web"],
  engine: "motion",
  dependencies: ["motion","lucide-react"],
  registryDependencies: ["kinetik-core"],
  tags: ["pricing","comparison","table","plans","features"],
  pageTypes: ["pricing"],
  inspiration: ["21st.dev category gap (audit 2026-11)"],
  a11y: "Real table with caption, column and row headers, colgroup headers; checks have 'Included' labels. Reduced motion: no drawing or gliding.",
  perf: "One layoutId highlight; checks draw once.",
  status: "stable",
  priority: "P1",
  previewHeight: 440,
  props: [
    { name: "plans", type: "{ id, name, price, highlight? }[]", description: "Columns." },
    { name: "rows", type: "{ group?, feature, values }[]", description: "Rows; values are booleans or short text." },
    { name: "caption", type: "string", default: "'Compare plans'", description: "Accessible caption." },
  ],
};
