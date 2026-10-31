import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  id: "before-after",
  name: "Before / After Slider",
  description: "Drag the handle — or use the arrow keys, it's a real slider — to wipe between two images.",
  category: "media",
  platforms: ["web"],
  engine: "js",
  dependencies: [],
  registryDependencies: ["kinetik-core"],
  tags: ["comparison","slider","before after","images"],
  pageTypes: ["ecommerce","portfolio","landing"],
  inspiration: ["Motion Primitives Image Comparison"],
  a11y: "Handle is role=slider with aria-valuenow and arrow-key support; both images have alt text.",
  perf: "clip-path inset on one image.",
  status: "stable",
  priority: "P2",
  previewHeight: 380,
  props: [
    { name: "before / after", type: "string", description: "Image URLs." },
    { name: "beforeLabel / afterLabel", type: "string", description: "Labels." },
  ],
};
