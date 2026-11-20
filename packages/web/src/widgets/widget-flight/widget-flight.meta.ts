import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  id: "widget-flight",
  name: "Flight Tracker Widget",
  description: "Live flight widget: the plane glides along a curved route with offset-path, banking with the arc; the flown part of the route fills in and time remaining counts down.",
  category: "widgets",
  platforms: ["web"],
  engine: "motion",
  dependencies: ["motion","lucide-react"],
  registryDependencies: ["kinetik-core"],
  tags: ["premium","flight","travel","tracker","widget","progress"],
  pageTypes: ["dashboard","media"],
  inspiration: ["kinetik Premium collection"],
  a11y: "Grouped and labelled; progress is a real progressbar. Reduced motion: no simulated movement.",
  perf: "offset-distance and pathLength on two elements.",
  status: "stable",
  priority: "P1",
  previewHeight: 360,
  props: [
    { name: "from", type: "{ code, city, time }", description: "Origin." },
    { name: "to", type: "{ code, city, time }", description: "Destination." },
    { name: "flight", type: "string", description: "Flight number." },
    { name: "progress", type: "number", default: "simulated", description: "0–1 progress." },
  ],
};
