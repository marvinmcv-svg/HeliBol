import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  id: "nav-speed-dial",
  name: "Speed Dial FAB",
  description: "Floating action button that blooms into a radial or vertical set of actions with staggered bouncy springs.",
  category: "navigation",
  platforms: ["web"],
  engine: "motion",
  dependencies: ["motion","lucide-react"],
  registryDependencies: ["kinetik-core"],
  tags: ["fab","speed dial","radial menu","actions"],
  pageTypes: ["dashboard","social","media"],
  inspiration: ["Material speed dial","Animata flower menu"],
  a11y: "aria-expanded on the FAB; actions labelled; Esc closes.",
  perf: "Transforms only.",
  status: "stable",
  priority: "P2",
  previewHeight: 320,
  props: [
    { name: "actions", type: "{ icon, label, onClick? }[]", description: "Actions." },
    { name: "layout", type: "\"radial\" | \"vertical\"", default: "\"radial\"", description: "Arrangement." },
  ],
};
