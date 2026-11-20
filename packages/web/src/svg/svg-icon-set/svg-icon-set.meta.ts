import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  id: "svg-icon-set",
  name: "Animated Icon Set",
  description: "Six stateful SVG icons with meaningful motion: hamburger ⇄ close, play ⇄ pause path morph, a heart that fills with a spark burst, a ringing bell with a badge, copy → check and sun ⇄ moon.",
  category: "svg",
  platforms: ["web"],
  engine: "motion",
  dependencies: ["motion"],
  registryDependencies: ["kinetik-core"],
  tags: ["premium","icons","svg","micro-interaction","toggle","morph"],
  pageTypes: ["landing","dashboard","settings"],
  inspiration: ["kinetik Premium collection"],
  a11y: "Each icon is a toggle button with aria-pressed and a label. Reduced motion switches state without motion.",
  perf: "Small SVGs animating d, transform and pathLength.",
  status: "stable",
  priority: "P1",
  previewHeight: 360,
  props: [
    { name: "size", type: "number", default: "28", description: "Icon size." },
    { name: "label", type: "string", description: "Accessible label." },
  ],
};
