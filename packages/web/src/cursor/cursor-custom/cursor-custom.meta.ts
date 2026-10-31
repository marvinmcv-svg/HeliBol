import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  id: "cursor-custom",
  name: "Custom Cursor",
  description: "Dot + lagging ring cursor with states: grows over links, becomes a 'View'/'Drag' bubble over tagged media.",
  category: "cursor",
  platforms: ["web"],
  engine: "motion",
  dependencies: ["motion"],
  registryDependencies: ["kinetik-core"],
  tags: ["cursor","custom cursor","portfolio","agency"],
  pageTypes: ["portfolio","landing"],
  inspiration: ["Awwwards agency cursors","Cuberto mouse follower"],
  a11y: "Native cursor restored on touch devices and reduced motion; states are decorative (links stay real links).",
  perf: "Springs on two absolutely positioned elements; one pointermove listener.",
  status: "stable",
  priority: "P2",
  previewHeight: 340,
  props: [
    { name: "children", type: "ReactNode", description: "Area where the cursor applies." },
    { name: "data-cursor", type: "\"link\" | \"view\"", description: "Attribute on children to switch state." },
    { name: "data-cursor-text", type: "string", description: "Custom bubble label." },
  ],
};
