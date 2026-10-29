import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  id: "progress-ring",
  name: "Progress Ring",
  description: "Circular progress whose arc and centered percentage spring smoothly to every new value — interruptible mid-flight.",
  category: "loaders",
  platforms: ["web"],
  engine: "motion",
  dependencies: ["motion"],
  registryDependencies: ["kinetik-core"],
  tags: ["progress", "ring", "goal", "fitness", "kpi"],
  pageTypes: ["dashboard", "onboarding"],
  inspiration: ["Apple Activity rings"],
  a11y: "role=progressbar with live aria-valuenow.",
  perf: "Spring motion value drives stroke-dashoffset and text without re-renders.",
  status: "stable",
  priority: "P1",
  previewHeight: 280,
  props: [
    { name: "value", type: "number", description: "0–100." },
    { name: "size / stroke", type: "number", default: "120 / 10", description: "Dimensions (px)." },
    { name: "showValue", type: "boolean", default: "true", description: "Center percentage." },
  ],
};
