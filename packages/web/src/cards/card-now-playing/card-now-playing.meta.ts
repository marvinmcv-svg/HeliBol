import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  id: "card-now-playing",
  name: "Card — Now Playing",
  description: "Mini player → full player. The compact pill (cover, title, live equaliser) expands in place into a full card — cover, title and play button are shared elements that fly to their new spots — with a scrubber and elapsed/remaining time.",
  category: "cards",
  platforms: ["web"],
  engine: "motion",
  dependencies: ["motion","lucide-react"],
  registryDependencies: ["kinetik-core"],
  tags: ["premium","card","music","player","expand","shared-layout","media"],
  pageTypes: ["media","social"],
  inspiration: ["kinetik Premium collection"],
  a11y: "Pill is a button that expands; controls are labelled; seek is a native range input. Reduced motion skips the flight.",
  perf: "Shared layoutIds for three elements; the equaliser is four transform animations.",
  status: "stable",
  priority: "P1",
  previewHeight: 520,
  props: [
    { name: "track", type: "{ title; artist; cover; duration }", description: "Track." },
    { name: "defaultExpanded", type: "boolean", default: "false", description: "Start expanded." },
  ],
};
