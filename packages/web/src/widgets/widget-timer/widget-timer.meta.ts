import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  id: "widget-timer",
  name: "Countdown Timer",
  description: "Countdown ring that drains smoothly, with start/pause/reset and a celebratory pulse when time is up.",
  category: "widgets",
  platforms: ["web"],
  engine: "motion",
  dependencies: ["motion","lucide-react"],
  registryDependencies: ["kinetik-core"],
  tags: ["timer","countdown","pomodoro","ring"],
  pageTypes: ["dashboard"],
  inspiration: ["Apple Clock timer"],
  a11y: "role=timer display; completion announced via an aria-live region.",
  perf: "One timeout per second; ring pathLength tween.",
  status: "stable",
  priority: "P2",
  previewHeight: 340,
  props: [
    { name: "seconds", type: "number", default: "90", description: "Duration." },
    { name: "label", type: "string", default: "\"Focus\"", description: "Caption." },
  ],
};
