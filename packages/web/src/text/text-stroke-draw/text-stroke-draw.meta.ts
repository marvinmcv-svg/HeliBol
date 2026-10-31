import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  id: "text-stroke-draw",
  name: "Stroke Draw Text",
  description: "The outline of a word draws itself on view, then the fill floods in — a signature/logo reveal.",
  category: "text",
  platforms: ["web"],
  engine: "svg",
  dependencies: ["motion"],
  registryDependencies: ["kinetik-core"],
  tags: ["svg","draw","logo","reveal","outline"],
  pageTypes: ["landing","portfolio"],
  inspiration: ["Animata text border animation","Apple 'hello'"],
  a11y: "SVG has role=img and aria-label; reduced motion renders filled text.",
  perf: "stroke-dashoffset + fill-opacity on one SVG text.",
  status: "stable",
  priority: "P2",
  previewHeight: 300,
  props: [
    { name: "fontSize", type: "number", default: "96", description: "SVG font size." },
    { name: "duration", type: "number", default: "2.2", description: "Draw seconds." },
  ],
};
