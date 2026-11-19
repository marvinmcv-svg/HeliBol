import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  id: "sortable-grid",
  name: "Sortable Grid",
  description: "iOS home-screen reordering in a 2D grid: drag a tile, it lifts and tilts, and the others slide out of the way as you pass over their slots; full keyboard pick-up/move/drop.",
  category: "layout",
  platforms: ["web"],
  engine: "motion",
  dependencies: ["motion"],
  registryDependencies: ["kinetik-core"],
  tags: ["premium","drag","reorder","grid","icons","sortable"],
  pageTypes: ["dashboard","settings"],
  inspiration: ["kinetik Premium collection"],
  a11y: "listbox/option roles; Space picks up/drops, arrows move, Esc cancels; every move is announced. Reduced motion: no lift/tilt.",
  perf: "Layout springs only on moved tiles; nearest-slot search on drag.",
  status: "stable",
  priority: "P1",
  previewHeight: 420,
  props: [
    { name: "items", type: "{ id, label, content }[]", description: "Tiles." },
    { name: "columns", type: "number", default: "4", description: "Grid columns." },
    { name: "onReorder", type: "(ids) => void", description: "After a drop." },
  ],
};
