import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  id: "hero-floating-images",
  name: "Hero — Floating Gallery",
  description: "Headline surrounded by photos floating at different depths that parallax against the pointer.",
  category: "heroes",
  platforms: ["web"],
  engine: "motion",
  dependencies: ["motion"],
  registryDependencies: ["kinetik-core"],
  tags: ["hero","parallax","gallery","floating","portfolio"],
  pageTypes: ["portfolio","landing"],
  inspiration: ["Fancy Parallax Floating"],
  a11y: "Images decorative (aria-hidden); text centered and legible; parallax off on touch/reduced motion.",
  perf: "Two springs shared by all images; transforms only.",
  status: "stable",
  priority: "P2",
  previewHeight: 500,
  props: [
    { name: "images", type: "string[]", description: "Photos (6 used)." },
    { name: "title", type: "string", description: "Headline." },
  ],
};
