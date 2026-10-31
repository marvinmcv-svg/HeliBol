import type { ComponentMeta } from "@web/types";
export const meta: ComponentMeta = {
  id: "stats-impact", name: "Stats — Live Impact", category: "data", platforms: ["web"], engine: "motion",
  description: "Impact section: a live odometer counter, KPI grid and a bar chart that grows on view.",
  dependencies: ["motion"], registryDependencies: ["kinetik-core", "text-odometer", "chart-bar-grow"], tags: ["stats", "kpi", "counter", "chart"],
  pageTypes: ["landing", "dashboard"], a11y: "Numbers exposed as text; chart has a text summary.", perf: "Odometer reels + one chart.",
  status: "stable", priority: "P2", previewHeight: 480,
};
