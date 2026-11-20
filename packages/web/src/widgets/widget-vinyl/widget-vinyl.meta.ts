import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  id: "widget-vinyl",
  name: "Vinyl Player Widget",
  description: "Turntable now-playing widget: the record spins up with inertia on play and coasts to a stop on pause, the tonearm swings on, grooves catch a moving highlight and an equaliser dances. Skip slides a new record in.",
  category: "widgets",
  platforms: ["web"],
  engine: "motion",
  dependencies: ["motion","lucide-react"],
  registryDependencies: ["kinetik-core"],
  tags: ["premium","music","vinyl","player","widget","turntable"],
  pageTypes: ["media"],
  inspiration: ["kinetik Premium collection"],
  a11y: "Play/pause and next are labelled buttons; visuals are decorative. Reduced motion: record stays still.",
  perf: "One rAF loop easing angular speed; transforms only.",
  status: "stable",
  priority: "P1",
  previewHeight: 440,
  props: [
    { name: "cover", type: "string", description: "Label art." },
    { name: "title", type: "string", description: "Track." },
    { name: "artist", type: "string", description: "Artist." },
  ],
};
