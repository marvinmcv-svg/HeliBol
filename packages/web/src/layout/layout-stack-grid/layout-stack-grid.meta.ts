import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  id: "layout-stack-grid",
  name: "Layout — Stack ⇄ Grid ⇄ List",
  description: "One collection, three layouts: a messy stacked deck, a tidy grid and a compact list. Switching animates every card from where it is to where it belongs with a per-card stagger, so the deck deals itself out.",
  category: "layout",
  platforms: ["web"],
  engine: "motion",
  dependencies: ["motion"],
  registryDependencies: ["kinetik-core"],
  tags: ["premium","layout","grid","list","stack","shared-layout","gallery"],
  pageTypes: ["dashboard","portfolio","media"],
  inspiration: ["kinetik Premium collection"],
  a11y: "Mode switch is a radiogroup; reduced motion switches instantly.",
  perf: "Motion layout animations (transform-based FLIP).",
  status: "stable",
  priority: "P1",
  previewHeight: 460,
  props: [
    { name: "items", type: "{ id; src; title; meta? }[]", description: "Items." },
    { name: "defaultMode", type: "'stack' | 'grid' | 'list'", default: "stack", description: "Initial layout." },
  ],
};
