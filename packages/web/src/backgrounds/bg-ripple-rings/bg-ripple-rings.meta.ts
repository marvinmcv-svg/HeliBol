import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  id: "bg-ripple-rings",
  name: "Ripple Rings",
  description: "Concentric rings that breathe around a centerpiece — behind avatars, logos, product icons or a CTA.",
  category: "backgrounds",
  platforms: ["web"],
  engine: "css",
  dependencies: [],
  registryDependencies: ["kinetik-core"],
  tags: ["rings","ripple","logo","css-only"],
  pageTypes: ["landing","onboarding"],
  inspiration: ["Magic UI Ripple"],
  a11y: "Decorative; still under reduced motion.",
  perf: "N absolutely positioned divs with a scale keyframe.",
  status: "stable",
  priority: "P2",
  previewHeight: 320,
  props: [
    { name: "count", type: "number", default: "8", description: "Rings." },
    { name: "base / step", type: "number", default: "140 / 70", description: "Smallest diameter and increment (px)." },
  ],
};
