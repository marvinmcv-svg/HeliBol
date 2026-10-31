import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  id: "button-ripple",
  name: "Ripple Button",
  description: "Material ink ripple that grows from the exact press point and fades, sized to cover the whole button.",
  category: "buttons",
  platforms: ["web"],
  engine: "css",
  dependencies: [],
  registryDependencies: ["kinetik-core"],
  tags: ["ripple","material","press","feedback"],
  pageTypes: ["dashboard","settings","auth"],
  inspiration: ["Material Design ripple"],
  a11y: "Native button; ripples aria-hidden; skipped under reduced motion.",
  perf: "One short-lived span per press, CSS keyframe.",
  status: "stable",
  priority: "P2",
  previewHeight: 240,
  props: [
    { name: "...props", type: "ButtonHTMLAttributes", description: "Native button props." },
  ],
};
