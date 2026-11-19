import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  id: "image-accordion",
  name: "Image Accordion",
  description: "Tall photo panels where the active one expands (flex-grow spring) to tell its story while the others collapse to slim strips with vertical titles. Stacks vertically on phones.",
  category: "layout",
  platforms: ["web"],
  engine: "motion",
  dependencies: ["motion"],
  registryDependencies: ["kinetik-core"],
  tags: ["premium","accordion","gallery","images","expand","travel"],
  pageTypes: ["landing","portfolio","media"],
  inspiration: ["kinetik Premium collection"],
  a11y: "tablist/tab/tabpanel roles with roving tabindex and arrow keys; mouse hover, focus or tap selects. Reduced motion: instant.",
  perf: "flex-grow and image scale/saturation springs; content mounts only for the active panel.",
  status: "stable",
  priority: "P1",
  previewHeight: 420,
  props: [
    { name: "items", type: "{ image, title, kicker?, body? }[]", description: "Panels." },
    { name: "defaultIndex", type: "number", default: "0", description: "Initially open." },
  ],
};
