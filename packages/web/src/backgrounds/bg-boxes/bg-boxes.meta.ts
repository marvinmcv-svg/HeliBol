import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  id: "bg-boxes",
  name: "Interactive Boxes",
  description: "A skewed isometric grid of cells that flash random colors under the cursor and fade back slowly.",
  category: "backgrounds",
  platforms: ["web"],
  engine: "css",
  dependencies: [],
  registryDependencies: ["kinetik-core"],
  tags: ["grid","interactive","isometric","hover"],
  pageTypes: ["landing","portfolio"],
  inspiration: ["Aceternity Background Boxes"],
  a11y: "Purely decorative; content sits above with pointer-events none on the overlay.",
  perf: "Color transitions on plain divs (rows×cols).",
  status: "stable",
  priority: "P2",
  previewHeight: 320,
  props: [
    { name: "rows / cols", type: "number", default: "18 / 22", description: "Grid size." },
  ],
};
