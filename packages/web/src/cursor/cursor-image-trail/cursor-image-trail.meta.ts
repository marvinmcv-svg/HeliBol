import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  id: "cursor-image-trail",
  name: "Image Trail",
  description: "Moving across the area drops a trail of images that pop in, drift in your direction and fade away.",
  category: "cursor",
  platforms: ["web"],
  engine: "js",
  dependencies: [],
  registryDependencies: ["kinetik-core"],
  tags: ["image trail","cursor","portfolio","editorial"],
  pageTypes: ["portfolio","landing"],
  inspiration: ["Codrops image trail","Fancy image trail"],
  a11y: "Images are decorative (empty alt) and pointer-events none; off on touch and reduced motion.",
  perf: "Spawns one <img> per threshold distance; WAAPI animation, removed on finish.",
  status: "stable",
  priority: "P2",
  previewHeight: 380,
  props: [
    { name: "images", type: "string[]", description: "Image URLs." },
    { name: "threshold", type: "number", default: "80", description: "px between spawns." },
  ],
};
