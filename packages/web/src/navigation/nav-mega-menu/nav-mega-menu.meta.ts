import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  id: "nav-mega-menu",
  name: "Morphing Mega Menu",
  description: "Stripe-style dropdown: one shared panel morphs its size between menus and slides content in the direction you move.",
  category: "navigation",
  platforms: ["web"],
  engine: "motion",
  dependencies: ["motion","lucide-react"],
  registryDependencies: ["kinetik-core"],
  tags: ["mega menu","dropdown","stripe","navigation"],
  pageTypes: ["landing"],
  inspiration: ["Stripe navigation","Vercel menu"],
  a11y: "Triggers are buttons with aria-expanded/controls; opens on focus; Esc closes.",
  perf: "Single panel with layout animation.",
  status: "stable",
  priority: "P2",
  previewHeight: 420,
  props: [
    { name: "items", type: "{ label, content }[]", description: "Menus." },
  ],
};
