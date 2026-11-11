import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  id: "pagination-animated",
  name: "Animated Pagination",
  description: "Pagination where the active pill slides between pages, numbers shuffle in and out as the window moves, and arrows nudge in their direction on press.",
  category: "navigation",
  platforms: ["web"],
  engine: "motion",
  dependencies: ["motion","lucide-react"],
  registryDependencies: ["kinetik-core"],
  tags: ["pagination","pages","navigation","table"],
  pageTypes: ["dashboard","blog","ecommerce"],
  inspiration: ["21st.dev — Paginations"],
  a11y: "nav landmark, aria-current=page, labelled buttons, ellipses hidden from AT. Reduced motion: instant.",
  perf: "popLayout list with a single layoutId pill.",
  status: "stable",
  priority: "P2",
  previewHeight: 280,
  props: [
    { name: "page", type: "number", description: "Current page (1-based)." },
    { name: "total", type: "number", description: "Page count." },
    { name: "onChange", type: "(p) => void", description: "Page change." },
    { name: "siblings", type: "number", default: "1", description: "Pages either side." },
  ],
};
