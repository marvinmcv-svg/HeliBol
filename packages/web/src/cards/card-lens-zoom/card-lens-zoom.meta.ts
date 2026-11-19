import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  id: "card-lens-zoom",
  name: "Lens Zoom Card",
  description: "Product-photo magnifier: a glass lens springs after the cursor and shows the image magnified underneath, with a refraction rim; scroll over the lens to change zoom; press-and-drag on touch.",
  category: "cards",
  platforms: ["web"],
  engine: "motion",
  dependencies: ["motion"],
  registryDependencies: ["kinetik-core"],
  tags: ["premium","magnifier","zoom","product","ecommerce","image"],
  pageTypes: ["ecommerce","portfolio"],
  inspiration: ["kinetik Premium collection"],
  a11y: "The image keeps its alt; the lens is aria-hidden decoration. Reduced motion: lens follows without spring.",
  perf: "Background-position on one element driven by motion values (no re-render per move).",
  status: "stable",
  priority: "P1",
  previewHeight: 380,
  props: [
    { name: "image", type: "string", description: "Image URL." },
    { name: "alt", type: "string", description: "Alt text." },
    { name: "zoom", type: "number", default: "2.5", description: "Initial magnification." },
    { name: "size", type: "number", default: "160", description: "Lens diameter." },
  ],
};
