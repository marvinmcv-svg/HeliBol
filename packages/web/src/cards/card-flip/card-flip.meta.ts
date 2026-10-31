import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  id: "card-flip",
  name: "Flip Card",
  description: "Two-sided card that flips in 3D on click, Enter or Space — keyboard and touch friendly, not hover-only.",
  category: "cards",
  platforms: ["web"],
  engine: "motion",
  dependencies: ["motion"],
  registryDependencies: ["kinetik-core"],
  tags: ["flip","3d","cards","reveal"],
  pageTypes: ["portfolio","landing","onboarding"],
  inspiration: ["Animata flip card"],
  a11y: "A real button with aria-pressed; reduced motion crossfades faces instead of rotating.",
  perf: "Single rotateY spring with backface-visibility hidden.",
  status: "stable",
  priority: "P2",
  previewHeight: 360,
  props: [
    { name: "front / back", type: "ReactNode", description: "Faces." },
    { name: "label", type: "string", default: "\"Flip card\"", description: "Accessible name." },
  ],
};
