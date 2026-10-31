import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  id: "nav-hover-highlight",
  name: "Hover Highlight Nav",
  description: "A soft background highlight glides between nav items under the pointer or keyboard focus and fades out when you leave.",
  category: "navigation",
  platforms: ["web"],
  engine: "motion",
  dependencies: ["motion"],
  registryDependencies: ["kinetik-core"],
  tags: ["nav","hover","highlight","layoutId"],
  pageTypes: ["landing","docs","dashboard"],
  inspiration: ["Motion Primitives Animated Background","Vercel nav"],
  a11y: "Works with keyboard focus; links stay native.",
  perf: "One shared layoutId element.",
  status: "stable",
  priority: "P1",
  previewHeight: 220,
  props: [
    { name: "items", type: "{ label, href }[]", description: "Links." },
  ],
};
