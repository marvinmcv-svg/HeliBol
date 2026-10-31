import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  id: "select-animated",
  name: "Animated Select",
  description: "Custom listbox select: the menu unfolds from the trigger, options stagger in and a highlight follows the active option.",
  category: "forms",
  platforms: ["web"],
  engine: "motion",
  dependencies: ["motion","lucide-react"],
  registryDependencies: ["kinetik-core"],
  tags: ["select","dropdown","listbox","form"],
  pageTypes: ["settings","dashboard","ecommerce"],
  inspiration: ["Radix Select","Linear dropdowns"],
  a11y: "Button + listbox with aria-activedescendant; ↑/↓/Enter/Esc; click outside closes.",
  perf: "Mounted while open; layoutId highlight.",
  status: "stable",
  priority: "P1",
  previewHeight: 380,
  props: [
    { name: "options", type: "{ value, label, hint? }[]", description: "Options." },
    { name: "value / onChange", type: "string / (v) => void", description: "Controlled value." },
    { name: "label", type: "string", description: "Accessible label." },
  ],
};
