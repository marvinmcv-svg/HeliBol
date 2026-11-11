import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  id: "data-table",
  name: "Animated Data Table",
  description: "Sortable, filterable, selectable table: rows glide to their new order, filtered rows fade out, the sort arrow flips and a bulk-action bar springs up on selection.",
  category: "data",
  platforms: ["web"],
  engine: "motion",
  dependencies: ["motion","lucide-react"],
  registryDependencies: ["kinetik-core"],
  tags: ["table","sort","filter","selection","dashboard"],
  pageTypes: ["dashboard","settings"],
  inspiration: ["21st.dev — Tables"],
  a11y: "Real <table> with caption, scope=col and aria-sort; checkboxes labelled per row; bulk bar is role=status. Reduced motion: no row movement.",
  perf: "layout=\"position\" on rows only (no size animation); memoised filtering/sorting.",
  status: "stable",
  priority: "P1",
  previewHeight: 420,
  props: [
    { name: "rows", type: "T[] (with id)", description: "Data." },
    { name: "columns", type: "{ key, header, render?, align?, sortable? }[]", description: "Columns." },
    { name: "searchKeys", type: "(keyof T)[]", default: "all columns", description: "Filtered keys." },
    { name: "caption", type: "string", description: "Accessible caption." },
  ],
};
