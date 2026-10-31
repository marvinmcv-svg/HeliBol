import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  id: "button-pulse",
  name: "Pulse CTA",
  description: "Primary action that emits two staggered sonar rings — 'go live', 'join call', unread attention.",
  category: "buttons",
  platforms: ["web"],
  engine: "css",
  dependencies: [],
  registryDependencies: ["kinetik-core"],
  tags: ["pulse","attention","live","cta","css-only"],
  pageTypes: ["dashboard","social"],
  inspiration: ["Magic UI Pulsating Button"],
  a11y: "Use for one primary action only; rings hidden under reduced motion.",
  perf: "Two pseudo-elements with transform/opacity keyframes.",
  status: "stable",
  priority: "P2",
  previewHeight: 220,
  props: [
    { name: "...props", type: "ButtonHTMLAttributes", description: "Native button props." },
  ],
};
