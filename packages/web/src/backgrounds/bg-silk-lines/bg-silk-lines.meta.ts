import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  id: "bg-silk-lines",
  name: "Silk Lines",
  description: "Dozens of thin strands flowing like one ribbon of silk: each line is a sum of slow sine waves offset by its index, so the bundle twists, folds and catches light; the pointer bends the fabric.",
  category: "backgrounds",
  platforms: ["web"],
  engine: "canvas",
  dependencies: [],
  registryDependencies: ["kinetik-core"],
  tags: ["premium","lines","silk","canvas","flow","hero"],
  pageTypes: ["landing","portfolio"],
  inspiration: ["kinetik Premium collection"],
  a11y: "Decorative canvas. Reduced motion: still frame.",
  perf: "~46 strokes per frame with additive blending; paused off-screen.",
  status: "stable",
  priority: "P1",
  previewHeight: 380,
  props: [
    { name: "lines", type: "number", default: "46", description: "Strands." },
    { name: "colors", type: "[string, string]", default: "pink → blue", description: "6-digit hex gradient." },
    { name: "width", type: "number", default: "1.1", description: "Stroke width." },
  ],
};
