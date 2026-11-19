import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  id: "ai-diff-review",
  name: "AI Diff Review",
  description: "An agent's proposed edit streaming in: diff lines appear one by one with a cursor, additions flash green and deletions strike through, then each hunk gets Accept / Reject and collapses into a verdict chip.",
  category: "ai",
  platforms: ["web"],
  engine: "motion",
  dependencies: ["motion","lucide-react"],
  registryDependencies: ["kinetik-core"],
  tags: ["premium","ai","code","diff","review","agent"],
  pageTypes: ["ai-app","dashboard"],
  inspiration: ["kinetik Premium collection"],
  a11y: "Each hunk is a labelled section; status announced via aria-live; real buttons. Reduced motion: all lines shown at once.",
  perf: "One timeout per line while streaming; height collapse on decision.",
  status: "stable",
  priority: "P1",
  previewHeight: 420,
  props: [
    { name: "hunks", type: "{ id, file, summary, lines }[]", description: "Proposed changes." },
    { name: "speed", type: "number", default: "70", description: "ms per line." },
    { name: "onDecision", type: "(id, accepted) => void", description: "Callback." },
  ],
};
