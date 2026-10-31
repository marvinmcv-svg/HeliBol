import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  id: "button-expand-icon",
  name: "Expanding Icon Button",
  description: "Icon-only circles that widen to reveal a label on hover or focus — compact toolbars that still explain themselves.",
  category: "buttons",
  platforms: ["web"],
  engine: "css",
  dependencies: [],
  registryDependencies: ["kinetik-core"],
  tags: ["icon button","toolbar","expand","hover","css-only"],
  pageTypes: ["dashboard","ecommerce","social"],
  inspiration: ["Linear toolbars"],
  a11y: "aria-label always present, so the label isn't required to understand the control; expands on focus-visible.",
  perf: "grid-template-columns 0fr→1fr transition; 0 KB JS.",
  status: "stable",
  priority: "P2",
  previewHeight: 220,
  props: [
    { name: "icon", type: "ReactNode", description: "Icon element." },
    { name: "label", type: "string", description: "Accessible + revealed label." },
  ],
};
