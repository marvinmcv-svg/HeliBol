import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  id: "parallax-layer",
  name: "Parallax Layer",
  description: "Wrap anything to give it its own scroll speed. Stack several with different speeds for collage-style depth.",
  category: "scroll",
  platforms: ["web"],
  engine: "motion",
  dependencies: ["motion"],
  registryDependencies: ["kinetik-core"],
  tags: ["parallax", "depth", "collage", "scroll", "images"],
  pageTypes: ["landing", "portfolio"],
  inspiration: ["Lusion / Locomotive sites", "Apple iPhone pages"],
  a11y: "Pure decoration; reduced motion pins layers in place.",
  perf: "Transform-only; one scroll observer per layer via Motion's shared scroll tracker.",
  status: "stable",
  priority: "P1",
  previewHeight: 420,
  props: [
    { name: "speed", type: "number", default: "120", description: "Total px of travel while passing through the viewport; negative inverts." },
    { name: "container", type: "RefObject<HTMLElement>", description: "Custom scroll container." },
  ],
};
