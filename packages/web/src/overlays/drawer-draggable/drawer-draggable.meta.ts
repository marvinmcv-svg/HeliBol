import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  id: "drawer-draggable",
  name: "Draggable Drawer",
  description: "Bottom sheet that follows your finger, rubber-bands upward and dismisses on distance or flick velocity — Vaul-style.",
  category: "overlays",
  platforms: ["web"],
  engine: "motion",
  dependencies: ["motion"],
  registryDependencies: ["kinetik-core"],
  tags: ["drawer", "bottom sheet", "drag", "mobile", "vaul"],
  pageTypes: ["ecommerce", "dashboard", "settings"],
  inspiration: ["Vaul by Emil Kowalski", "iOS sheets"],
  a11y: "role=dialog, focus moves in and is restored on close; Esc and backdrop close it, so dragging is never required.",
  perf: "Drag via transforms; dismiss threshold uses Motion's velocity tracking.",
  status: "stable",
  priority: "P1",
  previewHeight: 380,
  props: [
    { name: "open / onOpenChange", type: "boolean / (open) => void", description: "Controlled state." },
    { name: "title", type: "string", description: "Accessible label + heading." },
    { name: "contained", type: "boolean", default: "false", description: "Absolute inside parent instead of fixed." },
  ],
};
