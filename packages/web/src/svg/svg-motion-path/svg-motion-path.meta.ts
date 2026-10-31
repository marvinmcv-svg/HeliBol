import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  id: "svg-motion-path",
  name: "CSS Motion Path",
  description: "Objects travel along an SVG path using CSS offset-path, auto-rotating to the curve — zero JavaScript.",
  category: "svg",
  platforms: ["web"],
  engine: "css",
  dependencies: [],
  registryDependencies: ["kinetik-core"],
  tags: ["motion path","offset-path","svg","css-only","logistics"],
  pageTypes: ["landing"],
  inspiration: ["GSAP MotionPath","CSS offset-path demos"],
  a11y: "Decorative; travellers sit at the midpoint under reduced motion.",
  perf: "Compositor-friendly offset-distance animation.",
  status: "stable",
  priority: "P2",
  previewHeight: 280,
  props: [
    { name: "path", type: "string", description: "SVG path data (viewBox units = px of the container)." },
    { name: "items", type: "ReactNode[]", description: "Travellers (evenly spaced)." },
    { name: "duration", type: "number", default: "6", description: "Seconds per lap." },
  ],
};
