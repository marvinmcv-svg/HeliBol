import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  id: "widget-battery",
  name: "Battery Level",
  description: "Battery with a sloshing liquid fill that springs to the level, colors by charge, and a pulsing bolt while charging.",
  category: "widgets",
  platforms: ["web"],
  engine: "motion",
  dependencies: ["motion"],
  registryDependencies: ["kinetik-core"],
  tags: ["battery","meter","widget","device"],
  pageTypes: ["dashboard","settings"],
  inspiration: ["iOS Batteries widget"],
  a11y: "role=meter with value and label; status text ('Charging', 'Low power').",
  perf: "Fill height spring + looping wave transform.",
  status: "stable",
  priority: "P2",
  previewHeight: 260,
  props: [
    { name: "level", type: "number", description: "0–100." },
    { name: "charging", type: "boolean", default: "false", description: "Show the bolt." },
    { name: "label", type: "string", default: "\"iPhone\"", description: "Device name." },
  ],
};
