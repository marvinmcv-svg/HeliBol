import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  id: "card-folder",
  name: "Folder Card",
  description: "A folder whose flap tilts open on hover/click while the papers inside slide up and fan out.",
  category: "cards",
  platforms: ["web"],
  engine: "motion",
  dependencies: ["motion"],
  registryDependencies: ["kinetik-core"],
  tags: ["folder","files","playful","3d"],
  pageTypes: ["portfolio","dashboard"],
  inspiration: ["React Bits Folder","macOS folders"],
  a11y: "Button with aria-expanded; opens on click for touch/keyboard.",
  perf: "Transforms on four elements.",
  status: "stable",
  priority: "P2",
  previewHeight: 320,
  props: [
    { name: "papers", type: "ReactNode[]", description: "Up to 3 papers." },
    { name: "color", type: "string", default: "\"#6366f1\"", description: "Folder color." },
  ],
};
