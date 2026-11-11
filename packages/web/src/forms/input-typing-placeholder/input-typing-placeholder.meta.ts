import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  id: "input-typing-placeholder",
  name: "Typing Placeholder Input",
  description: "A search field whose placeholder types out example queries, pauses and deletes them — and stops the moment you focus or type.",
  category: "forms",
  platforms: ["web"],
  engine: "js",
  dependencies: [],
  registryDependencies: ["kinetik-core"],
  tags: ["input","search","placeholder","typewriter","ai"],
  pageTypes: ["landing","ai-app"],
  inspiration: ["unlumen UI — Animate Text Input Typing"],
  a11y: "A real static placeholder is set for assistive tech; the animated text is aria-hidden and hidden on focus. Reduced motion: suggestions swap whole.",
  perf: "setTimeout loop only while idle; stops on focus/value.",
  status: "stable",
  priority: "P2",
  previewHeight: 360,
  props: [
    { name: "suggestions", type: "string[]", description: "Example queries." },
    { name: "prefix", type: "string", default: "'Try'", description: "Text before the query." },
    { name: "typeSpeed", type: "number", default: "55", description: "ms per character." },
    { name: "pause", type: "number", default: "1400", description: "Pause when a query is complete." },
  ],
};
