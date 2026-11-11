import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  id: "card-aurora",
  name: "Aurora Card",
  description: "A quiet card that wakes on hover: drifting aurora blobs fade in behind frosted glass and lean toward the cursor via CSS variables.",
  category: "cards",
  platforms: ["web"],
  engine: "css",
  dependencies: [],
  registryDependencies: ["kinetik-core"],
  tags: ["card","aurora","glass","hover","feature"],
  pageTypes: ["landing"],
  inspiration: ["unlumen UI — Aurora Card"],
  a11y: "Purely decorative layer; content stays readable at rest. Pointer lean is off on touch and reduced motion; blob drift stops under reduced motion.",
  perf: "CSS keyframes on three blurred blobs; pointer updates two CSS variables (no React renders).",
  status: "stable",
  priority: "P2",
  previewHeight: 360,
  props: [
    { name: "colors", type: "[string, string, string]", default: "cyan, violet, pink", description: "Blob colours." },
  ],
};
