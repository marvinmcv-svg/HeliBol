import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  id: "cursor-click-spark",
  name: "Click Spark",
  description: "Clicking anywhere in the area emits a tiny starburst of sparks from the click point.",
  category: "cursor",
  platforms: ["web"],
  engine: "canvas",
  dependencies: [],
  registryDependencies: ["kinetik-core"],
  tags: ["click","spark","feedback","canvas"],
  pageTypes: ["landing","portfolio"],
  inspiration: ["React Bits Click Spark"],
  a11y: "Canvas overlay is aria-hidden with pointer-events none; skipped under reduced motion.",
  perf: "rAF runs only while sparks are alive (450ms).",
  status: "stable",
  priority: "P2",
  previewHeight: 280,
  props: [
    { name: "color", type: "string", default: "\"#a78bfa\"", description: "Spark color." },
    { name: "count", type: "number", default: "10", description: "Sparks per click." },
  ],
};
