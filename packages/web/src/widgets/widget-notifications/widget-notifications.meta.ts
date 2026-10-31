import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  id: "widget-notifications",
  name: "Notification Feed",
  description: "New notifications drop in at the top on a loop, pushing older ones down — the animated list for social proof and dashboards.",
  category: "widgets",
  platforms: ["web"],
  engine: "motion",
  dependencies: ["motion"],
  registryDependencies: ["kinetik-core"],
  tags: ["notifications","feed","animated list","social proof"],
  pageTypes: ["landing","dashboard"],
  inspiration: ["Magic UI Animated List"],
  a11y: "aria-live polite list.",
  perf: "Max N items; layout animation on insert.",
  status: "stable",
  priority: "P2",
  previewHeight: 380,
  props: [
    { name: "items", type: "{ icon, title, body, time, color }[]", description: "Notifications to cycle." },
    { name: "interval", type: "number", default: "1800", description: "ms between items." },
    { name: "max", type: "number", default: "4", description: "Visible items." },
  ],
};
