import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  id: "cursor-context-label",
  name: "Context Label Cursor",
  description: "A cursor that reads the room: over elements marked data-cursor=\"View\" (or Drag, Play…) the dot morphs into a pill showing that label in the element's colour; elsewhere it's a small difference-blend dot.",
  category: "cursor",
  platforms: ["web"],
  engine: "motion",
  dependencies: ["motion"],
  registryDependencies: ["kinetik-core"],
  tags: ["premium","cursor","label","portfolio","hover","agency"],
  pageTypes: ["portfolio","landing"],
  inspiration: ["kinetik Premium collection"],
  a11y: "Native cursor is hidden only on fine pointers inside the area; every target is still a real link/button with its own name. Off on touch.",
  perf: "Spring motion values; label swaps only when the hovered target changes.",
  status: "stable",
  priority: "P1",
  previewHeight: 380,
  props: [
    { name: "children", type: "ReactNode", description: "Area content with data-cursor targets." },
  ],
};
