import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  id: "popover-morph",
  name: "Morphing Popover",
  description: "A button that morphs (shared layout) into a panel — feedback forms, quick-add, share sheets.",
  category: "overlays",
  platforms: ["web"],
  engine: "motion",
  dependencies: ["motion"],
  registryDependencies: ["kinetik-core"],
  tags: ["popover","morph","layoutId","form","feedback"],
  pageTypes: ["dashboard","landing","settings"],
  inspiration: ["Motion Primitives Morphing Popover","Cult UI Popover Form"],
  a11y: "Panel is a labelled dialog; Esc and click-outside close; focus moves into the form.",
  perf: "One shared-layout morph.",
  status: "stable",
  priority: "P1",
  previewHeight: 320,
  props: [
    { name: "label", type: "ReactNode", description: "Button label." },
    { name: "title", type: "string", description: "Panel title." },
    { name: "children", type: "(close) => ReactNode", description: "Panel content." },
  ],
};
