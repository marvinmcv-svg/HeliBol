import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  id: "mockup-watch",
  name: "Mockup — Smartwatch",
  description: "Smartwatch mockup with a working digital crown: drag the crown, scroll over the face or use ↑/↓ and the app list rolls on a curved fish-eye path — centre rows big and bright, edge rows shrinking inward — snapping to the nearest row.",
  category: "mockups",
  platforms: ["web"],
  engine: "motion",
  dependencies: ["motion"],
  registryDependencies: ["kinetik-core"],
  tags: ["premium","mockup","watch","wearable","crown","fisheye","device"],
  pageTypes: ["landing","portfolio"],
  inspiration: ["kinetik Premium collection"],
  a11y: "Face is a focusable listbox with aria-activedescendant; the crown is a labelled button. Reduced motion snaps without springs.",
  perf: "One motion value drives every row through transforms; no re-render while scrolling except the active index.",
  status: "stable",
  priority: "P1",
  previewHeight: 520,
  props: [
    { name: "apps", type: "{ name; icon; color }[]", description: "Apps in the list." },
  ],
};
