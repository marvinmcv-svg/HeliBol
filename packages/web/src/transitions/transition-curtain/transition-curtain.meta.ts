import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  id: "transition-curtain",
  name: "Curtain Page Transition",
  description: "Layered colored panels sweep up to cover the screen, the route swaps underneath with its title shown, then they sweep away.",
  category: "transitions",
  platforms: ["web"],
  engine: "motion",
  dependencies: ["motion"],
  registryDependencies: ["kinetik-core"],
  tags: ["page transition","curtain","wipe","agency"],
  pageTypes: ["portfolio","landing"],
  inspiration: ["Barba.js transitions","Awwwards"],
  a11y: "Navigation is real buttons with aria-current; reduced motion swaps instantly.",
  perf: "Three transformed panels during the transition only.",
  status: "stable",
  priority: "P2",
  previewHeight: 400,
  props: [
    { name: "pages", type: "{ title, content }[]", description: "Pages." },
    { name: "colors", type: "string[]", description: "Panel colors (back to front)." },
  ],
};
