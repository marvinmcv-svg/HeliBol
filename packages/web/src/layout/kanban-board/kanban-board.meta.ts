import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  id: "kanban-board",
  name: "Kanban Board",
  description: "Kanban board: drag cards between and within columns (native drag-and-drop, no library) or move them with buttons; every card glides to its new slot with shared layout and the target column lights up.",
  category: "layout",
  platforms: ["web"],
  engine: "motion",
  dependencies: ["motion","lucide-react"],
  registryDependencies: ["kinetik-core"],
  tags: ["kanban","drag and drop","board","tasks","productivity"],
  pageTypes: ["dashboard"],
  inspiration: ["21st.dev category gap (audit 2026-11)"],
  a11y: "Each column is a labelled section with a count; move-left/right buttons give a keyboard path; moves are announced via aria-live. Reduced motion: no layout animation.",
  perf: "layoutId per card; drag state is two small pieces of state.",
  status: "stable",
  priority: "P1",
  previewHeight: 420,
  props: [
    { name: "columns", type: "{ id, title, cards }[]", description: "Initial board." },
    { name: "onChange", type: "(columns) => void", description: "After every move." },
  ],
};
