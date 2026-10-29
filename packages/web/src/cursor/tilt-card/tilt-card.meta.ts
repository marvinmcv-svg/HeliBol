import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  id: "tilt-card",
  name: "3D Tilt Card",
  description: "The card rotates in 3D toward the pointer on soft springs, with a moving specular glare. Children can pop out with translateZ.",
  category: "cursor",
  platforms: ["web"],
  engine: "motion",
  dependencies: ["motion"],
  registryDependencies: ["kinetik-core"],
  tags: ["3d", "tilt", "card", "glare", "collectible"],
  pageTypes: ["ecommerce", "portfolio", "landing"],
  inspiration: ["Apple TV posters", "Pokémon card CSS"],
  a11y: "Decorative; disabled on touch and reduced motion. Don't put essential info only in the glare.",
  perf: "Two springs → rotateX/Y; glare is a motion template, no React renders on move.",
  status: "stable",
  priority: "P1",
  previewHeight: 440,
  props: [
    { name: "max", type: "number", default: "12", description: "Max tilt (deg)." },
    { name: "glare", type: "boolean", default: "true", description: "Show the moving highlight." },
  ],
};
