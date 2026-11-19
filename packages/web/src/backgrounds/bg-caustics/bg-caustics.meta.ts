import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  id: "bg-caustics",
  name: "Water Caustics",
  description: "Pool-floor caustics in a ~1 KB fragment shader: iterated light focusing in two layers, a deep-to-shallow gradient and a ripple that follows the pointer.",
  category: "backgrounds",
  platforms: ["web"],
  engine: "canvas",
  dependencies: [],
  registryDependencies: ["kinetik-core"],
  tags: ["premium","water","shader","webgl","caustics","summer"],
  pageTypes: ["landing"],
  inspiration: ["kinetik Premium collection"],
  a11y: "Decorative canvas behind real content. Reduced motion: one still frame. CSS gradient fallback without WebGL.",
  perf: "Fullscreen triangle, DPR ≤ 1.5, paused off-screen and in background tabs.",
  status: "stable",
  priority: "P1",
  previewHeight: 380,
  props: [
    { name: "deep", type: "string", default: "'#04364a'", description: "Water colour." },
    { name: "light", type: "string", default: "'#a5f3fc'", description: "Caustic colour." },
    { name: "speed", type: "number", default: "1", description: "Time scale." },
  ],
};
