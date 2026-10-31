import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  id: "widget-music",
  name: "Now Playing",
  description: "Music widget: spinning vinyl art, bouncing equalizer, live progress and a play↔pause morphing icon.",
  category: "widgets",
  platforms: ["web"],
  engine: "motion",
  dependencies: ["motion","lucide-react"],
  registryDependencies: ["kinetik-core"],
  tags: ["music","player","widget","media"],
  pageTypes: ["media","dashboard"],
  inspiration: ["Spotify / Apple Music mini players"],
  a11y: "Labelled transport buttons; progress is a progressbar; motion stops when paused or reduced.",
  perf: "Interval for time; transforms only.",
  status: "stable",
  priority: "P2",
  previewHeight: 320,
  props: [
    { name: "title / artist / cover", type: "string", description: "Track." },
    { name: "duration", type: "number", default: "214", description: "Seconds." },
  ],
};
