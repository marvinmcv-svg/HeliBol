import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  id: "dropdown-menu",
  name: "Dropdown Menu",
  description: "Menu button with the full WAI-ARIA keyboard model — arrows, Home/End, type-ahead, Esc returns focus. The panel springs from the trigger's corner, items stagger in and a highlight pill glides between them.",
  category: "overlays",
  platforms: ["web"],
  engine: "motion",
  dependencies: ["motion","lucide-react"],
  registryDependencies: ["kinetik-core"],
  tags: ["dropdown","menu","actions","keyboard","popover"],
  pageTypes: ["dashboard","settings"],
  inspiration: ["21st.dev category gap (audit 2026-11)"],
  a11y: "menu / menuitem / menuitemcheckbox roles with aria-activedescendant; Esc and Tab close; focus returns to the trigger. Reduced motion: fades only.",
  perf: "Panel mounts only while open; one layoutId highlight.",
  status: "stable",
  priority: "P1",
  previewHeight: 400,
  props: [
    { name: "trigger", type: "ReactNode", description: "Button content." },
    { name: "items", type: "DropdownItem[]", description: "Items, check items, labels and separators." },
    { name: "align", type: "'start' | 'end'", default: "'start'", description: "Panel alignment." },
  ],
};
