import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  id: "ai-agent-steps",
  name: "Agent Run Timeline",
  description: "Agent tool calls appear one by one with a pulsing running state, then resolve to a check with their result.",
  category: "ai",
  platforms: ["web"],
  engine: "motion",
  dependencies: ["motion","lucide-react"],
  registryDependencies: ["kinetik-core"],
  tags: ["ai","agent","tool calls","timeline","status"],
  pageTypes: ["ai-app","dashboard"],
  inspiration: ["Claude Code / Devin activity feeds"],
  a11y: "Ordered list with aria-live polite; status conveyed by text, not only color.",
  perf: "Layout animation as steps are appended.",
  status: "stable",
  priority: "P1",
  previewHeight: 360,
  props: [
    { name: "steps", type: "{ icon, title, detail?, duration? }[]", description: "Steps." },
  ],
};
