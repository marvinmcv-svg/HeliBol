import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  id: "loader-liquid",
  name: "Liquid Orb Loader",
  description: "A glass orb filling with liquid: two counter-moving waves rise to the value with a soft ease, bubbles drift up, and the percentage flips contrast as the liquid passes behind it. Indeterminate mode bobs.",
  category: "loaders",
  platforms: ["web"],
  engine: "svg",
  dependencies: [],
  registryDependencies: ["kinetik-core"],
  tags: ["premium","loader","progress","liquid","orb","upload"],
  pageTypes: ["dashboard","onboarding"],
  inspiration: ["kinetik Premium collection"],
  a11y: "role=progressbar with valuenow (omitted when indeterminate). Reduced motion: still surface.",
  perf: "SVG only: SMIL loops, one CSS transform transition.",
  status: "stable",
  priority: "P1",
  previewHeight: 380,
  props: [
    { name: "value", type: "number", description: "0–100; omit for indeterminate." },
    { name: "size", type: "number", default: "140", description: "Diameter." },
    { name: "color", type: "string", default: "'#8b5cf6'", description: "Liquid colour." },
    { name: "label", type: "string", default: "'Loading'", description: "Accessible label." },
  ],
};
