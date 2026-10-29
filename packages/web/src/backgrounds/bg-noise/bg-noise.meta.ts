import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  id: "bg-noise",
  name: "Film Grain",
  description: "An SVG feTurbulence grain overlay that jitters in steps like film — instantly makes flat gradients feel tactile and kills banding.",
  category: "backgrounds",
  platforms: ["web"],
  engine: "css",
  dependencies: [],
  registryDependencies: ["kinetik-core"],
  tags: ["noise", "grain", "texture", "gradient", "css-only"],
  pageTypes: ["landing", "portfolio"],
  inspiration: ["Codrops grain overlays", "Editorial print textures"],
  a11y: "aria-hidden; stepped animation stops under reduced motion. Low opacity — doesn't affect legibility.",
  perf: "Static data-URI SVG tile; the jitter is a stepped transform (no repaint of the noise).",
  status: "stable",
  priority: "P1",
  previewHeight: 260,
  props: [
    { name: "opacity", type: "number", default: "0.18", description: "Grain strength." },
    { name: "animated", type: "boolean", default: "true", description: "Film-style jitter." },
  ],
};
