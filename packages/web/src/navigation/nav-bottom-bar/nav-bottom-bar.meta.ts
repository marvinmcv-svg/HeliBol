import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  id: "nav-bottom-bar",
  name: "Bottom Tab Bar",
  description: "Mobile bottom tab bar where a pill slides to the active tab, its icon bounces and its label expands inline.",
  category: "navigation",
  platforms: ["web"],
  engine: "motion",
  dependencies: ["motion"],
  registryDependencies: ["kinetik-core"],
  tags: ["tab bar","mobile","bottom nav","pill"],
  pageTypes: ["dashboard","social","media"],
  inspiration: ["Mobbin tab bars","Google Bottom navigation"],
  a11y: "tablist/tab roles with aria-selected; labels available to screen readers.",
  perf: "Shared layoutId pill; tiny keyframes.",
  status: "stable",
  priority: "P1",
  previewHeight: 240,
  props: [
    { name: "items", type: "{ icon, label }[]", description: "Tabs." },
  ],
};
