import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  id: "alert-animated",
  name: "Animated Alert",
  description: "Inline alert that springs in, draws its status icon, and on dismiss collapses its own height so the content below closes the gap. Optional auto-dismiss with a draining progress line.",
  category: "overlays",
  platforms: ["web"],
  engine: "motion",
  dependencies: ["motion","lucide-react"],
  registryDependencies: ["kinetik-core"],
  tags: ["alert","callout","status","notification","dismiss"],
  pageTypes: ["dashboard","settings"],
  inspiration: ["21st.dev category gap (audit 2026-11)"],
  a11y: "role=alert for warning/danger, role=status otherwise; labelled dismiss button. Reduced motion: fades only.",
  perf: "Height/opacity on one element; icon stroke via pathLength.",
  status: "stable",
  priority: "P2",
  previewHeight: 360,
  props: [
    { name: "tone", type: "'info' | 'success' | 'warning' | 'danger'", default: "'info'", description: "Colour + icon." },
    { name: "title", type: "string", description: "Heading." },
    { name: "duration", type: "number", description: "Auto-dismiss ms." },
    { name: "dismissible", type: "boolean", default: "true", description: "Show close button." },
    { name: "action", type: "ReactNode", description: "Optional action." },
  ],
};
