import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  id: "text-liquid-fill",
  name: "Liquid Fill Text",
  description: "Outlined letters as glass vessels: two offset waves slosh inside the type (SVG clip to the text) and rise to a level you control — loaders, counters, scroll progress.",
  category: "text",
  platforms: ["web"],
  engine: "svg",
  dependencies: [],
  registryDependencies: ["kinetik-core"],
  tags: ["premium","text","liquid","wave","progress","loader"],
  pageTypes: ["landing","dashboard"],
  inspiration: ["kinetik Premium collection"],
  a11y: "role=img with an aria-label that includes the percentage. Reduced motion: still waves, level jumps.",
  perf: "Pure SVG: two SMIL translate loops and one CSS transform transition.",
  status: "stable",
  priority: "P1",
  previewHeight: 320,
  props: [
    { name: "text", type: "string", description: "Word to fill." },
    { name: "level", type: "number", default: "60", description: "0–100 fill level." },
    { name: "color", type: "string", default: "'#38bdf8'", description: "Front wave." },
    { name: "colorBack", type: "string", default: "'#818cf8'", description: "Back wave." },
  ],
};
