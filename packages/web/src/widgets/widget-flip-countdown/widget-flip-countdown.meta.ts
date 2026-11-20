import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  id: "widget-flip-countdown",
  name: "Flip Clock Countdown",
  description: "Split-flap countdown: each digit is a physical flap — the top leaf falls away and the bottom leaf swings down with the new number, with a hinge line and depth. Days, hours, minutes, seconds.",
  category: "widgets",
  platforms: ["web"],
  engine: "css",
  dependencies: [],
  registryDependencies: ["kinetik-core"],
  tags: ["premium","countdown","flip clock","launch","timer","widget"],
  pageTypes: ["landing","ecommerce"],
  inspiration: ["kinetik Premium collection"],
  a11y: "role=timer with an sr-only summary of time left; digits aria-hidden. Reduced motion: digits change without flipping.",
  perf: "CSS keyframes per changed digit only; one 1 s interval.",
  status: "stable",
  priority: "P1",
  previewHeight: 320,
  props: [
    { name: "to", type: "Date", description: "Target time." },
    { name: "title", type: "string", default: "'Launch in'", description: "Label." },
  ],
};
