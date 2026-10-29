import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  id: "image-reveal-mask",
  name: "Image Reveal Mask",
  description: "Images wipe in with a clip-path curtain (up, left, center-out) while the photo settles from 1.25× zoom — editorial gallery feel.",
  category: "media",
  platforms: ["web"],
  engine: "css",
  dependencies: [],
  registryDependencies: ["kinetik-core"],
  tags: ["image", "reveal", "clip-path", "gallery", "editorial"],
  pageTypes: ["portfolio", "blog", "ecommerce"],
  inspiration: ["Codrops image reveals", "Awwwards galleries"],
  a11y: "Real <img> with alt from the start; reduced motion shows images immediately.",
  perf: "clip-path + scale transitions; IntersectionObserver toggles one attribute.",
  status: "stable",
  priority: "P1",
  previewHeight: 420,
  props: [
    { name: "src / alt", type: "string", description: "Image." },
    { name: "direction", type: '"up" | "left" | "center" | "diagonal"', default: '"up"', description: "Curtain direction." },
    { name: "delay", type: "number", default: "0", description: "Seconds." },
  ],
};
