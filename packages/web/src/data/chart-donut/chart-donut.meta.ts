import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  id: "chart-donut",
  name: "Donut Chart",
  description: "Donut chart whose segments sweep in sequence on view; hovering a segment or legend item thickens it and updates the center.",
  category: "data",
  platforms: ["web"],
  engine: "svg",
  dependencies: ["motion"],
  registryDependencies: ["kinetik-core"],
  tags: ["chart","donut","pie","analytics"],
  pageTypes: ["dashboard"],
  inspiration: ["Tremor Donut","Stripe dashboard"],
  a11y: "role=img with a text summary of all segments; legend mirrors the data as text.",
  perf: "Stroke-dash segments; no chart library.",
  status: "stable",
  priority: "P2",
  previewHeight: 300,
  props: [
    { name: "data", type: "{ label, value, color }[]", description: "Segments." },
    { name: "label", type: "string", default: "\"Total\"", description: "Center caption." },
  ],
};
