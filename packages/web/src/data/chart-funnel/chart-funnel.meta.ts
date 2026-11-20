import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  id: "chart-funnel",
  name: "Chart — Funnel",
  description: "Conversion funnel drawn as one continuous, smoothly tapering SVG shape: stages pour in from the top on view, drop-off between stages appears as a pill, and hovering a stage highlights its band and shows its share of the top.",
  category: "data",
  platforms: ["web"],
  engine: "svg",
  dependencies: ["motion"],
  registryDependencies: ["kinetik-core"],
  tags: ["premium","chart","funnel","conversion","analytics","svg","marketing"],
  pageTypes: ["dashboard"],
  inspiration: ["kinetik Premium collection"],
  a11y: "SVG has an aria-label listing all stages; stage rows are focusable buttons. Reduced motion shows the final chart.",
  perf: "Five paths and a short list; animations run once.",
  status: "stable",
  priority: "P1",
  previewHeight: 460,
  props: [
    { name: "stages", type: "{ label; value }[]", description: "Funnel stages." },
    { name: "colors", type: "[string, string]", default: "violet → cyan", description: "Gradient." },
    { name: "title", type: "string", default: "Conversion", description: "Title." },
  ],
};
