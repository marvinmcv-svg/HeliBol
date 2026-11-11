import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  id: "pinned-list",
  name: "Pinned List",
  description: "A list where pinning an item flies it up into the Pinned section with a shared-layout transition while the rest close the gap.",
  category: "layout",
  platforms: ["web"],
  engine: "motion",
  dependencies: ["motion","lucide-react"],
  registryDependencies: ["kinetik-core"],
  tags: ["list","pin","layout","favorites","sidebar"],
  pageTypes: ["dashboard","docs"],
  inspiration: ["unlumen UI — Pinned List"],
  a11y: "Pin buttons have aria-pressed and a descriptive label; they appear on hover and on focus. Reduced motion: instant reorder.",
  perf: "layoutId per row; only moved rows animate.",
  status: "stable",
  priority: "P2",
  previewHeight: 380,
  props: [
    { name: "items", type: "{ id, title, subtitle?, icon? }[]", description: "Items." },
    { name: "defaultPinned", type: "string[]", default: "[]", description: "Initially pinned ids." },
  ],
};
