import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  id: "layout-split-panes",
  name: "Layout — Split Panes",
  description: "Resizable split view with feel: drag the handle and the panes resize live; release near a snap point (⅓, ½, ⅔) and it springs into place. The grip grows while dragging and shows the ratio. Arrow keys, Home/End and double-click to reset.",
  category: "layout",
  platforms: ["web"],
  engine: "motion",
  dependencies: ["motion"],
  registryDependencies: ["kinetik-core"],
  tags: ["premium","layout","split","resize","panes","editor","drag"],
  pageTypes: ["dashboard","docs"],
  inspiration: ["kinetik Premium collection"],
  a11y: "Handle is role=separator with live aria-valuenow; ←/→, Home/End, Enter reset. Reduced motion snaps without springs.",
  perf: "One motion value drives the left width; no layout thrash beyond the resize itself.",
  status: "stable",
  priority: "P1",
  previewHeight: 420,
  props: [
    { name: "left", type: "ReactNode", description: "Left pane." },
    { name: "right", type: "ReactNode", description: "Right pane." },
    { name: "defaultSplit", type: "number", default: "0.5", description: "Initial ratio." },
    { name: "snaps", type: "number[]", default: "[⅓, ½, ⅔]", description: "Snap points." },
    { name: "min / max", type: "number", default: "0.2 / 0.8", description: "Limits." },
  ],
};
