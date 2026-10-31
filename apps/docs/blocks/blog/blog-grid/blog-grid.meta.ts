import type { ComponentMeta } from "@web/types";
export const meta: ComponentMeta = {
  id: "blog-grid", name: "Blog Grid — Filterable", category: "cards", platforms: ["web"], engine: "motion",
  description: "Journal index: category tabs filter the grid with FLIP reshuffling; cards reveal excerpts on hover.",
  dependencies: ["motion"], registryDependencies: ["kinetik-core", "animated-tabs", "card-hover-reveal"], tags: ["blog", "filter", "grid", "flip"],
  pageTypes: ["blog"], a11y: "Tabs pattern for filters; cards focusable with the same reveal.", perf: "Layout animations on ≤ 12 cards.",
  status: "stable", priority: "P2", previewHeight: 640,
};
