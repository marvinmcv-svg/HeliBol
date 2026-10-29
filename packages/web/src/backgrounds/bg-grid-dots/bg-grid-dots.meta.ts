import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  id: "bg-grid-dots",
  name: "Grid & Dot Pattern",
  description: "Dot or line grid backgrounds with a radial vignette mask and optional slow pan — the dev-tool aesthetic.",
  category: "backgrounds",
  platforms: ["web"],
  engine: "css",
  dependencies: [],
  registryDependencies: ["kinetik-core"],
  tags: ["background", "grid", "dots", "pattern", "css-only"],
  pageTypes: ["landing", "docs", "auth"],
  inspiration: ["Vercel / Magic UI grid patterns"],
  a11y: "aria-hidden. Pan pauses under reduced motion.",
  perf: "Two CSS gradients; panning animates background-position (one paint layer).",
  status: "stable",
  priority: "P1",
  previewHeight: 260,
  props: [
    { name: "variant", type: '"dots" | "grid"', default: '"dots"', description: "Pattern type." },
    { name: "size", type: "number", default: "24", description: "Cell size (px)." },
    { name: "vignette", type: "boolean", default: "true", description: "Radial fade mask." },
    { name: "animate", type: "boolean", default: "false", description: "Diagonal pan loop." },
  ],
};
