import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  id: "widget-thermostat",
  name: "Widget — Thermostat",
  description: "Smart-thermostat dial: drag around the ring or use the arrow keys to set the target; the arc fills along a blue-to-orange gradient, the number ticks, and the mode switches between heating, cooling and idle with a breathing glow.",
  category: "widgets",
  platforms: ["web"],
  engine: "motion",
  dependencies: ["motion","lucide-react"],
  registryDependencies: ["kinetik-core"],
  tags: ["premium","widget","thermostat","dial","smart-home","knob","iot"],
  pageTypes: ["dashboard","settings"],
  inspiration: ["kinetik Premium collection"],
  a11y: "role=slider with value text including the mode; arrow keys step 0.5°. Reduced motion stops the glow.",
  perf: "Motion values drive the arc dash and knob position.",
  status: "stable",
  priority: "P1",
  previewHeight: 480,
  props: [
    { name: "defaultTarget", type: "number", default: "21", description: "Target °." },
    { name: "current", type: "number", default: "19", description: "Room °." },
    { name: "min / max", type: "number", default: "10 / 30", description: "Range." },
  ],
};
