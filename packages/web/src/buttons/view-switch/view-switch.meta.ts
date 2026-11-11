import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  id: "view-switch",
  name: "View Switch Icons",
  description: "A list / compact / cards view switcher whose glyphs are the same four rectangles morphing between layouts, with a pill sliding under the active mode.",
  category: "buttons",
  platforms: ["web"],
  engine: "motion",
  dependencies: ["motion"],
  registryDependencies: ["kinetik-core"],
  tags: ["segmented control","icons","view","toggle","morph"],
  pageTypes: ["dashboard","ecommerce"],
  inspiration: ["unlumen UI — List/Compact/Cards View Icons"],
  a11y: "radiogroup with labelled radio buttons. Reduced motion: instant.",
  perf: "Springs on SVG rect attributes; layoutId pill.",
  status: "stable",
  priority: "P2",
  previewHeight: 380,
  props: [
    { name: "value", type: "'list' | 'compact' | 'cards'", description: "Current view." },
    { name: "onChange", type: "(v) => void", description: "Change handler." },
  ],
};
