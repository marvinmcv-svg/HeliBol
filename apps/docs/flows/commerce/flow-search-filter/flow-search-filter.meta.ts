import type { ComponentMeta } from "@web/types";
export const meta: ComponentMeta = {
  id: "flow-search-filter", name: "Search & Filter", category: "forms", platforms: ["native", "web"], engine: "motion",
  description: "Shop search journey: the search bar takes over the header, recent searches stagger in, a filter sheet with chips and a price cap springs up, and the results grid re-flows with layout animations — with a helpful empty result.",
  dependencies: ["motion", "lucide-react"], registryDependencies: ["kinetik-core"], tags: ["search", "filter", "bottom sheet", "ecommerce", "mobile"],
  pageTypes: ["ecommerce"], inspiration: ["Mobbin — search & filtering flows", "Nike", "Zara"],
  a11y: "Labelled search input, filter button announces active count, chips use aria-pressed, result count is aria-live, the sheet is a labelled dialog. Reduced motion: instant layout changes.",
  perf: "Filtering is memoised; grid uses popLayout so exits don't block re-flow.",
  status: "stable", priority: "P1", previewHeight: 700, steps: ["Browse", "Search", "Filters", "Results"],
};
