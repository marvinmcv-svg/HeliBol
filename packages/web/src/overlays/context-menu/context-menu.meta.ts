import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  id: "context-menu",
  name: "Context Menu",
  description: "Right-click menu that scales from the click point with staggered items, shortcuts and full arrow-key navigation.",
  category: "overlays",
  platforms: ["web"],
  engine: "motion",
  dependencies: ["motion"],
  registryDependencies: ["kinetik-core"],
  tags: ["context menu","right click","menu","shortcuts"],
  pageTypes: ["dashboard","docs"],
  inspiration: ["macOS context menus","Radix Context Menu"],
  a11y: "Opens with Shift+F10 / Menu key too; role=menu/menuitem; focus moves in; arrows and Esc work.",
  perf: "Mounted only while open.",
  status: "stable",
  priority: "P2",
  previewHeight: 320,
  props: [
    { name: "actions", type: "{ label, icon?, shortcut?, danger?, onSelect? }[]", description: "Menu items." },
  ],
};
