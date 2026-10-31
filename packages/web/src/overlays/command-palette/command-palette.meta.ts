import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  id: "command-palette",
  name: "Command Palette",
  description: "⌘K palette that springs open, filters and groups commands, with a highlight gliding between results.",
  category: "overlays",
  platforms: ["web"],
  engine: "motion",
  dependencies: ["motion","lucide-react"],
  registryDependencies: ["kinetik-core"],
  tags: ["command palette","cmdk","search","keyboard"],
  pageTypes: ["dashboard","docs","ai-app"],
  inspiration: ["Raycast","Linear ⌘K","cmdk"],
  a11y: "Dialog with combobox input and listbox options; ↑/↓/Enter/Esc; ⌘K toggles.",
  perf: "Filtering is in-memory; layout animation for the list.",
  status: "stable",
  priority: "P1",
  previewHeight: 440,
  props: [
    { name: "commands", type: "{ id, label, group, icon?, shortcut?, run? }[]", description: "Commands." },
    { name: "open / onOpenChange", type: "boolean / (o) => void", description: "Controlled state." },
  ],
};
