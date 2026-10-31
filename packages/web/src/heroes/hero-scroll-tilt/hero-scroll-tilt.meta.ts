import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  id: "hero-scroll-tilt",
  name: "Hero — Scroll Tilt Screenshot",
  description: "Product screenshot starts tilted back in 3D under the headline and rotates flat while scaling up as you scroll.",
  category: "heroes",
  platforms: ["web"],
  engine: "motion",
  dependencies: ["motion"],
  registryDependencies: ["kinetik-core"],
  tags: ["hero","scroll","3d","screenshot","product"],
  pageTypes: ["landing"],
  inspiration: ["Aceternity Container Scroll Animation"],
  a11y: "Content order unchanged; reduced motion shows it flat.",
  perf: "One scroll observer; rotateX/scale transforms.",
  status: "stable",
  priority: "P1",
  previewHeight: 500,
  props: [
    { name: "title", type: "ReactNode", description: "Heading block." },
    { name: "children", type: "ReactNode", description: "Screenshot." },
    { name: "container", type: "RefObject<HTMLElement>", description: "Custom scroller." },
  ],
};
