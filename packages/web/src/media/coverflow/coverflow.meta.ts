import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  id: "coverflow",
  name: "Cover Flow",
  description: "Classic 3D cover flow: the centered item faces you while neighbours rotate away in perspective.",
  category: "media",
  platforms: ["web"],
  engine: "motion",
  dependencies: ["motion"],
  registryDependencies: ["kinetik-core"],
  tags: ["coverflow","3d","carousel","albums"],
  pageTypes: ["media","portfolio"],
  inspiration: ["iTunes Cover Flow"],
  a11y: "listbox with options; ←/→ keys; click any cover to focus it.",
  perf: "Transforms on visible items; far items fade out.",
  status: "stable",
  priority: "P3",
  previewHeight: 340,
  props: [
    { name: "items", type: "{ src, title }[]", description: "Covers." },
  ],
};
