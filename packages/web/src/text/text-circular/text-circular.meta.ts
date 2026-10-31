import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  id: "text-circular",
  name: "Circular Text Badge",
  description: "Text set on a circle with an SVG textPath slowly spins around a center icon; the center pops on hover.",
  category: "text",
  platforms: ["web"],
  engine: "svg",
  dependencies: ["motion"],
  registryDependencies: ["kinetik-core"],
  tags: ["badge","circular","spinning","portfolio","cta"],
  pageTypes: ["portfolio","landing"],
  inspiration: ["React Bits Circular Text","agency 'available for work' badges"],
  a11y: "Wrapper has aria-label with the text; the spinning SVG is aria-hidden. Reduced motion: static ring.",
  perf: "Single rotating SVG (transform only).",
  status: "stable",
  priority: "P2",
  previewHeight: 260,
  props: [
    { name: "text", type: "string", description: "Text around the circle (end with a separator)." },
    { name: "duration", type: "number", default: "14", description: "Seconds per revolution." },
    { name: "size", type: "number", default: "160", description: "Diameter in px." },
    { name: "reverse", type: "boolean", default: "false", description: "Spin counter-clockwise." },
  ],
};
