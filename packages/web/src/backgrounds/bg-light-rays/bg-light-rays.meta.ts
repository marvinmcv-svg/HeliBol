import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  id: "bg-light-rays",
  name: "Rotating Light Rays",
  description: "Slowly rotating god-rays fan out from above — celebratory 'achievement unlocked' energy.",
  category: "backgrounds",
  platforms: ["web"],
  engine: "css",
  dependencies: [],
  registryDependencies: ["kinetik-core"],
  tags: ["rays","celebration","conic","css-only"],
  pageTypes: ["onboarding","landing"],
  inspiration: ["Game reward screens"],
  a11y: "Decorative; static under reduced motion.",
  perf: "One repeating-conic-gradient with an animated @property angle.",
  status: "stable",
  priority: "P2",
  previewHeight: 300,
  props: [
    { name: "color", type: "string", description: "Ray color." },
  ],
};
