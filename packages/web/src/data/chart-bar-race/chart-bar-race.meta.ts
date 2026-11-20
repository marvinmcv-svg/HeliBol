import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  id: "chart-bar-race",
  name: "Chart — Bar Race",
  description: "Animated bar-chart race: bars re-rank with layout springs as values change period by period, numbers tween, and the big period label rolls. Play/pause and a scrubber let you jump to any frame.",
  category: "data",
  platforms: ["web"],
  engine: "motion",
  dependencies: ["motion","lucide-react"],
  registryDependencies: ["kinetik-core"],
  tags: ["premium","chart","bar-race","ranking","data-viz","timeline"],
  pageTypes: ["dashboard","landing","blog"],
  inspiration: ["kinetik Premium collection"],
  a11y: "Chart has a text summary of the current leader; controls are real buttons and a labelled range input. Reduced motion jumps between frames without springs.",
  perf: "Only the visible top-N bars render; layout animations on transform.",
  status: "stable",
  priority: "P1",
  previewHeight: 440,
  props: [
    { name: "frames", type: "string[]", description: "Period labels." },
    { name: "series", type: "{ name; color; values: number[] }[]", description: "One value per frame per series." },
    { name: "top", type: "number", default: "6", description: "Bars shown." },
    { name: "speed", type: "number", default: "1400", description: "ms per frame." },
    { name: "title", type: "string", default: "Ranking", description: "Chart title." },
  ],
};
