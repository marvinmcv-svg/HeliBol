import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  id: "nav-drawer-3d",
  name: "Menu — 3D Push Drawer",
  description: "Mobile menu that pushes the page back in 3D: the page rotates on Y, slides right and scales down with rounded corners and a deep shadow, revealing a dark menu whose links slide in with a stagger.",
  category: "navigation",
  platforms: ["web"],
  engine: "motion",
  dependencies: ["motion"],
  registryDependencies: ["kinetik-core"],
  tags: ["premium","menu","drawer","3d","mobile","navigation","push"],
  pageTypes: ["landing","ecommerce","media"],
  inspiration: ["kinetik Premium collection"],
  a11y: "Menu is a nav landmark; closed menu and open page are inert; Esc closes and returns focus to the toggle. Reduced motion: slide only, no rotation.",
  perf: "Transform-only animation on the page wrapper.",
  status: "stable",
  priority: "P1",
  previewHeight: 520,
  props: [
    { name: "children", type: "ReactNode", description: "Page content." },
    { name: "links", type: "{ label; href; icon? }[]", description: "Menu links." },
    { name: "footer", type: "ReactNode", description: "Menu footer." },
    { name: "defaultOpen", type: "boolean", default: "false", description: "Start open." },
  ],
};
