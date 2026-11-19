import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  id: "banner-announcement",
  name: "Announcement Banner",
  description: "Top-of-page announcement bar: a sheen sweeps across, several messages rotate vertically (paused on hover/focus), the arrow nudges on hover, and dismissal collapses the bar and is remembered.",
  category: "navigation",
  platforms: ["web"],
  engine: "motion",
  dependencies: ["motion","lucide-react"],
  registryDependencies: ["kinetik-core"],
  tags: ["banner","announcement","top bar","marketing","launch"],
  pageTypes: ["landing"],
  inspiration: ["21st.dev category gap (audit 2026-11)"],
  a11y: "Labelled region; rotation pauses on hover and focus; dismiss is a labelled button and persists. Reduced motion: no sheen, crossfades.",
  perf: "CSS sheen; one interval; height animation only on dismiss.",
  status: "stable",
  priority: "P2",
  previewHeight: 360,
  props: [
    { name: "items", type: "{ label?, text, href? }[]", description: "Messages." },
    { name: "interval", type: "number", default: "4000", description: "ms per message." },
    { name: "storageKey", type: "string", description: "Persist dismissal." },
  ],
};
