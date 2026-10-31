import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  id: "button-rainbow",
  name: "Rainbow Border Button",
  description: "Dark pill with a rotating rainbow conic border and a blurred rainbow glow pooling underneath.",
  category: "buttons",
  platforms: ["web"],
  engine: "css",
  dependencies: [],
  registryDependencies: ["kinetik-core"],
  tags: ["cta","rainbow","glow","border","css-only"],
  pageTypes: ["landing","pricing"],
  inspiration: ["Magic UI Rainbow Button"],
  a11y: "Native button; decorative motion stops under reduced motion.",
  perf: "One registered @property angle animation; 0 KB JS.",
  status: "stable",
  priority: "P2",
  previewHeight: 220,
  props: [
    { name: "...props", type: "ButtonHTMLAttributes", description: "Native button props." },
  ],
};
