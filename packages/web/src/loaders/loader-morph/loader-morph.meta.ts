import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  id: "loader-morph",
  name: "Morphing Shape Loader",
  description: "A single shape that morphs circle → rounded square → blob while rotating — a loader with character.",
  category: "loaders",
  platforms: ["web"],
  engine: "motion",
  dependencies: ["motion"],
  registryDependencies: ["kinetik-core"],
  tags: ["loader","spinner","morph","brand"],
  pageTypes: ["dashboard","onboarding"],
  inspiration: ["Dribbble brand loaders"],
  a11y: "role=status with label; reduced motion pulses opacity instead.",
  perf: "border-radius + transform keyframes on one element.",
  status: "stable",
  priority: "P2",
  previewHeight: 220,
  props: [
    { name: "size", type: "number", default: "56", description: "px." },
    { name: "color", type: "string", default: "\"currentColor\"", description: "Fill." },
    { name: "label", type: "string", default: "\"Loading\"", description: "Accessible label." },
  ],
};
