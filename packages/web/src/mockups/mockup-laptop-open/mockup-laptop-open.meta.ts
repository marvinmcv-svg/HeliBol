import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  id: "mockup-laptop-open",
  name: "Laptop Opening Mockup",
  description: "A laptop that opens as it scrolls into view: the lid hinges up from closed in 3D, the screen wakes with a flash of glow, then the content fades in.",
  category: "mockups",
  platforms: ["web"],
  engine: "motion",
  dependencies: ["motion"],
  registryDependencies: ["kinetik-core"],
  tags: ["premium","mockup","laptop","macbook","scroll","reveal"],
  pageTypes: ["landing"],
  inspiration: ["kinetik Premium collection"],
  a11y: "Screen content is real HTML; reduced motion shows it open immediately.",
  perf: "One rotateX transform and two opacity fades, once.",
  status: "stable",
  priority: "P1",
  previewHeight: 420,
  props: [
    { name: "children", type: "ReactNode", description: "Screen content." },
  ],
};
