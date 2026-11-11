import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  id: "orbital-image-wheel",
  name: "Orbital Image Wheel",
  description: "Images arranged on a giant wheel whose hub sits below the frame. Drag, scroll or use arrow keys to turn it; it springs so one image sits enlarged at the top with its title.",
  category: "media",
  platforms: ["web"],
  engine: "motion",
  dependencies: ["motion"],
  registryDependencies: ["kinetik-core"],
  tags: ["carousel","wheel","gallery","drag","portfolio"],
  pageTypes: ["portfolio","media"],
  inspiration: ["unlumen UI — Orbital Image Wheel"],
  a11y: "Focusable region with arrow-key navigation; each image is a labelled button; title announced via aria-live. Reduced motion: snaps without spring.",
  perf: "All positions are derived from one motion value with useTransform — no React re-render while turning.",
  status: "stable",
  priority: "P1",
  previewHeight: 420,
  props: [
    { name: "items", type: "{ image, title }[]", description: "Images." },
    { name: "radius", type: "number", default: "0.55", description: "Wheel radius as a fraction of width." },
  ],
};
