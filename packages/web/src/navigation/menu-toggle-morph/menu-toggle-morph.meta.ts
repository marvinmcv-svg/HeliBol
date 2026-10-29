import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  id: "menu-toggle-morph",
  name: "Morphing Menu",
  description: "Hamburger morphs to an X while a full-screen menu circle-wipes open from the button and links rise from masks in sequence.",
  category: "navigation",
  platforms: ["web"],
  engine: "motion",
  dependencies: ["motion"],
  registryDependencies: ["kinetik-core"],
  tags: ["menu", "hamburger", "fullscreen", "mobile nav", "clip-path"],
  pageTypes: ["portfolio", "landing"],
  inspiration: ["Agency sites on Awwwards", "Codrops fullscreen menus"],
  a11y: "aria-expanded/controls on the toggle, Esc closes, links are real anchors.",
  perf: "clip-path + transforms only; exit is staggered in reverse.",
  status: "stable",
  priority: "P1",
  previewHeight: 400,
  props: [
    { name: "links", type: "{ label, href }[]", description: "Menu links." },
    { name: "contained", type: "boolean", default: "false", description: "Absolute (inside parent) instead of fixed overlay." },
  ],
};
