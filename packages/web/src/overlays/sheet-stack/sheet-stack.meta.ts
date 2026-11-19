import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  id: "sheet-stack",
  name: "Stacked Sheets",
  description: "iOS-style stacked sheets: each new sheet slides up while the layers beneath scale back, dim and round their corners; drag a sheet down (or Esc) to dismiss and everything springs forward.",
  category: "overlays",
  platforms: ["web"],
  engine: "motion",
  dependencies: ["motion"],
  registryDependencies: ["kinetik-core"],
  tags: ["premium","sheet","modal","ios","stack","drawer"],
  pageTypes: ["settings","social"],
  inspiration: ["kinetik Premium collection"],
  a11y: "Top sheet is an aria-modal dialog that receives focus; lower layers are aria-hidden; Esc and the grabber button close. Reduced motion: no drag, fades.",
  perf: "Transforms and a brightness filter per layer.",
  status: "stable",
  priority: "P1",
  previewHeight: 460,
  props: [
    { name: "sheets", type: "{ id, title, content }[]", description: "Open sheets." },
    { name: "onClose", type: "(id) => void", description: "Dismiss handler." },
    { name: "children", type: "ReactNode", description: "Page underneath." },
  ],
};
