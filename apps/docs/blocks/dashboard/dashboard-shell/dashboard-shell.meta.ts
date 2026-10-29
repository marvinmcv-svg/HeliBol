import type { ComponentMeta } from "@web/types";

export const meta: ComponentMeta = {
  id: "dashboard-shell",
  name: "Dashboard Shell",
  description: "Collapsible spring sidebar with a gliding active indicator, period tabs, KPI tickers with sparklines and a self-drawing chart.",
  category: "data",
  platforms: ["web"],
  engine: "motion",
  dependencies: ["motion", "lucide-react"],
  registryDependencies: ["kinetik-core", "stat-counter-grid", "chart-line-draw", "animated-tabs"],
  tags: ["dashboard", "sidebar", "admin", "analytics", "app shell"],
  pageTypes: ["dashboard"],
  a11y: "Collapsed icons keep aria-labels; aria-current on the active page; toggle button labelled.",
  perf: "Sidebar width springs on one element; labels mount/unmount with short fades.",
  status: "stable",
  priority: "P1",
  previewHeight: 600,
};
