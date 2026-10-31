import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  id: "lightbox",
  name: "Shared-Layout Lightbox",
  description: "Click a thumbnail and it flies into a fullscreen lightbox; browse with arrows or keys, Esc returns it home.",
  category: "media",
  platforms: ["web"],
  engine: "motion",
  dependencies: ["motion","lucide-react"],
  registryDependencies: ["kinetik-core"],
  tags: ["lightbox","gallery","layoutId","photos"],
  pageTypes: ["portfolio","ecommerce","blog"],
  inspiration: ["Apple Photos","Unsplash"],
  a11y: "aria-modal dialog with alt text, labelled controls, ←/→/Esc keys, focus to Close.",
  perf: "Shared layoutId between grid tile and full image.",
  status: "stable",
  priority: "P2",
  previewHeight: 420,
  props: [
    { name: "images", type: "{ src, alt }[]", description: "Images." },
  ],
};
