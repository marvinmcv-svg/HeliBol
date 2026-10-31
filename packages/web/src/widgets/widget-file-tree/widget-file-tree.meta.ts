import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  id: "widget-file-tree",
  name: "File Tree",
  description: "Collapsible file tree with smooth height animation, rotating chevrons and open/closed folder icons.",
  category: "widgets",
  platforms: ["web"],
  engine: "motion",
  dependencies: ["motion","lucide-react"],
  registryDependencies: ["kinetik-core"],
  tags: ["file tree","explorer","docs","ide"],
  pageTypes: ["docs","dashboard"],
  inspiration: ["Magic UI File Tree","VS Code explorer"],
  a11y: "tree / treeitem / group roles with aria-expanded and aria-selected.",
  perf: "Height auto animation per folder.",
  status: "stable",
  priority: "P2",
  previewHeight: 380,
  props: [
    { name: "tree", type: "{ name, children? }[]", description: "Nodes." },
  ],
};
