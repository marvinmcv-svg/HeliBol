import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  id: "tooltip-animated",
  name: "Spring Tooltip",
  description: "Tooltips that spring from their anchor (origin-aware), with hover delay, instant on keyboard focus and a quick exit.",
  category: "overlays",
  platforms: ["web"],
  engine: "motion",
  dependencies: ["motion"],
  registryDependencies: ["kinetik-core"],
  tags: ["tooltip", "hint", "toolbar", "spring"],
  pageTypes: ["dashboard", "docs", "settings"],
  inspiration: ["Radix Tooltip", "Figma toolbar hints"],
  a11y: "role=tooltip wired with aria-describedby; opens on focus, closes on blur and Esc.",
  perf: "Mounted only while open.",
  status: "stable",
  priority: "P1",
  previewHeight: 220,
  props: [
    { name: "content", type: "ReactNode", description: "Tooltip content." },
    { name: "side", type: '"top" | "bottom"', default: '"top"', description: "Placement." },
    { name: "delay", type: "number", default: "300", description: "Hover delay (ms)." },
  ],
};
