import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  id: "orbit-icons",
  name: "Orbiting Integrations",
  description: "Integration icons circle a center logo on concentric dashed orbits at different speeds, staying upright as they travel.",
  category: "data",
  platforms: ["web"],
  engine: "motion",
  dependencies: ["motion"],
  registryDependencies: ["kinetik-core"],
  tags: ["integrations","orbit","logos","ecosystem"],
  pageTypes: ["landing"],
  inspiration: ["Magic UI Orbiting Circles"],
  a11y: "Decorative motion; list your integrations in text too. Static under reduced motion.",
  perf: "Each ring is one rotating element; icons counter-rotate.",
  status: "stable",
  priority: "P2",
  previewHeight: 380,
  props: [
    { name: "center", type: "ReactNode", description: "Center logo." },
    { name: "rings", type: "{ radius, duration, reverse?, icons }[]", description: "Orbits." },
  ],
};
