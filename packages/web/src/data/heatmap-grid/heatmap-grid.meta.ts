import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  id: "heatmap-grid",
  name: "Contribution Heatmap",
  description: "GitHub-style contribution grid whose cells fill in a diagonal wave on view, with a hover readout.",
  category: "data",
  platforms: ["web"],
  engine: "motion",
  dependencies: ["motion"],
  registryDependencies: ["kinetik-core"],
  tags: ["heatmap","contributions","calendar","github"],
  pageTypes: ["dashboard","portfolio"],
  inspiration: ["GitHub contributions graph"],
  a11y: "role=img with a total summary; the readout text updates on hover.",
  perf: "Spring per cell on first view only (≈200 cells).",
  status: "stable",
  priority: "P3",
  previewHeight: 260,
  props: [
    { name: "weeks", type: "number", default: "26", description: "Columns." },
    { name: "color", type: "string", description: "RGB triplet." },
    { name: "seed", type: "number", default: "7", description: "Deterministic data seed." },
  ],
};
