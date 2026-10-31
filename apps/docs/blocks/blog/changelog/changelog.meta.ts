import type { ComponentMeta } from "@web/types";
export const meta: ComponentMeta = {
  id: "changelog", name: "Changelog Timeline", category: "scroll", platforms: ["web"], engine: "motion",
  description: "Release timeline whose rail draws down as you arrive and version dots pop onto it with each entry.",
  dependencies: ["motion"], registryDependencies: ["kinetik-core"], tags: ["changelog", "timeline", "releases", "docs"],
  pageTypes: ["blog", "docs"], a11y: "Ordered list with dates and versions as text.", perf: "whileInView once per entry.",
  status: "stable", priority: "P2", previewHeight: 560,
};
