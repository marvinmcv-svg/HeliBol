import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  id: "spotlight",
  name: "Cursor Spotlight",
  description: "A soft radial light follows the pointer across a section — fades in on enter, out on leave.",
  category: "cursor",
  platforms: ["web"],
  engine: "css",
  dependencies: [],
  registryDependencies: ["kinetik-core"],
  tags: ["cursor", "spotlight", "hero", "glow", "pointer"],
  pageTypes: ["landing", "pricing"],
  inspiration: ["Aceternity Spotlight", "Linear hero glow"],
  a11y: "Purely decorative and aria-hidden. Hidden under reduced motion; ignores touch pointers.",
  perf: "Pointer handler sets CSS custom properties directly — no state, no re-render.",
  status: "stable",
  priority: "P1",
  previewHeight: 320,
  props: [
    { name: "size", type: "number", default: "420", description: "Light radius (px)." },
    { name: "color", type: "string", description: "Light color (use alpha)." },
  ],
};
