import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  id: "button-download",
  name: "Download Progress Button",
  description: "Download pill shrinks into a circular progress ring, fills, then pops a checkmark.",
  category: "buttons",
  platforms: ["web"],
  engine: "motion",
  dependencies: ["motion"],
  registryDependencies: ["kinetik-core"],
  tags: ["download","progress","async","feedback"],
  pageTypes: ["dashboard","docs","ecommerce"],
  inspiration: ["Dribbble download interactions"],
  a11y: "aria-label tracks the percentage; aria-live announces completion.",
  perf: "Layout width morph + one stroke animation.",
  status: "stable",
  priority: "P2",
  previewHeight: 220,
  props: [
    { name: "onDownload", type: "() => Promise<unknown>", description: "Start handler." },
    { name: "progress", type: "number", description: "Controlled 0–100 (simulated otherwise)." },
  ],
};
