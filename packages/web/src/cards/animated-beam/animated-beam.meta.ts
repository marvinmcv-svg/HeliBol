import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  id: "animated-beam",
  name: "Animated Beam",
  description: "Light pulses travel along curved connectors between any two elements — the go-to integrations / data-flow diagram.",
  category: "cards",
  platforms: ["web"],
  engine: "svg",
  dependencies: ["motion"],
  registryDependencies: ["kinetik-core"],
  tags: ["integrations", "diagram", "beam", "svg", "connections"],
  pageTypes: ["landing"],
  inspiration: ["Magic UI Animated Beam"],
  a11y: "aria-hidden; describe the integrations in text nearby. Reduced motion: static gradient line.",
  perf: "Only the gradient's x1/x2 animate; paths recompute on ResizeObserver.",
  status: "stable",
  priority: "P2",
  previewHeight: 340,
  props: [
    { name: "container / from / to", type: "RefObject<HTMLElement>", description: "Positioning container and endpoints." },
    { name: "curvature", type: "number", default: "0", description: "Quadratic control-point offset (px)." },
    { name: "duration / delay", type: "number", description: "Pulse timing (s)." },
    { name: "reverse", type: "boolean", default: "false", description: "Pulse direction." },
  ],
};
