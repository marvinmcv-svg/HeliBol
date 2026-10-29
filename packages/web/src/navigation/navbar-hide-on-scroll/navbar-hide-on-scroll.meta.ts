import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  id: "navbar-hide-on-scroll",
  name: "Smart Navbar",
  description: "Full-width bar that morphs into a floating glass pill after scrolling, hides on scroll-down and reappears on scroll-up.",
  category: "navigation",
  platforms: ["web"],
  engine: "motion",
  dependencies: ["motion"],
  registryDependencies: ["kinetik-core"],
  tags: ["navbar", "header", "sticky", "scroll", "glass"],
  pageTypes: ["landing", "blog", "docs"],
  inspiration: ["Medium / Linear headers", "Dynamic island navbars"],
  a11y: "Re-shows immediately whenever focus enters it, so keyboard users never tab into a hidden nav.",
  perf: "Motion's scroll listener; layout morph on one element.",
  status: "stable",
  priority: "P1",
  previewHeight: 400,
  props: [
    { name: "threshold", type: "number", default: "40", description: "Scroll px before compacting." },
    { name: "container", type: "RefObject<HTMLElement>", description: "Custom scroller." },
  ],
};
