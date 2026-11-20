import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  id: "mockup-phone-3d",
  name: "3D Phone Mockup",
  description: "A real 3D phone in CSS — front, back and four sides with depth — resting at a three-quarter angle and turning toward the pointer on a spring, with glare sweeping the glass and the shadow shifting. Any React content renders live on the screen.",
  category: "mockups",
  platforms: ["web"],
  engine: "motion",
  dependencies: ["motion"],
  registryDependencies: ["kinetik-core"],
  tags: ["premium","mockup","iphone","3d","device","app"],
  pageTypes: ["landing","ecommerce"],
  inspiration: ["kinetik Premium collection"],
  a11y: "Screen content is live and keyboard-accessible; the device chrome is decorative. Rotation off on touch/reduced motion.",
  perf: "CSS preserve-3d; rotation via springs (no re-render).",
  status: "stable",
  priority: "P1",
  previewHeight: 520,
  props: [
    { name: "children", type: "ReactNode", description: "Screen content." },
    { name: "restY", type: "number", default: "-22", description: "Resting Y rotation." },
    { name: "restX", type: "number", default: "8", description: "Resting X rotation." },
  ],
};
