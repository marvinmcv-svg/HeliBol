import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  id: "ai-plan-graph",
  name: "AI — Plan Graph",
  description: "Agent plan visualiser: a goal node grows a tree of steps; each step's sub-tasks spin then tick off, finished steps collapse into an 'N done' chip, and the next step unfolds — like watching an agent think.",
  category: "ai",
  platforms: ["web"],
  engine: "motion",
  dependencies: ["motion","lucide-react"],
  registryDependencies: ["kinetik-core"],
  tags: ["premium","ai","agent","plan","tasks","tree","reasoning"],
  pageTypes: ["ai-app","dashboard"],
  inspiration: ["kinetik Premium collection"],
  a11y: "Plan is an ordered list with status text per item; progress is announced politely. Reduced motion shows the final state.",
  perf: "Small DOM; height animations via layout on a handful of nodes.",
  status: "stable",
  priority: "P1",
  previewHeight: 460,
  props: [
    { name: "goal", type: "string", description: "Top-level goal." },
    { name: "steps", type: "{ id; title; children?: { id; title }[] }[]", description: "Plan steps and their sub-tasks." },
    { name: "speed", type: "number", default: "650", description: "ms per task." },
  ],
};
