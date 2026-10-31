import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  id: "tag-input",
  name: "Tag Input",
  description: "Chip input: Enter or comma pops a tag in, Backspace arms then removes the last tag, duplicates wiggle instead of adding.",
  category: "forms",
  platforms: ["web"],
  engine: "motion",
  dependencies: ["motion","lucide-react"],
  registryDependencies: ["kinetik-core"],
  tags: ["tags","chips","input","multi-select"],
  pageTypes: ["settings","dashboard","blog"],
  inspiration: ["Linear labels","GitHub topics"],
  a11y: "Native input with label; each chip has a labelled remove button; two-step Backspace avoids accidental deletion.",
  perf: "Layout animation on chips.",
  status: "stable",
  priority: "P2",
  previewHeight: 260,
  props: [
    { name: "defaultTags", type: "string[]", description: "Initial tags." },
    { name: "placeholder / label", type: "string", description: "Copy." },
  ],
};
