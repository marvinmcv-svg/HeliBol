import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  id: "button-split-action",
  name: "Button — Split Action",
  description: "Split button whose menu grows out of the button itself: the chevron opens a panel that morphs from the pill's shape with options staggering in; picking one rolls the main label to the new action.",
  category: "buttons",
  platforms: ["web"],
  engine: "motion",
  dependencies: ["motion","lucide-react"],
  registryDependencies: ["kinetik-core"],
  tags: ["premium","button","split","dropdown","menu","actions"],
  pageTypes: ["dashboard","settings"],
  inspiration: ["kinetik Premium collection"],
  a11y: "Chevron has aria-haspopup/expanded; menu uses menuitemradio with arrow keys, Esc returns focus. Reduced motion fades.",
  perf: "One panel morph and a few staggered items; label roll via AnimatePresence.",
  status: "stable",
  priority: "P1",
  previewHeight: 420,
  props: [
    { name: "options", type: "{ id; label; hint?; icon? }[]", description: "Actions." },
    { name: "defaultId", type: "string", default: "first", description: "Initial action." },
    { name: "onAction", type: "(id: string) => void", description: "Primary click." },
  ],
};
