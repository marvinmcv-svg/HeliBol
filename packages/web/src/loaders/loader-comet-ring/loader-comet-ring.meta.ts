import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  id: "loader-comet-ring",
  name: "Comet Ring Loader",
  description: "A comet chasing its tail: a conic-gradient ring masked to a thin band whose start angle is an animatable @property, plus a blurred glow copy, gently breathing. Zero JS.",
  category: "loaders",
  platforms: ["web"],
  engine: "css",
  dependencies: [],
  registryDependencies: ["kinetik-core"],
  tags: ["premium","loader","spinner","conic","glow","css"],
  pageTypes: ["dashboard","ai-app"],
  inspiration: ["kinetik Premium collection"],
  a11y: "role=status with label. Reduced motion slows to a calm 4 s turn (loaders must still show activity).",
  perf: "Single @property animation on two elements; no JS.",
  status: "stable",
  priority: "P1",
  previewHeight: 300,
  props: [
    { name: "size", type: "number", default: "64", description: "Diameter." },
    { name: "thickness", type: "number", default: "5", description: "Ring thickness." },
    { name: "colors", type: "[string, string]", default: "cyan → purple", description: "Head and tail." },
    { name: "label", type: "string", default: "'Loading'", description: "Accessible label." },
  ],
};
