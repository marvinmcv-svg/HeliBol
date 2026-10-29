import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  id: "reorder-list",
  name: "Reorder List",
  description: "Drag a handle to reorder; siblings spring out of the way. Up/down buttons give a keyboard-accessible alternative.",
  category: "layout",
  platforms: ["web"],
  engine: "motion",
  dependencies: ["motion", "lucide-react"],
  registryDependencies: ["kinetik-core"],
  tags: ["drag", "reorder", "sortable", "todo", "kanban"],
  pageTypes: ["dashboard", "settings"],
  inspiration: ["Motion Reorder", "Linear priority lists"],
  a11y: "Drag is pointer-only, so each row has Move up / Move down buttons. Handle has an aria-label.",
  perf: "Motion Reorder uses layout projection (transforms) for sibling movement.",
  status: "stable",
  priority: "P1",
  previewHeight: 360,
  props: [
    { name: "items", type: "T[] (with id)", description: "Ordered items." },
    { name: "onReorder", type: "(items) => void", description: "New order." },
    { name: "render", type: "(item) => ReactNode", description: "Row content." },
  ],
};
