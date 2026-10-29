import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  id: "button-shimmer",
  name: "Shimmer Button",
  description: "A glossy light sweep crosses the CTA every few seconds, pulling the eye without being noisy.",
  category: "buttons",
  platforms: ["web"],
  engine: "css",
  dependencies: [],
  registryDependencies: ["kinetik-core"],
  tags: ["cta", "shimmer", "upgrade", "css-only"],
  pageTypes: ["landing", "pricing", "onboarding"],
  inspiration: ["Magic UI Shimmer Button", "Stripe CTAs"],
  a11y: "Native button; animation is decorative. Reduced motion: no sweep.",
  perf: "One background-position keyframe on a pseudo-element; 0 KB JS.",
  status: "stable",
  priority: "P1",
  previewHeight: 220,
  props: [
    { name: "duration", type: "number", default: "2.6", description: "Seconds per cycle (sweep occupies 60%)." },
    { name: "href", type: "string", description: "Render as an <a> link." },
    { name: "shimmerColor", type: "string", default: '"rgb(255 255 255 / .35)"', description: "Highlight color." },
  ],
};
