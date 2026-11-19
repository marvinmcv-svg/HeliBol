import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  id: "nav-circle-reveal",
  name: "Circle Reveal Menu",
  description: "Full-screen menu that pours out of the menu button: a clip-path circle expands from the button's centre, huge links rise from behind a mask with stagger, and hovering a link cross-fades its preview image.",
  category: "navigation",
  platforms: ["web"],
  engine: "motion",
  dependencies: ["motion"],
  registryDependencies: ["kinetik-core"],
  tags: ["premium","menu","fullscreen","clip-path","agency","navigation"],
  pageTypes: ["portfolio","landing"],
  inspiration: ["kinetik Premium collection"],
  a11y: "Toggle with aria-expanded; Esc closes and returns focus; links are real anchors. Reduced motion: fade.",
  perf: "clip-path animation on one layer; images mount on hover only.",
  status: "stable",
  priority: "P1",
  previewHeight: 420,
  props: [
    { name: "links", type: "{ label, href, image? }[]", description: "Menu links." },
    { name: "footer", type: "string", description: "Footer text." },
    { name: "defaultOpen", type: "boolean", default: "false", description: "Start open." },
  ],
};
