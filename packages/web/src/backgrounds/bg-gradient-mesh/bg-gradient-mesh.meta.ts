import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  id: "bg-gradient-mesh",
  name: "Animated Mesh Gradient",
  description: "Three radial color fields whose anchor points wander via animated @property percentages — a buttery mesh gradient in pure CSS.",
  category: "backgrounds",
  platforms: ["web"],
  engine: "css",
  dependencies: [],
  registryDependencies: ["kinetik-core"],
  tags: ["gradient", "mesh", "@property", "card", "hero", "css-only"],
  pageTypes: ["landing", "pricing", "onboarding"],
  inspiration: ["Stripe mesh gradient", "Apple wallpapers"],
  a11y: "Decorative; pauses under reduced motion. Ensure text contrast on all colors.",
  perf: "Animating registered custom properties repaints the gradient; keep it to hero-sized areas.",
  status: "stable",
  priority: "P1",
  previewHeight: 300,
  props: [
    { name: "colors", type: "[c1, c2, c3, base]", description: "Three field colors + base." },
    { name: "speed", type: "number", default: "12", description: "Seconds per leg." },
  ],
};
