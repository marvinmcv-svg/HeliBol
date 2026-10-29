import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  id: "spinner-set",
  name: "Spinner Set",
  description: "Eight pure-CSS loaders — ring, dots, bars, orbit, pulse, wave, morphing square, bounce — that inherit currentColor.",
  category: "loaders",
  platforms: ["web"],
  engine: "css",
  dependencies: [],
  registryDependencies: ["kinetik-core"],
  tags: ["spinner", "loader", "loading", "css-only"],
  pageTypes: ["dashboard", "auth", "ecommerce"],
  inspiration: ["SpinKit", "Loaders.css"],
  a11y: "role=status with an aria-label. Reduced motion slows animation to 3s rather than removing the busy signal.",
  perf: "Individual transform properties only; one shared stylesheet for all variants.",
  status: "stable",
  priority: "P1",
  previewHeight: 280,
  props: [
    { name: "variant", type: '"ring" | "dots" | "bars" | "orbit" | "pulse" | "wave" | "square" | "bounce"', default: '"ring"', description: "Style." },
    { name: "size", type: "number", default: "28", description: "px." },
    { name: "label", type: "string", default: '"Loading"', description: "Accessible label." },
  ],
};
