import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  id: "mockup-window",
  name: "macOS Window",
  description: "A macOS app window that zooms open from its dock icon and minimizes back into it.",
  category: "mockups",
  platforms: ["web"],
  engine: "motion",
  dependencies: ["motion"],
  registryDependencies: ["kinetik-core"],
  tags: ["macos","window","dock","minimize"],
  pageTypes: ["portfolio","landing"],
  inspiration: ["macOS genie effect"],
  a11y: "Window is a labelled dialog; traffic lights and dock icon are labelled buttons.",
  perf: "Scale/translate from a bottom origin.",
  status: "stable",
  priority: "P2",
  previewHeight: 380,
  props: [
    { name: "title", type: "string", description: "Window title." },
    { name: "icon", type: "ReactNode", description: "Dock icon." },
    { name: "children", type: "ReactNode", description: "Window content." },
  ],
};
