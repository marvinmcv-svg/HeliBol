import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  id: "transition-stairs",
  name: "Transition — Stairs",
  description: "Staircase page transition: vertical columns drop in one after another, a big index number appears while the page swaps under cover, then the columns keep falling out the bottom in the same order.",
  category: "transitions",
  platforms: ["web"],
  engine: "motion",
  dependencies: ["motion"],
  registryDependencies: ["kinetik-core"],
  tags: ["premium","transition","stairs","columns","page","stagger"],
  pageTypes: ["portfolio","landing"],
  inspiration: ["kinetik Premium collection"],
  a11y: "Columns are decorative; nav uses aria-current. Reduced motion swaps instantly.",
  perf: "N transformed divs; no layout work.",
  status: "stable",
  priority: "P1",
  previewHeight: 480,
  props: [
    { name: "pages", type: "{ title; content }[]", description: "Pages." },
    { name: "steps", type: "number", default: "6", description: "Columns." },
    { name: "color", type: "string", default: "#111", description: "Column colour." },
  ],
};
