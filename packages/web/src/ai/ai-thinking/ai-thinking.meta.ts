import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  id: "ai-thinking",
  name: "Thinking Steps",
  description: "Reasoning disclosure: the current step shimmers, finished steps tick off, then it collapses into 'Thought for Ns'.",
  category: "ai",
  platforms: ["web"],
  engine: "motion",
  dependencies: ["motion","lucide-react"],
  registryDependencies: ["kinetik-core"],
  tags: ["ai","reasoning","thinking","status","shimmer"],
  pageTypes: ["ai-app"],
  inspiration: ["Claude extended thinking","ChatGPT reasoning UI"],
  a11y: "Disclosure button with aria-expanded; steps list is aria-live polite.",
  perf: "Text shimmer is CSS; one timer.",
  status: "stable",
  priority: "P1",
  previewHeight: 300,
  props: [
    { name: "steps", type: "string[]", description: "Reasoning steps." },
    { name: "stepMs", type: "number", default: "1300", description: "ms per step." },
  ],
};
