import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  id: "button-magnetic",
  name: "Magnetic Button",
  description: "The button leans toward the cursor on a bouncy spring, its label leaning further for parallax depth. Snaps back on leave.",
  category: "buttons",
  platforms: ["web"],
  engine: "motion",
  dependencies: ["motion"],
  registryDependencies: ["kinetik-core"],
  tags: ["cursor", "magnetic", "portfolio", "cta", "awwwards"],
  pageTypes: ["portfolio", "landing"],
  inspiration: ["Awwwards agency sites", "Codrops magnetic buttons"],
  a11y: "Native button; effect is pointer-only and disabled on touch devices and reduced motion.",
  perf: "Two spring motion values driving transforms; no re-renders.",
  status: "stable",
  priority: "P1",
  previewHeight: 260,
  props: [
    { name: "strength", type: "number", default: "0.35", description: "Fraction of cursor offset the button follows." },
    { name: "onClick", type: "() => void", description: "Click handler." },
  ],
};
